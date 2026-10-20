<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import RevenueChart from '~/coms/admin/dash/childs/charts/RevenueChart.vue';
import VisitorsChart from '~/coms/admin/dash/childs/charts/VisitorsChart.vue';

import { ref, onMounted } from 'vue';

definePageMeta({
    layout: 'admin'
})

const stats = ref([
    { title: 'Số lượng thiệp', value: '0', change: '', icon: 'layout', color: 'primary' },
    { title: 'Tổng người dùng', value: '0', change: '', icon: 'users', color: 'success' },
    { title: 'Tổng lượt xem thiệp', value: '0', change: '', icon: 'trending-up', color: 'info' },
    { title: 'Số lượng bài viết', value: '0', change: '', icon: 'file-text', color: 'warning' },
])

const fetchDashboardStats = async () => {
    try {
        const { data, success }: any = await $fetch('/api/v1/admin/dashboard', {
            method: 'GET'
        });

        if (success && data && stats.value) {
            stats.value = [
                { title: 'Số lượng thiệp', value: (data.totalCards || 0).toLocaleString(), change: '', icon: 'layout', color: 'primary' },
                { title: 'Tổng người dùng', value: (data.totalUsers || 0).toLocaleString(), change: '', icon: 'users', color: 'success' },
                { title: 'Tổng lượt xem thiệp', value: (data.totalViews || 0).toLocaleString(), change: '', icon: 'trending-up', color: 'info' },
                { title: 'Số lượng bài viết', value: (data.totalArticles || 0).toLocaleString(), change: '', icon: 'file-text', color: 'warning' },
            ];
        }
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
    }
}

onMounted(() => {
    fetchDashboardStats();
})

const quickActions = [
    { title: 'Tạo mẫu thiệp', icon: 'layout', color: 'primary', link: '/admin/card-templates/create' },
    { title: 'Tạo bài viết', icon: 'file-plus', color: 'success', link: '/admin/articles/create' },
    { title: 'Tạo danh mục', icon: 'folder-plus', color: 'warning', link: '/admin/categories/create' },
    { title: 'Cấu hình', icon: 'settings', color: 'info', link: '/admin/settings/list' },
]

const recentOrders = [
    { id: '#9875', product: 'Modern Desk Lamp', client: 'John Doe', price: '$45.99', status: 'Shipped', statusColor: 'success' },
    { id: '#9874', product: 'Vintage Chair', client: 'Jane Smith', price: '$99.00', status: 'Processing', statusColor: 'warning' },
    { id: '#9873', product: 'Wireless Keyboard', client: 'Bob Johnson', price: '$29.99', status: 'Cancelled', statusColor: 'danger' },
    { id: '#9872', product: 'Bluetooth Speaker', client: 'Alice Brown', price: '$65.00', status: 'Shipped', statusColor: 'success' },
]

const brands = [
    { name: 'TechNova', country: 'Germany', sales: '1,200', active: true },
    { name: 'DecoLux', country: 'France', sales: '450', active: false },
    { name: 'InnovTech', country: 'Japan', sales: '650', active: true },
]
</script>

<template>
    <div class="container-fluid p-3 p-md-4">
        <!-- Stats Row -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-xl-3" v-for="(stat, index) in stats" :key="index">
                <div class="card h-100 border-0 shadow-sm stat-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-muted text-uppercase mb-0">{{ stat.title }}</h6>
                            <div class="icon-shape rounded-circle d-flex align-items-center justify-content-center"
                                :class="`bg-${stat.color}-subtle text-${stat.color}`">
                                <BaseIconComponent :name="stat.icon" type="lucide" :size="20" />
                            </div>
                        </div>
                        <h3 class="fw-bold mb-1">{{ stat.value }}</h3>
                        <span class="small fw-bold text-success" v-if="stat.change">
                            {{ stat.change }} <span class="text-muted fw-normal"> Since last month</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions Row -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-xl-3" v-for="(action, index) in quickActions" :key="index">
                <a :href="action.link" class="text-decoration-none">
                    <div class="card h-100 border-0 shadow-sm hover-scale">
                        <div class="card-body d-flex align-items-center">
                            <div class="icon-shape rounded-circle d-flex align-items-center justify-content-center me-3"
                                :class="`bg-${action.color}-subtle text-${action.color}`"
                                style="width: 48px; height: 48px;">
                                <BaseIconComponent :name="action.icon" type="lucide" :size="24" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-body">{{ action.title }}</h6>
                                <small class="text-muted">Nhấn để thực hiện</small>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>


        <!-- Revenue Chart -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div
                        class="card-header bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 fw-bold">Biểu đồ doanh thu</h5>
                        <select class="form-select w-auto form-select-sm">
                            <option>Năm 2024</option>
                            <option>Năm 2023</option>
                        </select>
                    </div>
                    <div class="card-body">
                        <RevenueChart />
                    </div>
                </div>
            </div>
        </div>


        <!-- Number of Visitors Chart -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card border-0 shadow-sm">
                    <div
                        class="card-header bg-transparent border-0 pt-3 d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 fw-bold">Số lượng người truy cập</h5>
                        <select class="form-select w-auto form-select-sm">
                            <option>7 ngày qua</option>
                            <option>Tháng này</option>
                            <option>Tháng trước</option>
                        </select>
                    </div>
                    <div class="card-body">
                        <VisitorsChart />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* Cards & Widgets */
.card {
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-2px);
}

.stat-card .icon-shape {
    width: 48px;
    height: 48px;
}

/* Tables */
.table {
    color: var(--text-primary);
    --bs-table-bg: transparent;
}

.table thead th {
    background-color: rgba(0, 0, 0, 0.02);
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
}

/* We need to refer to .dark-mode which is on a parent. 
   Since scoped styles are isolated, we use :deep() or rely on the fact that variables handle colors.
   However, this specific rule uses a direct background color. 
   We can use :global() or :deep() if the class is on body/parent.
   The class .dark-mode is on the layout wrapper, which is a parent of this page.
   So we need :deep() or just rely on global styles. 
   For now, strictly speaking, scoped styles can't restrict parent selector easily without :global.
   But we can use a CSS variable for the table header bg.
*/

.table thead th {
    /* fallback */
    background-color: rgba(0, 0, 0, 0.02);
}

/* Better approach: Use CSS variable for this in layout? 
   For now, I'll attempt to use :global(.dark-mode) .table thead th to target it if possible,
   or just assume variables are better. 
   Let's use a variable approach or just :deep for specificity if supported.
*/

.avatar-sm {
    width: 32px;
    height: 32px;
}

/* Utilities */
.text-muted {
    color: var(--text-muted) !important;
}

.bg-primary-subtle {
    background-color: rgba(59, 130, 246, 0.1);
}

.bg-success-subtle {
    background-color: rgba(16, 185, 129, 0.1);
}

.bg-danger-subtle {
    background-color: rgba(239, 68, 68, 0.1);
}

.bg-warning-subtle {
    background-color: rgba(245, 158, 11, 0.1);
}

.bg-info-subtle {
    background-color: rgba(6, 182, 212, 0.1);
}

.cursor-pointer {
    cursor: pointer;
}

.hover-scale {
    transition: transform 0.2s ease;
}

.hover-scale:hover {
    transform: translateY(-3px);
}
</style>