import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const { WeddingCard: WeddingCardModel, QrBox: QrBoxModel } = (global as any).__db;

    // Get all user's cards
    const weddingCards = await WeddingCardModel.findAll({
      where: { id_user: user.id },
      attributes: ["id", "name", "url"],
      raw: true,
    });

    const cardIds = weddingCards.map((c: any) => c.id);

    let qrBoxes: any[] = [];
    if (cardIds.length > 0) {
      qrBoxes = await QrBoxModel.findAll({
        where: { id_wedding_card: cardIds },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
    }

    // Attach card information
    const bankAccounts = qrBoxes.map((box: any) => {
      const card = weddingCards.find((c: any) => c.id === box.id_wedding_card);
      let qrUrl = box.image;
      if (qrUrl && !qrUrl.startsWith("http://") && !qrUrl.startsWith("https://") && !qrUrl.startsWith("/")) {
        qrUrl = `/images/qr_codes/${qrUrl}`;
      }

      return {
        id: box.id,
        name: box.name, // e.g. "Cô dâu", "Chú rể"
        receiverName: box.name_reveive,
        bankName: box.name_bank,
        accountNumber: box.number_bank,
        qrCodeUrl: qrUrl || `https://img.vietqr.io/image/${box.name_bank}-${box.number_bank}-compact.png?accountName=${encodeURIComponent(box.name_reveive || '')}`,
        cardId: box.id_wedding_card,
        cardName: card?.name || "Thiệp cưới",
        cardUrl: card?.url || "",
        createdAt: box.createdAt,
      };
    });

    return FormatResponse.success({
      bankAccounts,
      cards: weddingCards,
    }, "Get bank accounts successfully!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
