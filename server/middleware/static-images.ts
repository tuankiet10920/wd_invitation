// server/middleware/static-images.ts
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { defineEventHandler, sendStream, setResponseHeader } from "h3";

// BẮT BUỘC phải có "export default"
export default defineEventHandler(async (event) => {
  const url = event.node.req.url || "";
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && url.startsWith("/images/")) {
    console.log("Cần chạy images");

    const rootDir = path.resolve();

    // Logic lùi thư mục như đã bàn
    const baseDir = path.join(rootDir, "..", "public");

    const filePath = path.join(baseDir, url);

    if (existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();

      // Map basic mime types
      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
      };

      setResponseHeader(
        event,
        "Content-Type",
        mimeTypes[ext] || "application/octet-stream",
      );
      setResponseHeader(event, "Cache-Control", "public, max-age=31536000");

      return sendStream(event, createReadStream(filePath));
    }
  }
});
