<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

definePageMeta({
    layout: 'blank'
});

const route = useRoute();
const router = useRouter();

const code = ref('GIFT753KW0J6');
const amount = ref(13140);
const giftName = ref('Bắn tim');
const senderName = ref('');
const message = ref('');
const slug = ref('');
const backUrl = ref('');

const config = useRuntimeConfig();
const sepayPublic = (config.public as any).sepay || {};

const bankInfo = {
    name: `${sepayPublic.bank || 'MBBank'} Ngân hàng Quân đội (${sepayPublic.bank || 'MBBank'})`,
    accountNo: sepayPublic.accNo || '3819031991',
    accountName: sepayPublic.accName || 'HO KINH DOANH THIEP CUOI ONLINE',
    bankCode: sepayPublic.bank || 'MBBank'
};

const copiedField = ref<string | null>(null);

const copyText = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        copiedField.value = fieldName;
        setTimeout(() => {
            if (copiedField.value === fieldName) copiedField.value = null;
        }, 2000);
    });
};

const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN');
};

const formattedCode = computed(() => {
    const raw = (code.value || '').trim().toUpperCase();
    if (raw.startsWith('SEVQR')) {
        return raw;
    }
    return `SEVQR${raw}`;
});

const sepayQrUrl = computed(() => {
    const bank = bankInfo.bankCode;
    const acc = bankInfo.accountNo;
    return `https://qr.sepay.vn/img?bank=${bank}&acc=${acc}&amount=${amount.value}&template=compact&des=${formattedCode.value}`;
});

// Timer state (10 minutes = 600s)
const timeLeft = ref(600);
let timerId: any = null;
const isSuccess = ref(false);
const ws = ref<WebSocket | null>(null);

const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const handleCancel = () => {
    if (confirm('Bạn có chắc chắn muốn hủy giao dịch không?')) {
        if (backUrl.value) {
            window.location.href = backUrl.value;
            return;
        }
        if (slug.value) {
            router.push(`/invite/${slug.value}`);
            return;
        }
        router.back();
    }
};

const triggerPaymentSuccess = () => {
    if (isSuccess.value) return;
    isSuccess.value = true;
    if (timerId) clearInterval(timerId);
    closeWebSocket();

    setTimeout(() => {
        if (backUrl.value) {
            window.location.href = backUrl.value;
        } else if (slug.value) {
            router.push(`/invite/${slug.value}`);
        } else {
            router.back();
        }
    }, 3000);
};

const connectWebSocket = () => {
    if (typeof window === 'undefined' || ws.value) return;
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;

        ws.value = new WebSocket(wsUrl);

        ws.value.onopen = () => {
            console.log('[WS] Connected to payment socket server');
            ws.value?.send(JSON.stringify({
                type: 'register',
                code: formattedCode.value
            }));
        };

        ws.value.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const recCode = data.code ? String(data.code).toUpperCase() : '';
                if (data.type === 'payment_success' && (recCode === formattedCode.value || recCode === code.value.toUpperCase() || !recCode)) {
                    console.log('[WS] Payment success received via WebSocket:', data);
                    triggerPaymentSuccess();
                }
            } catch (err) {}
        };

        ws.value.onclose = () => {
            ws.value = null;
        };
    } catch (e) {}
};

const closeWebSocket = () => {
    if (ws.value) {
        ws.value.close();
        ws.value = null;
    }
};

onMounted(() => {
    if (route.query.code) code.value = route.query.code as string;
    if (route.query.amount) amount.value = Number(route.query.amount);
    if (route.query.gift) giftName.value = route.query.gift as string;
    if (route.query.sender) senderName.value = route.query.sender as string;
    if (route.query.slug) slug.value = route.query.slug as string;

    if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('sepay_payment_data');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.code) code.value = data.code;
                if (data.amount) amount.value = data.amount;
                if (data.giftName) giftName.value = data.giftName;
                if (data.senderName) senderName.value = data.senderName;
                if (data.message) message.value = data.message;
                if (data.slug) slug.value = data.slug;
                if (data.backUrl) backUrl.value = data.backUrl;
            } catch (e) {}
        }
    }

    timerId = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--;
        } else {
            clearInterval(timerId);
        }
    }, 1000);

    connectWebSocket();
});

onUnmounted(() => {
    if (timerId) clearInterval(timerId);
    closeWebSocket();
});
</script>

<template>
    <div class="payment-page-container">
        <!-- Top Navigation Header -->
        <div class="payment-top-header">
            <div class="brand-logo">
                <span class="pay-text">Pay</span>
                <span class="badge-2s">2S</span>
                <span class="brand-name">CINELOVE</span>
            </div>
            <div class="lang-selector">
                <button type="button" class="btn-lang">
                    VN <span class="lang-code">VI ▼</span>
                </button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="payment-content-wrapper">
            <!-- Payment White Card -->
            <div class="payment-card">
                <!-- Left Column: Payment Info -->
                <div class="payment-info-col">
                    <h4 class="section-title">Thông tin thanh toán</h4>

                    <!-- Bank Name -->
                    <div class="bank-header-row">
                        <div class="mb-star-icon">
                            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 2L19.5 11.5H29.5L21.5 17.5L24.5 27L16 21L7.5 27L10.5 17.5L2.5 11.5H12.5L16 2Z" fill="#ee0033"/>
                            </svg>
                        </div>
                        <span class="bank-name-text">{{ bankInfo.name }}</span>
                    </div>

                    <!-- Payment Details Table -->
                    <div class="info-details-list">
                        <!-- Account Owner -->
                        <div class="info-item">
                            <span class="info-label">Chủ tài khoản:</span>
                            <span class="info-value text-uppercase font-weight-bold">{{ bankInfo.accountName }}</span>
                        </div>

                        <!-- Account Number -->
                        <div class="info-item">
                            <span class="info-label">Số tài khoản:</span>
                            <div class="info-value-group">
                                <span class="info-value font-weight-bold">{{ bankInfo.accountNo }}</span>
                                <button type="button" class="btn-copy-icon" @click="copyText(bankInfo.accountNo, 'acc')">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <span v-if="copiedField === 'acc'" class="copy-tooltip">Đã chép!</span>
                                </button>
                            </div>
                        </div>

                        <!-- Amount -->
                        <div class="info-item">
                            <span class="info-label">Số tiền:</span>
                            <div class="info-value-group">
                                <span class="info-value font-weight-bold">{{ formatCurrency(amount) }}đ</span>
                                <button type="button" class="btn-copy-icon" @click="copyText(amount.toString(), 'amount')">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <span v-if="copiedField === 'amount'" class="copy-tooltip">Đã chép!</span>
                                </button>
                            </div>
                        </div>

                        <!-- Content Code -->
                        <div class="info-item">
                            <span class="info-label">Nội dung chuyển khoản:</span>
                            <div class="info-value-group">
                                <span class="info-value code-highlight">{{ formattedCode }}</span>
                                <button type="button" class="btn-copy-icon" @click="copyText(formattedCode, 'code')">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <span v-if="copiedField === 'code'" class="copy-tooltip">Đã chép!</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="info-note">
                        (Vui lòng nhập chính xác nội dung và số tiền)
                    </div>
                </div>

                <!-- Right Column: Blue QR Box -->
                <div class="payment-qr-col">
                    <div class="qr-blue-box">
                        <h5 class="qr-box-title">Quét mã QR để thanh toán</h5>
                        <div class="qr-image-wrapper">
                            <img :src="sepayQrUrl" alt="SePay VietQR Code" class="sepay-qr-img" />
                            
                            <!-- Scanner Laser Animation -->
                            <div class="scanner-line"></div>
                            <div class="scanner-glow"></div>
                            
                            <!-- Scanner Corner Brackets -->
                            <span class="qr-corner corner-tl"></span>
                            <span class="qr-corner corner-tr"></span>
                            <span class="qr-corner corner-bl"></span>
                            <span class="qr-corner corner-br"></span>
                        </div>
                        <p class="qr-box-subtitle">Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</p>
                    </div>
                </div>
            </div>

            <!-- Success Overlay Card (if payment completed) -->
            <div v-if="isSuccess" class="success-banner-card mt-3 text-center p-4 bg-success text-white rounded-4 shadow w-100">
                <h4 class="fw-bold mb-2">🎉 Thanh toán thành công!</h4>
                <p class="mb-0">Cảm ơn bạn đã tặng quà. Đang tự động quay lại trang thiệp...</p>
            </div>

            <!-- Yellow Expiration Banner -->
            <div v-else class="timer-yellow-banner">
                <span>Đơn hàng sẽ hết hạn sau: </span>
                <span class="timer-clock">{{ formattedTimeLeft }}</span>
            </div>

            <!-- Cancel Button -->
            <div class="cancel-action-wrapper">
                <button type="button" class="btn-cancel-transaction" @click="handleCancel">
                    Hủy giao dịch
                </button>
            </div>
        </div>

        <!-- Page Footer -->
        <div class="payment-footer">
            Pay2S v1.0.0 © 2026 - Cổng thanh toán online thuộc CINELOVE
        </div>
    </div>
</template>

<style scoped>
.payment-page-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #eef4fb 0%, #e6eff9 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.payment-top-header {
    width: 100%;
    max-width: 860px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
}

.pay-text {
    font-weight: 800;
    letter-spacing: -0.5px;
}

.badge-2s {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 6px;
}

.brand-name {
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #334155;
    margin-left: 2px;
}

.btn-lang {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.lang-code {
    color: #1e293b;
}

.payment-content-wrapper {
    width: 100%;
    max-width: 860px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.payment-card {
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 30px;
    box-sizing: border-box;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px 0;
}

.bank-header-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
}

.bank-name-text {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
}

.info-details-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
}

.info-label {
    color: #64748b;
    font-weight: 500;
}

.info-value {
    color: #0f172a;
    font-weight: 600;
}

.info-value-group {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
}

.code-highlight {
    font-family: monospace;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #0f172a;
}

.btn-copy-icon {
    background: #f1f5f9;
    border: none;
    border-radius: 6px;
    padding: 6px 8px;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;
}

.btn-copy-icon:hover {
    background: #e2e8f0;
    color: #0f172a;
}

.copy-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: #ffffff;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    margin-bottom: 4px;
    pointer-events: none;
}

.info-note {
    font-size: 12px;
    font-style: italic;
    color: #94a3b8;
    margin-top: 24px;
}

.payment-qr-col {
    display: flex;
    flex-direction: column;
}

.qr-blue-box {
    background: linear-gradient(145deg, #1d4ed8 0%, #1e40af 100%);
    border-radius: 16px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: #ffffff;
    height: 100%;
    box-sizing: border-box;
}

.qr-box-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: #ffffff;
}

.qr-image-wrapper {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 210px;
    height: 210px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    margin-bottom: 16px;
    box-sizing: border-box;
}

.sepay-qr-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Scanner Animation Styling */
.scanner-line {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    height: 3px;
    background: linear-gradient(90deg, rgba(16, 185, 129, 0) 0%, #10b981 50%, rgba(16, 185, 129, 0) 100%);
    box-shadow: 0 0 12px #10b981, 0 0 4px #10b981;
    z-index: 5;
    animation: qrScanLine 2.5s ease-in-out infinite alternate;
    pointer-events: none;
}

.scanner-glow {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    height: 40px;
    background: linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0) 100%);
    z-index: 4;
    animation: qrScanGlow 2.5s ease-in-out infinite alternate;
    pointer-events: none;
}

@keyframes qrScanLine {
    0% {
        top: 8px;
    }
    100% {
        top: calc(100% - 11px);
    }
}

@keyframes qrScanGlow {
    0% {
        top: 8px;
        opacity: 0.8;
    }
    50% {
        opacity: 0.4;
    }
    100% {
        top: calc(100% - 48px);
        opacity: 0.8;
    }
}

/* Corner Brackets */
.qr-corner {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: #10b981;
    border-style: solid;
    border-width: 0;
    z-index: 6;
    pointer-events: none;
}

.corner-tl {
    top: 8px;
    left: 8px;
    border-top-width: 3px;
    border-left-width: 3px;
    border-top-left-radius: 4px;
}

.corner-tr {
    top: 8px;
    right: 8px;
    border-top-width: 3px;
    border-right-width: 3px;
    border-top-right-radius: 4px;
}

.corner-bl {
    bottom: 8px;
    left: 8px;
    border-bottom-width: 3px;
    border-left-width: 3px;
    border-bottom-left-radius: 4px;
}

.corner-br {
    bottom: 8px;
    right: 8px;
    border-bottom-width: 3px;
    border-right-width: 3px;
    border-bottom-right-radius: 4px;
}

.qr-box-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.4;
    margin: 0;
}

.timer-yellow-banner {
    width: 100%;
    background: #fef9c3;
    border: 1px solid #fde047;
    border-radius: 10px;
    padding: 12px 20px;
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #854d0e;
    box-sizing: border-box;
}

.timer-clock {
    color: #dc2626;
    font-weight: 700;
}

.cancel-action-wrapper {
    margin-top: 16px;
}

.btn-cancel-transaction {
    background: none;
    border: none;
    color: #dc2626;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 12px;
    transition: opacity 0.2s;
}

.btn-cancel-transaction:hover {
    opacity: 0.8;
    text-decoration: underline;
}

.payment-footer {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 30px;
    text-align: center;
}

@media (max-width: 768px) {
    .payment-card {
        grid-template-columns: 1fr;
        padding: 20px;
    }
}
</style>