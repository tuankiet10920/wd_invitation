import { WidgetData } from "../data/widget";
import FormatResponse from "~~/composables/FormatResponse";

const Widget = new WidgetData();

export class WidgetService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Widget.list(query);
      return FormatResponse.success(result, "Get widget list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Widget.getById(id);
      if (!item) return FormatResponse.error(event, "Widget not found!");
      return FormatResponse.success(item, "Get widget detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name || !body.slug || !body.key) {
        return FormatResponse.error(event, "Name, Slug and Key are required!");
      }

      const newItem = await Widget.create(body);
      return FormatResponse.success(newItem, "Widget created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      await Widget.update(id, body);
      const updatedItem = await Widget.getById(id);
      return FormatResponse.success(
        updatedItem,
        "Widget updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Widget.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or widget not found!",
        );
      return FormatResponse.success(true, "Widget deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
