import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const configs = useRuntimeConfig();
  const { image, filename, folder = "news" } = body;

  if (!image || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image base64 and filename are required",
    });
  }

  // Remove header if present (e.g., "data:image/png;base64,")
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Define save path (public/images/folder)
  const saveDir = path.join(process.cwd(), configs.publicDir, "images", folder);

  // Ensure directory exists
  try {
    await fs.access(saveDir);
  } catch {
    await fs.mkdir(saveDir, { recursive: true });
  }

  const filePath = path.join(saveDir, `${filename}.png`);

  try {
    await sharp(buffer)
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

    return {
      success: true,
      path: `/images/${folder}/${filename}.png`,
      message: "Image saved successfully",
    };
  } catch (error) {
    console.error("Error saving image:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save image",
    });
  }
});
