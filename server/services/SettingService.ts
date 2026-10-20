import { SettingData } from "../data/setting";
import FormatResponse from "~~/composables/FormatResponse";

const Setting = new SettingData();

export class SettingService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Setting.list(query);
      return FormatResponse.success(result, "Get setting list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Setting.getById(id);
      if (!item) return FormatResponse.error(event, "Setting not found!");
      return FormatResponse.success(item, "Get setting detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getOneByKey(event: any) {
    const key = getRouterParam(event, "key");
    try {
      if (!key) return FormatResponse.error(event, "KEY is required!");
      const item = await Setting.getByKey(key);
      if (!item) return FormatResponse.error(event, "Setting not found!");
      return FormatResponse.success(item, "Get setting detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getSocialLinks(event: any) {
    try {
      const keys = ["facebook_link", "instagram_link", "tiktok_link"];
      const settings = await Setting.getByKeys(keys);
      
      const result: any = {};
      // Initialize with empty strings
      keys.forEach(key => result[key] = "");

      // Fill with actual data
      if (settings && Array.isArray(settings)) {
          settings.forEach((s: any) => {
              result[s.key] = s.value;
          });
      }
      
      return FormatResponse.success(result, "Get social links successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      // Basic validation
      if (!body.key || !body.value) {
        return FormatResponse.error(event, "Key and Value are required!");
      }

      const newItem = await Setting.create(body);
      return FormatResponse.success(newItem, "Setting created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      await Setting.update(id, body);
      // Fetch updated
      const updatedItem = await Setting.getById(id);
      return FormatResponse.success(
        updatedItem,
        "Setting updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Setting.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or setting not found!",
        );
      return FormatResponse.success(true, "Setting deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
