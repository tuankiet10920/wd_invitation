import { CategoryWeddingCardService } from "~~/server/services/CategoryWeddingCardService";

const service = new CategoryWeddingCardService();

export default defineEventHandler(async (event) => {
  return await service.getAllData(event);
});
