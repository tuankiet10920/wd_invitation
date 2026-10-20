import FormatResponse from "~~/composables/FormatResponse";
import { TagData } from "~~/server/data/tag";

const Tag = new TagData();

export class TagService {
  public async getAllData(event: any) {
    try {
      const data = await Tag.getAll();
      return FormatResponse.paginate(data);
    } catch (error: unknown) {
      return FormatResponse.failure(error);
    }
  }
}
