import { SEOPageData } from "../data/seo-page";
import FormatResponse from "~~/composables/FormatResponse";

const SeoPage = new SEOPageData();

export class SeoPageService {
  public async getList(event: any) {
    const query = getQuery(event);
    try {
      const result = await SeoPage.list(query);
      return FormatResponse.success(result, "Get SEO page list successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetail(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const item = await SeoPage.getById(id);
      if (!item) return FormatResponse.error(event, "SEO page not found!");
      return FormatResponse.success(item, "Get SEO page detail successfully!");
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
      if (!body.slug) {
        return FormatResponse.error(event, "Slug is required!");
      }

      const newItem = await SeoPage.create(body);
      return FormatResponse.success(newItem, "SEO page created successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async update(event: any) {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      await SeoPage.update(id, body);
      const updatedItem = await SeoPage.getById(id);
      return FormatResponse.success(
        updatedItem,
        "SEO page updated successfully!",
      );
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async delete(event: any) {
    const id = getRouterParam(event, "id");
    try {
      if (!id) return FormatResponse.error(event, "ID is required!");
      const result = await SeoPage.delete(id);
      if (!result)
        return FormatResponse.error(
          event,
          "Delete failed or SEO page not found!",
        );
      return FormatResponse.success(true, "SEO page deleted successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }

  public async getDetailBySlug(event: any) {
    const slug = getRouterParam(event, "slug");
    try {
      if (!slug) return FormatResponse.error(event, "Slug is required!");
      const item = await SeoPage.getBySlug(slug);
      if (!item) return FormatResponse.error(event, "SEO page not found!");
      return FormatResponse.success(item, "Get SEO page detail successfully!");
    } catch (error) {
      return FormatResponse.failure(error);
    }
  }
}
