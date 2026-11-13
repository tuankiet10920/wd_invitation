import { createPaymentRecord } from "./payment-store";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body || !body.code) {
        throw createError({ statusCode: 400, statusMessage: "Code is required" });
    }

    const user = await getAuthUser(event);
    if (user && !body.userId) {
        body.userId = user.id;
    }

    if (body.type === "PACKAGE" || body.packageId) {
        body.type = "PACKAGE";
    } else if (body.type === "COIN_TOPUP" || body.coins) {
        body.type = "COIN_TOPUP";
    }

    const record = await createPaymentRecord(body);
    return { success: true, data: record };
});
