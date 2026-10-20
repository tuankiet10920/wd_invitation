import FormatResponse from "~~/composables/FormatResponse";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import slugify from "slugify";
import { UserData } from "~~/server/data/user";

const User = new UserData();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, content, type, images } = body;

  if (!title || !content) {
    return FormatResponse.error(event, "Title and content are required!");
  }

  // Get current user session
  const session = await getUserSession(event);
  const sessionUser = session?.user as any;
  const email = sessionUser?.email;

  let userId = null;
  if (email) {
    const user = await User.checkUserNormal(email);
    if (user) {
      userId = user.id;
    }
  }

  try {
    const { News: NewsModel, Gallery: GalleryModel } = global.__db;
    
    // 1. Create News
    const newFeedback = await NewsModel.create({
      key: "user_feedback",
      content: title,
      slug: slugify(title, { lower: true, strict: true }),
      desc: content,
      id_news: type, // the type field from frontend now holds the ID of the category
      id_user: userId, // associate feedback with the current user
    });

    // 2. Process images if any
    if (images && Array.isArray(images) && images.length > 0) {
      for (const imageBase64 of images.slice(0, 3)) { // Max 3 images
          // create a gallery record first to get the ID
          const newGallery = await GalleryModel.create({
            id_news: newFeedback.id,
            num: 0
          });

          // Process and save the image using base64
          const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const saveDir = path.join(process.cwd(), "public", "images", "user_feedback");

          try {
            await fs.access(saveDir);
          } catch {
            await fs.mkdir(saveDir, { recursive: true });
          }

          const filename = `USER_FEEDBACK_${newGallery.id}.png`;
          const filePath = path.join(saveDir, filename);

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
      }
    }

    return FormatResponse.success(newFeedback, "Feedback submitted successfully!");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return FormatResponse.failure(error);
  }
});
