import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { loadSentGifts, COIN_TO_VND_RATE } from "./coin-store";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filterSlug = (query.slug as string)?.trim();

    const { WeddingCard: WeddingCardModel, Gift: GiftModel, Invitor: InvitorModel } = (global as any).__db;
    const allGifts = await GiftModel.findAll({ raw: true });

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

      const cardSent = await loadSentGifts({
        weddingCardIds: [Number(targetCard.id)],
      });

      const cardGifts = cardSent
        .filter(
          (g) =>
            Number(g.weddingCardId) === Number(targetCard.id) ||
            g.slug === targetCard.url ||
            g.slug === filterSlug
        )
        .map((g) => {
          const dbGift = allGifts.find((item: any) => Number(item.id) === Number(g.giftId));
          const priceCoins = Number(g.giftPriceCoins || dbGift?.price || 0);
          const amountVnd = Number(g.amountVnd) > 0 ? Number(g.amountVnd) : priceCoins * COIN_TO_VND_RATE;
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
            amount: amountVnd,
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

    // Lấy danh sách thiệp của user từ MySQL
    const allUserCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url", "is_template"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const personalCards = allUserCards.filter((c: any) => !c.is_template);
    const weddingCards = personalCards.length > 0 ? personalCards : allUserCards;
    const cardIds = allUserCards.map((c: any) => Number(c.id));

    // Truy vấn quà tặng của user từ bảng sent_gifts trong MySQL
    const userSentGifts = await loadSentGifts({
      recipientUserId: user.id,
      weddingCardIds: cardIds,
    });

    const receivedGifts = userSentGifts.map((g) => {
      const matchedCard =
        allUserCards.find(
          (c: any) => c.url === g.slug || Number(c.id) === Number(g.weddingCardId)
        ) ||
        (g.weddingCardId
          ? { id: g.weddingCardId, name: g.weddingCardName || "Thiệp cưới", url: g.slug || "" }
          : weddingCards[0] || { id: 1, name: "Thiệp cưới", url: "" });

      const dbGift = allGifts.find((item: any) => Number(item.id) === Number(g.giftId));
      const priceCoins = Number(g.giftPriceCoins || dbGift?.price || 0);
      const amountVnd = Number(g.amountVnd) > 0 ? Number(g.amountVnd) : priceCoins * COIN_TO_VND_RATE;

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
        amount: amountVnd,
        weddingCardId: matchedCard.id,
        weddingCardName: matchedCard.name,
        weddingCardUrl: matchedCard.url,
        createdAt: g.createdAt,
        status: "SUCCESS",
      };
    });

    const totalAmount = receivedGifts.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCoins = receivedGifts.reduce((acc, curr) => acc + (curr.priceCoins || 0), 0);

    return FormatResponse.success(
      {
        stats: {
          totalGifts: receivedGifts.length,
          totalCoins,
          totalAmount,
          cardsCount: weddingCards.length,
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
