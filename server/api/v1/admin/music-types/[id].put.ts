import { MusicTypeService } from "~~/server/services/MusicTypeService";
const Service = new MusicTypeService();

export default defineEventHandler(async (event) => {
  return await Service.update(event);
});
