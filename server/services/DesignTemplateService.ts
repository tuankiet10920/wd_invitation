import { DesignTemplateData } from "../data/design-template";
import FormatResponse from "~~/composables/FormatResponse";

const DesignTemplate = new DesignTemplateData();

export class DesignTemplateService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await DesignTemplate.list(query);
      return FormatResponse.success(result, "Get template list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await DesignTemplate.getById(id);
      if (!item) return FormatResponse.error(event, "Template not found!");
      return FormatResponse.success(item, "Get template detail successfully!");
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
      
      const newItem = await DesignTemplate.create(body);
      return FormatResponse.success(newItem, "Template created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      await DesignTemplate.update(id, body);
      const updatedItem = await DesignTemplate.getById(id);
      return FormatResponse.success(updatedItem, "Template updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await DesignTemplate.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or template not found!");
      return FormatResponse.success(true, "Template deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
