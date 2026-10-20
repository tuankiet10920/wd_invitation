import jwt from "jsonwebtoken";
import { useRuntimeConfig } from "#imports";
import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler((event) => {
  const path = event.path;
  if (path.startsWith("/api/v1/admin")) {
    if (path == "/api/v1/admin/login") return;

    const token = getCookie(event, "auth_admin_token");

    if (!token) {
      return FormatResponse.error(
        event,
        "Unauthorized: No admin token found.",
        401,
      );
    }

    try {
      const config = useRuntimeConfig();
      const decoded = jwt.verify(token, config.jwtSecret) as any;

      event.context.admin = decoded;
    } catch (error) {
      deleteCookie(event, "auth_admin_token");
      deleteCookie(event, "auth_admin_info");

      return FormatResponse.error(
        event,
        "Session expired. Please login again.",
        401,
      );
    }
  }
});
