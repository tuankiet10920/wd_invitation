<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'dashboard'
});

const bankAccountsData = ref<{
    bankAccounts: any[];
    cards: any[];
} | null>(null);

const isLoading = ref(true);

const fetchBankAccounts = async () => {
    isLoading.value = true;
    try {
        const res = await $fetch<any>('/api/v1/client/bank-accounts');
        if (res.success && res.data) {
            bankAccountsData.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch bank accounts:', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchBankAccounts();
});

const copyAccount = (accNo: string) => {
    if (!accNo) return;
    navigator.clipboard.writeText(accNo).then(() => {
        alert(`Đã sao chép số tài khoản: ${accNo}`);
    }).catch(() => {
        alert(`Số tài khoản: ${accNo}`);
    });
};

// Modal Add Account
const isAddModalOpen = ref(false);
const newLabel = ref('Cô dâu');
const newReceiverName = ref('');
const newBankName = ref('Vietcombank');
const newAccountNumber = ref('');
const newCardId = ref('');
const qrMode = ref<'auto' | 'upload'>('auto');
const uploadedQrBase64 = ref('');
const isSubmitting = ref(false);

const handleFileUpload = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        uploadedQrBase64.value = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const handleAddAccount = async () => {
    if (!newReceiverName.value || !newBankName.value || !newAccountNumber.value) {
        alert('Vui lòng điền đầy đủ thông tin tài khoản!');
        return;
    }

    try {
        isSubmitting.value = true;
        const res = await $fetch<any>('/api/v1/client/bank-accounts', {
            method: 'POST',
            body: {
                name: newLabel.value,
                receiverName: newReceiverName.value,
                bankName: newBankName.value,
                accountNumber: newAccountNumber.value,
                cardId: newCardId.value || undefined,
                image: qrMode.value === 'upload' ? uploadedQrBase64.value : undefined
            }
        });

        if (res.success) {
            alert('Thêm tài khoản ngân hàng thành công!');
            isAddModalOpen.value = false;
            newReceiverName.value = '';
            newAccountNumber.value = '';
            uploadedQrBase64.value = '';
            fetchBankAccounts();
        } else {
            alert(res.message || 'Thêm tài khoản thất bại');
        }
    } catch (e: any) {
        alert(e.data?.message || 'Có lỗi xảy ra khi thêm tài khoản');
    } finally {
        isSubmitting.value = false;
    }
};

// Delete account
const handleDeleteAccount = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông tin tài khoản này khỏi thiệp?')) return;

    try {
        const res = await $fetch<any>(`/api/v1/client/bank-accounts/${id}`, {
            method: 'DELETE'
        });
        if (res.success) {
            alert('Đã xóa tài khoản thành công!');
            fetchBankAccounts();
        } else {
            alert(res.message || 'Xóa thất bại');
        }
    } catch (e: any) {
        alert(e.data?.message || 'Lỗi khi xóa tài khoản');
    }
};

// Zoom QR Modal
const isZoomModalOpen = ref(false);
const zoomQrUrl = ref('');
const zoomAccountInfo = ref<any>(null);

const openZoomQr = (acc: any) => {
    zoomAccountInfo.value = acc;
    zoomQrUrl.value = acc.qrCodeUrl;
    isZoomModalOpen.value = true;
};
</script>

<template>
    <div class="bank-accounts-page dashboard-cover">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <ButtonReturnMobileComponent />
                    <h4 class="fw-bold mb-0 d-flex align-items-center">
                        <span class="me-2">🏦</span> Tài khoản ngân hàng
                    </h4>
                </div>
                <p class="text-muted small mb-0">Quản lý mã QR và số tài khoản nhận tiền mừng trực tiếp từ khách mời</p>
            </div>
            <button
                @click="isAddModalOpen = true"
                class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center"
            >
                <BaseIconComponent name="plus" type="lucide" :size="16" class="me-2" />
                Thêm tài khoản mới
            </button>
        </div>

        <!-- Tip Box -->
        <div class="card border-0 rounded-4 shadow-sm p-4 mb-4" style="background: linear-gradient(135deg, #f0f7ff 0%, #e6f0fa 100%);">
            <div class="d-flex align-items-start gap-3">
                <span class="fs-3">💡</span>
                <div>
                    <h6 class="fw-bold text-dark mb-1">Mẹo nhận tiền mừng tiện lợi</h6>
                    <p class="small text-muted mb-0">
                        Hệ thống tự động liên kết tài khoản ngân hàng của bạn vào thiệp online dưới dạng mã VietQR chuẩn quốc gia.
                        Khách mời chỉ cần quét mã bằng bất kỳ ứng dụng ngân hàng nào để chuyển khoản mừng cưới siêu nhanh chóng.
                    </p>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-2">Đang tải danh sách tài khoản ngân hàng...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!bankAccountsData?.bankAccounts || bankAccountsData.bankAccounts.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm p-4">
            <div class="fs-1 mb-2">💳</div>
            <h5 class="fw-bold text-dark">Chưa có tài khoản ngân hàng nào</h5>
            <p class="text-muted small mb-4">Hãy thêm tài khoản ngân hàng và mã QR của Cô dâu / Chú rể để hiển thị trong mục mừng cưới của thiệp online.</p>
            <button
                @click="isAddModalOpen = true"
                class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
            >
                Thêm tài khoản đầu tiên
            </button>
        </div>

        <!-- Bank Accounts Grid -->
        <div v-else class="row g-4">
            <div
                v-for="acc in bankAccountsData.bankAccounts"
                :key="acc.id"
                class="col-md-6 col-lg-4"
            >
                <div class="card bank-account-card border-0 rounded-4 shadow-sm h-100 overflow-hidden bg-white d-flex flex-column justify-content-between">
                    <div>
                        <!-- Card Top Bar -->
                        <div class="card-top-bar p-3 d-flex justify-content-between align-items-center" style="background-color: #2b3a4a; color: white;">
                            <span class="badge bg-white text-dark fw-bold rounded-pill px-3 py-1">
                                {{ acc.name }}
                            </span>
                            <span class="small opacity-75">{{ acc.bankName }}</span>
                        </div>

                        <!-- Card Body -->
                        <div class="p-4 text-center">
                            <!-- QR code thumbnail -->
                            <div
                                @click="openZoomQr(acc)"
                                class="qr-thumbnail-box mx-auto mb-3 rounded-3 p-2 bg-light shadow-sm cursor-pointer position-relative"
                                style="width: 140px; height: 140px;"
                                title="Nhấn để phóng to mã QR"
                            >
                                <img :src="acc.qrCodeUrl" :alt="acc.bankName" class="w-100 h-100 object-fit-contain" />
                                <div class="qr-hover-overlay d-flex align-items-center justify-content-center">
                                    <BaseIconComponent name="maximize-2" type="lucide" :size="20" color="#fff" />
                                </div>
                            </div>

                            <h6 class="fw-bold text-dark mb-1 fs-5">{{ acc.receiverName }}</h6>

                            <!-- Account number with copy button -->
                            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border mt-2">
                                <span class="fw-bold font-monospace text-primary fs-6">{{ acc.accountNumber }}</span>
                                <button
                                    type="button"
                                    @click="copyAccount(acc.accountNumber)"
                                    class="btn btn-sm btn-link p-0 text-secondary"
                                    title="Sao chép số tài khoản"
                                >
                                    <BaseIconComponent name="copy" type="lucide" :size="15" />
                                </button>
                            </div>

                            <div class="small text-muted mt-3">
                                Thiệp liên kết: <strong class="text-dark">{{ acc.cardName }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Card Actions Footer -->
                    <div class="p-3 border-top bg-light-subtle d-flex justify-content-between align-items-center">
                        <button
                            type="button"
                            @click="openZoomQr(acc)"
                            class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold"
                        >
                            <BaseIconComponent name="qr-code" type="lucide" :size="14" class="me-1" />
                            Mã QR
                        </button>
                        <button
                            type="button"
                            @click="handleDeleteAccount(acc.id)"
                            class="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                        >
                            <BaseIconComponent name="trash-2" type="lucide" :size="14" class="me-1" />
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isAddModalOpen">
                <div class="p-4" style="max-width: 480px; width: 100%;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="fw-bold mb-0">Thêm tài khoản ngân hàng</h5>
                        <button type="button" class="btn-close" @click="isAddModalOpen = false"></button>
                    </div>

                    <form @submit.prevent="handleAddAccount">
                        <div class="mb-3">
                            <label class="form-label small fw-bold">Gắn với thiệp cưới</label>
                            <select v-model="newCardId" class="form-select">
                                <option value="">Mặc định (áp dụng thiệp gần nhất)</option>
                                <option v-for="c in bankAccountsData?.cards" :key="c.id" :value="c.id">
                                    {{ c.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Danh xưng / Nhãn hiển thị</label>
                            <select v-model="newLabel" class="form-select">
                                <option value="Cô dâu">Cô dâu</option>
                                <option value="Chú rể">Chú rể</option>
                                <option value="Bố cô dâu">Bố cô dâu</option>
                                <option value="Mẹ cô dâu">Mẹ cô dâu</option>
                                <option value="Bố chú rể">Bố chú rể</option>
                                <option value="Mẹ chú rể">Mẹ chú rể</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Ngân hàng</label>
                            <select v-model="newBankName" class="form-select" required>
                                <option value="Vietcombank">Vietcombank</option>
                                <option value="MBBank">MBBank (Ngân hàng Quân Đội)</option>
                                <option value="Techcombank">Techcombank</option>
                                <option value="ACB">ACB (Á Châu)</option>
                                <option value="VPBank">VPBank</option>
                                <option value="BIDV">BIDV</option>
                                <option value="VietinBank">VietinBank</option>
                                <option value="TPBank">TPBank</option>
                                <option value="Agribank">Agribank</option>
                                <option value="Sacombank">Sacombank</option>
                                <option value="VIB">VIB</option>
                                <option value="HDBank">HDBank</option>
                                <option value="Khác">Ngân hàng khác</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Số tài khoản</label>
                            <input
                                v-model="newAccountNumber"
                                type="text"
                                class="form-control"
                                placeholder="Nhập số tài khoản ngân hàng"
                                required
                            />
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Tên chủ tài khoản (in hoa không dấu)</label>
                            <input
                                v-model="newReceiverName"
                                type="text"
                                class="form-control text-uppercase"
                                placeholder="VD: NGUYEN THI B"
                                required
                            />
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold d-block">Tạo mã QR</label>
                            <div class="form-check form-check-inline mb-2">
                                <input class="form-check-input" type="radio" v-model="qrMode" id="qrAuto" value="auto">
                                <label class="form-check-label small" for="qrAuto">Tự động tạo VietQR theo số tài khoản</label>
                            </div>
                            <div class="form-check form-check-inline mb-2">
                                <input class="form-check-input" type="radio" v-model="qrMode" id="qrUpload" value="upload">
                                <label class="form-check-label small" for="qrUpload">Tải ảnh QR riêng</label>
                            </div>
                            <div v-if="qrMode === 'upload'" class="mt-2">
                                <input type="file" accept="image/*" class="form-control form-control-sm" @change="handleFileUpload" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm"
                        >
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                            Lưu tài khoản
                        </button>
                    </form>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>

        <!-- Zoom QR Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="isZoomModalOpen">
                <div class="p-4 text-center" style="max-width: 360px;">
                    <span class="badge bg-primary rounded-pill px-3 py-1 mb-2">{{ zoomAccountInfo?.name }}</span>
                    <h5 class="fw-bold text-dark mb-1">{{ zoomAccountInfo?.receiverName }}</h5>
                    <p class="small text-muted mb-3">{{ zoomAccountInfo?.bankName }} - {{ zoomAccountInfo?.accountNumber }}</p>

                    <div class="p-3 bg-white rounded-4 shadow-sm border mx-auto mb-3" style="width: 250px; height: 250px;">
                        <img :src="zoomQrUrl" class="w-100 h-100 object-fit-contain" alt="QR Code" />
                    </div>

                    <button
                        type="button"
                        @click="copyAccount(zoomAccountInfo?.accountNumber)"
                        class="btn btn-outline-primary btn-sm rounded-pill px-3 me-2"
                    >
                        <BaseIconComponent name="copy" type="lucide" :size="14" class="me-1" />
                        Sao chép số TK
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm rounded-pill px-3" @click="isZoomModalOpen = false">
                        Đóng
                    </button>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>
    </div>
</template>

<style scoped>
.bank-account-card {
    border: 1px solid #edf2f7;
    transition: 0.2s;
}
.bank-account-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
}
.qr-thumbnail-box {
    overflow: hidden;
}
.qr-hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    opacity: 0;
    transition: 0.2s;
}
.qr-thumbnail-box:hover .qr-hover-overlay {
    opacity: 1;
}
</style>
