import { WebsiteTypeService } from "~~/server/services/WebsiteTypeService";

export default defineEventHandler(async (event) => {
  const websiteTypeService = new WebsiteTypeService();
  try {
    const data = await websiteTypeService.getWebsiteTypeList();
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
