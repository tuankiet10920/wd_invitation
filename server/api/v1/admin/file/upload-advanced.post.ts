import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const configs = useRuntimeConfig();
  const { image, filename, folder = "stocks", type = "img" } = body;

  if (!image || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image base64 and filename are required",
    });
  }

  const isBackground = folder === "backgrounds";
  
  const listFolder = isBackground ? "list" : "lists";
  const thumbFolder = "thumbnails";

  const originalRelativePath = isBackground ? `backgrounds/${listFolder}` : `images/stocks/${listFolder}`;
  const thumbnailRelativePath = isBackground ? `backgrounds/${thumbFolder}` : `images/stocks/${thumbFolder}`;

  const originalSaveDir = path.join(process.cwd(), configs.publicDir, ...originalRelativePath.split('/'));
  const thumbnailSaveDir = path.join(process.cwd(), configs.publicDir, ...thumbnailRelativePath.split('/'));

  for (const dir of [originalSaveDir, thumbnailSaveDir]) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }
  }

  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const isSvgType = type === 'svg' || (image.includes('image/svg+xml'));
  const buffer = Buffer.from(base64Data, "base64");

  let originalExt = ".png";
  if (isSvgType) originalExt = ".svg";
  else if (image.includes("image/jpeg") || image.includes("image/jpg")) originalExt = ".jpg";
  else if (image.includes("image/webp")) originalExt = ".webp";

  const originalFilePath = path.join(originalSaveDir, `${filename}${originalExt}`);

  try {
    // Save Original
    await fs.writeFile(originalFilePath, buffer);

    // Save Thumbnail
    const thumbnailFilePath = path.join(thumbnailSaveDir, `${filename}.webp`);
    
    if (!isSvgType) {
        await sharp(buffer)
        .resize(800, null, {
            kernel: sharp.kernel.lanczos3,
            withoutEnlargement: true,
        })
        .webp({
            quality: 80,
        })
        .toFile(thumbnailFilePath);
    } else {
        // Just copy SVG or convert explicitly if we want webp thumbnail
        try {
            await sharp(buffer).resize(400, null).webp({ quality: 80 }).toFile(thumbnailFilePath);
        } catch (e) {
            // fallback: write svg to webp path just so it resolves (though UI prevents calling it usually)
            await fs.writeFile(thumbnailFilePath, buffer);
        }
    }

    return {
      success: true,
      url: `${filename}${originalExt}`,
      message: "Images saved successfully",
    };
  } catch (error) {
    console.error("Error saving advanced images:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save image",
    });
  }
});
