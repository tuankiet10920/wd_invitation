import { FallingService } from "~~/server/services/FallingService";
const Service = new FallingService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    return await Service.getList(event);
  }
});
