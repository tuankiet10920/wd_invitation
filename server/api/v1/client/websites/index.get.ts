import { WebsiteService } from "~~/server/services/WebsiteService";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const websiteService = new WebsiteService();
  try {
    const data = await websiteService.getWebsiteList(query);
    return {
      status: 200,
      message: "Success",
      data: data,
    };
  } catch (error: any) {
    return {
      status: 500,
      message: error.message,
    };
  }
});
