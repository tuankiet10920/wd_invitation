import { PackageData } from "../data/package";
import { PackageFeatureData } from "../data/package-feature";
import FormatResponse from "~~/composables/FormatResponse";

const Package = new PackageData();

export class PackageService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Package.list(query);
      return FormatResponse.success(result, "Get package list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    const PackageFeature = new PackageFeatureData();
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Package.getById(id);
      if (!item) return FormatResponse.error(event, "Package not found!");

      // bổ sung danh sách các features
      const feature_list = await PackageFeature.getListInternal(id);
      return FormatResponse.success(
        { ...item, feature_list },
        "Get package detail successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name || !body.sale_price) {
        return FormatResponse.error(event, "Name and Price are required!");
      }

      const newItem = await Package.create(body);
      return FormatResponse.success(newItem, "Package created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const PackageFeature = new PackageFeatureData();
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      await Package.update(id, body);
      const updatedItem = await Package.getById(id);

      // Cập nhật các features
      if (
        Object.prototype.hasOwnProperty.call(body, "feature_list") &&
        body.feature_list.length > 0
      ) {
        const { feature_list } = body;
        for (let index = 0; index < feature_list.length; index++) {
          const data = {
            status: feature_list[index].status,
          };
          await PackageFeature.update(feature_list[index].id, data);
        }
      }

      return FormatResponse.success(
        updatedItem,
        "Package updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Package.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or package not found!",
        );
      return FormatResponse.success(true, "Package deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
