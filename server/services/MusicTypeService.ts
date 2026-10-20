import FormatResponse from "~~/composables/FormatResponse";
import { MusicTypeData } from "../data/music-type";

const MusicType = new MusicTypeData();

export class MusicTypeService {
  public async getAll(event: any) {
    try {
      const data = await MusicType.getAll();
      return FormatResponse.success(data, "Get music types successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await MusicType.examplePagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name)
        return FormatResponse.error(event, "Name is required!");

      const newItem = await MusicType.create(body);
      return FormatResponse.success(newItem, "Music type created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      const updatedItem = await MusicType.update(id, body);
      if (!updatedItem) return FormatResponse.error(event, "Music type not found!");
      
      return FormatResponse.success(updatedItem, "Music type updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await MusicType.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or music type not found!");
      return FormatResponse.success(true, "Music type deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await MusicType.getById(id);
      if (!item) return FormatResponse.error(event, "Music type not found!");
      return FormatResponse.success(item, "Get music type detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
