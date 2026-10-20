import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;

    if (!email) {
      return FormatResponse.error(event, "Unauthorized");
    }

    const user = await User.checkUserNormal(email);
    if (!user) {
      return FormatResponse.error(event, "User not found");
    }

    const { WeddingCard: WeddingCardModel, Wish: WishModel } = global.__db;

    // Fetch all wedding cards of the user to get their IDs and count
    const weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name"],
    });

    const cardIds = weddingCards.map((card: any) => card.id);

    // Fetch all wishes for these cards
    const wishes = await WishModel.findAll({
      where: {
        id_wedding_card: cardIds,
      },
      include: [
        {
          model: WeddingCardModel,
          as: "weddingCard",
          attributes: ["name", "url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Stats
    const totalWishes = wishes.length;
    const latestWish = wishes.length > 0 ? wishes[0].createdAt : null;
    const totalCards = weddingCards.length;

    return FormatResponse.success(
      {
        stats: {
          totalWishes,
          latestWish,
          totalCards,
        },
        wishes: wishes.map((w: any) => ({
          id: w.id,
          name: w.name,
          content: w.content,
          createdAt: w.createdAt,
          cardName: w.weddingCard?.name || "N/A",
          cardSlug: w.weddingCard?.url || "",
        })),
      },
      "Fetched blessing box data successfully",
    );
  } catch (error) {
    console.error("Error fetching blessing box data:", error);
    return FormatResponse.failure(error);
  }
});
