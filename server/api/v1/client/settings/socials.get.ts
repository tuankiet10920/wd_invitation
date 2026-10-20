import { SettingService } from "~~/server/services/SettingService";

const Service = new SettingService();

export default defineEventHandler(async (event) => {
  return await Service.getSocialLinks(event);
});
