import { GiftData } from "~~/server/data/gift";
import FormatResponse from "~~/composables/FormatResponse";

const Gift = new GiftData();

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return FormatResponse.error(event, "ID is required!", 400);
    await Gift.delete(id);
    return FormatResponse.success(true, "Deleted gift successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});

