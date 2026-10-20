import { markPaymentSuccess } from "./payment-store";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
    try {
        const config = useRuntimeConfig();
        const sepayConfig = config.payment?.sepay;

        if (sepayConfig) {
            const signature = getHeader(event, "x-sepay-signature");
            const timestampHeader = getHeader(event, "x-sepay-timestamp");

            let isAuthenticated = false;

            if (signature && timestampHeader) {
                // 1. Verify via HMAC-SHA256
                const rawBody = await readRawBody(event, "utf-8") || "";
                const timestamp = Number(timestampHeader);

                if (Math.abs(Date.now() / 1000 - timestamp) <= 300) {
                    const secret = sepayConfig.webhookSecret || sepayConfig.apiKey;
                    const expected = "sha256=" + crypto.createHmac("sha256", secret)
                        .update(`${timestamp}.${rawBody}`)
                        .digest("hex");

                    try {
                        const sig = Buffer.from(signature);
                        const exp = Buffer.from(expected);
                        if (sig.length === exp.length && crypto.timingSafeEqual(sig, exp)) {
                            isAuthenticated = true;
                        }
                    } catch (e) {}
                }
            } else {
                // 2. Fallback to API Key Authorization header
                const authHeader = getHeader(event, "authorization");
                if (authHeader) {
                    const token = authHeader.replace(/^(Apikey|Bearer)\s+/i, "").trim();
                    if (token === sepayConfig.apiKey) {
                        isAuthenticated = true;
                    }
                }
            }

            // In production/configured environment, reject if authentication failed
            if (!isAuthenticated && (signature || getHeader(event, "authorization"))) {
                return { success: false, error: "Xác thực Webhook không thành công (API Key hoặc HMAC-SHA256 không hợp lệ)." };
            }
        }

        const body = await readBody(event);
        console.log("[SePay Webhook Received]:", JSON.stringify(body, null, 2));

        const content = body.content || body.transferContent || body.des || body.description || "";

        if (content) {
            const match = content.match(/SEVQR[A-Z0-9]+/i) || content.match(/GIFT[A-Z0-9]+/i);
            if (match) {
                const fullCode = match[0].toUpperCase();
                const giftMatch = fullCode.match(/GIFT[A-Z0-9]+/i);
                const giftCode = giftMatch ? giftMatch[0].toUpperCase() : fullCode;

                console.log(`[SePay Webhook] Found code ${fullCode} (giftCode: ${giftCode}) in content "${content}"`);

                markPaymentSuccess(fullCode);
                markPaymentSuccess(giftCode);

                if ((global as any).__wsPeers) {
                    const keysToNotify = Array.from(new Set([fullCode, giftCode, `SEVQR${giftCode}`]));
                    keysToNotify.forEach((key) => {
                        const peers = (global as any).__wsPeers.get(key);
                        if (peers && peers.size > 0) {
                            const wsMessage = JSON.stringify({
                                type: "payment_success",
                                code: key
                            });
                            for (const peer of peers) {
                                try {
                                    peer.send(wsMessage);
                                } catch (err) {}
                            }
                            console.log(`[SePay Webhook] WebSocket payment success notification sent to ${peers.size} peer(s) for key ${key}`);
                        }
                    });
                }
            }
        }

        return { success: true, message: "Webhook processed" };
    } catch (e: any) {
        console.error("[SePay Webhook Error]:", e);
        return { success: false, error: e.message };
    }
});
