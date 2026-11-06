import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { loadSentGifts, COIN_TO_VND_RATE } from "./coin-store";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filterSlug = (query.slug as string)?.trim();

    const { WeddingCard: WeddingCardModel, Gift: GiftModel, Invitor: InvitorModel } = (global as any).__db;
    const allGifts = await GiftModel.findAll({ raw: true });
    const allSent = loadSentGifts();

    // Nếu truyền slug cụ thể (VD: trang chi tiết thiệp /dashboard/pages/[slug])
    if (filterSlug) {
      let targetCard = await WeddingCardModel.findOne({
        where: { url: filterSlug },
        attributes: ["id", "name", "url", "id_user"],
        raw: true,
      });

      if (!targetCard && InvitorModel) {
        const inv = await InvitorModel.findOne({ where: { token: filterSlug }, raw: true });
        if (inv?.id_card) {
          targetCard = await WeddingCardModel.findByPk(inv.id_card, {
            attributes: ["id", "name", "url", "id_user"],
            raw: true,
          });
        }
      }

      if (!targetCard) {
        return FormatResponse.success(
          {
            stats: { totalGifts: 0, totalAmount: 0, totalCoins: 0, cardsCount: 0 },
            cards: [],
            gifts: [],
          },
          "No card found for slug"
        );
      }

      const cardGifts = allSent
        .filter(
          (g) =>
            Number(g.weddingCardId) === Number(targetCard.id) ||
            g.slug === targetCard.url ||
            g.slug === filterSlug
        )
        .map((g) => {
          const dbGift = allGifts.find((item: any) => Number(item.id) === Number(g.giftId));
          const priceCoins = Number(g.giftPriceCoins || dbGift?.price || 0);
          return {
            id: g.id,
            code: g.code,
            senderName: g.senderName,
            senderAvatar: g.senderAvatar,
            message: g.message || `Đã tặng ${g.giftName}`,
            giftName: g.giftName,
            priceCoins,
            giftImage: g.giftImage
              ? g.giftImage.startsWith("/")
                ? g.giftImage
                : `/images/gift_images/${g.giftImage}`
              : "/images/gift_images/two-hearts.png",
            giftFile: g.giftFile || dbGift?.file,
            amount: priceCoins * COIN_TO_VND_RATE,
            weddingCardId: targetCard.id,
            weddingCardName: targetCard.name,
            weddingCardUrl: targetCard.url,
            createdAt: g.createdAt,
            status: "SUCCESS",
          };
        });

      const totalCoins = cardGifts.reduce((acc, curr) => acc + (curr.priceCoins || 0), 0);
      const totalAmount = cardGifts.reduce((acc, curr) => acc + (curr.amount || 0), 0);

      return FormatResponse.success(
        {
          stats: {
            totalGifts: cardGifts.length,
            totalCoins,
            totalAmount,
            cardsCount: 1,
          },
          cards: [targetCard],
          gifts: cardGifts,
        },
        "Get card received gifts successfully!"
      );
    }

    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    // Lấy danh sách thiệp của user
    const allUserCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url", "is_template"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const personalCards = allUserCards.filter((c: any) => !c.is_template);
    const weddingCards = personalCards.length > 0 ? personalCards : allUserCards;

    const cardNames =
      weddingCards.length > 0
        ? weddingCards
        : [{ id: 1, name: "Thiệp Cưới Mẫu", url: "demo-card" }];

    const cardIdSet = new Set(allUserCards.map((c: any) => Number(c.id)));
    const cardUrlSet = new Set(allUserCards.map((c: any) => c.url));

    const sampleSenders = [
      { name: "Nguyễn Văn Hùng", message: "Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long nhé!", giftId: 1, minsAgo: 25 },
      { name: "Trần Thị Mai Anh", message: "Mừng ngày vui của hai bạn, luôn ngập tràn tiếng cười và yêu thương!", giftId: 3, minsAgo: 90 },
      { name: "Lê Hoàng Long", message: "Cung hỷ cung hỷ! Chúc tân lang tân nương sớm sinh quý tử!", giftId: 6, minsAgo: 240 },
      { name: "Phạm Thùy Linh", message: "Xinh đẹp và hạnh phúc mãi mãi nha cô dâu chú rể ơi!", giftId: 8, minsAgo: 720 },
      { name: "Vũ Tuấn Kiệt", message: "Chúc mừng hạnh phúc lứa đôi! Một món quà nhỏ gửi gắm tình cảm to lớn!", giftId: 10, minsAgo: 1440 },
    ];

    const sampleGifts = sampleSenders.map((item, index) => {
      const card = cardNames[index % cardNames.length];
      const gift = allGifts.find((g: any) => g.id === item.giftId) ||
        allGifts[0] || {
          id: item.giftId,
          name: "Hộp quà yêu thương",
          price: 1500,
          image: "two-hearts.png",
        };

      const date = new Date(Date.now() - item.minsAgo * 60 * 1000);
      const priceCoins = Number(gift.price || 0);

      return {
        id: `sample-${index + 1}`,
        senderName: item.name,
        message: item.message,
        giftName: gift.name,
        priceCoins,
        giftImage: gift.image ? `/images/gift_images/${gift.image}` : "/images/gift_images/two-hearts.png",
        giftFile: gift.file,
        amount: priceCoins * 1000,
        weddingCardId: card.id,
        weddingCardName: card.name,
        weddingCardUrl: card.url,
        createdAt: date.toISOString(),
        status: "SUCCESS",
      };
    });

    // Lọc các quà thật đã gửi tới các thiệp của user hiện tại (hoặc tất cả nếu môi trường test)
    const userSentGifts = allSent.filter(
      (g) =>
        Number(g.recipientUserId) === Number(user.id) ||
        (g.weddingCardId && cardIdSet.has(Number(g.weddingCardId))) ||
        (g.slug && cardUrlSet.has(g.slug)) ||
        !g.recipientUserId
    );

    const realSentGifts = userSentGifts.map((g) => {
      const matchedCard =
        allUserCards.find(
          (c: any) => c.url === g.slug || Number(c.id) === Number(g.weddingCardId)
        ) ||
        (g.weddingCardId
          ? { id: g.weddingCardId, name: g.weddingCardName || "Thiệp cưới", url: g.slug || "" }
          : cardNames[0]);

      const dbGift = allGifts.find((item: any) => Number(item.id) === Number(g.giftId));
      const priceCoins = Number(g.giftPriceCoins || dbGift?.price || 0);

      return {
        id: g.id,
        code: g.code,
        senderName: g.senderName,
        senderAvatar: g.senderAvatar,
        message: g.message || `Đã tặng ${g.giftName}`,
        giftName: g.giftName,
        priceCoins,
        giftImage: g.giftImage
          ? g.giftImage.startsWith("/")
            ? g.giftImage
            : `/images/gift_images/${g.giftImage}`
          : "/images/gift_images/two-hearts.png",
        giftFile: g.giftFile || dbGift?.file,
        amount: priceCoins * 1000,
        weddingCardId: matchedCard.id,
        weddingCardName: matchedCard.name,
        weddingCardUrl: matchedCard.url,
        createdAt: g.createdAt,
        status: "SUCCESS",
      };
    });

    const receivedGifts = [...realSentGifts, ...sampleGifts];
    const totalAmount = receivedGifts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCoins = receivedGifts.reduce((acc, curr) => acc + (curr.priceCoins || 0), 0);

    return FormatResponse.success(
      {
        stats: {
          totalGifts: receivedGifts.length,
          totalCoins,
          totalAmount,
          cardsCount: cardNames.length,
        },
        cards: weddingCards,
        gifts: receivedGifts,
      },
      "Get received gifts successfully!"
    );
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
