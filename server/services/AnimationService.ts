import FormatResponse from "~~/composables/FormatResponse";
import { AnimationData } from "../data/animation";

const Animation = new AnimationData();

export class AnimationService {
  public async getAll(event: any) {
    try {
      const data = await Animation.getAll();
      return FormatResponse.success(data, "Get animations successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await Animation.examplePagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name) return FormatResponse.error(event, "Name is required!");

      const payload = {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        icon: body.icon || null,
        icon_type: body.icon_type || 'mdi',
        id_min_package: body.id_min_package || 1
      };

      const newItem = await Animation.create(payload);
      return FormatResponse.success(newItem, "Animation created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      const payload: any = {};
      if (body.name !== undefined) payload.name = body.name;
      if (body.slug !== undefined) payload.slug = body.slug;
      if (body.icon !== undefined) payload.icon = body.icon;
      if (body.icon_type !== undefined) payload.icon_type = body.icon_type;
      if (body.id_min_package !== undefined) payload.id_min_package = body.id_min_package;

      const updatedItem = await Animation.update(id, payload);
      if (!updatedItem) return FormatResponse.error(event, "Animation not found!");
      
      return FormatResponse.success(updatedItem, "Animation updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Animation.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or Animation not found!");
      return FormatResponse.success(true, "Animation deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Animation.getById(id);
      if (!item) return FormatResponse.error(event, "Animation not found!");
      return FormatResponse.success(item, "Get Animation detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
