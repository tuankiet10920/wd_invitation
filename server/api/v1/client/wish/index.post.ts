import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, content, slug } = body;

    if (!name || !content || !slug) {
      return FormatResponse.error(event, "Vui lòng nhập đầy đủ thông tin!");
    }

    const { WeddingCard: WeddingCardModel, Wish: WishModel } = global.__db;

    // Tìm tấm thiệp theo slug (lưu ở cột url)
    const card = await WeddingCardModel.findOne({ where: { url: slug } });
    if (!card) {
      return FormatResponse.error(event, "Không tìm thấy thông tin thiệp!");
    }

    const wish = await WishModel.create({
      name,
      content,
      id_wedding_card: card.id,
    });

    return FormatResponse.success(wish, "Gửi lời chúc thành công!");
  } catch (error) {
    console.error("Error creating wish:", error);
    return FormatResponse.failure(error);
  }
});
