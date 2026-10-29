import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const body = await readBody(event);
    const { name, receiverName, bankName, accountNumber, cardId, image } = body;

    if (!receiverName || !bankName || !accountNumber) {
      return FormatResponse.error(event, "Vui lòng nhập tên người nhận, ngân hàng và số tài khoản!");
    }

    const { WeddingCard: WeddingCardModel, QrBox: QrBoxModel } = (global as any).__db;

    // Check card ownership or fallback to user's first card
    let targetCardId = cardId;
    if (!targetCardId) {
      const firstCard = await WeddingCardModel.findOne({
        where: { id_user: user.id },
        attributes: ["id"],
      });
      targetCardId = firstCard?.id;
    }

    if (!targetCardId) {
      return FormatResponse.error(event, "Bạn chưa có thiệp cưới nào để liên kết tài khoản ngân hàng!");
    }

    // Auto generate VietQR URL if no custom image is supplied
    const qrImage = image || `https://img.vietqr.io/image/${encodeURIComponent(bankName)}-${encodeURIComponent(accountNumber)}-compact.png?accountName=${encodeURIComponent(receiverName)}`;

    const newQrBox = await QrBoxModel.create({
      name: name || "Chủ tài khoản",
      name_reveive: receiverName,
      name_bank: bankName,
      number_bank: accountNumber,
      image: qrImage,
      id_wedding_card: targetCardId,
    });

    return FormatResponse.success(newQrBox, "Thêm tài khoản ngân hàng thành công!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
