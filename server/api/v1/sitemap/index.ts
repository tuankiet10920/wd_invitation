import { SitemapService } from "~~/server/services/SitemapService";

const sitemap = new SitemapService();

export default defineEventHandler((event) => {
  const method = getMethod(event);
  switch (method) {
    /**
     * @method GET
     * @access Public
     * @route /api/v1/sitemap
     */
    case "GET":
      return sitemap.getAllData(event);
    default:
      break;
  }
});
