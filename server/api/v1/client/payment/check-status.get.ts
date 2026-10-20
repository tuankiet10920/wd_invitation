import { getPaymentRecord } from "./payment-store";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const code = query.code as string;

    if (!code) {
        return { success: false, message: "Code is required" };
    }

    const record = getPaymentRecord(code);
    if (!record) {
        return { success: true, status: "PENDING" };
    }

    return {
        success: true,
        status: record.status,
        data: record
    };
});
