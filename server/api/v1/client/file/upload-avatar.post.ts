import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { WeddingCardData } from "~~/server/data/card-template";

const WeddingCard = new WeddingCardData();

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // Parsing the multipart form data using h3's built-in helper
  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file provided",
    });
  }

  const fileField = formData.find((field) => field.name === "file");
  const filenameField = formData.find((field) => field.name === "filename");

  if (!fileField || !fileField.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "File is required",
    });
  }

  const originalFilename =
    filenameField && filenameField.data
      ? filenameField.data.toString()
      : `WEDDING_CARD_AVATAR_DRAFT_${Date.now()}`;
  const cardIdField = formData.find((field) => field.name === "cardId");
  const cardId =
    cardIdField && cardIdField.data ? cardIdField.data.toString() : null;

  // Define save path (public/images/card_avatars)
  const saveDir = path.join(process.cwd(), config.publicDir, "images", "card_avatars");

  // Ensure directory exists
  try {
    await fs.access(saveDir);
  } catch {
    await fs.mkdir(saveDir, { recursive: true });
  }

  const outputFilename = `${originalFilename}.png`;
  const filePath = path.join(saveDir, outputFilename);

  try {
    await sharp(fileField.data)
      .resize(500, null, {
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: true,
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        palette: true,
      })
      .toFile(filePath);

    const avatarPath = `/images/card_avatars/${outputFilename}`;

    // Cập nhật avatar vào database nếu có cardId
    if (cardId && !isNaN(Number(cardId))) {
      try {
        await WeddingCard.update(Number(cardId), { avatar: avatarPath });
      } catch (dbError) {
        console.error("Lỗi cập nhật avatar vào database:", dbError);
        // Không throw lỗi ở đây để vẫn cho phép upload ảnh thành công, nhưng ghi log lỗi DB
      }
    }

    return {
      success: true,
      path: avatarPath,
      message: "Avatar saved successfully",
    };
  } catch (error) {
    console.error("Error saving avatar:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to save avatar",
    });
  }
});
