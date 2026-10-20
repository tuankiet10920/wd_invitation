import FormatResponse from "~~/composables/FormatResponse";
import { BackgroundTypeData } from "../data/background-type";

const BackgroundType = new BackgroundTypeData();

export class BackgroundTypeService {
  public async getAll(event: any) {
    try {
      const data = await BackgroundType.getAll();
      return FormatResponse.success(data, "Get background types successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await BackgroundType.pagination(query);
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

      // Prevent key mutation
      body.key = 'background-system';
      const newItem = await BackgroundType.create(body);
      return FormatResponse.success(newItem, "Background type created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      // Prevent key mutation
      body.key = 'background-system';
      const updatedItem = await BackgroundType.update(id, body);
      if (!updatedItem) return FormatResponse.error(event, "Background type not found!");
      
      return FormatResponse.success(updatedItem, "Background type updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await BackgroundType.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or background type not found!");
      return FormatResponse.success(true, "Background type deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await BackgroundType.getById(id);
      if (!item) return FormatResponse.error(event, "Background type not found!");
      return FormatResponse.success(item, "Get background type detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
