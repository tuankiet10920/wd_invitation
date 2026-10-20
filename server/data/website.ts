import { DataPattern } from "./index";

export class WebsiteData extends DataPattern {
  protected table = "Website";

  public async list(query: any) {
    const WebsiteModel = this.getModels()?.Website;
    const WebsiteTypeModel = this.getModels()?.WebsiteType;
    const TagModel = this.getModels()?.Tag;
    const WebsiteImageModel = this.getModels()?.WebsiteImage;

    const where: any = {};
    if (query.id_website_type) {
      where.id_website_type = query.id_website_type;
    }
    if (query.id_package) {
      where.id_package = query.id_package;
    }

    const options = {
      query: {
        page: query.page || "1",
        limit: query.limit || "12",
        search: query.search || "",
      },
      where,
      keySearch: "title",
      includes: [
        { model: WebsiteTypeModel, as: "type" },
        { model: TagModel, as: "tags" },
        { model: WebsiteImageModel, as: "images" },
      ],
      order: [["createdAt", "DESC"]],
    };
    return await this.pagination(WebsiteModel, options);
  }

  public async getBySlug(slug: string) {
    const WebsiteModel = this.getModels()?.Website;
    const WebsiteTypeModel = this.getModels()?.WebsiteType;
    const TagModel = this.getModels()?.Tag;
    const PackageModel = this.getModels()?.Package;
    const WebsiteImageModel = this.getModels()?.WebsiteImage;

    return await WebsiteModel.findOne({
      where: { slug },
      include: [
        { model: WebsiteTypeModel, as: "type" },
        { model: TagModel, as: "tags" },
        { model: PackageModel, as: "package" },
        { model: WebsiteImageModel, as: "images" },
      ],
    });
  }
}
