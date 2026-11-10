import FormatResponse from "~~/composables/FormatResponse";
import { Op } from "sequelize";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const search = String(query.search || "").trim();
    const status = String(query.status || "all").trim();
    const categoryId = query.categoryId ? Number(query.categoryId) : null;

    const { News: NewsModel, Gallery: GalleryModel, User: UserModel } = (global as any).__db;

    const whereClause: any = {
      key: "user_feedback",
    };

    if (categoryId) {
      whereClause.id_news = categoryId;
    }

    if (status === "resolved") {
      whereClause.icon = "resolved";
    } else if (status === "pending") {
      whereClause[Op.or] = [
        { icon: "pending" },
        { icon: null },
        { icon: "" },
      ];
    }

    if (search) {
      whereClause[Op.and] = [
        ...(whereClause[Op.and] || []),
        {
          [Op.or]: [
            { content: { [Op.like]: `%${search}%` } },
            { desc: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${search}%` } },
          ],
        },
      ];
    }

    const offset = (page - 1) * limit;

    const [
      { count: totalCount, rows: feedbacks },
      categories,
      allFeedbackCounts,
    ] = await Promise.all([
      NewsModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: GalleryModel,
            as: "galleries",
            attributes: ["id", "num"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        distinct: true,
      }),
      NewsModel.findAll({
        where: { key: "type_feedback" },
        attributes: ["id", "content", "desc"],
        raw: true,
      }),
      NewsModel.findAll({
        where: { key: "user_feedback" },
        attributes: ["id", "icon", "name"],
        raw: true,
      }),
    ]);

    const userIds = Array.from(
      new Set(
        feedbacks
          .map((f: any) => Number(f.id_user))
          .filter((id: number) => id > 0)
      )
    );

    const users =
      userIds.length > 0 && UserModel
        ? await UserModel.findAll({
            where: { id: userIds },
            attributes: ["id", "name", "email", "phone", "avatar", "social"],
            raw: true,
          })
        : [];

    const userMap = new Map<number, any>();
    for (const u of users) {
      userMap.set(Number(u.id), u);
    }

    const categoryMap = new Map<number, any>();
    for (const c of categories) {
      categoryMap.set(Number(c.id), c);
    }

    const mappedData = feedbacks.map((item: any) => {
      const plain = item.toJSON ? item.toJSON() : item;
      const usr = userMap.get(Number(plain.id_user)) || null;
      const cat = categoryMap.get(Number(plain.id_news)) || null;
      const isResolved = plain.icon === "resolved" || Boolean(plain.name);

      return {
        id: plain.id,
        title: plain.content || "",
        content: plain.desc || "",
        categoryId: plain.id_news,
        categoryName: cat?.content || "Góp ý chung",
        status: isResolved ? "resolved" : "pending",
        adminReply: plain.name || "",
        userId: plain.id_user,
        userName: usr?.name || "Người dùng ẩn danh",
        userEmail: usr?.email || "N/A",
        userPhone: usr?.phone || "",
        userAvatar: usr?.avatar || "default-avatar.png",
        userSocial: usr?.social || "normal",
        galleries: plain.galleries || [],
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      };
    });

    const totalAll = allFeedbackCounts.length;
    const resolvedAll = allFeedbackCounts.filter(
      (f: any) => f.icon === "resolved" || Boolean(f.name)
    ).length;
    const pendingAll = totalAll - resolvedAll;

    return FormatResponse.success(
      {
        data: mappedData,
        categories,
        stats: {
          total: totalAll,
          pending: pendingAll,
          resolved: resolvedAll,
        },
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        totalCount,
      },
      "Fetched admin feedbacks successfully!"
    );
  } catch (error) {
    console.error("Error fetching admin feedbacks:", error);
    return FormatResponse.failure(error);
  }
});

