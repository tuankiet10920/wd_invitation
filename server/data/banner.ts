import { DataPattern } from ".";

export class BannerData extends DataPattern {
  protected table = "Banner";
  public async getAll(): Promise<any> {
    try {
      const BannerModel = this.getModels()?.Banner;
      const attributes = ["id", "title", "image", "active", "order"];
      return await this.pagination(BannerModel, { attributes });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
  public async getBannersPosition(
    position: string = "slide-index",
    limit: number = 5
  ): Promise<any> {
    try {
      const BannerModel = this.getModels()?.Banner;
      const attributes = ["id", "title", "image", "active", "order"];
      const where = { position };
      return await BannerModel.findAll({
        where,
        attributes,
        order: [["order", "ASC"]],
        limit,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
