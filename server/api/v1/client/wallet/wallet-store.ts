import fs from "fs";
import path from "path";
import { getPaymentRecord } from "../payment/payment-store";

export interface WithdrawalRecord {
  id: string;
  code: string;
  userId: number;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  note: string;
  status: "PROCESSING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_PATH = path.resolve(process.cwd(), "server/data/withdrawals.json");

function loadWithdrawalsFromDisk(): WithdrawalRecord[] {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const raw = fs.readFileSync(STORAGE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("[WalletStore] Failed to read withdrawals.json:", e);
  }
  return [];
}

function saveWithdrawalsToDisk(records: WithdrawalRecord[]) {
  try {
    const dir = path.dirname(STORAGE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(records, null, 2), "utf-8");
  } catch (e) {
    console.error("[WalletStore] Failed to save withdrawals.json:", e);
  }
}

export function getUserWithdrawals(userId: number): WithdrawalRecord[] {
  const all = loadWithdrawalsFromDisk();
  return all.filter((w) => Number(w.userId) === Number(userId));
}

export function addWithdrawalRecord(record: WithdrawalRecord): WithdrawalRecord {
  const all = loadWithdrawalsFromDisk();
  all.unshift(record);
  saveWithdrawalsToDisk(all);
  return record;
}

export function updateWithdrawalStatus(
  id: string,
  userId: number,
  status: "PROCESSING" | "COMPLETED" | "CANCELLED"
): WithdrawalRecord | null {
  const all = loadWithdrawalsFromDisk();
  const idx = all.findIndex((w) => w.id === id && Number(w.userId) === Number(userId));
  if (idx === -1) return null;

  all[idx].status = status;
  all[idx].updatedAt = new Date().toISOString();
  saveWithdrawalsToDisk(all);
  return all[idx];
}

export async function calculateUserWallet(user: any) {
  const { Package: PackageModel, WeddingCard: WeddingCardModel, QrBox: QrBoxModel } = (global as any).__db;
  const userPackageId = user.id_package || 1;
  const currentPkg = await PackageModel?.findByPk(userPackageId);

  const packageName = currentPkg?.name || "Free";

  // Tỷ lệ thực nhận quà mừng theo gói:
  // Free = 80% (phí nền tảng 20%), Basic = 90% (phí 10%), Premium = 100% (miễn phí 100%)
  let receiveRate = 80;
  if (packageName.toLowerCase().includes("premium")) {
    receiveRate = 100;
  } else if (packageName.toLowerCase().includes("basic")) {
    receiveRate = 90;
  } else {
    receiveRate = 80;
  }

  // Danh sách giao dịch nhận quà mừng gốc
  const rawGiftItems = [
    {
      id: "tx-3",
      code: "GIFT-194028",
      senderName: "Vũ Tuấn Kiệt",
      giftName: "Rượu mừng",
      grossAmount: 3000000,
      createdAt: new Date(Date.now() - 1440 * 60 * 1000).toISOString(),
    },
    {
      id: "tx-2",
      code: "GIFT-193851",
      senderName: "Phạm Thùy Linh",
      giftName: "Hoa gấu bông",
      grossAmount: 2020000,
      createdAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
    },
    {
      id: "tx-1",
      code: "GIFT-193402",
      senderName: "Nguyễn Văn Hùng",
      giftName: "Bắn tim",
      grossAmount: 1780000,
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    },
  ];

  const giftTransactions = rawGiftItems.map((g) => {
    const netAmount = Math.round((g.grossAmount * receiveRate) / 100);
    return {
      id: g.id,
      code: g.code,
      type: "GIFT",
      title: `Nhận quà mừng: ${g.giftName}`,
      description: `Từ người thân ${g.senderName} (Gốc: ${g.grossAmount.toLocaleString("vi-VN")}đ - Nhận ${receiveRate}%)`,
      grossAmount: g.grossAmount,
      amount: netAmount,
      status: "COMPLETED",
      createdAt: g.createdAt,
    };
  });

  const grossReceived = rawGiftItems.reduce((sum, g) => sum + g.grossAmount, 0);
  const netReceived = giftTransactions.reduce((sum, g) => sum + g.amount, 0);

  const userWithdrawals = getUserWithdrawals(user.id);

  // Chỉ tính các lệnh rút không bị hủy vào tổng tiền đã rút / đang giữ
  const activeWithdrawals = userWithdrawals.filter((w) => w.status !== "CANCELLED");
  const totalWithdrawn = activeWithdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawn = activeWithdrawals
    .filter((w) => w.status === "PROCESSING")
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = Math.max(0, netReceived - totalWithdrawn - pendingWithdrawn);

  // Lấy danh sách tài khoản ngân hàng đã lưu của user (từ qr_boxes)
  let savedBankAccounts: any[] = [];
  try {
    const weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name"],
      raw: true,
    });
    const cardIds = weddingCards.map((c: any) => c.id);
    if (cardIds.length > 0 && QrBoxModel) {
      const qrBoxes = await QrBoxModel.findAll({
        where: { id_wedding_card: cardIds },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      const seen = new Set<string>();
      for (const box of qrBoxes) {
        const key = `${box.name_bank}-${box.number_bank}`;
        if (!seen.has(key) && box.name_bank && box.number_bank) {
          seen.add(key);
          savedBankAccounts.push({
            id: box.id,
            label: box.name || "Tài khoản",
            bankName: box.name_bank,
            accountNumber: box.number_bank,
            accountHolder: box.name_reveive,
          });
        }
      }
    }
  } catch (e) {}

  const withdrawTransactions = userWithdrawals.map((w) => ({
    id: w.id,
    code: w.code,
    type: "WITHDRAW",
    title: "Rút tiền về tài khoản ngân hàng",
    description: `Ngân hàng ${w.bankName} - STK: ${w.accountNumber} (${w.accountHolder})`,
    bankName: w.bankName,
    accountNumber: w.accountNumber,
    accountHolder: w.accountHolder,
    note: w.note,
    amount: -w.amount,
    status: w.status,
    createdAt: w.createdAt,
  }));

  const transactions = [...withdrawTransactions, ...giftTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    balance: availableBalance,
    grossReceived,
    netReceived,
    totalWithdrawn: totalWithdrawn + pendingWithdrawn,
    completedWithdrawn: totalWithdrawn,
    pendingWithdrawn,
    receiveRate,
    packageName,
    isPremium: packageName.toLowerCase().includes("premium"),
    savedBankAccounts,
    transactions,
  };
}

