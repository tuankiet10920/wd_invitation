import FormatResponse from "~~/composables/FormatResponse";
import { NewsWithTypeData } from "../data/news-with-type";

const NewsWithType = new NewsWithTypeData();

export class NewsWithTypeService {
  public async getHome(event: any) {
    try {
      const data = await NewsWithType.getDataTypeNewsAndNewsWithType();
      return FormatResponse.success(data);
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
