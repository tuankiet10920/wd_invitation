import { PackageFeatureService } from "~~/server/services/PackageFeatureService";

const service = new PackageFeatureService();

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    return await service.getDetail(event);
  }

  if (method === "PUT") {
    return await service.update(event);
  }

  if (method === "DELETE") {
    return await service.delete(event);
  }
});
