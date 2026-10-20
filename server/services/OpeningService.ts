import FormatResponse from "~~/composables/FormatResponse";
import { OpeningData } from "../data/opening";

const Opening = new OpeningData();

export class OpeningService {
  public async getAll(event: any) {
    try {
      const data = await Opening.getAll();
      return FormatResponse.success(data, "Get openings successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await Opening.examplePagination(query);
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
        id_min_package: body.id_min_package || 1,
        image_left: body.image_left || null,
        image_right: body.image_right || null,
        video: body.video || null,
        is_custom: body.is_custom === true || body.is_custom === 'true'
      };

      const newItem = await Opening.create(payload);
      return FormatResponse.success(newItem, "Opening created successfully!");
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
      if (body.image_left !== undefined) payload.image_left = body.image_left;
      if (body.image_right !== undefined) payload.image_right = body.image_right;
      if (body.video !== undefined) payload.video = body.video;
      if (body.is_custom !== undefined) payload.is_custom = body.is_custom === true || body.is_custom === 'true';

      const updatedItem = await Opening.update(id, payload);
      if (!updatedItem) return FormatResponse.error(event, "Opening not found!");
      
      return FormatResponse.success(updatedItem, "Opening updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Opening.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or Opening not found!");
      return FormatResponse.success(true, "Opening deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Opening.getById(id);
      if (!item) return FormatResponse.error(event, "Opening not found!");
      return FormatResponse.success(item, "Get Opening detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getBySlug(event: any) {
    const slug = getRouterParam(event, "slug");
    try {
      if (!slug) return FormatResponse.error(event, "Slug is required!");
      const item = await Opening.getBySlug(slug);
      if (!item) return FormatResponse.error(event, "Opening not found!");
      return FormatResponse.success(item, "Get Opening by slug successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
