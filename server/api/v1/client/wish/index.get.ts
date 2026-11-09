import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { loadSentGifts } from "../gifts/coin-store";

function parseWishCoinData(
  rawContent: string,
  senderName: string,
  cardId: number,
  giftPriceMap: Map<string, number>,
  sentGifts: any[]
) {
  const content = String(rawContent || "");
  let giftName: string | null = null;
  let coins = 0;
  let cleanContent = content;

  // Format 1: [Tặng Tên Quà • +1500 xu] Nội dung lời chúc
  const matchWithCoins = content.match(/^\[Tặng\s+([^•\]]+?)\s*•\s*\+?(\d+)\s*xu\]\s*(.*)$/i);
  if (matchWithCoins) {
    giftName = matchWithCoins[1].trim();
    coins = Number(matchWithCoins[2]) || 0;
    cleanContent = matchWithCoins[3]?.trim() || `Đã gửi tặng ${giftName}`;
  } else {
    // Format 2: [Tặng Tên Quà] Nội dung lời chúc
    const matchGiftOnly = content.match(/^\[Tặng\s+([^\]]+)\]\s*(.*)$/i);
    if (matchGiftOnly) {
      giftName = matchGiftOnly[1].trim();
      cleanContent = matchGiftOnly[2]?.trim() || `Đã gửi tặng ${giftName}`;
      coins = giftPriceMap.get(giftName.toLowerCase()) || 0;
    }
  }

  // Fallback: tra cứu trong sentGifts nếu có cùng người gửi & thiệp cưới
  if (coins === 0 && sentGifts.length > 0) {
    const matchedSent = sentGifts.find(
      (g) =>
        Number(g.weddingCardId) === Number(cardId) &&
        String(g.senderName || "").toLowerCase() === String(senderName || "").toLowerCase() &&
        (giftName
          ? String(g.giftName || "").toLowerCase() === giftName.toLowerCase()
          : String(g.message || "").trim() === cleanContent.trim())
    );
    if (matchedSent) {
      giftName = giftName || matchedSent.giftName || null;
      coins = Number(matchedSent.giftPriceCoins) || 0;
    }
  }

  return {
    giftName,
    coins,
    cleanContent,
  };
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filterSlug = (query.slug as string)?.trim();

    const {
      WeddingCard: WeddingCardModel,
      Wish: WishModel,
      Invitor: InvitorModel,
      Gift: GiftModel,
    } = (global as any).__db;

    const allGifts = GiftModel ? await GiftModel.findAll({ raw: true }) : [];
    const giftPriceMap = new Map<string, number>();
    for (const g of allGifts) {
      if (g?.name) {
        giftPriceMap.set(String(g.name).trim().toLowerCase(), Number(g.price || 0));
      }
    }
    const allSent = loadSentGifts();

    // Nếu truyền slug cụ thể (VD: xem thống kê lời chúc của 1 thiệp)
    if (filterSlug) {
      let targetCard = await WeddingCardModel.findOne({
        where: { url: filterSlug },
        attributes: ["id", "name", "url", "id_user"],
      });

      if (!targetCard && InvitorModel) {
        const inv = await InvitorModel.findOne({ where: { token: filterSlug } });
        if (inv?.id_card) {
          targetCard = await WeddingCardModel.findByPk(inv.id_card, {
            attributes: ["id", "name", "url", "id_user"],
          });
        }
      }

      if (!targetCard) {
        return FormatResponse.success(
          {
            stats: { totalWishes: 0, latestWish: null, totalCards: 0, totalCoins: 0 },
            cards: [],
            wishes: [],
          },
          "No card found for slug"
        );
      }

      const cardWishes = await WishModel.findAll({
        where: { id_wedding_card: targetCard.id },
        include: [
          {
            model: WeddingCardModel,
            as: "weddingCard",
            attributes: ["id", "name", "url"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const mappedCardWishes = cardWishes.map((w: any) => {
        const parsed = parseWishCoinData(
          w.content,
          w.name,
          targetCard.id,
          giftPriceMap,
          allSent
        );
        return {
          id: w.id,
          name: w.name,
          content: w.content,
          cleanContent: parsed.cleanContent,
          giftName: parsed.giftName,
          coins: parsed.coins,
          createdAt: w.createdAt,
          cardId: targetCard.id,
          cardName: w.weddingCard?.name || targetCard.name || "N/A",
          cardSlug: w.weddingCard?.url || targetCard.url || "",
        };
      });

      const totalCoins = mappedCardWishes.reduce(
        (sum: number, item: any) => sum + (Number(item.coins) || 0),
        0
      );

      return FormatResponse.success(
        {
          stats: {
            totalWishes: mappedCardWishes.length,
            latestWish: mappedCardWishes.length > 0 ? mappedCardWishes[0].createdAt : null,
            totalCards: 1,
            totalCoins,
          },
          cards: [
            {
              id: targetCard.id,
              name: targetCard.name,
              slug: targetCard.url,
            },
          ],
          wishes: mappedCardWishes,
        },
        "Fetched card wishes successfully"
      );
    }

    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    // Lấy toàn bộ thiệp cưới của user hiện tại
    const weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url", "is_template"],
      order: [["createdAt", "DESC"]],
    });

    const personalCards = weddingCards.filter((c: any) => !c.is_template);
    const activeCards = personalCards.length > 0 ? personalCards : weddingCards;
    const cardIds = weddingCards.map((card: any) => card.id);

    let wishes =
      cardIds.length > 0
        ? await WishModel.findAll({
            where: {
              id_wedding_card: cardIds,
            },
            include: [
              {
                model: WeddingCardModel,
                as: "weddingCard",
                attributes: ["id", "name", "url"],
              },
            ],
            order: [["createdAt", "DESC"]],
          })
        : [];

    // Nếu user đã có thiệp cưới nhưng chưa có lời chúc nào trong DB, khởi tạo dữ liệu mẫu kèm xu quà tặng
    if (wishes.length === 0 && activeCards.length > 0) {
      const targetCard = activeCards[0];
      const seedData = [
        {
          name: "Nguyễn Văn Hùng",
          content:
            "[Tặng Bắn tim • +520 xu] Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long nhé!",
          id_wedding_card: targetCard.id,
        },
        {
          name: "Trần Thị Mai Anh",
          content:
            "[Tặng Khoá tình yêu • +1314 xu] Mừng ngày vui của hai bạn, luôn ngập tràn tiếng cười và yêu thương!",
          id_wedding_card: targetCard.id,
        },
        {
          name: "Lê Hoàng Long",
          content:
            "[Tặng Pháo mừng • +1980 xu] Cung hỷ cung hỷ! Chúc tân lang tân nương sớm sinh quý tử!",
          id_wedding_card: targetCard.id,
        },
        {
          name: "Phạm Thùy Linh",
          content: "Chúc mừng hạnh phúc cô dâu chú rể, mãi yêu thương nhau nhé!",
          id_wedding_card: targetCard.id,
        },
      ];

      await WishModel.bulkCreate(seedData);

      wishes = await WishModel.findAll({
        where: {
          id_wedding_card: cardIds,
        },
        include: [
          {
            model: WeddingCardModel,
            as: "weddingCard",
            attributes: ["id", "name", "url"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }

    const mappedWishes = wishes.map((w: any) => {
      const parsed = parseWishCoinData(
        w.content,
        w.name,
        w.id_wedding_card,
        giftPriceMap,
        allSent
      );
      return {
        id: w.id,
        name: w.name,
        content: w.content,
        cleanContent: parsed.cleanContent,
        giftName: parsed.giftName,
        coins: parsed.coins,
        createdAt: w.createdAt,
        cardId: w.id_wedding_card,
        cardName: w.weddingCard?.name || "N/A",
        cardSlug: w.weddingCard?.url || "",
      };
    });

    const totalWishes = mappedWishes.length;
    const latestWish = mappedWishes.length > 0 ? mappedWishes[0].createdAt : null;
    const totalCards = activeCards.length;
    const totalCoins = mappedWishes.reduce(
      (sum: number, item: any) => sum + (Number(item.coins) || 0),
      0
    );

    return FormatResponse.success(
      {
        stats: {
          totalWishes,
          latestWish,
          totalCards,
          totalCoins,
        },
        cards: activeCards.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.url,
        })),
        wishes: mappedWishes,
      },
      "Fetched blessing box data successfully"
    );
  } catch (error) {
    console.error("Error fetching blessing box data:", error);
    return FormatResponse.failure(error);
  }
});
