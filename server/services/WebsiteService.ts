import { WebsiteData } from "../data/website";
import { Op } from "sequelize";

export class WebsiteService {
  private websiteData: WebsiteData;

  constructor() {
    this.websiteData = new WebsiteData();
  }

  public async getWebsiteList(query: any) {
    return await this.websiteData.list(query);
  }

  public async getWebsiteBySlug(slug: string) {
    return await this.websiteData.getBySlug(slug);
  }

  // Related websites in the same category
  public async getRelatedWebsites(id_website_type: number, current_id: number) {
    const WebsiteModel = (global as any).__db.Website;
    return await WebsiteModel.findAll({
      where: {
        id_website_type,
        id: { [Op.ne]: current_id }
      },
      limit: 6,
      order: [["createdAt", "DESC"]]
    });
  }
}
