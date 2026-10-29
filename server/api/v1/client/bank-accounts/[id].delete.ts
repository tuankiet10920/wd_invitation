import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const id = getRouterParam(event, "id");
    if (!id) {
      return FormatResponse.error(event, "ID is required");
    }

    const { QrBox: QrBoxModel } = (global as any).__db;
    const deleted = await QrBoxModel.destroy({ where: { id: Number(id) } });

    if (!deleted) {
      return FormatResponse.error(event, "Không tìm thấy tài khoản ngân hàng để xóa!");
    }

    return FormatResponse.success(true, "Xóa tài khoản ngân hàng thành công!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
