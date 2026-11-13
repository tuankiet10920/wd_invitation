import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { getUserCoinRecord, COIN_TO_VND_RATE } from "./coin-store";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    const userId = user?.id || 1;
    const coinRecord = await getUserCoinRecord(userId);

    return FormatResponse.success(
      {
        userId,
        coins: coinRecord.coins,
        rateVndPerCoin: COIN_TO_VND_RATE,
        history: coinRecord.history.slice(0, 20),
      },
      "Get coin balance successfully!"
    );
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
