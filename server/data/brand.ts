import { Op } from "sequelize";
import { DataPattern } from ".";

export class BrandData extends DataPattern {
  protected table = "Brand";
  public async getAll(): Promise<any> {
    try {
      const BrandModel = this.getModels()?.Brand;
      const attributes = ["id", "name", "slug", "description", "featured"];
      return await BrandModel.findAll({ attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getOne(id: number | string): Promise<any> {
    try {
      const BrandModel = this.getModels()?.Brand;
      const attributes = ["id", "name", "slug", "description", "featured"];
      return await BrandModel.findByPk(id, { attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getBrandsWithCategoryProduct(id: number | string) {
    try {
      const ProductModel = this.getModels()?.Product;
      const BrandModel = this.getModels()?.Brand;

      const query = {
        where: {
          categoryId: id,
          brandId: {
            [Op.not]: null,
          },
        },
        group: ["brandId"],
        attributes: ["brand.name"],
        include: [
          {
            model: BrandModel,
            as: "brand",
            attributes: ["id", "name", "slug"],
          },
        ],
      };

      return await ProductModel.findAll(query);
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
