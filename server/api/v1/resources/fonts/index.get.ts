import { FontService } from "~~/server/services/FontService";

export default defineEventHandler(async (event) => {
  const service = new FontService();
  return await service.getFontTypes(event);
});
