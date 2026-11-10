import FormatResponse from "~~/composables/FormatResponse";
import fs from "node:fs/promises";
import path from "node:path";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, "id"));
    if (!id) {
      return FormatResponse.error(event, "ID phản hồi không hợp lệ!", 400);
    }

    const { News: NewsModel, Gallery: GalleryModel } = (global as any).__db;

    const feedback = await NewsModel.findOne({
      where: {
        id,
        key: "user_feedback",
      },
      include: [
        {
          model: GalleryModel,
          as: "galleries",
        },
      ],
    });

    if (!feedback) {
      return FormatResponse.error(event, "Không tìm thấy ý kiến phản hồi!", 404);
    }

    // Delete gallery files & DB rows if any
    const galleries = feedback.galleries || [];
    for (const gal of galleries) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "images",
        "user_feedback",
        `USER_FEEDBACK_${gal.id}.png`
      );
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore if file doesn't exist
      }
    }

    await GalleryModel.destroy({ where: { id_news: id } });
    await feedback.destroy();

    return FormatResponse.success(null, "Đã xóa ý kiến phản hồi thành công!");
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return FormatResponse.failure(error);
  }
});

