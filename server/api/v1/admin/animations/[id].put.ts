import { AnimationService } from "~~/server/services/AnimationService";
const Service = new AnimationService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "PUT") {
    return await Service.update(event);
  }
});
