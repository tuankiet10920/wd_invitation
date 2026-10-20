import FormatResponse from "~~/composables/FormatResponse";
import { ArticleTypeData } from "../data/article-type";

const ArticleType = new ArticleTypeData();

export class ArticleTypeService {
  public async getAll(event: any) {
    try {
      const query = getQuery(event);
      // If we want pagination, we can use examplePagination or keep getAll for simple list
      // For now, let's keep getAll as returning all, but maybe we want pagination for the list page?
      // The user request said "Article types currently only has index getting list", so likely wants full management.
      // Let's support both or just pagination if needed. existing getAll returned findAll directly.
      // Let's add a getList method that uses pagination if the frontend expects it,
      // or just keep getAll simple. The frontend list usually needs pagination.
      // The sidebar link is "Article Types", so a list page is expected.
      // Let's check if the existing getAll is used elsewhere.
      const data = await ArticleType.getAll(); // Existing behavior
      return FormatResponse.success(data, "Get article types successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getList(event: any) {
     const query = getQuery(event);
     try {
         const data = await ArticleType.examplePagination(query);
         return FormatResponse.paginate(data);
     } catch (error) {
         return FormatResponse.failure(error);
     }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.name_vi)
        return FormatResponse.error(event, "Name is required!");

      // Basic validation, can be expanded
      const newItem = await ArticleType.create(body);
      return FormatResponse.success(newItem, "Article type created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      
      const updatedItem = await ArticleType.update(id, body);
      if (!updatedItem) return FormatResponse.error(event, "Article type not found!");
      
      return FormatResponse.success(updatedItem, "Article type updated successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await ArticleType.delete(id);
      if (!result) return FormatResponse.error(event, "Delete failed or article type not found!");
      return FormatResponse.success(true, "Article type deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await ArticleType.getById(id);
      if (!item) return FormatResponse.error(event, "Article type not found!");
      return FormatResponse.success(item, "Get article type detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
