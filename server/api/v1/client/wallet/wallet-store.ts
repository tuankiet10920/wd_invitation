import { Op } from "sequelize";
import { getUserCoins, loadSentGifts, COIN_TO_VND_RATE } from "../gifts/coin-store";

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

function mapWithdrawalRow(row: any): WithdrawalRecord {
  const plain = row?.get ? row.get({ plain: true }) : row;
  const code = plain.code || `WD-${plain.id}`;
  return {
    id: code,
    code,
    userId: Number(plain.id_user),
    amount: Number(plain.amount || 0),
    bankName: plain.bank_name || "",
    accountNumber: plain.account_number || "",
    accountHolder: plain.account_holder || "",
    note: plain.note || "",
    status: plain.status || "PROCESSING",
    createdAt: plain.createdAt ? new Date(plain.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: plain.updatedAt ? new Date(plain.updatedAt).toISOString() : undefined,
  };
}

export async function getUserWithdrawals(userId: number): Promise<WithdrawalRecord[]> {
  const db = (global as any).__db;
  const rows = await db.Withdrawal.findAll({
    where: { id_user: Number(userId) },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
  });
  return rows.map(mapWithdrawalRow);
}

export async function addWithdrawalRecord(
  record: Partial<WithdrawalRecord> & {
    userId: number;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }
): Promise<WithdrawalRecord> {
  const db = (global as any).__db;
  const code = record.code || record.id || `WD-${Math.floor(100000 + Math.random() * 900000)}`;

  const row = await db.Withdrawal.create({
    code,
    id_user: Number(record.userId),
    amount: Number(record.amount),
    bank_name: record.bankName,
    account_number: record.accountNumber,
    account_holder: record.accountHolder,
    note: record.note || "",
    status: record.status || "PROCESSING",
  });

  return mapWithdrawalRow(row);
}

export async function updateWithdrawalStatus(
  id: string,
  userId: number,
  status: "PROCESSING" | "COMPLETED" | "CANCELLED"
): Promise<WithdrawalRecord | null> {
  const db = (global as any).__db;
  const orConds: any[] = [{ code: String(id) }];
  if (!isNaN(Number(id))) {
    orConds.push({ id: Number(id) });
  }

  const row = await db.Withdrawal.findOne({
    where: {
      id_user: Number(userId),
      [Op.or]: orConds,
    },
  });

  if (!row) return null;

  await row.update({ status });
  return mapWithdrawalRow(row);
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

  // Lấy danh sách thiệp cưới và tài khoản ngân hàng đã lưu của user (từ qr_boxes)
  let weddingCards: any[] = [];
  let cardIds: number[] = [];
  const savedBankAccounts: any[] = [];

  try {
    weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url"],
      raw: true,
    });
    cardIds = weddingCards.map((c: any) => Number(c.id));
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

  // Lấy danh sách quà tặng của user từ bảng sent_gifts trong MySQL
  const userSentGifts = await loadSentGifts({
    recipientUserId: user.id,
    weddingCardIds: cardIds,
  });

  const rawGiftItems = userSentGifts.map((g) => ({
    id: g.id,
    code: g.code,
    senderName: g.senderName,
    giftName: g.giftName,
    grossAmount: Number(g.amountVnd) > 0 ? Number(g.amountVnd) : Number(g.giftPriceCoins || 0) * COIN_TO_VND_RATE,
    createdAt: g.createdAt,
  }));

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

  const userWithdrawals = await getUserWithdrawals(user.id);

  // Chỉ tính các lệnh rút không bị hủy vào tổng tiền đã rút / đang giữ
  const activeWithdrawals = userWithdrawals.filter((w) => w.status !== "CANCELLED");
  const totalWithdrawn = activeWithdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawn = activeWithdrawals
    .filter((w) => w.status === "PROCESSING")
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = Math.max(0, netReceived - totalWithdrawn - pendingWithdrawn);

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

  const coins = await getUserCoins(user.id);

  return {
    balance: availableBalance,
    coins,
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
