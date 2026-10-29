import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { withdrawalRecords } from "./index.get";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const body = await readBody(event);
    const amount = Number(body.amount);

    if (!amount || isNaN(amount) || amount < 50000) {
      return FormatResponse.error(event, "Số tiền rút tối thiểu là 50,000 VNĐ!");
    }

    if (!body.bankName || !body.accountNumber || !body.accountHolder) {
      return FormatResponse.error(event, "Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng!");
    }

    const newWithdrawal = {
      id: `wd-${Date.now()}`,
      code: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.id,
      amount,
      bankName: body.bankName,
      accountNumber: body.accountNumber,
      accountHolder: body.accountHolder,
      note: body.note || "Rút tiền quà mừng thiệp online",
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
    };

    withdrawalRecords.unshift(newWithdrawal);

    return FormatResponse.success(newWithdrawal, "Yêu cầu rút tiền đã được tạo thành công! Hệ thống sẽ xử lý trong vòng 24h làm việc.");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
