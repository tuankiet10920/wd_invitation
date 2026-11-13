import { getPaymentRecord, processPaymentSuccess } from "./payment-store";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const code = query.code as string;

    if (!code) {
        return { success: false, message: "Code is required" };
    }

    let record = await getPaymentRecord(code);
    if (!record) {
        return { success: true, status: "PENDING" };
    }

    if (record.status === "SUCCESS") {
        record = (await processPaymentSuccess(code)) || record;
        return {
            success: true,
            status: "SUCCESS",
            data: record,
        };
    }

    return {
        success: true,
        status: record.status,
        data: record,
    };
});
