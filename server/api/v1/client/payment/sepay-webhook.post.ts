import { getPaymentRecord, getPendingPayments, processPaymentSuccess } from './payment-store';

/**
 * Chuẩn hóa chuỗi nội dung chuyển khoản: viết hoa và bỏ toàn bộ ký tự đặc biệt/khoảng trắng
 */
function normalizeText(str: string): string {
  return String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Webhook nhận thông báo biến động số dư từ SePay (MBBank / VietQR)
 * Cấu hình URL trên SePay Dashboard: https://<domain>/api/v1/client/payment/sepay-webhook
 */
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const webhookSecret = config.sepayWebhookSecret || process.env.SEPAY_WEBHOOK_SECRET || '';
    const apiToken = config.sepayApiToken || process.env.SEPAY_API_TOKEN || '';

    // Kiểm tra bảo mật Webhook nếu hệ thống có cấu hình Secret / API Key
    const authHeader = getHeader(event, 'authorization') || '';
    const signatureHeader = getHeader(event, 'x-sepay-signature') || '';

    if (webhookSecret && signatureHeader && signatureHeader !== webhookSecret) {
      setResponseStatus(event, 401);
      return { success: false, message: 'Invalid Webhook Signature' };
    }

    if (apiToken && authHeader && !authHeader.includes(apiToken) && !authHeader.includes(webhookSecret)) {
      setResponseStatus(event, 401);
      return { success: false, message: 'Unauthorized Webhook Request' };
    }

    const body = await readBody(event);
    if (!body) {
      return { success: false, message: 'Empty payload' };
    }

    // SePay gửi thông tin giao dịch trong body:
    // content: Nội dung chuyển khoản
    // transferAmount: Số tiền chuyển
    // transferType: 'in' (tiền vào) | 'out' (tiền ra)
    // code: Mã thanh toán SePay tự bóc tách (nếu có)
    const content = String(body.content || body.description || '').toUpperCase();
    const cleanContent = normalizeText(content);
    const transferAmount = Number(body.transferAmount || body.amount_in || 0);
    const transferType = String(body.transferType || 'in').toLowerCase();

    if (transferType !== 'in') {
      return { success: true, message: 'Ignored outgoing transaction' };
    }

    console.log(`[SePay Webhook] Nhận giao dịch: +${transferAmount}đ | Nội dung: "${content}"`);

    let matchedRecord: any = null;

    // Bước 1: Thử khớp chính xác qua regex SEVQR... trong nội dung
    const match = content.match(/SEVQR[A-Z0-9]+/i) || cleanContent.match(/SEVQR[A-Z0-9]+/i);
    const candidateCode = body.code ? String(body.code).toUpperCase() : (match ? match[0].toUpperCase() : '');

    if (candidateCode) {
      matchedRecord = await getPaymentRecord(candidateCode);
    }

    // Bước 2: Nếu ngân hàng làm rớt chữ hoặc cắt ngắn mã, quét các giao dịch PENDING trong MySQL để đối chiếu thông minh
    if (!matchedRecord) {
      const pendingRecords = await getPendingPayments();

      for (const rec of pendingRecords) {
        const cleanCode = normalizeText(rec.code);
        const shortCode = normalizeText(rec.shortCode || rec.code.slice(-4));
        const suffixAfterPrefix = cleanCode.replace(/^SEVQR(PKGU\d+P\d+|COINU\d+C\d+|GIFT)?/, '');

        // Khớp nếu nội dung chứa toàn bộ mã, hoặc chứa phần đuôi định danh + đúng số tiền
        const isCodeMatched =
          (cleanCode && cleanContent.includes(cleanCode)) ||
          (suffixAfterPrefix.length >= 4 && cleanContent.includes(suffixAfterPrefix)) ||
          (shortCode.length >= 4 && cleanContent.includes(shortCode));

        if (isCodeMatched && transferAmount >= rec.amount) {
          matchedRecord = rec;
          break;
        }
      }
    }

    if (!matchedRecord) {
      console.warn(`[SePay Webhook] Không tìm thấy đơn hàng khớp với nội dung: "${content}"`);
      return {
        success: true,
        message: 'No matching payment order found in store',
      };
    }

    // Kiểm tra số tiền chuyển vào phải lớn hơn hoặc bằng số tiền đơn hàng
    if (transferAmount > 0 && transferAmount < matchedRecord.amount) {
      console.warn(
        `[SePay Webhook] Giao dịch ${matchedRecord.code} chuyển thiếu tiền (${transferAmount} < ${matchedRecord.amount})`
      );
      return {
        success: true,
        message: 'Transfer amount is less than required amount',
      };
    }

    const updated = await processPaymentSuccess(matchedRecord.code);
    console.log(`[SePay Webhook] Đã xác nhận thanh toán & cập nhật DB thành công cho mã: ${matchedRecord.code}`);

    return {
      success: true,
      message: 'Payment confirmed and DB updated successfully',
      data: updated,
    };
  } catch (error: any) {
    console.error('[SePay Webhook] Lỗi xử lý webhook:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      message: error?.message || 'Webhook processing error',
    };
  }
});
