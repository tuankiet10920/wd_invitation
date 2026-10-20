import FormatResponse from "~~/composables/FormatResponse";
import { BannerData } from "../data/banner";

const Banner = new BannerData();

export class BrandService {
  public async getAllBanners() {
    try {
      const data = await Banner.getAll();
      return FormatResponse.success(data);
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
  public async getBannersWithPosition(
    event: any,
    position: string,
    limit: number
  ) {
    if (!position) return FormatResponse.error(`Position is required!`);

    try {
      const banners = await Banner.getBannersPosition(position, limit);
      return FormatResponse.success(banners);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
