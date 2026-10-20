import FormatResponse from "~~/composables/FormatResponse";
import { AcceptInvitationData } from "../data/accept-invitation";
import { WeddingCardData } from "../data/card-template";

const AcceptInvitation = new AcceptInvitationData();
const WeddingCard = new WeddingCardData();

export class AcceptInvitationService {
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
