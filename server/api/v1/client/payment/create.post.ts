import { createPaymentRecord } from "./payment-store";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (!body || !body.code) {
        throw createError({ statusCode: 400, statusMessage: "Code is required" });
    }
    const record = createPaymentRecord(body);
    return { success: true, data: record };
});
