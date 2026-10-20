import FormatResponse from "~~/composables/FormatResponse";
import { CategoryData } from "~~/server/data/category";

const Category = new CategoryData();

export class CategoryService {
  public async getAllData(event: any) {
    try {
      const data = await Category.getAll();
      return FormatResponse.paginate(data);
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
}
