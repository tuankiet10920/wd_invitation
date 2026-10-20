import { ArticleData } from "~~/server/data/article";
import { ArticleTypeData } from "~~/server/data/article-type";
import FormatResponse from "~~/composables/FormatResponse";
import { services } from "~~/composables/FuncServices";

const Article = new ArticleData();
const ArticleType = new ArticleTypeData();

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  
  if (!slug) return FormatResponse.error(event, "Slug is required!");

  try {
    // 1. Get all article types to find the matching slug
    const allTypes = await ArticleType.getAll();
    if (!allTypes) {
        return FormatResponse.error(event, "Category not found!");
    }
    
    // Find the type whose generated slug matches the requested slug
    const matchedType = allTypes.find((t: any) => {
        const generatedSlug = services.generateSlug(t.name_vi);
        return generatedSlug === slug;
    });

    if (!matchedType) {
        return FormatResponse.error(event, "Category not found!");
    }

    const { Article: ArticleModel, ArticleType: ArticleTypeModel } = global.__db;
    
    // Reusing the standard list query logic but filtered by id_type_news
    const query = getQuery(event);
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 50);
    const offset = (page - 1) * limit;

    const { count, rows } = await ArticleModel.findAndCountAll({
        where: { id_type_news: matchedType.id },
        include: [{ model: ArticleTypeModel, as: "type" }],
        limit,
        offset,
        order: [["createdAt", "DESC"]]
    });

    const result = {
        data: rows,
        category: matchedType,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalCount: count
    };

    return FormatResponse.success(result, "Fetched articles by category successfully!");
  } catch (error) {
    return FormatResponse.failure(error);
  }
});
