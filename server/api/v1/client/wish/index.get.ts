import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const filterSlug = (query.slug as string)?.trim();

    const { WeddingCard: WeddingCardModel, Wish: WishModel, Invitor: InvitorModel } = (global as any).__db;

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
            stats: { totalWishes: 0, latestWish: null, totalCards: 0 },
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

      return FormatResponse.success(
        {
          stats: {
            totalWishes: cardWishes.length,
            latestWish: cardWishes.length > 0 ? cardWishes[0].createdAt : null,
            totalCards: 1,
          },
          cards: [
            {
              id: targetCard.id,
              name: targetCard.name,
              slug: targetCard.url,
            },
          ],
          wishes: cardWishes.map((w: any) => ({
            id: w.id,
            name: w.name,
            content: w.content,
            createdAt: w.createdAt,
            cardId: targetCard.id,
            cardName: w.weddingCard?.name || targetCard.name || "N/A",
            cardSlug: w.weddingCard?.url || targetCard.url || "",
          })),
        },
        "Fetched card wishes successfully"
      );
    }

    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    // Lấy toàn bộ thiệp cưới của user hiện tại
    let weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url", "is_template"],
      order: [["createdAt", "DESC"]],
    });

    // Nếu user có cả thiệp cá nhân (is_template = false) và template, ưu tiên thiệp cá nhân hoặc lấy tất cả
    const personalCards = weddingCards.filter((c: any) => !c.is_template);
    const activeCards = personalCards.length > 0 ? personalCards : weddingCards;
    const cardIds = weddingCards.map((card: any) => card.id);

    const wishes =
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

    const totalWishes = wishes.length;
    const latestWish = wishes.length > 0 ? wishes[0].createdAt : null;
    const totalCards = activeCards.length;

    return FormatResponse.success(
      {
        stats: {
          totalWishes,
          latestWish,
          totalCards,
        },
        cards: activeCards.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.url,
        })),
        wishes: wishes.map((w: any) => ({
          id: w.id,
          name: w.name,
          content: w.content,
          createdAt: w.createdAt,
          cardId: w.id_wedding_card,
          cardName: w.weddingCard?.name || "N/A",
          cardSlug: w.weddingCard?.url || "",
        })),
      },
      "Fetched blessing box data successfully"
    );
  } catch (error) {
    console.error("Error fetching blessing box data:", error);
    return FormatResponse.failure(error);
  }
});
