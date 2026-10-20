import { SeoPageService } from "~~/server/services/SeoPageService";

const Service = new SeoPageService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case "GET":
      return await Service.getList(event);
    case "POST":
      return await Service.create(event);
  }
});
