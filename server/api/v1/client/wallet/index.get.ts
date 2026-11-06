import FormatResponse from "~~/composables/FormatResponse";
import { getAuthUser } from "~~/server/utils/auth";
import { calculateUserWallet } from "./wallet-store";

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuthUser(event);
    if (!user) {
      return FormatResponse.error(event, "Unauthorized", 401);
    }

    const walletInfo = await calculateUserWallet(user);

    return FormatResponse.success(walletInfo, "Get wallet info successfully!");
  } catch (error: any) {
    return FormatResponse.failure(error);
  }
});
