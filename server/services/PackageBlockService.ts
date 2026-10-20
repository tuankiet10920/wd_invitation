import { PackageBlockData } from "../data/package-block";
import FormatResponse from "~~/composables/FormatResponse";

const PackageBlock = new PackageBlockData();

export class PackageBlockService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await PackageBlock.list(query);
      return FormatResponse.success(result, "Get blocks list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await PackageBlock.getById(id);
      if (!item) return FormatResponse.error(event, "Block not found!");
      return FormatResponse.success(item, "Get block detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name) {
           return FormatResponse.error(event, "Name is required!");
      }
      
      const newItem = await PackageBlock.create(body);
      return FormatResponse.success(newItem, "Block created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await PackageBlock.update(id, body);
      const updatedItem = await PackageBlock.getById(id);
      return FormatResponse.success(updatedItem, "Block updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await PackageBlock.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or block not found!");
      return FormatResponse.success(true, "Block deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
