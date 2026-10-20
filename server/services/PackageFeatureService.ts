import { PackageFeatureData } from "../data/package-feature";
import FormatResponse from "~~/composables/FormatResponse";

const PackageFeature = new PackageFeatureData();

export class PackageFeatureService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await PackageFeature.list(query);
      return FormatResponse.success(result, "Get package feature list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await PackageFeature.getById(id);
      if (!item) return FormatResponse.error(event, "Package feature not found!");
      return FormatResponse.success(item, "Get package feature detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      // Basic validation
      if (!body.id_package || !body.id_feature) {
           return FormatResponse.error(event, "Package ID and Feature ID are required!");
      }
      
      const newItem = await PackageFeature.create(body);
      return FormatResponse.success(newItem, "Package feature created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await PackageFeature.update(id, body);
      const updatedItem = await PackageFeature.getById(id);
      return FormatResponse.success(updatedItem, "Package feature updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await PackageFeature.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or item not found!");
      return FormatResponse.success(true, "Package feature deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
