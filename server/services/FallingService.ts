import FormatResponse from "~~/composables/FormatResponse";
import { FallingData } from "../data/falling";

const Falling = new FallingData();

export class FallingService {
  public async getAll(event: any) {
    try {
      const data = await Falling.getAll();
      return FormatResponse.success(data, "Get falling effects successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await Falling.examplePagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name) return FormatResponse.error(event, "Name is required!");

      // Prepare payload
      const payload = {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        icon: body.icon || null,
        icon_type: body.icon_type || 'mdi',
        icons: body.icons || null, // Array of small inner icons
        is_custom: body.is_custom || false,
        id_min_package: body.id_min_package || 1
      };

      const newItem = await Falling.create(payload);
      return FormatResponse.success(newItem, "Falling effect created successfully!");
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
      if (body.icons !== undefined) payload.icons = body.icons;
      if (body.is_custom !== undefined) payload.is_custom = body.is_custom;
      if (body.id_min_package !== undefined) payload.id_min_package = body.id_min_package;

      const updatedItem = await Falling.update(id, payload);
      if (!updatedItem) return FormatResponse.error(event, "Falling effect not found!");
      
      return FormatResponse.success(updatedItem, "Falling effect updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Falling.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or falling effect not found!");
      return FormatResponse.success(true, "Falling effect deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Falling.getById(id);
      if (!item) return FormatResponse.error(event, "Falling effect not found!");
      return FormatResponse.success(item, "Get falling effect detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
