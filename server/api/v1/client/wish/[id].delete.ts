import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return FormatResponse.error(event, "ID is required!");

    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { Wish: WishModel, WeddingCard: WeddingCardModel } = (global as any).__db;

    const wish = await WishModel.findByPk(id, {
      include: [
        {
          model: WeddingCardModel,
          as: "weddingCard",
          attributes: ["id_user"],
        },
      ],
    });

    if (!wish) {
      return FormatResponse.error(event, "Lời chúc không tồn tại!");
    }

    if (user.role !== "admin" && wish.weddingCard && wish.weddingCard.id_user !== user.id) {
      return FormatResponse.error(event, "Bạn không có quyền xóa lời chúc này!", 403);
    }

    await wish.destroy();

    return FormatResponse.success(true, "Xóa lời chúc thành công!");
  } catch (error) {
    console.error("Error deleting wish:", error);
    return FormatResponse.failure(error);
  }
});
