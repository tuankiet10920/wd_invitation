import { WebsiteService } from "~~/server/services/WebsiteService";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    return {
      status: 400,
      message: "Slug is required",
    };
  }
  const websiteService = new WebsiteService();
  try {
    const data = await websiteService.getWebsiteBySlug(slug);
    if (!data) {
      return {
        status: 404,
        message: "Website not found",
      };
    }

    // Get related websites in same category
    const related = await websiteService.getRelatedWebsites(data.id_website_type, data.id);

    return {
      status: 200,
      message: "Success",
      data: data,
      related: related
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
});
