import { OpeningService } from "~~/server/services/OpeningService";
const Service = new OpeningService();

export default defineEventHandler(async (event) => {
  return await Service.getBySlug(event);
});
