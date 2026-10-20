<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import type { IconType } from "~~/interfaces"
import { useUserStore } from '~~/stores/user';

definePageMeta({
    layout: 'dashboard'
})

const store = useUserStore();

const myPlanData = ref<any>(null)

const fetchMyPlan = async () => {
    try {
        const response = await $fetch<any>('/api/v1/client/my-plan')
        if (response.success) myPlanData.value = response.data
    } catch (error) {
        console.error('Failed to fetch my plan:', error)
    }
}

fetchMyPlan()

// Thống kê sử dụng từ API
const stats = computed(() => {
    if (!myPlanData.value) return []
    const d = myPlanData.value

    const websitePercent = Math.min(100, ((d.currentWebsites || 0) / (d.number_of_cards || 1)) * 100)
    const imagePercent = Math.min(100, ((d.currentImages || 0) / (d.image_limits || 1)) * 100)
    const viewPercent = Math.min(100, ((d.currentViews || 0) / (d.maximum_views || 1)) * 100)

    return [
        { name: 'Website', current: d.currentWebsites || 0, max: d.number_of_cards || 0, icon: 'globe', iconColor: '#3b82f6', barColor: '#f97316', percent: websitePercent, limit: `${d.number_of_cards} trang` },
        { name: 'Hình ảnh', current: d.currentImages || 0, max: d.image_limits || 0, icon: 'image', iconColor: '#10b981', barColor: '#10b981', percent: imagePercent, limit: `${d.image_limits} hình ảnh` },
        { name: 'Lượt xem', current: d.currentViews || 0, max: d.maximum_views || 0, icon: 'eye', iconColor: '#8b5cf6', barColor: '#adb5bd', percent: viewPercent, limit: `${d.maximum_views.toLocaleString('en-US')} lượt xem` }
    ]
})

interface Tool {
    label: string
    icon: string
    type: IconType
    color: string
    to: string
}

// Dữ liệu mẫu cho công cụ phổ biến
const tools: Tool[] = [
    { label: 'Trang chủ', icon: 'home', type: 'lucide', color: '#ff6b6b', to: '/' },
    { label: 'Mẫu thiết kế', icon: 'edit-3', type: 'lucide', color: '#a29bfe', to: '/dashboard/pages' },
    { label: 'Mẫu yêu thích', icon: 'heart', type: 'lucide', color: '#fd79a8', to: '/favorites' },
    { label: 'Thiệp thực tế', icon: 'image', type: 'lucide', color: '#74b9ff', to: '/dashboard/coming-soon' },
    { label: 'Dịch vụ của tôi', icon: 'crown', type: 'lucide', color: '#fab1a0', to: '/dashboard/my-plan' },
    { label: 'Chương trình quà tặng', icon: 'gift', type: 'lucide', color: '#ff7675', to: '/dashboard/gifts-overview' },
    { label: 'Website khác', icon: 'layout', type: 'lucide', color: '#55efc4', to: '/dashboard/my-custom-web' },
    { label: 'Gói dịch vụ', icon: 'zap', type: 'lucide', color: '#81ecec', to: '/dashboard/my-plan' },
]

const _tools: Tool[] = [
    { label: 'Hỗ trợ', icon: 'headphones', type: 'lucide', color: '#0984e3', to: '/dashboard/coming-soon' },
    { label: 'Đóng góp ý kiến', icon: 'message-square', type: 'lucide', color: '#00b894', to: '/dashboard/feedback' },
    { label: 'Hướng dẫn', icon: 'play-circle', type: 'lucide', color: '#ff7675', to: '/dashboard/coming-soon' },
    { label: 'Tài khoản', icon: 'user', type: 'lucide', color: '#6c5ce7', to: '/dashboard/profile' }
]

interface QuickIcon {
    label: string
    icon: string
    type: IconType
    to: string
}

const quickIcons: QuickIcon[] = [
    { label: 'Lời chúc', icon: 'message-circle', type: 'lucide', to: '/dashboard/blessing-box' },
    { label: 'Quà tặng', icon: 'gift', type: 'lucide', to: '/dashboard/gifts-overview' },
    { label: 'Tham dự', icon: 'calendar', type: 'lucide', to: '/dashboard/coming-soon' },
    { label: 'Ví & Xu', icon: 'wallet', type: 'lucide', to: '/dashboard/coming-soon' }
]
</script>
<template>
    <div class="dashboard-cover dashboard-content">
        <!-- INFORMATION -->
        <div class="shadow-sm dashboard-info border-0 p-4 mb-4">
            <div class="d-flex align-items-center">
                <div class="avatar-large me-3 shadow-sm overflow-hidden p-0">
                    <NuxtImg :src="store.image || '/others/logo.svg'" class="w-100 h-100 object-fit-cover" />
                </div>
                <div>
                    <h5 class="fw-bold mb-0">{{ store.name }}</h5>
                    <p class="text-muted dashboard-email mb-0">{{ store.email }}</p>
                </div>
            </div>
            <div class="mt-3" style="width: fit-content;">
                <span
                    class="badge current-package text-dark py-2 px-3 fw-normal rounded-pill d-flex align-items-center">
                    <span class="me-1" v-if="myPlanData?.name == 'Premium'">💎</span>
                    <span class="fw-bold">{{ myPlanData?.name || 'Free' }}</span> <a
                        v-if="myPlanData?.name != 'Premium'" href="#"
                        class="text-primary text-decoration-none ms-1">Nâng
                        cấp →</a>
                </span>
            </div>
        </div>
        <div class="mt-4 text-center d-flex flex-jb-ac bg-white py-3 mb-4">
            <div class="quick-icon" v-for="(ico, index) in quickIcons" :key="index" @click="navigateTo(ico.to)">
                <div class="quick-icon-wrapper mb-2 mx-auto cursor-pointer">
                    <BaseIconComponent :name="ico.icon" :type="ico.type" :size="20" color="#ff7675" />
                </div>
                <span class="small-text">{{ ico.label }}</span>
            </div>
        </div>

        <div class="bg-white p-3 p-md-4 mb-3 rounded-4 shadow-sm">
            <h6 class="fw-bold mb-3 d-flex align-items-center text-dark">
                <BaseIconComponent name="bar-chart-2" type="lucide" :size="18" class="me-2 text-success" />
                Thống kê sử dụng
            </h6>
            <div class="row g-2 g-md-3">
                <div class="col-4" v-for="stat in stats" :key="stat.name">
                    <div class="info-usage rounded-4 p-2 p-md-3 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="iu-first d-flex align-items-center gap-1 gap-md-2 mb-2 overflow-hidden">
                                <BaseIconComponent class="iu-icon" :name="stat.icon" type="lucide" :size="25"
                                    :color="stat.iconColor" />
                                <span class="iu-text text-dark text-nowrap">{{ stat.name
                                }}</span>
                            </div>
                            <div class="usage-content">
                                <div class="fw-bold text-dark lh-1 uc-text-first">{{
                                    stat.current.toLocaleString() }}</div>
                                <div class="uc-text-second">/ {{ stat.max.toLocaleString() }}</div>
                            </div>
                        </div>
                        <div class="progress progress-uc"
                            style="height: 7px; border-radius: 15px; background-color: #e9ecef;">
                            <div class="progress-bar"
                                :style="{ width: stat.percent + '%', backgroundColor: stat.barColor }"></div>
                        </div>
                        <div class="limit-uc">
                            Giới hạn: {{ stat.limit }}
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div
            class="upgrade-banner p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between cursor-pointer shadow-sm">
            <div class="d-flex align-items-center">
                <div class="rocket-icon me-3">🚀</div>
                <div>
                    <h6 class="upgrade-banner-text mb-0 fw-bold">Nâng cấp giới hạn</h6>
                    <p class="upgrade-banner-small mb-0 small text-muted">Mở rộng giới hạn sử dụng của bạn</p>
                </div>
            </div>
            <BaseIconComponent name="chevron-right" type="lucide" :size="18" color="#adb5bd" />
        </div>

        <div class="bg-white p-4 mb-3 rounded-4 shadow-sm">
            <h5 class="fw-bold mb-4 text-dark">Công cụ phổ biến</h5>
            <div class="card border-0">
                <div class="row g-3 g-md-4 text-center">
                    <div class="col-3" v-for="tool in tools" :key="tool.label" @click="navigateTo(tool.to)">
                        <div class="tool-item">
                            <div class="cursor-pointer">
                                <div
                                    class="tool-icon-wrapper item-icon mb-2 mx-auto d-flex align-items-center justify-content-center">
                                    <BaseIconComponent :name="tool.icon" :type="tool.type" :size="24"
                                        :color="tool.color" />
                                </div>
                                <div class="tool-item-text fw-medium text-dark lh-sm">{{
                                    tool.label }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 mb-4 rounded-4 shadow-sm">
            <div class="row g-3 g-md-4 text-center">
                <div class="col-3" v-for="tool in _tools" :key="tool.label" @click="navigateTo(tool.to)">
                    <div class="tool-item">
                        <div class="cursor-pointer">
                            <div
                                class="tool-icon-wrapper item-icon mb-2 mx-auto d-flex align-items-center justify-content-center">
                                <BaseIconComponent :name="tool.icon" :type="tool.type" :size="24" :color="tool.color" />
                            </div>
                            <div class="tool-item-text fw-medium text-dark lh-sm">{{ tool.label }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.dashboard-content {
    background-color: #F9FAFB;
    padding: 15px;
    /* Reduced for mobile */
}

.current-package {
    background: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.current-package span {
    font-size: 14px;
}

.usage-content {
    display: flex;
    align-items: center;
    margin-top: 15px;
}

.uc-text-first {
    margin-right: 5px;
}

.uc-text-first,
.uc-text-second {
    font-size: 19px;
    font-weight: 600;
}

.progress-uc {
    margin-top: 15px;
}

.limit-uc {
    font-size: 12px;
    margin-top: 10px;
    color: #4b5563;
}

.tool-item-text {
    font-size: 11px;
}

.iu-text {
    font-size: 15px;
    font-weight: 600;
}

@media (min-width: 768px) {
    .dashboard-content {
        padding: 25px;
    }
}

.quick-icon {
    width: 25%;
    /* Default for desktop */
}

@media (max-width: 575.98px) {
    .quick-icon {
        width: 50%;
        margin-bottom: 15px;
    }
}

.info-usage {
    background-color: #F6F7F9;
}

.dashboard-info {
    background-color: #FEF2F5;
    border-radius: 16px;
}

.avatar-large {
    width: 60px;
    /* Scaled for mobile */
    height: 60px;
    flex-shrink: 0;
    /* Critical: preventing distortion */
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
}

@media (min-width: 768px) {
    .avatar-large {
        width: 80px;
        height: 80px;
        font-size: 24px;
    }
}

.quick-icon-wrapper {
    width: 44px;
    height: 44px;
    background-color: #fff0f0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.quick-icon-wrapper:hover {
    background-color: #ffdada;
}

.small-text {
    font-size: 12px;
    color: #555;
    font-weight: 500;
}

.upgrade-banner {
    background-color: #f0f7ff;
    border: 1px solid #e1eeff;
    transition: 0.2s;
    border-radius: 12px;
}

.upgrade-banner:hover {
    background-color: #e6f2ff;
}

.rocket-icon {
    width: 40px;
    height: 40px;
    background-color: #6c5ce7;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

/* Tool item logic */
.tool-item {
    transition: transform 0.2s ease;
}

.item-icon {
    background-color: #F7F8FA;
}

.tool-item:hover {
    transform: translateY(-5px);
}

.tool-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    transition: background-color 0.2s;
}

.tool-item:hover .tool-icon-wrapper {
    background-color: #f8f9fa;
}

@media (max-width: 768px) {
    .dashboard-info {
        margin-top: 10px;
    }

    h5 {
        font-size: 17px !important;
    }

    .dashboard-email {
        margin-top: 8px;
        font-size: 11px;
    }

    .tool-item-text {
        font-size: 10px;
    }

    .iu-text {
        font-size: 12px;
        font-weight: 500;
    }

    .iu-icon {
        font-size: 16px !important;
        margin-right: 3px;
        display: block;
    }

    .usage-content {
        flex-direction: column;
        align-items: start;
        margin-top: 7px;
    }

    .uc-text-first,
    .uc-text-second {
        font-size: 13px;
    }

    .upgrade-banner-small {
        font-size: 13px !important;
        margin-top: 3px;
    }

    .uc-text-second {
        font-weight: 400;
        color: #6b7280;
    }

    .limit-uc {
        display: none;
    }

    .progress-uc {
        height: 5px !important;
        margin-top: 5px;
    }

    .upgrade-banner-text {
        font-size: 15px;
    }
}
</style>