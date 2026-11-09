import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(getRouterParam(event, "id"));
    if (!id) {
      return FormatResponse.error(event, "ID phản hồi không hợp lệ!", 400);
    }

    const body = await readBody(event);
    const { status, adminReply } = body || {};

    const { News: NewsModel } = (global as any).__db;
    const feedback = await NewsModel.findOne({
      where: {
        id,
        key: "user_feedback",
      },
    });

    if (!feedback) {
      return FormatResponse.error(event, "Không tìm thấy ý kiến phản hồi!", 404);
    }

    const nextReply =
      adminReply !== undefined ? (String(adminReply).trim() || null) : feedback.name;
    const nextStatus =
      status === "resolved" || status === "pending"
        ? status
        : nextReply
        ? "resolved"
        : feedback.icon || "pending";

    await feedback.update({
      icon: nextStatus,
      name: nextReply,
    });

    return FormatResponse.success(feedback, "Cập nhật phản hồi thành công!");
  } catch (error) {
    console.error("Error updating feedback:", error);
    return FormatResponse.failure(error);
  }
});

