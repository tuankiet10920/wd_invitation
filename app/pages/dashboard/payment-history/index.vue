<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'dashboard'
});

const ordersData = ref<{
    stats: {
        totalOrders: number;
        totalSpent: number;
        currentPackage: string;
    };
    orders: any[];
} | null>(null);

const isLoading = ref(true);

const fetchOrders = async () => {
    isLoading.value = true;
    try {
        const res = await $fetch<any>('/api/v1/client/payment/orders');
        if (res.success && res.data) {
            ordersData.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch orders history:', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchOrders();
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

// Receipt Modal
const isReceiptModalOpen = ref(false);
const activeOrder = ref<any>(null);

const openReceipt = (order: any) => {
    activeOrder.value = order;
    isReceiptModalOpen.value = true;
};

const printReceipt = () => {
    window.print();
};
</script>

<template>
    <div class="payment-history-page dashboard-cover">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <ButtonReturnMobileComponent />
                    <h4 class="fw-bold mb-0 d-flex align-items-center">
                        <span class="me-2">🧾</span> Lịch sử thanh toán
                    </h4>
                </div>
                <p class="text-muted small mb-0">Xem chi tiết các hóa đơn và giao dịch nâng cấp gói dịch vụ</p>
            </div>
            <div class="d-flex gap-2">
                <NuxtLink to="/pricing-plans" class="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-bold shadow-sm text-decoration-none d-flex align-items-center">
                    <BaseIconComponent name="zap" type="lucide" :size="16" class="me-1" />
                    Xem các gói dịch vụ
                </NuxtLink>
            </div>
        </div>

        <!-- Top stats cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-4 col-sm-6">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-primary-subtle text-primary">
                        <BaseIconComponent name="credit-card" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Tổng chi tiêu</div>
                        <h4 class="fw-bold mb-0 text-dark">{{ formatCurrency(ordersData?.stats.totalSpent || 0) }}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-6">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-success-subtle text-success">
                        <BaseIconComponent name="shopping-bag" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Số giao dịch thanh toán</div>
                        <h4 class="fw-bold mb-0 text-dark">{{ ordersData?.stats.totalOrders || 0 }} <span class="fs-6 fw-normal text-muted">đơn hàng</span></h4>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-12">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-warning-subtle text-warning">
                        <BaseIconComponent name="crown" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Gói dịch vụ kích hoạt</div>
                        <h4 class="fw-bold mb-0 text-dark">{{ ordersData?.stats.currentPackage || 'Free' }}</h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Orders Table Card -->
        <div class="bg-white rounded-4 shadow-sm border-0 overflow-hidden mb-4">
            <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0 text-dark d-flex align-items-center">
                    <BaseIconComponent name="file-text" type="lucide" :size="18" class="me-2 text-primary" />
                    Danh sách đơn hàng
                </h6>
                <span class="small text-muted">Cập nhật tự động</span>
            </div>

            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-2">Đang tải lịch sử thanh toán...</p>
            </div>

            <div v-else-if="!ordersData?.orders || ordersData.orders.length === 0" class="text-center py-5">
                <div class="fs-2 mb-2">📜</div>
                <h6 class="fw-bold text-dark">Chưa có giao dịch thanh toán nào</h6>
                <p class="text-muted small">Các đơn hàng mua gói dịch vụ hoặc tính năng sẽ được hiển thị tại đây.</p>
            </div>

            <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th class="ps-4">Mã đơn</th>
                            <th>Gói dịch vụ</th>
                            <th>Thời hạn</th>
                            <th>Phương thức</th>
                            <th>Ngày thanh toán</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th class="text-end pe-4">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in ordersData.orders" :key="order.id">
                            <td class="ps-4">
                                <span class="badge bg-light text-dark border font-monospace">{{ order.code }}</span>
                            </td>
                            <td>
                                <strong class="text-dark">{{ order.packageName }}</strong>
                            </td>
                            <td>
                                <span class="small text-muted">{{ order.duration }}</span>
                            </td>
                            <td>
                                <span class="small text-muted">{{ order.paymentMethod }}</span>
                            </td>
                            <td>
                                <span class="small text-muted">{{ formatDate(order.createdAt) }}</span>
                            </td>
                            <td>
                                <strong class="text-primary">{{ formatCurrency(order.total) }}</strong>
                            </td>
                            <td>
                                <span class="badge bg-success-subtle text-success rounded-pill px-3 py-1">
                                    Thành công
                                </span>
                            </td>
                            <td class="text-end pe-4">
                                <button
                                    type="button"
                                    @click="openReceipt(order)"
                                    class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                >
                                    Hóa đơn
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Receipt Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isReceiptModalOpen">
                <div class="receipt-modal-box p-4 bg-white rounded-4 shadow" style="max-width: 480px; width: 100%;">
                    <div class="text-center pb-3 border-bottom mb-3">
                        <div class="fs-3 mb-1">💍</div>
                        <h5 class="fw-bold mb-1">CINELOVE - WEDDING INVITATION</h5>
                        <div class="small text-muted">Hóa đơn thanh toán dịch vụ</div>
                    </div>

                    <div class="receipt-details mb-3">
                        <div class="d-flex justify-content-between small py-1">
                            <span class="text-muted">Mã đơn hàng:</span>
                            <span class="fw-bold text-dark font-monospace">{{ activeOrder?.code }}</span>
                        </div>
                        <div class="d-flex justify-content-between small py-1">
                            <span class="text-muted">Thời gian:</span>
                            <span class="text-dark">{{ formatDate(activeOrder?.createdAt) }}</span>
                        </div>
                        <div class="d-flex justify-content-between small py-1">
                            <span class="text-muted">Phương thức:</span>
                            <span class="text-dark">{{ activeOrder?.paymentMethod }}</span>
                        </div>
                        <div class="d-flex justify-content-between small py-1">
                            <span class="text-muted">Trạng thái:</span>
                            <span class="badge bg-success-subtle text-success">Đã thanh toán</span>
                        </div>
                    </div>

                    <div class="p-3 bg-light rounded-3 mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <strong class="text-dark">{{ activeOrder?.packageName }}</strong>
                            <strong class="text-primary fs-6">{{ formatCurrency(activeOrder?.total) }}</strong>
                        </div>
                        <div class="small text-muted">Thời hạn sử dụng: {{ activeOrder?.duration }}</div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center pt-2 border-top mb-4">
                        <span class="fw-bold">Tổng thanh toán:</span>
                        <span class="fw-bold fs-5 text-primary">{{ formatCurrency(activeOrder?.total) }}</span>
                    </div>

                    <div class="d-flex gap-2">
                        <button type="button" @click="printReceipt" class="btn btn-outline-primary flex-fill rounded-pill py-2 fw-bold">
                            <BaseIconComponent name="printer" type="lucide" :size="16" class="me-1" />
                            In hóa đơn
                        </button>
                        <button type="button" @click="isReceiptModalOpen = false" class="btn btn-secondary flex-fill rounded-pill py-2">
                            Đóng
                        </button>
                    </div>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>
    </div>
</template>

<style scoped>
.stat-box {
    border: 1px solid #edf2f7;
    transition: 0.2s;
}
.stat-box:hover {
    transform: translateY(-2px);
}
.stat-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
