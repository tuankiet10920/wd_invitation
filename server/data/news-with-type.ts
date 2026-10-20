import { DataPattern } from ".";

export class NewsWithTypeData extends DataPattern {
  protected table = "NewsWithType";

  public async getDataTypeNewsAndNewsWithType(
    type: string = "home"
  ): Promise<any> {
    const NewsTypeModel = this.getModels()?.NewsType;
    const News = this.getModels()?.News;
    const where = { type };
    const attributes = ["id", "name", "slug", "type"];
    const order = [["createdAt", "DESC"]];
    const include = [
      {
        model: News,
        as: "news",
        attributes: ["id", "title", "slug", "image", "id_type", "createdAt"],
      },
    ];
    try {
      return await NewsTypeModel.findAll({
        where,
        attributes,
        include,
        order,
      });
    } catch (error) {
      return this.failure(error as Error);
    }
  }
}
