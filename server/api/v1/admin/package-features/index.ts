import { PackageFeatureService } from "~~/server/services/PackageFeatureService";

const service = new PackageFeatureService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    return await service.getList(event);
  }

  if (method === "POST") {
    return await service.create(event);
  }
});
