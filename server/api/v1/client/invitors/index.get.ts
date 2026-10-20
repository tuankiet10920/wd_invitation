import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
  try {
    const { Invitor: InvitorModel, WeddingCard: WeddingCardModel } = global.__db;
    const query = getQuery(event);
    
    const whereClause: any = {};
    if (query.slug) {
        const card = await WeddingCardModel.findOne({ where: { url: query.slug } });
        if (card) {
            whereClause.id_card = card.id;
        } else {
            return FormatResponse.success([], "No invitors found for this card slug");
        }
    }
    
    // Default config: fetch all, sort by newest
    const invitors = await InvitorModel.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
    });

    return FormatResponse.success(invitors, "Fetched invitors successfully");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
