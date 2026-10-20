import { ArticleTypeService } from "~~/server/services/ArticleTypeService";

const Service = new ArticleTypeService();

export default defineEventHandler(async (event) => {
  return await Service.create(event);
});
