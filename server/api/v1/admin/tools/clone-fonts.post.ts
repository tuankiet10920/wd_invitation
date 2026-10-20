import { FontService } from "~~/server/services/FontService";

const service = new FontService();

export default defineEventHandler(async (event) => {
  return await service.cloneFonts(event);
});
