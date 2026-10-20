import { OpeningService } from "~~/server/services/OpeningService";
const Service = new OpeningService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "POST") {
    return await Service.create(event);
  }
});
