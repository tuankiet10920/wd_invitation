import { ArticleService } from "~~/server/services/ArticleService";

const Service = new ArticleService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case "GET":
      return await Service.getList(event);
    case "POST":
      return await Service.create(event);
  }
});
