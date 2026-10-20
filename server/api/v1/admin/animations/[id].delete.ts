import { AnimationService } from "~~/server/services/AnimationService";
const Service = new AnimationService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "DELETE") {
    return await Service.delete(event);
  }
});
