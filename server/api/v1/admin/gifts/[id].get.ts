import { GiftData } from "~~/server/data/gift";
import FormatResponse from "~~/composables/FormatResponse";

const Gift = new GiftData();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return FormatResponse.error(event, "ID is required!", 400);
    const item = await Gift.getById(id);
    if (!item) return FormatResponse.error(event, "Gift not found!", 404);
    return FormatResponse.success(item, "Get gift detail successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});

