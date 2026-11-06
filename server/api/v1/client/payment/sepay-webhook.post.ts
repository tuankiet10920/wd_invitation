import { processPaymentSuccess } from "./payment-store";
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

        // Kết hợp cả trường code và nội dung chuyển khoản để không bỏ sót dù ngân hàng tách chuỗi
        const rawSearchText = [
            body.code,
            body.content,
            body.transferContent,
            body.des,
            body.description
        ].filter(Boolean).join(" ");

        const transferAmount = Number(body.transferAmount || body.amount || 0);

        if (rawSearchText) {
            const match =
                rawSearchText.match(/SEVQR\s*(?:PKG|GIFT|COIN)[A-Z0-9]+/i) ||
                rawSearchText.match(/(?:PKG|GIFT|COIN)[A-Z0-9]+/i) ||
                rawSearchText.match(/SEVQR[A-Z0-9]+/i);

            if (match) {
                const matchedRaw = match[0].replace(/\s+/g, "").toUpperCase();
                const subMatch = matchedRaw.match(/(?:GIFT|PKG|COIN)[A-Z0-9]+/i);
                const shortCode = subMatch ? subMatch[0].toUpperCase() : matchedRaw.replace(/^SEVQR/i, "");
                const fullCode = matchedRaw.startsWith("SEVQR") ? matchedRaw : `SEVQR${shortCode}`;

                console.log(`[SePay Webhook] Found code ${fullCode} (shortCode: ${shortCode}) in content "${rawSearchText}"`);

                const record = await processPaymentSuccess(fullCode, shortCode, transferAmount);

                if ((global as any).__wsPeers) {
                    const keysToNotify = Array.from(new Set([fullCode, shortCode, `SEVQR${shortCode}`]));
                    keysToNotify.forEach((key) => {
                        const peers = (global as any).__wsPeers.get(key);
                        if (peers && peers.size > 0) {
                            const wsMessage = JSON.stringify({
                                type: "payment_success",
                                code: key,
                                paymentType: record?.type || "GIFT",
                                packageId: record?.packageId,
                                packageName: record?.packageName
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

                return {
                    success: true,
                    message: "Webhook processed",
                    data: {
                        code: fullCode,
                        type: record?.type,
                        userId: record?.userId,
                        packageId: record?.packageId,
                        packageName: record?.packageName
                    }
                };
            }
        }

        return { success: true, message: "Webhook processed (no matching code)" };
    } catch (e: any) {
        console.error("[SePay Webhook Error]:", e);
        return { success: false, error: e.message };
    }
});
