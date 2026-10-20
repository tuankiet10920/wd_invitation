import { BackgroundTypeService } from "~~/server/services/BackgroundTypeService";
const Service = new BackgroundTypeService();

export default defineEventHandler(async (event) => {
  return await Service.getList(event);
});
