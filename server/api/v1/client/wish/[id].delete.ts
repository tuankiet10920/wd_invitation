import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return FormatResponse.error(event, "ID is required!");

    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    if (!email) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "User not found");
    }

    const { Wish: WishModel, WeddingCard: WeddingCardModel } = global.__db;

    // Tìm lời chúc và kiểm tra xem nó có thuộc về thiệp của user hiện tại không
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

    // Kiểm tra quyền sở hữu
    if (wish.weddingCard && wish.weddingCard.id_user !== user.id) {
      return FormatResponse.error(event, "Bạn không có quyền xóa lời chúc này!", 403);
    }

    await wish.destroy();

    return FormatResponse.success(true, "Xóa lời chúc thành công!");
  } catch (error) {
    console.error("Error deleting wish:", error);
    return FormatResponse.failure(error);
  }
});
