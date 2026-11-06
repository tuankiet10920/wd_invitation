import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const name = (body?.name || "").trim();
    const content = (body?.content || "").trim();
    const slug = (body?.slug || "").trim();

    if (!name || !content || !slug) {
      return FormatResponse.error(event, "Vui lòng nhập đầy đủ tên và lời chúc!");
    }

    const { WeddingCard: WeddingCardModel, Wish: WishModel, Invitor: InvitorModel } = (global as any).__db;

    // 1. Tìm tấm thiệp theo slug (lưu ở cột url)
    let card = await WeddingCardModel.findOne({ where: { url: slug } });

    // 2. Fallback: Nếu slug là mã token của khách mời (/invite/[token])
    if (!card && InvitorModel) {
      const invitor = await InvitorModel.findOne({ where: { token: slug } });
      if (invitor?.id_card) {
        card = await WeddingCardModel.findByPk(invitor.id_card);
      }
    }

    // 3. Fallback: Nếu slug là ID số của thiệp
    if (!card && !isNaN(Number(slug))) {
      card = await WeddingCardModel.findByPk(Number(slug));
    }

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
