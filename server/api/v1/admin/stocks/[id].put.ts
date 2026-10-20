import { StockService } from "~~/server/services/StockService";
const Service = new StockService();

export default defineEventHandler(async (event) => {
  return await Service.update(event);
});
