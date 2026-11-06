import FormatResponse from "~~/composables/FormatResponse";
import { AcceptInvitationData } from "../data/accept-invitation";
import { WeddingCardData } from "../data/card-template";
import { UserData } from "../data/user";

const AcceptInvitation = new AcceptInvitationData();
const WeddingCard = new WeddingCardData();
const User = new UserData();

export class AcceptInvitationService {
  public async getOverview(event: any) {
    try {
      const session = await getUserSession(event);
      const sessionUser = session?.user as any;
      const email = sessionUser?.email;

      if (!email) {
        return FormatResponse.error(event, "Unauthorized", 401);
      }

      const user = await User.checkUserNormal(email);
      if (!user) {
        return FormatResponse.error(event, "User not found", 404);
      }

      const { WeddingCard: WeddingCardModel, AcceptInvitation: AcceptInvitationModel } =
        global.__db;

      const weddingCards = await WeddingCardModel.findAll({
        where: { id_user: user.id },
        attributes: ["id", "name", "url", "avatar", "is_publish", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
      });

      const cardIds = weddingCards.map((card: any) => card.id);

      const rsvpRecords =
        cardIds.length > 0
          ? await AcceptInvitationModel.findAll({
              where: { id_wedding_card: cardIds },
              order: [["createdAt", "DESC"]],
            })
          : [];

      const byCardMap = new Map<
        number,
        {
          responses: number;
          attending: number;
          expectedPeople: number;
          notAttending: number;
          latestResponseAt: string | null;
        }
      >();

      for (const card of weddingCards) {
        byCardMap.set(card.id, {
          responses: 0,
          attending: 0,
          expectedPeople: 0,
          notAttending: 0,
          latestResponseAt: null,
        });
      }

      for (const item of rsvpRecords) {
        const cardId = Number(item.id_wedding_card);
        const entry = byCardMap.get(cardId);
        if (!entry) continue;

        entry.responses += 1;
        if (!entry.latestResponseAt && item.createdAt) {
          entry.latestResponseAt = item.createdAt;
        }

        const isAccept = !!item.is_accept;
        if (isAccept) {
          entry.attending += 1;
          let people = 1;
          try {
            const parsed =
              typeof item.content === "string"
                ? JSON.parse(item.content)
                : item.content;
            const count = Number(
              parsed?.number_of_people ?? parsed?.people ?? parsed?.guests ?? 1,
            );
            people = Number.isFinite(count) && count > 0 ? count : 1;
          } catch {
            people = 1;
          }
          entry.expectedPeople += people;
        } else {
          entry.notAttending += 1;
        }
      }

      let totalResponses = 0;
      let totalAttending = 0;
      let totalExpectedPeople = 0;
      let cardsWithResponse = 0;

      const cards = weddingCards.map((card: any) => {
        const cardStats = byCardMap.get(card.id) || {
          responses: 0,
          attending: 0,
          expectedPeople: 0,
          notAttending: 0,
          latestResponseAt: null,
        };

        totalResponses += cardStats.responses;
        totalAttending += cardStats.attending;
        totalExpectedPeople += cardStats.expectedPeople;
        if (cardStats.responses > 0) {
          cardsWithResponse += 1;
        }

        return {
          id: card.id,
          name: card.name,
          url: card.url,
          avatar: card.avatar,
          is_publish: card.is_publish,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
          responses: cardStats.responses,
          attending: cardStats.attending,
          expectedPeople: cardStats.expectedPeople,
          notAttending: cardStats.notAttending,
          latestResponseAt: cardStats.latestResponseAt,
        };
      });

      return FormatResponse.success(
        {
          stats: {
            totalResponses,
            totalAttending,
            totalExpectedPeople,
            cardsWithResponse,
            totalCards: weddingCards.length,
          },
          cards,
        },
        "Fetched RSVP overview successfully!",
      );
    } catch (error) {
      console.error("Error fetching RSVP overview:", error);
      return FormatResponse.failure(error);
    }
  }

  public async list(event: any) {
    try {
      const { slug } = getQuery(event);
      if (!slug) return FormatResponse.error(event, "Slug is required!");

      const card = await WeddingCard.getByUrl(slug as string);
      if (!card) return FormatResponse.error(event, "Wedding card not found!");

      const list = await AcceptInvitation.listByCard(card.id);
      
      // Parse content column for each item
      const parsedList = list.map((item: any) => {
        const itemObj = item.toJSON();
        try {
          itemObj.content = JSON.parse(itemObj.content);
        } catch (e) {
          itemObj.content = { name: itemObj.content };
        }
        return itemObj;
      });

      return FormatResponse.success(parsedList, "List accept invitations fetched successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getStats(event: any) {
    try {
      const { slug } = getQuery(event);
      if (!slug) return FormatResponse.error(event, "Slug is required!");

      const card = await WeddingCard.getByUrl(slug as string);
      if (!card) return FormatResponse.error(event, "Wedding card not found!");

      const list = await AcceptInvitation.listByCard(card.id);
      
      const stats = {
        total: list.length,
        attending: 0,
        totalPeople: list.length, // Match total as requested
        notAttending: 0
      };

      list.forEach((item: any) => {
        const isAccept = !!item.is_accept;
        if (isAccept) {
          stats.attending++;
        } else {
          stats.notAttending++;
        }
      });

      return FormatResponse.success(stats, "RSVP stats fetched successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    try {
      const body = await readBody(event);
      const { slug, content, is_accept } = body;

      if (!slug) return FormatResponse.error(event, "Slug is required!");
      
      const card = await WeddingCard.getByUrl(slug);
      if (!card) return FormatResponse.error(event, "Wedding card not found!");

      const data = {
        content: typeof content === 'object' ? JSON.stringify(content) : content,
        is_accept: is_accept === true,
        id_wedding_card: card.id,
      };

      const newItem = await AcceptInvitation.create(data);

      return FormatResponse.success(newItem, "Accept invitation submitted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    try {
      const id = getRouterParam(event, "id");
      if (!id) return FormatResponse.error(event, "ID is required!");

      const result = await AcceptInvitation.delete(id);
      if (!result) return FormatResponse.error(event, "RSVP record not found or delete failed!");

      return FormatResponse.success(true, "RSVP record deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
