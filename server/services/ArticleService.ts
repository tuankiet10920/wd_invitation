import { services } from "~~/composables/FuncServices";
import { ArticleData } from "../data/article";
import FormatResponse from "~~/composables/FormatResponse";

const Article = new ArticleData();

export class ArticleService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await Article.list(query);
      return FormatResponse.success(result, "Get article list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await Article.getById(id);
      if (!item) return FormatResponse.error(event, "Article not found!");
      return FormatResponse.success(item, "Get article detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async create(event: any) {
    const body = await readBody(event);
    try {
      if (!body.title_vi) {
        return FormatResponse.error(event, "Title is required!");
      }

      if (body.type_id) {
        body.id_type_news = body.type_id;
        delete body.type_id;
      }

      const newItem = await Article.create({
        ...body,
        slug_vi: services.generateSlug(body.title_vi),
      });
      return FormatResponse.success(newItem, "Article created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");

      if (body.type_id) {
        body.id_type_news = body.type_id;
        delete body.type_id;
      }

      await Article.update(id, body);
      const updatedItem = await Article.getById(id);
      return FormatResponse.success(
        updatedItem,
        "Article updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await Article.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or article not found!",
        );
      return FormatResponse.success(true, "Article deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
