import { FeatureData } from "../data/FeatureData";
import FormatResponse from "~~/composables/FormatResponse";
import { services } from "~~/composables/FuncServices";

const Feature = new FeatureData();

export class FeatureService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Feature.list(query);
      return FormatResponse.success(result, "Get features list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Feature.getById(id);
      if (!item) return FormatResponse.error(event, "Feature not found!");
      return FormatResponse.success(item, "Get feature detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name) return FormatResponse.error(event, "Name is required!");

      if (!body.slug) body.slug = services.generateSlug(body.name);

      const newItem = await Feature.create(body);
      return FormatResponse.success(newItem, "Feature created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      await Feature.update(id, body);
      const updatedItem = await Feature.getById(id);
      return FormatResponse.success(
        updatedItem,
        "Feature updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Feature.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or feature not found!",
        );
      return FormatResponse.success(true, "Feature deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
