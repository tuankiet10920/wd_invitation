import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { updateWithdrawalStatus } from "./wallet-store";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const body = await readBody(event);
    const { id, action } = body;

    if (!id || !["cancel", "complete"].includes(action)) {
      return FormatResponse.error(event, "Thao tác không hợp lệ!");
    }

    const targetStatus = action === "cancel" ? "CANCELLED" : "COMPLETED";
    const updated = await updateWithdrawalStatus(id, user.id, targetStatus);

    if (!updated) {
      return FormatResponse.error(event, "Không tìm thấy yêu cầu rút tiền!");
    }

    const message =
      action === "cancel"
        ? "Đã hủy yêu cầu rút tiền và hoàn lại số dư khả dụng!"
        : "Đã xác nhận hoàn tất chuyển khoản về ngân hàng!";

    return FormatResponse.success(updated, message);
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
