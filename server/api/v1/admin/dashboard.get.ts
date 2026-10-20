import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const { WeddingCard, User, Article } = global.__db;
    
    // Count stats
    const totalCards = await WeddingCard.count({});
    const totalUsers = await User.count({});
    const totalViewsResult = await WeddingCard.sum('views');
    const totalViews = totalViewsResult || 0;
    
    let totalArticles = 0;
    if (Article) {
        totalArticles = await Article.count({});
    }

    return FormatResponse.success(
      {
        totalCards,
        totalUsers,
        totalViews,
        totalArticles
      },
      "Fetch dashboard stats successfully!"
    );
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return FormatResponse.failure(error);
  }
});
