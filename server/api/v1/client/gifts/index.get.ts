import { GiftData } from "~~/server/data/gift";
import FormatResponse from "~~/composables/FormatResponse";

const Gift = new GiftData();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const result = await Gift.list({
      ...query,
      limit: query.limit || 50 // Default to load more gifts
    });
    
    return FormatResponse.success(result, "Get gifts list successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
