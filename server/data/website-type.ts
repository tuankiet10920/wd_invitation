import { DataPattern } from "./index";

export class WebsiteTypeData extends DataPattern {
  protected table = "WebsiteType";

  public async list() {
    const WebsiteTypeModel = this.getModels()?.WebsiteType;
    return await WebsiteTypeModel.findAll({
      order: [["id", "ASC"]],
    });
  }
}
