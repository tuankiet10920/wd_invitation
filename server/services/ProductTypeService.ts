import FormatResponse from "~~/composables/FormatResponse";
import { ProductTypeData } from "~~/server/data/product-type";

const ProductType = new ProductTypeData();

export class ProductTypeService {
  public async getAllData(event: any) {
    try {
      const data = await ProductType.getAll();
      return FormatResponse.paginate(data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
