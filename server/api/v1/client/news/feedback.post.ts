import FormatResponse from "~~/composables/FormatResponse";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import slugify from "slugify";
import { UserData } from "~~/server/data/user";
import { getAuthUser } from "~~/server/utils/auth";

const User = new UserData();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, content, type, images } = body;

  if (!title || !content) {
    return FormatResponse.error(event, "Vui lòng nhập đầy đủ tiêu đề và nội dung!");
  }

  // Get current user via getAuthUser or session fallback
  let userId: number | null = null;
  const authUser = await getAuthUser(event);
  if (authUser?.id) {
    userId = Number(authUser.id);
  } else {
    const session = await getUserSession(event);
    const sessionUser = session?.user as any;
    const email = sessionUser?.email;
    if (email) {
      const user = await User.checkUserNormal(email);
      if (user) {
        userId = user.id;
      }
    }
  }

  try {
    const { News: NewsModel, Gallery: GalleryModel } = (global as any).__db;

    const baseSlug = slugify(String(title), { lower: true, strict: true }) || "feedback";
    const uniqueSlug = `${baseSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Create News feedback record
    const newFeedback = await NewsModel.create({
      key: "user_feedback",
      content: String(title).trim(),
      slug: uniqueSlug,
      desc: String(content).trim(),
      id_news: type ? Number(type) : null,
      id_user: userId,
      icon: "pending", // Trạng thái: pending | resolved
      name: null, // Phản hồi từ Admin
    });

    // 2. Process images if any
    if (images && Array.isArray(images) && images.length > 0) {
      for (const imageBase64 of images.slice(0, 3)) {
        if (!imageBase64 || typeof imageBase64 !== "string") continue;

        const newGallery = await GalleryModel.create({
          id_news: newFeedback.id,
          num: 0,
        });

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

    return FormatResponse.success(newFeedback, "Gửi ý kiến đóng góp thành công!");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return FormatResponse.failure(error);
  }
});
