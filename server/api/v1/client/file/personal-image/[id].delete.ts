import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import fs from "node:fs/promises";
import path from "node:path";
import { getCookie } from "h3";
import jwt from "jsonwebtoken";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const id = getRouterParam(event, "id");
    let user = null;

    // 1. Auth check
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    if (sessionUser?.email) {
      user = await User.checkUserNormal(sessionUser.email);
    }

    if (!user) {
      const token = getCookie(event, "auth_admin_token");
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          if (decoded && decoded.id) {
            user = await User.getById(decoded.id);
          }
        } catch (e) {
             // Admin auth fail
        }
      }
    }

    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { Image: ImageModel } = global.__db;

    // 2. Find image
    const image = await ImageModel.findOne({
      where: { id, id_user: user.id }
    });

    if (!image) {
      return FormatResponse.error(event, "Image not found or permission denied", 404);
    }

    // 3. Delete physical file if it exists
    const url = image.url;
    if (url) {
      // Handle both filename-only and full path
      const filename = url.startsWith('/') ? path.basename(url) : url;
      const filePath = path.join(process.cwd(), "public", "images", "personal_image", filename);
      
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (e) {
        console.warn(`[DeleteImage] File not found or couldn't be deleted: ${filePath}`);
      }
    }

    // 4. Delete record
    await image.destroy();

    return FormatResponse.success(null, "Image deleted successfully!");
  } catch (error: any) {
    console.error("[DeleteImage] Failure:", error);
    return FormatResponse.failure(error);
  }
});
