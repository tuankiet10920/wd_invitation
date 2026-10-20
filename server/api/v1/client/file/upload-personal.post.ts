import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { readMultipartFormData, getCookie } from "h3";
import jwt from "jsonwebtoken";

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
            if (user) {
              console.log(
                `[UploadPersonal] Authenticated via Admin Token: ${user.email}`,
              );
            }
          }
        } catch (e) {
          console.error("[UploadPersonal] Admin token verification failed:", e);
        }
      }
    }

    if (!user) {
      console.log(
        "[UploadPersonal] Unauthorized: No valid session or admin token found",
      );
      return FormatResponse.error(
        event,
        "Unauthorized - Please log in again",
        401,
      );
    }

    const parts = await readMultipartFormData(event);
    if (!parts || !Array.isArray(parts) || parts.length === 0) {
      console.log("[UploadPersonal] Bad Request: No files in payload");
      return FormatResponse.error(
        event,
        "No files provided in the request",
        400,
      );
    }

    const { Image: ImageModel, ImageType: ImageTypeModel } = global.__db;

    // Determine the proper image type: prioritizes 'admin_image' for admins
    let typeKey = "personal_image";
    if (user.role === "admin") {
      const adminTypeExists = await ImageTypeModel.findOne({
        where: { key: "admin_image" },
      });
      if (adminTypeExists) typeKey = "admin_image";
    }

    const targetImageType = await ImageTypeModel.findOne({
      where: { key: typeKey },
    });

    if (!targetImageType) {
      console.log(
        `[UploadPersonal] Error: Image type '${typeKey}' not found in database`,
      );
      return FormatResponse.error(
        event,
        `Server configuration error: Image type '${typeKey}' missing`,
        404,
      );
    }

    const saveDir = path.join(
      process.cwd(),
      config.publicDir,
      "images",
      "personal_image",
    );
    try {
      await fs.access(saveDir);
    } catch {
      await fs.mkdir(saveDir, { recursive: true });
    }

    const savedImages: any[] = [];
    const imagesParts = parts.filter((p) => p.name === "images" && p.filename);

    for (const part of imagesParts.slice(0, 15)) {
      try {
        // 1. Create image record first to get the ID
        const newImage = await ImageModel.create({
          url: "", // will update after saving file
          id_image_type: targetImageType.id,
          id_user: user.id,
          id_min_package: null,
        });

        // 2. Generate filename: PERSONAL_IMAGE_<ID><HHMMSSYYYYMMDD>.png
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const yyyy = String(now.getFullYear());
        const MM = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const timestamp = `${hh}${mm}${ss}${yyyy}${MM}${dd}`;

        const filename = `PERSONAL_IMAGE_${newImage.id}${timestamp}.png`;
        const filePath = path.join(saveDir, filename);

        // 3. Process and save the image
        await sharp(part.data)
          .resize(800, null, {
            kernel: sharp.kernel.lanczos3,
            withoutEnlargement: true,
          })
          .png({
            quality: 100,
            compressionLevel: 9,
            palette: true,
          })
          .toFile(filePath);

        // 4. Update the URL in the record (Save ONLY the filename for flexibility)
        await newImage.update({ url: filename });

        const imageRecord = {
          id: newImage.id,
          url: filename, // Just filename
        };
        savedImages.push(imageRecord);

        // If admin, log to a file for seeder copy-pasting
        if (user.role === "admin") {
          const lpath = path.join(
            process.cwd(),
            config.seederDir,
            "admin_upload_records.txt",
          );
          const logEntry = `      {
        url: "${filename}",
        type: "img",
        id_image_type: typeImageAdmin,
        id_user: ${user.id},
        id_min_package: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },\n`;
          await fs
            .appendFile(lpath, logEntry)
            .catch((e) => console.error("Failed to write seeder log:", e));
        }
      } catch (innerError) {
        console.error(
          `[UploadPersonal] Error processing single image:`,
          innerError,
        );
        throw innerError;
      }
    }

    return FormatResponse.success(savedImages, "Images uploaded successfully!");
  } catch (error: any) {
    console.error("[UploadPersonal] Top-level failure:", error);
    return FormatResponse.failure(
      error,
      error?.message || "Failed to process images",
    );
  }
});
