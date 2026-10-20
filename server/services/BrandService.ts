import FormatResponse from "~~/composables/FormatResponse";
import { BrandData } from "~~/server/data/brand";

const Brand = new BrandData();

export class BrandService {
  public async getAllBrands() {
    try {
      const data = await Brand.getAll();
      return FormatResponse.success(data);
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
  public async getOneBrand(event: any) {
    const id = getRouterParam(event, "id");

    if (!id) return FormatResponse.error(`ID is required!`);

    try {
      const brand = await Brand.getOne(id);

      if (!brand) return FormatResponse.error("This Brand does not exist!");

      return FormatResponse.success(brand);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
