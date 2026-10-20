import { SeoPageService } from "~~/server/services/SeoPageService";

const Service = new SeoPageService();

export default defineEventHandler(async (event) => {
  return await Service.getDetailBySlug(event);
});
