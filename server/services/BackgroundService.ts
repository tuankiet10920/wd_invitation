import FormatResponse from "~~/composables/FormatResponse";
import { BackgroundData } from "../data/background";

const Background = new BackgroundData();

export class BackgroundService {
  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await Background.pagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.url) return FormatResponse.error(event, "Image URL is required!");
      if (!body.id_image_type) return FormatResponse.error(event, "Type is required!");

      // Force min package 1 since we are not providing an option in CMS right now
      body.id_min_package = 1; 

      const newItem = await Background.create(body);
      return FormatResponse.success(newItem, "Background created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      const updatedItem = await Background.update(id, body);
      if (!updatedItem) return FormatResponse.error(event, "Background not found!");
      return FormatResponse.success(updatedItem, "Background updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Background.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed!");
      return FormatResponse.success(true, "Background deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Background.getById(id);
      if (!item) return FormatResponse.error(event, "Background not found!");
      return FormatResponse.success(item, "Success");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
