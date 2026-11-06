<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'dashboard'
});

const walletData = ref<any>(null);
const isLoading = ref(true);
const activeTab = ref('all'); // 'all', 'GIFT', 'WITHDRAW'
const feedbackMessage = ref<{ text: string; type: 'success' | 'error' } | null>(null);

const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    feedbackMessage.value = { text, type };
    setTimeout(() => {
        if (feedbackMessage.value?.text === text) {
            feedbackMessage.value = null;
        }
    }, 5000);
};

const fetchWallet = async () => {
    isLoading.value = true;
    try {
        const res = await $fetch<any>('/api/v1/client/wallet');
        if (res.success && res.data) {
            walletData.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch wallet info:', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchWallet();
});

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const filteredTransactions = computed(() => {
    const list = walletData.value?.transactions || [];
    if (activeTab.value === 'all') return list;
    return list.filter((t: any) => t.type === activeTab.value);
});

const savedAccounts = computed(() => walletData.value?.savedBankAccounts || []);

// Withdraw Modal State
const isWithdrawModalOpen = ref(false);
const selectedSavedAccId = ref<number | 'custom'>('custom');
const withdrawAmount = ref<number | null>(null);
const bankName = ref('Vietcombank');
const accountNumber = ref('');
const accountHolder = ref('');
const note = ref('');
const saveAccount = ref(true);
const isSubmitting = ref(false);
const formError = ref('');

// Detail / Receipt Modal
const selectedWithdrawal = ref<any>(null);
const isDetailModalOpen = ref(false);

const bankList = [
    { code: 'VCB', name: 'Vietcombank', label: 'Vietcombank (VCB)' },
    { code: 'MB', name: 'MBBank', label: 'MBBank (Quân Đội)' },
    { code: 'TCB', name: 'Techcombank', label: 'Techcombank (TCB)' },
    { code: 'ICB', name: 'VietinBank', label: 'VietinBank (CTG)' },
    { code: 'BIDV', name: 'BIDV', label: 'BIDV' },
    { code: 'ACB', name: 'ACB', label: 'ACB (Á Châu)' },
    { code: 'VPB', name: 'VPBank', label: 'VPBank' },
    { code: 'TPB', name: 'TPBank', label: 'TPBank' },
    { code: 'VBA', name: 'Agribank', label: 'Agribank' },
    { code: 'STB', name: 'Sacombank', label: 'Sacombank' }
];

const remainingBalance = computed(() => {
    const bal = walletData.value?.balance || 0;
    const amt = Number(withdrawAmount.value) || 0;
    return Math.max(0, bal - amt);
});

const previewQrUrl = computed(() => {
    if (!bankName.value || !accountNumber.value.trim()) return '';
    const found = bankList.find(b => b.name.toLowerCase() === bankName.value.toLowerCase());
    const bankCode = found ? found.code : bankName.value;
    const amt = Number(withdrawAmount.value) || 0;
    const holder = encodeURIComponent((accountHolder.value || '').trim().toUpperCase());
    const desc = encodeURIComponent(note.value || 'Rut tien qua mung Cinelove');
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber.value.trim()}-compact2.png?amount=${amt}&addInfo=${desc}&accountName=${holder}`;
});

const selectSavedAccount = (acc: any) => {
    selectedSavedAccId.value = acc.id;
    bankName.value = acc.bankName || 'Vietcombank';
    accountNumber.value = acc.accountNumber || '';
    accountHolder.value = (acc.accountHolder || '').toUpperCase();
    saveAccount.value = false;
    formError.value = '';
};

const selectCustomAccount = () => {
    selectedSavedAccId.value = 'custom';
    bankName.value = 'Vietcombank';
    accountNumber.value = '';
    accountHolder.value = '';
    saveAccount.value = true;
    formError.value = '';
};

const openWithdrawModal = () => {
    formError.value = '';
    withdrawAmount.value = null;
    note.value = '';
    if (savedAccounts.value.length > 0) {
        selectSavedAccount(savedAccounts.value[0]);
    } else {
        selectCustomAccount();
    }
    isWithdrawModalOpen.value = true;
};

const setQuickAmount = (val: number) => {
    const maxBal = walletData.value?.balance || 0;
    withdrawAmount.value = Math.min(val, maxBal);
    formError.value = '';
};

const setMaxAmount = () => {
    withdrawAmount.value = walletData.value?.balance || 0;
    formError.value = '';
};

const handleWithdraw = async () => {
    formError.value = '';
    const amt = Math.floor(Number(withdrawAmount.value));
    const maxBal = walletData.value?.balance || 0;

    if (!amt || amt < 50000) {
        formError.value = 'Số tiền rút tối thiểu là 50,000 VNĐ!';
        return;
    }
    if (amt > maxBal) {
        formError.value = `Số tiền rút vượt quá số dư khả dụng (${formatCurrency(maxBal)})!`;
        return;
    }
    if (!bankName.value || !accountNumber.value.trim() || !accountHolder.value.trim()) {
        formError.value = 'Vui lòng điền đầy đủ thông tin ngân hàng thụ hưởng!';
        return;
    }

    try {
        isSubmitting.value = true;
        const res = await $fetch<any>('/api/v1/client/wallet/withdraw', {
            method: 'POST',
            body: {
                amount: amt,
                bankName: bankName.value,
                accountNumber: accountNumber.value.trim(),
                accountHolder: accountHolder.value.trim().toUpperCase(),
                note: note.value.trim() || 'Rút tiền tự động 24/7 về ngân hàng',
                saveAccount: selectedSavedAccId.value === 'custom' && saveAccount.value
            }
        });

        if (res.success) {
            isWithdrawModalOpen.value = false;
            withdrawAmount.value = null;
            showFeedback(res.message || 'Rút tiền tự động về ngân hàng thành công!', 'success');
            await fetchWallet();
            if (res.data) {
                selectedWithdrawal.value = {
                    ...res.data,
                    amount: -Math.abs(res.data.amount)
                };
                isDetailModalOpen.value = true;
            }
        } else {
            formError.value = res.message || 'Rút tiền thất bại';
        }
    } catch (e: any) {
        formError.value = e.data?.message || 'Có lỗi xảy ra khi thực hiện rút tiền';
    } finally {
        isSubmitting.value = false;
    }
};

const openWithdrawalDetail = (tx: any) => {
    selectedWithdrawal.value = tx;
    isDetailModalOpen.value = true;
};
</script>

<template>
    <div class="wallet-page dashboard-cover">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <ButtonReturnMobileComponent />
                    <h4 class="fw-bold mb-0 d-flex align-items-center">
                        <span class="me-2">💳</span> Số dư và Giao dịch
                    </h4>
                </div>
                <p class="text-muted small mb-0">Theo dõi dòng tiền quà mừng và quản lý lịch sử thanh toán</p>
            </div>
            <div class="d-flex gap-2">
                <NuxtLink to="/dashboard/bank-accounts" class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-bold text-decoration-none d-flex align-items-center">
                    <BaseIconComponent name="credit-card" type="lucide" :size="16" class="me-1" />
                    Tài khoản ngân hàng
                </NuxtLink>
                <NuxtLink to="/pricing-plans" class="btn btn-warning btn-sm rounded-pill px-3 py-2 fw-bold shadow-sm text-decoration-none d-flex align-items-center text-dark">
                    <BaseIconComponent name="zap" type="lucide" :size="16" class="me-1" />
                    Nâng cấp gói (100%)
                </NuxtLink>
            </div>
        </div>

        <!-- Feedback Toast Banner -->
        <div
            v-if="feedbackMessage"
            class="alert rounded-4 shadow-sm mb-4 d-flex align-items-center justify-content-between"
            :class="feedbackMessage.type === 'success' ? 'alert-success border-0' : 'alert-danger border-0'"
        >
            <div class="d-flex align-items-center gap-2">
                <span>{{ feedbackMessage.type === 'success' ? '✅' : '⚠️' }}</span>
                <span class="fw-semibold">{{ feedbackMessage.text }}</span>
            </div>
            <button type="button" class="btn-close btn-sm" @click="feedbackMessage = null"></button>
        </div>

        <!-- Main Balance Card Banner -->
        <div class="balance-banner p-4 p-md-5 rounded-4 shadow-sm mb-4 text-white position-relative overflow-hidden">
            <div class="row align-items-center position-relative z-1">
                <div class="col-md-7 mb-3 mb-md-0">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span class="small text-white-50 text-uppercase fw-semibold letter-spacing-1">Số dư khả dụng</span>
                        <span class="badge rounded-pill bg-white text-primary fw-bold px-2 py-1" style="font-size: 11px;">
                            {{ walletData?.packageName || 'Free' }}: {{ walletData?.receiveRate || 0 }}% quà tặng
                        </span>
                    </div>
                    <h2 class="display-5 fw-bold mb-3 text-white">
                        {{ formatCurrency(walletData?.balance || 0) }}
                    </h2>
                    <p class="small text-white-50 mb-0" style="max-width: 480px;">
                        Tiền quà mừng từ người thân gửi qua thiệp online. Rút tiền tự động 24/7 trực tiếp về tài khoản ngân hàng ngay lập tức.
                    </p>
                </div>
                <div class="col-md-5 text-md-end">
                    <div class="d-flex flex-column flex-sm-row justify-content-md-end gap-2">
                        <button
                            @click="openWithdrawModal"
                            class="btn btn-light rounded-pill px-4 py-3 fw-bold text-primary shadow d-flex align-items-center justify-content-center"
                        >
                            <BaseIconComponent name="arrow-up-right" type="lucide" :size="18" class="me-2" />
                            Rút tiền về ngân hàng
                        </button>
                        <NuxtLink
                            v-if="!walletData?.isPremium"
                            to="/pricing-plans"
                            class="btn btn-outline-light rounded-pill px-4 py-3 fw-bold text-decoration-none d-flex align-items-center justify-content-center"
                        >
                            <BaseIconComponent name="crown" type="lucide" :size="18" class="me-2 text-warning" />
                            Nâng cấp lên 100%
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <!-- Decorative circle backgrounds -->
            <div class="circle-decor-1"></div>
            <div class="circle-decor-2"></div>
        </div>

        <!-- Stats 3 boxes -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="bg-white p-4 rounded-4 shadow-sm border-0 h-100">
                    <div class="small text-muted fw-bold mb-1">Tổng quà mừng nhận được</div>
                    <h4 class="fw-bold text-dark mb-1">{{ formatCurrency(walletData?.grossReceived || 0) }}</h4>
                    <span class="small text-muted">Quy đổi 100% giá trị danh nghĩa</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white p-4 rounded-4 shadow-sm border-0 h-100">
                    <div class="small text-muted fw-bold mb-1">Thực nhận theo gói</div>
                    <h4 class="fw-bold text-primary mb-1">{{ formatCurrency(walletData?.netReceived || 0) }}</h4>
                    <span class="small text-muted">Áp dụng tỷ lệ {{ walletData?.receiveRate || 0 }}%</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bg-white p-4 rounded-4 shadow-sm border-0 h-100">
                    <div class="small text-muted fw-bold mb-1">Đã rút về ngân hàng</div>
                    <h4 class="fw-bold text-success mb-1">{{ formatCurrency(walletData?.totalWithdrawn || 0) }}</h4>
                    <span class="small text-muted">Tự động chuyển khoản 24/7 hoàn tất</span>
                </div>
            </div>
        </div>

        <!-- Transactions history -->
        <div class="bg-white p-4 rounded-4 shadow-sm mb-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h6 class="fw-bold mb-0 text-dark d-flex align-items-center">
                    <BaseIconComponent name="activity" type="lucide" :size="18" class="me-2 text-primary" />
                    Lịch sử biến động số dư
                </h6>
                <div class="btn-group btn-group-sm rounded-pill p-1 bg-light">
                    <button
                        @click="activeTab = 'all'"
                        class="btn rounded-pill px-3 fw-bold"
                        :class="activeTab === 'all' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'"
                    >
                        Tất cả
                    </button>
                    <button
                        @click="activeTab = 'GIFT'"
                        class="btn rounded-pill px-3 fw-bold"
                        :class="activeTab === 'GIFT' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'"
                    >
                        Nhận quà
                    </button>
                    <button
                        @click="activeTab = 'WITHDRAW'"
                        class="btn rounded-pill px-3 fw-bold"
                        :class="activeTab === 'WITHDRAW' ? 'btn-white shadow-sm text-primary' : 'text-muted border-0'"
                    >
                        Rút tiền
                    </button>
                </div>
            </div>

            <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                <span class="ms-2 text-muted small">Đang cập nhật giao dịch...</span>
            </div>

            <div v-else-if="filteredTransactions.length === 0" class="text-center py-4 text-muted small">
                Chưa có giao dịch nào trong mục này.
            </div>

            <div v-else class="list-group list-group-flush">
                <div
                    v-for="tx in filteredTransactions"
                    :key="tx.id"
                    class="list-group-item px-0 py-3 d-flex align-items-center justify-content-between border-bottom flex-wrap gap-2"
                >
                    <div class="d-flex align-items-center">
                        <div
                            class="tx-icon-circle me-3"
                            :class="tx.type === 'GIFT'
                                ? 'bg-success-subtle text-success'
                                : 'bg-primary-subtle text-primary'"
                        >
                            <BaseIconComponent
                                :name="tx.type === 'GIFT' ? 'arrow-down-left' : 'arrow-up-right'"
                                type="lucide"
                                :size="20"
                            />
                        </div>
                        <div>
                            <div class="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <span>{{ tx.title }}</span>
                                <span class="badge bg-light text-secondary border fw-normal">{{ tx.code }}</span>
                            </div>
                            <div class="small text-muted">
                                <span>{{ tx.description }}</span>
                                <span class="mx-1">•</span>
                                <span>{{ formatDate(tx.createdAt) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-end d-flex align-items-center gap-3 ms-auto">
                        <div>
                            <div
                                class="fw-bold fs-6"
                                :class="tx.amount > 0 ? 'text-success' : 'text-danger'"
                            >
                                {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                            </div>
                            <span class="badge bg-success-subtle text-success">
                                Thành công
                            </span>
                        </div>
                        <button
                            v-if="tx.type === 'WITHDRAW'"
                            type="button"
                            class="btn btn-light btn-sm rounded-pill border px-3 fw-semibold"
                            @click="openWithdrawalDetail(tx)"
                        >
                            Biên lai
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isWithdrawModalOpen">
                <div class="withdraw-modal-card">
                    <!-- Modal Header -->
                    <div class="withdraw-modal-header">
                        <div class="d-flex align-items-center gap-2">
                            <div class="header-icon-badge">🏦</div>
                            <div>
                                <h5 class="fw-bold mb-0 text-white">Rút tiền tự động 24/7</h5>
                                <small class="text-white-50">Chuyển khoản tức thì về tài khoản ngân hàng của bạn</small>
                            </div>
                        </div>
                        <button type="button" class="btn-modal-close" @click="isWithdrawModalOpen = false">✕</button>
                    </div>

                    <div class="withdraw-modal-body">
                        <!-- Balance Summary Box -->
                        <div class="balance-summary-box mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="small text-secondary fw-medium">Số dư khả dụng hiện tại:</span>
                                <strong class="text-primary fs-5">{{ formatCurrency(walletData?.balance || 0) }}</strong>
                            </div>
                            <div v-if="withdrawAmount && withdrawAmount > 0" class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top small">
                                <span class="text-muted">Số dư còn lại sau khi rút:</span>
                                <strong class="text-dark">{{ formatCurrency(remainingBalance) }}</strong>
                            </div>
                        </div>

                        <div v-if="formError" class="alert alert-danger py-2 px-3 small rounded-3 mb-3">
                            {{ formError }}
                        </div>

                        <form @submit.prevent="handleWithdraw">
                            <!-- Amount Input -->
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-dark">Số tiền muốn rút (VNĐ)</label>
                                <div class="input-group">
                                    <input
                                        v-model.number="withdrawAmount"
                                        type="number"
                                        min="50000"
                                        step="1000"
                                        :max="walletData?.balance || 0"
                                        class="form-control fw-bold text-primary"
                                        placeholder="Tối thiểu 50,000 đ"
                                        required
                                    />
                                    <button type="button" class="btn btn-primary btn-sm px-3 fw-bold" @click="setMaxAmount">
                                        Rút tất cả
                                    </button>
                                </div>
                                <div class="d-flex flex-wrap gap-1 mt-2">
                                    <button type="button" class="btn btn-sm btn-quick-amt" @click="setQuickAmount(100000)">100,000đ</button>
                                    <button type="button" class="btn btn-sm btn-quick-amt" @click="setQuickAmount(500000)">500,000đ</button>
                                    <button type="button" class="btn btn-sm btn-quick-amt" @click="setQuickAmount(1000000)">1,000,000đ</button>
                                    <button type="button" class="btn btn-sm btn-quick-amt" @click="setQuickAmount(2000000)">2,000,000đ</button>
                                </div>
                            </div>

                            <!-- Saved Bank Accounts Selector -->
                            <div v-if="savedAccounts.length > 0" class="mb-3">
                                <label class="form-label small fw-bold text-dark">Chọn nhanh tài khoản đã lưu</label>
                                <div class="d-flex flex-column gap-2 mb-2">
                                    <div
                                        v-for="acc in savedAccounts"
                                        :key="acc.id"
                                        @click="selectSavedAccount(acc)"
                                        class="saved-acc-card p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                                        :class="selectedSavedAccId === acc.id ? 'selected-acc' : ''"
                                    >
                                        <div>
                                            <div class="fw-bold small text-dark">{{ acc.bankName }} - {{ acc.accountNumber }}</div>
                                            <div class="text-muted" style="font-size: 12px;">{{ acc.accountHolder }} ({{ acc.label }})</div>
                                        </div>
                                        <input type="radio" :checked="selectedSavedAccId === acc.id" class="form-check-input m-0" />
                                    </div>
                                    <div
                                        @click="selectCustomAccount"
                                        class="saved-acc-card p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                                        :class="selectedSavedAccId === 'custom' ? 'selected-acc' : ''"
                                    >
                                        <span class="small fw-semibold text-primary">+ Nhập tài khoản ngân hàng khác</span>
                                        <input type="radio" :checked="selectedSavedAccId === 'custom'" class="form-check-input m-0" />
                                    </div>
                                </div>
                            </div>

                            <!-- Bank Details Fields -->
                            <div class="row g-2 mb-3">
                                <div class="col-sm-6">
                                    <label class="form-label small fw-bold text-dark">Ngân hàng nhận tiền</label>
                                    <select v-model="bankName" class="form-select" required>
                                        <option v-for="b in bankList" :key="b.code" :value="b.name">
                                            {{ b.label }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-sm-6">
                                    <label class="form-label small fw-bold text-dark">Số tài khoản</label>
                                    <input
                                        v-model="accountNumber"
                                        type="text"
                                        class="form-control"
                                        placeholder="Nhập số tài khoản"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-dark">Tên chủ tài khoản (in hoa không dấu)</label>
                                <input
                                    v-model="accountHolder"
                                    type="text"
                                    class="form-control text-uppercase"
                                    placeholder="VD: NGUYEN VAN A"
                                    required
                                />
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-dark">Nội dung chuyển khoản</label>
                                <input
                                    v-model="note"
                                    type="text"
                                    class="form-control"
                                    placeholder="VD: Rút tiền mừng đám cưới"
                                />
                            </div>

                            <div v-if="selectedSavedAccId === 'custom'" class="form-check mb-3">
                                <input id="saveBankAccCheck" v-model="saveAccount" class="form-check-input" type="checkbox" />
                                <label class="form-check-label small text-muted" for="saveBankAccCheck">
                                    Lưu tài khoản ngân hàng này cho những lần rút tiếp theo
                                </label>
                            </div>

                            <!-- VietQR Beneficiary Preview -->
                            <div v-if="previewQrUrl && accountNumber.length >= 6" class="qr-preview-box p-3 rounded-3 mb-3 d-flex align-items-center gap-3">
                                <img :src="previewQrUrl" alt="VietQR Preview" class="rounded-2 border bg-white p-1" style="width: 80px; height: 80px; object-fit: contain;" />
                                <div class="small">
                                    <div class="fw-bold text-dark mb-1">Xác thực VietQR tự động 24/7</div>
                                    <div class="text-muted">{{ bankName }} • <strong>{{ accountNumber }}</strong></div>
                                    <div class="text-uppercase fw-semibold text-primary">{{ accountHolder || 'CHU TAI KHOAN' }}</div>
                                </div>
                            </div>

                            <div class="d-flex gap-2 mt-2">
                                <button
                                    type="button"
                                    class="btn btn-light border rounded-pill px-4 py-2 fw-bold text-secondary"
                                    @click="isWithdrawModalOpen = false"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    :disabled="isSubmitting || (walletData?.balance || 0) < 50000"
                                    class="btn btn-primary flex-fill py-2 rounded-pill fw-bold shadow-sm"
                                >
                                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ (walletData?.balance || 0) < 50000 ? 'Số dư chưa đủ 50,000 đ' : 'Rút tiền ngay về ngân hàng' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>

        <!-- Withdrawal Receipt Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isDetailModalOpen">
                <div v-if="selectedWithdrawal" class="withdraw-modal-card" style="max-width: 450px;">
                    <div class="withdraw-modal-header receipt-header">
                        <div class="d-flex align-items-center gap-2">
                            <div class="header-icon-badge">✅</div>
                            <div>
                                <h5 class="fw-bold mb-0 text-white">Biên lai rút tiền thành công</h5>
                                <small class="text-white-50">Chuyển khoản tự động 24/7 hoàn tất</small>
                            </div>
                        </div>
                        <button type="button" class="btn-modal-close" @click="isDetailModalOpen = false">✕</button>
                    </div>

                    <div class="withdraw-modal-body">
                        <div class="text-center p-3 bg-success-subtle rounded-4 mb-3">
                            <div class="small text-success fw-semibold mb-1">Số tiền đã chuyển về ngân hàng</div>
                            <h3 class="fw-bold text-success mb-2">{{ formatCurrency(Math.abs(selectedWithdrawal.amount)) }}</h3>
                            <span class="badge bg-success text-white px-3 py-1 rounded-pill">
                                ✓ Đã chuyển khoản thành công
                            </span>
                        </div>

                        <div class="small d-flex flex-column gap-2 mb-4 bg-light p-3 rounded-3 border">
                            <div class="d-flex justify-content-between py-1 border-bottom">
                                <span class="text-muted">Mã giao dịch:</span>
                                <strong class="text-dark">{{ selectedWithdrawal.code }}</strong>
                            </div>
                            <div class="d-flex justify-content-between py-1 border-bottom">
                                <span class="text-muted">Ngân hàng thụ hưởng:</span>
                                <strong class="text-dark">{{ selectedWithdrawal.bankName }}</strong>
                            </div>
                            <div class="d-flex justify-content-between py-1 border-bottom">
                                <span class="text-muted">Số tài khoản:</span>
                                <strong class="text-primary">{{ selectedWithdrawal.accountNumber }}</strong>
                            </div>
                            <div class="d-flex justify-content-between py-1 border-bottom">
                                <span class="text-muted">Chủ tài khoản:</span>
                                <strong class="text-dark text-uppercase">{{ selectedWithdrawal.accountHolder }}</strong>
                            </div>
                            <div class="d-flex justify-content-between py-1 border-bottom">
                                <span class="text-muted">Thời gian hoàn tất:</span>
                                <span class="text-dark">{{ formatDate(selectedWithdrawal.createdAt) }}</span>
                            </div>
                            <div v-if="selectedWithdrawal.note" class="d-flex justify-content-between py-1">
                                <span class="text-muted">Nội dung:</span>
                                <span class="text-dark">{{ selectedWithdrawal.note }}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm"
                            @click="isDetailModalOpen = false"
                        >
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>
    </div>
</template>

<style scoped>
.balance-banner {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.circle-decor-1 {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    top: -50px;
    right: -50px;
}
.circle-decor-2 {
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    bottom: -60px;
    right: 20%;
}
.tx-icon-circle {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cursor-pointer {
    cursor: pointer;
}

/* Modal Card Styling with solid white background */
.withdraw-modal-card {
    background: #ffffff;
    border-radius: 20px;
    width: 520px;
    max-width: 92vw;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);
    border: 1px solid #e2e8f0;
}

.withdraw-modal-header {
    background: linear-gradient(135deg, #1e3c72 0%, #2563eb 100%);
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.withdraw-modal-header.receipt-header {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.header-icon-badge {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.btn-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-modal-close:hover {
    background: rgba(255, 255, 255, 0.35);
}

.withdraw-modal-body {
    padding: 22px 24px;
    overflow-y: auto;
    background: #ffffff;
}

.balance-summary-box {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 12px 16px;
}

.btn-quick-amt {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 600;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 12px;
}

.btn-quick-amt:hover {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #2563eb;
}

.saved-acc-card {
    background: #ffffff;
    transition: all 0.2s ease;
}

.saved-acc-card:hover {
    border-color: #3b82f6 !important;
    background-color: #f8fafc;
}

.saved-acc-card.selected-acc {
    border-color: #2563eb !important;
    background-color: #eff6ff;
}

.qr-preview-box {
    background: #f8fafc;
    border: 1px dashed #93c5fd;
}
</style>
