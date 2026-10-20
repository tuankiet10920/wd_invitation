import { WeddingCardService } from "~~/server/services/CardTemplateService";

const service = new WeddingCardService();

export default defineEventHandler(async (event) => {
  return await service.view(event);
});
