export interface PaymentRecord {
    code: string;
    amount: number;
    giftName?: string;
    senderName?: string;
    message?: string;
    slug?: string;
    status: 'PENDING' | 'SUCCESS' | 'EXPIRED';
    createdAt: number;
}

const paymentsMap = new Map<string, PaymentRecord>();

export const createPaymentRecord = (data: Partial<PaymentRecord>) => {
    if (!data.code) return null;
    const record: PaymentRecord = {
        code: data.code,
        amount: data.amount || 0,
        giftName: data.giftName,
        senderName: data.senderName,
        message: data.message,
        slug: data.slug,
        status: 'PENDING',
        createdAt: Date.now()
    };
    paymentsMap.set(data.code, record);
    return record;
};

export const getPaymentRecord = (code: string) => {
    return paymentsMap.get(code);
};

export const markPaymentSuccess = (code: string) => {
    const record = paymentsMap.get(code);
    if (record) {
        record.status = 'SUCCESS';
        paymentsMap.set(code, record);
        return true;
    }
    return false;
};
