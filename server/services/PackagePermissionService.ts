import { PackagePermissionData } from "../data/package-permission";
import FormatResponse from "~~/composables/FormatResponse";

const PackagePermission = new PackagePermissionData();

export class PackagePermissionService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await PackagePermission.list(query);
      return FormatResponse.success(result, "Get permissions list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await PackagePermission.getById(id);
      if (!item) return FormatResponse.error(event, "Permission not found!");
      return FormatResponse.success(item, "Get permission detail successfully!");
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
      
      const newItem = await PackagePermission.create(body);
      return FormatResponse.success(newItem, "Permission created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await PackagePermission.update(id, body);
      const updatedItem = await PackagePermission.getById(id);
      return FormatResponse.success(updatedItem, "Permission updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await PackagePermission.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or permission not found!");
      return FormatResponse.success(true, "Permission deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
