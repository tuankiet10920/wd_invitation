import FormatResponse from "~~/composables/FormatResponse";
import { CategoryWeddingCardData } from "~~/server/data/category-wedding-cards";

const Category = new CategoryWeddingCardData();

export class CategoryWeddingCardService {
  public async getAllData(event: any) {
    try {
      const data = await Category.getAll();
      return FormatResponse.success(data, "Success");
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
}
