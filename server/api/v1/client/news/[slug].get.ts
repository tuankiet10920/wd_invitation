import FormatResponse from "~~/composables/FormatResponse";
import { Op } from "sequelize";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  
  if (!slug) return FormatResponse.error(event, "Slug is required!");

  try {
    const { Article: ArticleModel, ArticleType: ArticleTypeModel, User: UserModel } = global.__db;
    
    const article = await ArticleModel.findOne({
        where: { slug_vi: slug },
        include: [
            { model: ArticleTypeModel, as: "type" },
            { model: UserModel, as: "user", attributes: ['id', 'email', 'name', 'avatar'] } // Assuming 'user' alias exists
        ]
    });

    if (!article) {
        return FormatResponse.error(event, "Article not found!");
    }

    const relatedArticles = await ArticleModel.findAll({
        where: {
            id_type_news: article.id_type_news,
            id: { [Op.ne]: article.id }
        },
        order: [['createdAt', 'DESC']],
        limit: 5
    });

    return FormatResponse.success({ article, relatedArticles }, "Fetched article successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
