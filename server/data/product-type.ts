import { DataPattern } from ".";

export class ProductTypeData extends DataPattern {
  protected table = "ProductType";
  public async getAll(): Promise<any> {
    try {
      const ProductTypeModel = this.getModels()?.ProductType;
      const attributes = ["id", "name", "description", "code", "active"];
      return await this.pagination(ProductTypeModel, { attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
