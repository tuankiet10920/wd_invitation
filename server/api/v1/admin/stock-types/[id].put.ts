import { StockTypeService } from "~~/server/services/StockTypeService";
const Service = new StockTypeService();

export default defineEventHandler(async (event) => {
  return await Service.update(event);
});
