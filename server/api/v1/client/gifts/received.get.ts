import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { WeddingCard: WeddingCardModel, Gift: GiftModel } = (global as any).__db;

    // Get all wedding cards of user
    const weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url"],
      raw: true,
    });

    const allGifts = await GiftModel.findAll({ raw: true });

    // Seeded/sample received gifts based on user's real wedding cards
    const cardNames = weddingCards.length > 0 ? weddingCards : [{ id: 1, name: "Thiệp Cưới Mẫu", url: "demo-card" }];

    const sampleSenders = [
      { name: "Nguyễn Văn Hùng", message: "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long nhé!", giftId: 1, minsAgo: 25 },
      { name: "Trần Thị Mai Anh", message: "Mừng ngày vui của hai bạn, luôn ngập tràn tiếng cười và yêu thương!", giftId: 3, minsAgo: 90 },
      { name: "Lê Hoàng Long", message: "Cung hỷ cung hỷ! Chúc tân lang tân nương sớm sinh quý tử!", giftId: 6, minsAgo: 240 },
      { name: "Phạm Thùy Linh", message: "Xinh đẹp và hạnh phúc mãi mãi nha cô dâu chú rể ơi!", giftId: 8, minsAgo: 720 },
      { name: "Vũ Tuấn Kiệt", message: "Chúc mừng hạnh phúc lứa đôi! Một món quà nhỏ gửi gắm tình cảm to lớn!", giftId: 10, minsAgo: 1440 },
    ];

    const receivedGifts = sampleSenders.map((item, index) => {
      const card = cardNames[index % cardNames.length];
      const gift = allGifts.find((g: any) => g.id === item.giftId) || allGifts[0] || {
        id: item.giftId,
        name: "Hộp quà yêu thương",
        price: 1500,
        image: "two-hearts.png"
      };

      const date = new Date(Date.now() - item.minsAgo * 60 * 1000);

      return {
        id: index + 1,
        senderName: item.name,
        message: item.message,
        giftName: gift.name,
        giftImage: gift.image ? `/images/gift_images/${gift.image}` : '/images/gift_images/two-hearts.png',
        giftFile: gift.file,
        amount: gift.price * 1000, // Giá trị tiền mặt quy đổi VNĐ
        weddingCardId: card.id,
        weddingCardName: card.name,
        weddingCardUrl: card.url,
        createdAt: date.toISOString(),
        status: "SUCCESS"
      };
    });

    const totalAmount = receivedGifts.reduce((acc, curr) => acc + curr.amount, 0);

    return FormatResponse.success({
      stats: {
        totalGifts: receivedGifts.length,
        totalAmount,
        cardsCount: cardNames.length,
      },
      cards: weddingCards,
      gifts: receivedGifts,
    }, "Get received gifts successfully!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
