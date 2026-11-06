import { createPaymentRecord } from "./payment-store";
import { getAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body || !body.code) {
        throw createError({ statusCode: 400, statusMessage: "Code is required" });
    }

    if (body.type === "PACKAGE" || body.packageId) {
        const user = await getAuthUser(event);
        if (user && !body.userId) {
            body.userId = user.id;
        }
        body.type = "PACKAGE";
    }

    const record = createPaymentRecord(body);
    return { success: true, data: record };
});
