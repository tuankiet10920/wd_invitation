import { WebsiteTypeData } from "../data/website-type";

export class WebsiteTypeService {
  private websiteTypeData: WebsiteTypeData;

  constructor() {
    this.websiteTypeData = new WebsiteTypeData();
  }

  public async getWebsiteTypeList() {
    return await this.websiteTypeData.list();
  }
}
