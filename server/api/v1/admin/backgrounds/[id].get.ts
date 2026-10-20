import { BackgroundService } from "~~/server/services/BackgroundService";
const Service = new BackgroundService();

export default defineEventHandler(async (event) => {
  return await Service.getDetail(event);
});
