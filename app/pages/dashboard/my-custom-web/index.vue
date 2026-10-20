<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

// Dữ liệu tóm tắt số lượng website
const websiteStats = [
    { label: 'Tổng website', value: 0, color: 'text-primary' },
    { label: 'Đã xuất bản', value: 0, color: 'text-success' },
    { label: 'Bản nháp', value: 0, color: 'text-danger' }
]

// Định nghĩa các cột cho bảng danh sách
const tableHeaders = [
    { label: 'Website', sortable: false },
    { label: 'Trạng thái', sortable: true },
    { label: 'Ngày tạo', sortable: true },
    { label: 'Ngày hết hạn', sortable: false },
    { label: 'Hành động', sortable: false }
]
</script>

<template>
    <div class="my-website-page dashboard-cover">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <h5 class="fw-bold mb-0 d-flex align-items-center">
                <span class="me-2">🐸</span> Website của tôi
            </h5>
            <button class="btn btn-primary rounded-3 px-3 py-2 fw-bold d-flex align-items-center shadow-sm">
                <BaseIconComponent name="plus" type="lucide" :size="18" class="me-1" color="#fff" />
                Tạo website mới
            </button>
        </div>
        <p class="text-muted small mb-4">Quản lý và theo dõi các website đã tạo</p>

        <div class="card shadow-sm border-0 rounded-3 p-3 mb-4">
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="input-group input-group-sm border rounded-2 overflow-hidden bg-white">
                        <input type="text" class="form-control border-0 py-2 shadow-none"
                            placeholder="Tìm kiếm website...">
                        <span class="input-group-text bg-transparent border-0 pe-3">
                            <BaseIconComponent name="search" type="lucide" :size="16" color="#adb5bd" />
                        </span>
                    </div>
                </div>
                <div class="col-md-3">
                    <select class="form-select form-select-sm border rounded-2 py-2 text-muted shadow-none">
                        <option selected disabled>Chọn trạng thái</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select form-select-sm border rounded-2 py-2 text-muted shadow-none">
                        <option selected disabled>Chọn ngày tạo</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button
                        class="btn btn-outline-secondary btn-sm w-100 py-2 border rounded-2 fw-medium d-flex align-items-center justify-content-center">
                        <BaseIconComponent name="filter" type="lucide" :size="14" class="me-2" />
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-md-4" v-for="stat in websiteStats" :key="stat.label">
                <div class="card shadow-sm border-0 rounded-3 p-4 h-100 text-center">
                    <h3 class="fw-bold mb-1" :class="stat.color">{{ stat.value }}</h3>
                    <span class="small text-secondary fw-medium">{{ stat.label }}</span>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0 rounded-3 overflow-hidden">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-light border-bottom">
                            <tr>
                                <th v-for="header in tableHeaders" :key="header.label"
                                    class="border-0 small fw-bold text-dark py-4 px-4">
                                    <div class="d-flex align-items-center">
                                        {{ header.label }}
                                        <BaseIconComponent v-if="header.sortable" name="chevrons-up-down" type="lucide"
                                            :size="12" class="ms-2 opacity-50" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="5" class="py-5 text-center">
                                    <div class="empty-state-container py-5">
                                        <div class="mb-4 opacity-25">
                                            <BaseIconComponent name="inbox" type="lucide" :size="56" />
                                        </div>
                                        <div class="d-flex flex-column align-items-center">
                                            <span class="text-muted small mb-0 d-inline-flex align-items-center">
                                                Chưa có website nào.
                                                <a href="#" class="text-primary text-decoration-none ms-1 fw-medium">Tạo
                                                    website đầu tiên</a>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-primary {
    background-color: #3b82f6;
    border: none;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #2563eb;
}

/* Kiểu dáng cho thẻ thống kê */
.text-primary {
    color: #3b82f6 !important;
}

.text-success {
    color: #10b981 !important;
}

.text-danger {
    color: #ef4444 !important;
}

/* Tùy chỉnh Table Header */
.table thead th {
    font-size: 13px;
    background-color: #fcfcfc !important;
}

/* Loại bỏ viền xanh khi click input/select của Bootstrap */
.form-control:focus,
.form-select:focus {
    border-color: #e5e7eb;
}

.bg-light {
    background-color: #f9fafb !important;
}

/* Hiệu ứng khi hover vào các hàng của bảng sau này */
.table tbody tr:hover {
    background-color: #fcfcfc;
}

/* Khoảng cách cho Empty State */
.empty-state-container {
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>