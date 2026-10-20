import { AnimationService } from "~~/server/services/AnimationService";
const Service = new AnimationService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    return await Service.getList(event);
  }
});
