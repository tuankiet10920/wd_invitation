import { ArticleTypeService } from "~~/server/services/ArticleTypeService";
import { services } from "~~/composables/FuncServices";

const Service = new ArticleTypeService();

export default defineEventHandler(async (event) => {
  const result: any = await Service.getList(event);
  if (result && result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
          const plainItem = item.get ? item.get({ plain: true }) : item;
          return {
              ...plainItem,
              slug_vi: services.generateSlug(plainItem.name_vi || '')
          }
      });
  }
  return result;
});
