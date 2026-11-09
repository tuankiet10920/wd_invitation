import FormatResponse from "~~/composables/FormatResponse";
import { UserData } from "~~/server/data/user";
import { getAuthUser } from "~~/server/utils/auth";

const User = new UserData();

export default defineEventHandler(async (event) => {
  try {
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

    if (!userId) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { News: NewsModel, Gallery: GalleryModel } = (global as any).__db;

    const [feedbacks, categories] = await Promise.all([
      NewsModel.findAll({
        where: {
          key: "user_feedback",
          id_user: userId,
        },
        include: [
          {
            model: GalleryModel,
            as: "galleries",
            attributes: ["id", "num"],
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
      NewsModel.findAll({
        where: { key: "type_feedback" },
        attributes: ["id", "content", "desc"],
        raw: true,
      }),
    ]);

    const categoryMap = new Map<number, string>();
    for (const cat of categories) {
      categoryMap.set(Number(cat.id), cat.content);
    }

    const result = feedbacks.map((item: any) => {
      const plain = item.toJSON ? item.toJSON() : item;
      return {
        ...plain,
        categoryName: categoryMap.get(Number(plain.id_news)) || "Góp ý chung",
        status: plain.icon === "resolved" ? "resolved" : "pending",
        adminReply: plain.name || null,
      };
    });

    return FormatResponse.success(result, "Fetched feedback history successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
