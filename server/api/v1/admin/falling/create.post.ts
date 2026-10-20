import { FallingService } from "~~/server/services/FallingService";
const Service = new FallingService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "POST") {
    return await Service.create(event);
  }
});
