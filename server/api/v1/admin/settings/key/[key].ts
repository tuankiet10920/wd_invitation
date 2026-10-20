import { SettingService } from "~~/server/services/SettingService";

const Service = new SettingService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case "GET":
      return await Service.getOneByKey(event);
  }
});
