import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { Queue, Worker } from "bullmq";
import { redisConnection } from "~~/server/utils/redis";

const IMAGE_QUEUE_NAME = "image-upload-tasks";

const imageQueue = new Queue(IMAGE_QUEUE_NAME, {
  connection: redisConnection,
});

const worker = new Worker(
  IMAGE_QUEUE_NAME,
  async (job) => {
    const { bufferData, filename, saveDir, filePath } = job.data;
    const buffer = Buffer.from(bufferData, "base64");

    try {
      await fs.access(saveDir);
    } catch {
      await fs.mkdir(saveDir, { recursive: true });
    }

    console.log(`[Queue] Bắt đầu xử lý ảnh: ${filename}`);
    await sharp(buffer)
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

    console.log(`[Queue] Hoàn tất lưu ảnh: ${filename}`);
  },
  {
    connection: redisConnection,
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { image, filename } = body;

  if (!image || !filename) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image base64 and filename are required",
    });
  }

  // Remove header if present (e.g., "data:image/png;base64,")
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  
  // Define save path (public/images/wcards)
  const saveDir = path.join(process.cwd(), config.publicDir, "images", "wcards");
  const filePath = path.join(saveDir, `${filename}.png`);

  // Add job to BullMQ processing queue in background (fire-and-forget)
  imageQueue.add("process-image", {
    bufferData: base64Data,
    filename,
    saveDir,
    filePath
  }).catch(error => {
    console.error("Error adding image to queue:", error);
  });

  return {
    success: true,
    path: `/images/wcards/${filename}.png`,
    message: "Image upload job added to queue",
  };
});
