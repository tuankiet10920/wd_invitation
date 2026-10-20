import FormatResponse from "~~/composables/FormatResponse";

export default defineEventHandler(async (event) => {
    try {
        const { Invitor: InvitorModel, WeddingCard: WeddingCardModel } = global.__db;
        const token = event.context.params?.token;

        if (!token) {
            return FormatResponse.failure("Token is missing");
        }

        const invitor = await InvitorModel.findOne({
            where: { token: token }
        });

        if (!invitor) {
            return FormatResponse.failure("Invitation not found");
        }

        const card = await WeddingCardModel.findByPk(invitor.id_card);
        if (!card) {
            return FormatResponse.failure("Wedding card not found");
        }

        // Increment view count for the invitor
        invitor.views += 1;
        invitor.lastest_view_at = new Date();
        await invitor.save();

        return FormatResponse.success({
            invitor,
            card
        }, "Fetched invite successfully");
    } catch (error: any) {
        return FormatResponse.failure(error);
    }
});
