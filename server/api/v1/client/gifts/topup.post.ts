import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { addUserCoins, COIN_TO_VND_RATE } from "./coin-store";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const user = await getAuthUser(event);
    const userId = user?.id || 1;

    const coins = Math.floor(Number(body?.coins || 0));
    if (!coins || coins <= 0) {
      return FormatResponse.error(event, "Số xu nạp thêm phải lớn hơn 0!", 400);
    }

    const updated = await addUserCoins(
      userId,
      coins,
      body?.description || `Nạp thêm ${coins.toLocaleString("vi-VN")} xu`,
      body?.code
    );

    return FormatResponse.success(
      {
        userId,
        addedCoins: coins,
        coins: updated.coins,
        rateVndPerCoin: COIN_TO_VND_RATE,
      },
      `Nạp thành công +${coins.toLocaleString("vi-VN")} xu!`
    );
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
