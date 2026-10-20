import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const key = query.key as string;

  if (!key) return FormatResponse.error(event, "Key is required!");

  try {
    const { News: NewsModel } = global.__db;
    
    const news = await NewsModel.findAll({
        where: { key: key },
        order: [['createdAt', 'ASC']],
    });

    return FormatResponse.success(news, "Fetched news successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
