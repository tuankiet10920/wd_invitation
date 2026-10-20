import FormatResponse from "~~/composables/FormatResponse";
import { SEOPageData } from "../data/seo-page";

const SEOPage = new SEOPageData();

export class SitemapService {
  public async getAllData(event: any) {
    try {
      return await SEOPage.sitemap();
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
}
