import { EffectService } from "~~/server/services/EffectService";
const Service = new EffectService();

export default defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    return await Service.getClientEffects(event);
  }
});
