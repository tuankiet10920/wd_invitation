import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import {
  calculateUserWallet,
  addWithdrawalRecord,
  type WithdrawalRecord,
} from "./wallet-store";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const body = await readBody(event);
    const amount = Math.floor(Number(body.amount));

    if (!amount || isNaN(amount) || amount < 50000) {
      return FormatResponse.error(event, "Số tiền rút tối thiểu là 50,000 VNĐ!");
    }

    const bankName = String(body.bankName || "").trim();
    const accountNumber = String(body.accountNumber || "").trim();
    const accountHolder = String(body.accountHolder || "")
      .trim()
      .toUpperCase();

    if (!bankName || !accountNumber || !accountHolder) {
      return FormatResponse.error(
        event,
        "Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng thụ hưởng!"
      );
    }

    const wallet = await calculateUserWallet(user);
    if (amount > wallet.balance) {
      return FormatResponse.error(
        event,
        `Số tiền rút vượt quá số dư khả dụng (${wallet.balance.toLocaleString("vi-VN")} VNĐ)!`
      );
    }

    // Lưu tài khoản ngân hàng vào qr_boxes nếu người dùng tích chọn
    if (body.saveAccount) {
      try {
        const { WeddingCard: WeddingCardModel, QrBox: QrBoxModel } = (global as any).__db;
        const firstCard = await WeddingCardModel?.findOne({
          where: { id_user: user.id },
          order: [["id", "ASC"]],
        });
        if (firstCard && QrBoxModel) {
          const exists = await QrBoxModel.findOne({
            where: {
              id_wedding_card: firstCard.id,
              name_bank: bankName,
              number_bank: accountNumber,
            },
          });
          if (!exists) {
            await QrBoxModel.create({
              name: "Tài khoản rút tiền",
              name_reveive: accountHolder,
              name_bank: bankName,
              number_bank: accountNumber,
              image: `https://img.vietqr.io/image/${bankName}-${accountNumber}-compact.png?accountName=${encodeURIComponent(accountHolder)}`,
              id_wedding_card: firstCard.id,
            });
          }
        }
      } catch (e) {}
    }

    const nowIso = new Date().toISOString();
    const newWithdrawal: WithdrawalRecord = {
      id: `wd-${Date.now()}`,
      code: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      amount,
      bankName,
      accountNumber,
      accountHolder,
      note: String(body.note || "Rút tiền tự động 24/7 về ngân hàng").trim(),
      status: "COMPLETED",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const created = await addWithdrawalRecord(newWithdrawal);

    return FormatResponse.success(
      created,
      `Rút thành công ${amount.toLocaleString("vi-VN")}đ về tài khoản ${bankName} - ${accountNumber}!`
    );
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
