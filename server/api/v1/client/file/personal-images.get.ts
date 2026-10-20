import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    let user = null;

    // 1. Check normal user session
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    if (sessionUser?.email) {
      user = await User.checkUserNormal(sessionUser.email);
    }

    // 2. Check admin token if no session user found
    if (!user) {
      const token = getCookie(event, "auth_admin_token");
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          if (decoded && decoded.id) {
            user = await User.getById(decoded.id);
          }
        } catch (e) {
          console.error("[PersonalImages] Admin token verification failed:", e);
        }
      }
    }

    if (!user) {
      console.log("[PersonalImages] Unauthorized: No valid session or admin token found");
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { Image: ImageModel, ImageType: ImageTypeModel } = global.__db;

    // Find all applicable image types
    const typeKeys = ["personal_image"];
    if (user.role === "admin") {
      typeKeys.push("admin_image");
    }

    const imageTypes = await ImageTypeModel.findAll({
      where: { key: typeKeys }
    });

    if (!imageTypes || imageTypes.length === 0) {
      console.log(`[PersonalImages] No image types found for keys: ${typeKeys.join(', ')}`);
      return FormatResponse.success([], "No image types found");
    }

    const typeIds = imageTypes.map((t: any) => t.id);
    console.log(`[PersonalImages] User: ${user.email} (Role: ${user.role}), Types: ${typeKeys.join(', ')} -> IDs: ${typeIds.join(', ')}`);

    const images = await ImageModel.findAll({
      where: {
        id_user: user.id,
        id_image_type: { [Op.in]: typeIds }
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'url', 'createdAt']
    });

    const plainImages = images.map((img: any) => img.get({ plain: true }));
    console.log(`[PersonalImages] Found ${plainImages.length} images for user ID ${user.id}`);

    return FormatResponse.success(plainImages, "Fetched personal images successfully!");
  } catch (error) {
    console.error("Error fetching personal images:", error);
    return FormatResponse.failure(error);
  }
});
