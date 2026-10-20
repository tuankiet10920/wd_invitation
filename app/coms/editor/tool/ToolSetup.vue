<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editorStore = useEditorStore();

const { data: categoryResponse } = useFetch('/api/v1/client/category-wedding-cards');
const categories = computed(() => (categoryResponse.value as any)?.data || []);

const { data: packageResponse } = useFetch('/api/v1/client/packages');
const packages = computed(() => (packageResponse.value as any)?.data?.data || []);
const selectedPackage = computed(() => packages.value.find((p: any) => p.id === editorStore.id_package));

watch(packages, (newPkgs) => {
    if (newPkgs.length > 0 && editorStore.id_package === null) {
        editorStore.id_package = newPkgs[0].id;
    }
}, { immediate: true });

const expirationDetails = computed(() => {
    const createdAt = editorStore.createdAt ? new Date(editorStore.createdAt) : new Date();
    let timeSaveCard = selectedPackage.value?.time_save_card || editorStore.package_time_save_card || 6; // Default to 6 months if not found
    timeSaveCard = timeSaveCard * 30; // convert months to days

    const expiryDate = new Date(createdAt.getTime());
    expiryDate.setDate(createdAt.getDate() + timeSaveCard);

    const today = new Date();

    // Remaining time
    const remainingTime = expiryDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 3600 * 24));

    // Passed time
    const passedTime = today.getTime() - createdAt.getTime();
    const passedDays = Math.floor(passedTime / (1000 * 3600 * 24)) + 1; // +1 as requested

    // Percentage
    let percentage = (passedDays / timeSaveCard) * 100;
    if (percentage > 100) percentage = 100;
    if (percentage < 0) percentage = 0;

    return {
        remainingDays: remainingDays > 0 ? remainingDays : 0,
        percentage: Math.round(percentage),
        createdAtStr: createdAt.toLocaleDateString('vi-VN'),
        expiryDateStr: expiryDate.toLocaleDateString('vi-VN'),
        isExpired: remainingDays <= 0,
        timeSaveCard
    };
});

const handleEditClick = () => {
    editorStore.showSettingModal = true;
    if (import.meta.client) {
        window.dispatchEvent(new CustomEvent('close-tool-setup'));
    }
};
</script>
<template>
    <!-- Category -->
    <div class="mb-4">
        <label class="form-label fw-bold text-dark mb-2" style="font-size: 14px;">Danh mục <span
                class="text-danger">*</span></label>
        <select v-model="editorStore.id_category_wedding_card" class="form-select shadow-none text-dark"
            :class="editorStore.categoryError ? 'border-danger bg-danger-subtle bg-opacity-10' : 'border-secondary-subtle'"
            style="font-size: 14px;" @change="editorStore.categoryError = false">
            <option :value="null">Danh mục</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
            </option>
        </select>
        <div v-if="editorStore.categoryError" class="text-danger mt-1 fw-medium" style="font-size: 13px;">
            <BaseIconComponent name="alert-circle" type="lucide" :size="14" class="me-1" />
            Bạn chưa chọn danh mục, bắt buộc chọn để Lưu!
        </div>
    </div>

    <!-- Package Selection -->
    <div class="mb-4" v-if="editorStore.role === 'admin'">
        <label class="form-label fw-bold text-dark mb-2" style="font-size: 14px;">Gói dịch vụ <span
                class="text-danger">*</span></label>
        <select v-model="editorStore.id_package" class="form-select border-secondary-subtle shadow-none text-dark"
            style="font-size: 14px;">
            <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                {{ pkg.name }}
            </option>
        </select>
        <p class="text-secondary m-0 mt-1 lh-base" style="font-size: 13px;">
            Áp dụng các giới hạn và tính năng theo gói đã chọn.
        </p>
    </div>

    <!-- Status -->
    <div class="mb-4">
        <label class="form-label fw-bold text-dark mb-2" style="font-size: 14px;">Trạng thái</label>
        <select v-model="editorStore.is_publish" class="form-select border-secondary-subtle shadow-none text-dark mb-2"
            style="font-size: 14px;">
            <option :value="true">Công khai</option>
            <option :value="false">Nháp</option>
        </select>
        <p class="text-secondary m-0 lh-base" style="font-size: 13px;">
            Chỉ khi ở trạng thái "Công khai", trang mới có thể xem được từ URL của trang.
        </p>
    </div>

    <!-- IS_TEMPLATE -->
    <div class="mb-4" v-if="editorStore.role === 'admin'">
        <div class="d-flex justify-content-between align-items-center">
            <label class="form-label fw-bold text-dark m-0" style="font-size: 14px;">Đặt làm mẫu thiệp (gốc)</label>
            <div class="form-check form-switch m-0">
                <input v-model="editorStore.is_template" class="form-check-input" type="checkbox" role="switch"
                    style="cursor: pointer; width: 40px; height: 20px;">
            </div>
        </div>
        <p class="text-secondary m-0 mt-1 lh-base" style="font-size: 13px;">
            Khi bật, thiệp sẽ nằm trong danh sách Mẫu thiệp dùng để khách hàng chọn thiết kế.
        </p>
    </div>

    <!-- IS_TEMPLATE_USER -->
    <div class="mb-4" v-if="editorStore.role === 'admin'">
        <div class="d-flex justify-content-between align-items-center">
            <label class="form-label fw-bold text-dark m-0" style="font-size: 14px;">Chia sẻ mẫu thiệp (User)</label>
            <div class="form-check form-switch m-0">
                <input v-model="editorStore.is_template_user" class="form-check-input" type="checkbox" role="switch"
                    style="cursor: pointer; width: 40px; height: 20px;">
            </div>
        </div>
        <p class="text-secondary m-0 mt-1 lh-base" style="font-size: 13px;">
            Cho phép trang này xuất hiện trong thư viện thiệp mẫu thực tế để người dùng khác tham khảo.
        </p>
    </div>

    <!-- Preview -->
    <div class="mb-2 d-flex justify-content-between align-items-center">
        <label class="form-label fw-bold text-dark m-0" style="font-size: 14px;">Bản xem trước</label>
        <button class="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3 py-1"
            style="background-color: #3b82f6; border-color: #3b82f6;" @click="handleEditClick">
            <BaseIconComponent name="pen-new-square-linear" type="solar" :size="14" color="#fff" />
            <span style="font-size: 13px;">Chỉnh sửa</span>
        </button>
    </div>

    <!-- IMAGE -->
    <div class="preview-card border rounded-3 overflow-hidden mb-3">
        <div class="preview-image bg-dark" style="height: 160px; width: 100%;">
            <img :src="editorStore.avatar ? `${editorStore.avatar}?t=${editorStore.avatarCacheBuster || 0}` : ''"
                class="w-100 h-100 object-fit-cover" v-if="editorStore.avatar" />
        </div>
        <div class="p-3 bg-white">
            <h6 class="fw-bold mb-0 text-dark" style="font-size: 14px;">Trang mới - {{ expirationDetails.createdAtStr }}
            </h6>
        </div>
    </div>

    <p class="text-secondary m-0 lh-base" style="font-size: 13px;">
        Đây là cách trang của bạn sẽ hiển thị khi được chia sẻ trên Facebook, Zalo, Messenger hoặc các mạng xã hội
        khác.
    </p>

    <!-- Page Expiration -->
    <div class="mb-4 mt-2">
        <label class="form-label fw-bold text-dark mb-2" style="font-size: 14px;">Thời hạn trang</label>
        <div class="border border-secondary-subtle rounded-3 p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="rounded-circle" :class="expirationDetails.isExpired ? 'bg-danger' : 'bg-primary'"
                        style="width: 8px; height: 8px;"></span>
                    <span class="fw-bold" style="font-size: 14px; color: #b45309;"
                        v-if="!expirationDetails.isExpired">Còn {{ expirationDetails.remainingDays }} ngày</span>
                    <span class="fw-bold" style="font-size: 14px; color: #dc2626;" v-else>Đã hết hạn</span>
                </div>
                <span class="text-secondary" style="font-size: 14px;">{{ expirationDetails.percentage }}%</span>
            </div>

            <div class="progress mb-3" style="height: 6px;">
                <div class="progress-bar" role="progressbar"
                    :style="{ width: expirationDetails.percentage + '%', backgroundColor: expirationDetails.isExpired ? '#dc2626' : '#d97706' }"
                    :aria-valuenow="expirationDetails.percentage" aria-valuemin="0" aria-valuemax="100"></div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3 text-secondary" style="font-size: 12px;">
                <span>Ngày tạo: {{ expirationDetails.createdAtStr }}</span>
                <span>Hết hạn: {{ expirationDetails.expiryDateStr }}</span>
            </div>

            <div class="bg-secondary-subtle bg-opacity-10 rounded p-3 mb-0" style="background-color: #f8f9fa;">
                <p class="mb-3 text-secondary lh-base" style="font-size: 13px;" v-if="!selectedPackage">
                    Vui lòng chọn gói dịch vụ để xem thông tin thời hạn. Thông thường gói Free có thời hạn 6 tháng.
                </p>
                <p class="mb-3 text-secondary lh-base" style="font-size: 13px;" v-else>
                    Gói <strong>{{ selectedPackage.name }}</strong> có thời hạn {{ selectedPackage.time_save_card || 0
                    }} tháng.
                    Cho phép tối đa {{ selectedPackage.image_limits || 0 }} ảnh và {{ selectedPackage.maximum_views || 0
                    }} lượt xem.
                </p>
                <button class="btn btn-primary btn-sm text-white border-0 fw-medium"
                    style="background-color: #3b82f6; font-size: 14px; padding: 6px 16px;"
                    @click="navigateTo('/pricing-plans')">Xem các gói</button>
            </div>
        </div>
    </div>

    <!-- Card Library -->
    <div class="card-library">
        <label class="form-label fw-bold text-dark mb-2" style="font-size: 14px;">Thư viện thiệp</label>
        <div class="d-flex justify-content-between align-items-start mb-2">
            <p class="text-secondary m-0 lh-base pe-2" style="font-size: 13px;">
                Cho phép trang này có thể xuất hiện trong thư viện thiệp mẫu của CineLove để người dùng khác có thể
                xem và chiêm ngưỡng.
            </p>
            <div class="form-check form-switch m-0">
                <input class="form-check-input" type="checkbox" role="switch" checked
                    style="cursor: pointer; width: 40px; height: 20px; border-color: #3b82f6; background-color: #3b82f6;">
            </div>
        </div>
        <div class="bg-secondary-subtle bg-opacity-10 rounded p-3" style="background-color: #f8f9fa;">
            <p class="m-0 text-secondary lh-base" style="font-size: 13px;">
                Khi hiển thị trong thư viện, link sẽ được mã hóa và chỉ cho phép xem, không thể thao tác trực tiếp
                với thiệp.
            </p>
        </div>
    </div>
</template>
<style scoped></style>