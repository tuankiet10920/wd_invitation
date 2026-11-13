import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { sendGiftWithCoins } from "./coin-store";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await getAuthUser(event);
    const senderUserId = user?.id || 1;

    const senderName = (body?.senderName || body?.name || "").trim();
    const message = (body?.message || "").trim();
    const giftId = Number(body?.giftId);
    const rawSlug = (body?.slug || "").trim();

    if (!senderName) {
      return FormatResponse.error(event, "Vui lòng nhập tên người gửi!", 400);
    }
    if (!giftId) {
      return FormatResponse.error(event, "Vui lòng chọn món quà!", 400);
    }

    const db = (global as any).__db;
    let giftName = body?.giftName || "Quà mừng";
    let giftPriceCoins = Number(body?.giftPrice || 0);
    let giftImage = body?.giftImage || "";
    let giftFile = body?.giftFile || "";

    if (db?.Gift) {
      const dbGift = await db.Gift.findByPk(giftId, { raw: true });
      if (dbGift) {
        giftName = dbGift.name;
        giftPriceCoins = Number(dbGift.price || 0);
        giftImage = dbGift.image;
        giftFile = dbGift.file;
      }
    }

    let weddingCardId: number | undefined;
    let weddingCardName: string | undefined;
    let weddingCardUrl = rawSlug;
    let recipientUserId: number | undefined;

    if (rawSlug && db?.WeddingCard) {
      let card = await db.WeddingCard.findOne({
        where: { url: rawSlug },
        raw: true,
      });

      if (!card && db?.Invitor) {
        const invitor = await db.Invitor.findOne({
          where: { token: rawSlug },
          raw: true,
        });
        if (invitor?.id_card) {
          card = await db.WeddingCard.findByPk(invitor.id_card, { raw: true });
        }
      }

      if (!card && !isNaN(Number(rawSlug))) {
        card = await db.WeddingCard.findByPk(Number(rawSlug), { raw: true });
      }

      if (card) {
        weddingCardId = card.id;
        weddingCardName = card.name;
        weddingCardUrl = card.url;
        recipientUserId = card.id_user;
      }
    }

    const result = await sendGiftWithCoins({
      senderUserId,
      senderName,
      senderAvatar: body?.avatar || "",
      message,
      giftId,
      giftName,
      giftPriceCoins,
      giftImage,
      giftFile,
      slug: weddingCardUrl,
      weddingCardId,
      weddingCardName,
      recipientUserId,
    });

    if (!result.success) {
      return {
        success: false,
        code: result.code,
        message: `Số xu hiện tại (${result.currentCoins} xu) không đủ để tặng "${giftName}" (${result.requiredCoins} xu). Vui lòng nạp thêm ${result.missingCoins} xu!`,
        data: {
          currentCoins: result.currentCoins,
          requiredCoins: result.requiredCoins,
          missingCoins: result.missingCoins,
          missingAmountVnd: result.missingAmountVnd,
        },
      };
    }

    // Lưu thông tin quà tặng & số xu chuyển vào Hộp lời chúc của thiệp đó
    if (weddingCardId && db?.Wish) {
      try {
        const wishText = message || "Chúc hai bạn trăm năm hạnh phúc!";
        await db.Wish.create({
          name: senderName,
          content: `[Tặng ${giftName} • +${result.deductedCoins} xu] ${wishText}`,
          id_wedding_card: weddingCardId,
        });
      } catch (wishErr) {
        console.error("Failed to create wish from gift message:", wishErr);
      }
    }

    return FormatResponse.success(
      {
        previousCoins: result.previousCoins,
        deductedCoins: result.deductedCoins,
        remainingCoins: result.remainingCoins,
        gift: result.giftRecord,
      },
      `Đã tặng "${giftName}" thành công! Đã trừ ${result.deductedCoins} xu.`
    );
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
