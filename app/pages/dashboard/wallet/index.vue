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

// Withdraw Modal
const isWithdrawModalOpen = ref(false);
const withdrawAmount = ref<number | null>(null);
const bankName = ref('Vietcombank');
const accountNumber = ref('');
const accountHolder = ref('');
const note = ref('');
const isSubmitting = ref(false);

const setQuickAmount = (val: number) => {
    withdrawAmount.value = val;
};

const setMaxAmount = () => {
    withdrawAmount.value = walletData.value?.balance || 0;
};

const handleWithdraw = async () => {
    const amt = Number(withdrawAmount.value);
    if (!amt || amt < 50000) {
        alert('Số tiền rút tối thiểu là 50,000 VNĐ!');
        return;
    }
    if (amt > (walletData.value?.balance || 0)) {
        alert('Số tiền rút vượt quá số dư khả dụng!');
        return;
    }
    if (!bankName.value || !accountNumber.value || !accountHolder.value) {
        alert('Vui lòng điền đầy đủ thông tin ngân hàng thụ hưởng!');
        return;
    }

    try {
        isSubmitting.value = true;
        const res = await $fetch<any>('/api/v1/client/wallet/withdraw', {
            method: 'POST',
            body: {
                amount: amt,
                bankName: bankName.value,
                accountNumber: accountNumber.value,
                accountHolder: accountHolder.value,
                note: note.value
            }
        });

        if (res.success) {
            alert(res.message || 'Yêu cầu rút tiền đã được gửi thành công!');
            isWithdrawModalOpen.value = false;
            withdrawAmount.value = null;
            fetchWallet();
        } else {
            alert(res.message || 'Rút tiền thất bại');
        }
    } catch (e: any) {
        alert(e.data?.message || 'Có lỗi xảy ra khi tạo yêu cầu rút tiền');
    } finally {
        isSubmitting.value = false;
    }
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
                        Tiền quà mừng từ người thân gửi qua thiệp online. Bạn có thể yêu cầu rút trực tiếp về tài khoản ngân hàng bất cứ lúc nào.
                    </p>
                </div>
                <div class="col-md-5 text-md-end">
                    <div class="d-flex flex-column flex-sm-row justify-content-md-end gap-2">
                        <button
                            @click="isWithdrawModalOpen = true"
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

        <!-- Upgrade Notice if rate < 100% -->
        <div v-if="walletData && walletData.receiveRate < 100" class="alert alert-warning border-0 rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div class="d-flex align-items-center">
                <span class="fs-4 me-3">💡</span>
                <div>
                    <div class="fw-bold">Bạn đang ở {{ walletData.packageName }} (tỷ lệ nhận {{ walletData.receiveRate }}% quà tặng)</div>
                    <div class="small text-muted">Nâng cấp lên gói <strong>Premium</strong> để nhận trọn vẹn 100% giá trị quà mừng không mất phí cổng thanh toán!</div>
                </div>
            </div>
            <NuxtLink to="/pricing-plans" class="btn btn-dark btn-sm rounded-pill px-3 py-2 fw-bold text-decoration-none">
                Nâng cấp ngay →
            </NuxtLink>
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
                    <span class="small text-muted">Tổng các lệnh rút đã xử lý</span>
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
                    class="list-group-item px-0 py-3 d-flex align-items-center justify-content-between border-bottom"
                >
                    <div class="d-flex align-items-center">
                        <div
                            class="tx-icon-circle me-3"
                            :class="tx.type === 'GIFT' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'"
                        >
                            <BaseIconComponent
                                :name="tx.type === 'GIFT' ? 'arrow-down-left' : 'arrow-up-right'"
                                type="lucide"
                                :size="20"
                            />
                        </div>
                        <div>
                            <div class="fw-bold text-dark mb-1">{{ tx.title }}</div>
                            <div class="small text-muted">
                                <span>{{ tx.description }}</span>
                                <span class="mx-1">•</span>
                                <span>{{ formatDate(tx.createdAt) }}</span>
                                <span class="mx-1">•</span>
                                <span class="badge bg-light text-secondary border">{{ tx.code }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-end">
                        <div
                            class="fw-bold fs-6"
                            :class="tx.amount > 0 ? 'text-success' : 'text-danger'"
                        >
                            {{ tx.amount > 0 ? '+' : '' }}{{ formatCurrency(tx.amount) }}
                        </div>
                        <span class="badge" :class="tx.status === 'COMPLETED' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'">
                            {{ tx.status === 'COMPLETED' ? 'Thành công' : 'Đang xử lý' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdraw Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isWithdrawModalOpen">
                <div class="withdraw-modal p-4" style="max-width: 460px; width: 100%;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold mb-0">Rút tiền về ngân hàng</h5>
                        <button type="button" class="btn-close" @click="isWithdrawModalOpen = false"></button>
                    </div>

                    <div class="p-3 bg-light rounded-3 mb-3 d-flex justify-content-between align-items-center">
                        <span class="small text-muted">Số dư khả dụng:</span>
                        <strong class="text-primary fs-6">{{ formatCurrency(walletData?.balance || 0) }}</strong>
                    </div>

                    <form @submit.prevent="handleWithdraw">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Số tiền muốn rút (VNĐ)</label>
                            <div class="input-group">
                                <input
                                    v-model="withdrawAmount"
                                    type="number"
                                    min="50000"
                                    :max="walletData?.balance || 0"
                                    class="form-control"
                                    placeholder="Tối thiểu 50,000 đ"
                                    required
                                />
                                <button type="button" class="btn btn-outline-secondary btn-sm" @click="setMaxAmount">
                                    Tất cả
                                </button>
                            </div>
                            <div class="d-flex gap-1 mt-2">
                                <button type="button" class="btn btn-sm btn-light border small" @click="setQuickAmount(100000)">100k</button>
                                <button type="button" class="btn btn-sm btn-light border small" @click="setQuickAmount(200000)">200k</button>
                                <button type="button" class="btn btn-sm btn-light border small" @click="setQuickAmount(500000)">500k</button>
                                <button type="button" class="btn btn-sm btn-light border small" @click="setQuickAmount(1000000)">1 triệu</button>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Ngân hàng nhận tiền</label>
                            <select v-model="bankName" class="form-select" required>
                                <option value="Vietcombank">Vietcombank (VCB)</option>
                                <option value="MBBank">MBBank (Quân Đội)</option>
                                <option value="Techcombank">Techcombank</option>
                                <option value="ACB">ACB (Á Châu)</option>
                                <option value="VPBank">VPBank</option>
                                <option value="BIDV">BIDV</option>
                                <option value="VietinBank">VietinBank</option>
                                <option value="TPBank">TPBank</option>
                                <option value="Khác">Ngân hàng khác</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Số tài khoản</label>
                            <input
                                v-model="accountNumber"
                                type="text"
                                class="form-control"
                                placeholder="Nhập số tài khoản ngân hàng"
                                required
                            />
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Tên chủ tài khoản (in hoa không dấu)</label>
                            <input
                                v-model="accountHolder"
                                type="text"
                                class="form-control text-uppercase"
                                placeholder="VD: NGUYEN VAN A"
                                required
                            />
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold">Ghi chú (tùy chọn)</label>
                            <input
                                v-model="note"
                                type="text"
                                class="form-control"
                                placeholder="VD: Rút tiền mừng đám cưới"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="isSubmitting || (walletData?.balance || 0) < 50000"
                            class="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm"
                        >
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                            {{ (walletData?.balance || 0) < 50000 ? 'Số dư chưa đủ 50,000 đ' : 'Xác nhận rút tiền' }}
                        </button>
                    </form>
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
</style>
