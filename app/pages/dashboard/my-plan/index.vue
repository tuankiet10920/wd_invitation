<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import type { IconType } from "~~/interfaces"

definePageMeta({
    layout: 'dashboard'
})

interface ServiceSummary {
    label: string
    value: string
    icon: string
    type: IconType
}

const myPlanData = ref<any>(null)
const features = ref<{ name: string, active: boolean }[]>([])

const serviceSummary = computed<ServiceSummary[]>(() => {
    if (!myPlanData.value) return []

    const d = myPlanData.value
    return [
        { label: 'Hình ảnh', value: `${d.currentImages || 0} / ${d.image_limits || 0}`, icon: 'image', type: 'lucide' },
        { label: 'Website', value: `${d.currentWebsites || 0} / ${d.number_of_cards || 0}`, icon: 'globe', type: 'lucide' },
        { label: 'Lượt xem', value: `${d.currentViews || 0} / ${d.maximum_views || 0}`, icon: 'eye', type: 'lucide' },
        { label: 'Add-ons', value: '0', icon: 'package', type: 'lucide' }
    ]
})

// Fetch from API
const fetchMyPlan = async () => {
    try {
        const response = await $fetch<any>('/api/v1/client/my-plan')
        if (response.success) {
            myPlanData.value = response.data
            features.value = response.data.features || []
        }
    } catch (error) {
        console.error("Failed to fetch my plan:", error)
    }
}

fetchMyPlan()
</script>

<template>
    <div class="dashboard-cover service-package-content">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <ButtonReturnMobileComponent />
            <h4 class="fw-bold mb-0 d-flex align-items-center spc-title">
                <span class="me-2">👑</span> Gói dịch vụ của tôi
            </h4>
            <span class="badge bg-light spc-btn text-primary border px-3 py-2 rounded-pill fw-bold text-uppercase">
                <span class="me-1" v-if="myPlanData?.name == 'Premium'">💎</span>
                <BaseIconComponent v-else name="layout" type="lucide" :size="14" class="me-1" /> {{ myPlanData?.name ||
                    'Free'
                }}
            </span>
        </div>

        <div class="row g-2 mp mb-4">
            <div class="col-md-3 col-6" v-for="item in serviceSummary" :key="item.label">
                <div class="d-flex mp-tt shadow-sm border-0 rounded-4 p-3 h-100 bg-white">
                    <div class="summary-icon-box me-2">
                        <BaseIconComponent :name="item.icon" :type="item.type" :size="18" color="#007bff" />
                    </div>
                    <div class="mp-box-text">
                        <span class="small mp-label fw-bold text-secondary">{{ item.label }}</span>
                        <h5 class="fw-bold mp-value mb-0">{{ item.value }}</h5>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="upgrade-banner p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between shadow-sm cursor-pointer border-0">
            <div class="d-flex align-items-center">
                <div class="rocket-icon-bg me-3">🚀</div>
                <div>
                    <h6 class="mb-1 fw-bold">Nâng cấp giới hạn</h6>
                    <p class="mb-0 small text-muted">Mở rộng giới hạn sử dụng của bạn</p>
                </div>
            </div>
            <BaseIconComponent name="chevron-right" type="lucide" :size="18" color="#adb5bd" />
        </div>

        <div class="d-flex mb-3 gap-2">
            <button class="btn btn-primary btn-sm px-3 py-2 rounded-3 fw-bold">Gói hiện tại</button>
            <button class="btn btn-light btn-sm px-3 py-2 rounded-3 text-muted border">Add-ons đã mua <span
                    class="badge bg-secondary ms-1">0</span></button>
        </div>

        <div class="card ip shadow-sm border-0 rounded-4 overflow-hidden p-4">
            <div class="status-card bg-dark text-white p-3 d-flex justify-content-between align-items-center"
                style="background-color: #343a40 !important;">
                <div class="d-flex align-items-center text-uppercase">
                    <span class="me-2 fs-4">🆓</span> <span class="fw-bold fs-4">{{ myPlanData?.name || 'FREE' }}</span>
                </div>
                <button class="btn btn-secondary btn-sm rounded-2 px-4 py-2 fw-bold" style="font-size: 14px;">Nâng
                    cấp</button>
            </div>

            <div class="p-4 ip-tt">
                <h6 class="fw-bold mb-3">Thống kê sử dụng</h6>
                <div class="mb-4" v-if="myPlanData">
                    <div class="d-flex justify-content-between small mb-1">
                        <div class="flex-js-ac">
                            <BaseIconComponent name="eye" type="lucide" :size="20" class="me-2" /> <span
                                class="fs-6">Lượt xem</span>
                        </div>
                        <span class="fw-bold">{{ myPlanData.currentViews || 0 }} / {{ myPlanData.maximum_views || 0
                        }}</span>
                    </div>
                    <div class="progress mb-3" style="height: 8px;">
                        <div class="progress-bar"
                            :class="(myPlanData.currentViews / myPlanData.maximum_views) >= 1 ? 'bg-danger' : 'bg-success'"
                            :style="{ width: Math.min(100, ((myPlanData.currentViews || 0) / (myPlanData.maximum_views || 1)) * 100) + '%' }">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between small mb-1">
                        <div class="flex-js-ac">
                            <BaseIconComponent name="image" type="lucide" :size="20" class="me-2" /> <span
                                class="fs-6">Hình ảnh</span>
                        </div>
                        <span class="fw-bold">{{ myPlanData.currentImages || 0 }} / {{ myPlanData.image_limits || 0
                        }}</span>
                    </div>
                    <div class="progress mb-3" style="height: 8px;">
                        <div class="progress-bar"
                            :class="(myPlanData.currentImages / myPlanData.image_limits) >= 1 ? 'bg-danger' : 'bg-secondary'"
                            :style="{ width: Math.min(100, ((myPlanData.currentImages || 0) / (myPlanData.image_limits || 1)) * 100) + '%' }">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between small mb-1">
                        <div class="flex-js-ac">
                            <BaseIconComponent name="globe" type="lucide" :size="20" class="me-2" /> <span
                                class="fs-6">Website</span>
                        </div>
                        <span class="fw-bold">{{ myPlanData.currentWebsites || 0 }} / {{ myPlanData.number_of_cards || 0
                        }}</span>
                    </div>
                    <div class="progress mb-1" style="height: 8px;">
                        <div class="progress-bar"
                            :class="(myPlanData.currentWebsites / myPlanData.number_of_cards) >= 1 ? 'bg-danger' : 'bg-primary'"
                            :style="{ width: Math.min(100, ((myPlanData.currentWebsites || 0) / (myPlanData.number_of_cards || 1)) * 100) + '%' }">
                        </div>
                    </div>
                    <p v-if="myPlanData.currentWebsites >= myPlanData.number_of_cards" class="text-danger mb-0 mt-2"
                        style="font-size: 11px;">Đã đạt giới hạn! Hãy nâng cấp hoặc
                        mua thêm addon</p>
                </div>

                <h6 class="fw-bold mb-3">Chi tiết gói</h6>
                <div class="row mb-4" v-if="myPlanData">
                    <div class="col-md-4">
                        <div class="small text-muted mb-1 flex-js-ac">
                            <BaseIconComponent name="clock" type="lucide" :size="18" /> <span class="fs-6 ms-2">Thời hạn
                                website</span>
                        </div>
                        <div class="fw-bold text-primary ip-text-p fs-5">6 tháng</div>
                    </div>
                    <div class="col-md-4 border-start border-end">
                        <div class="small text-muted mb-1 flex-js-ac">
                            <BaseIconComponent name="hard-drive" type="lucide" :size="18" /> <span
                                class="fs-6 ms-2">Dung lượng</span>
                        </div>
                        <div class="fw-bold text-primary fs-5 ip-text-p">{{ myPlanData.image_limits || 0 }} hình ảnh
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="small text-muted mb-1 flex-js-ac">
                            <BaseIconComponent name="eye" type="lucide" :size="18" /> <span class="fs-6 ms-2">Giới hạn
                                lượt xem</span>
                        </div>
                        <div class="fw-bold text-primary fs-5 ip-text-p">{{ myPlanData.maximum_views || 0 }} lượt</div>
                    </div>
                </div>

                <h6 class="fw-bold mb-3">Tính năng</h6>
                <div class="row">
                    <div class="col-md-6 d-flex align-items-center mb-2" v-for="feature in features"
                        :key="feature.name">
                        <span class="me-2 fw-bold" :class="feature.active ? 'text-success' : 'text-danger'">
                            {{ feature.active ? '✅' : '❌' }}
                        </span>
                        <span class="small" :class="feature.active ? 'text-dark fw-bold' : 'text-secondary'">{{
                            feature.name }}</span>
                    </div>
                </div>

                <div class="mt-4 ip-update p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style="background-color: #f8f9fa; border: 1px dashed #dee2e6;">
                    <div>
                        <div class="fw-bold fs-6">Muốn có thêm tính năng?</div>
                        <div class="text-muted" style="font-size: 13px;">Nâng cấp để mở khóa tất cả các tính năng và
                            giới hạn cao hơn</div>
                    </div>
                    <button class="btn btn-primary btn-sm px-4 py-2 fw-bold shadow-sm">Xem gói</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.service-package-content {
    background-color: #f4f7fa;
}

.status-card {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.summary-icon-box {
    width: 50px;
    height: 50px;
    background-color: #e7f1ff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upgrade-banner {
    background-color: #f0f7ff;
    border: 1px solid #e1eeff;
    transition: 0.2s;
}

.rocket-icon-bg {
    width: 45px;
    height: 45px;
    background-color: #6c5ce7;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.progress {
    background-color: #e9ecef;
    border-radius: 10px;
}

.rounded-4 {
    border-radius: 1rem !important;
}

.card {
    border: none;
}

.text-primary {
    color: #007bff !important;
}

.small {
    font-size: 13px;
}

@media (max-width: 768px) {
    .mp-tt {
        padding: 8px !important;
    }

    .summary-icon-box {
        width: 40px;
        height: 40px;
    }

    .mp-label {
        font-size: 10px !important;
        font-weight: 400 !important;
    }

    .mp-value {
        font-size: 12px !important;
        margin-top: 3px;
    }

    .mp-box-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ip,
    .ip-tt {
        padding: 10px !important;
    }

    .ip {
        margin-bottom: 50px !important;
    }

    .ip-update {
        display: none !important;
    }

    .ip-text-p,
    .spc-title {
        font-size: 16px !important;
    }

    .spc-btn {
        padding-left: 10px !important;
        padding-right: 10px !important;
        font-size: 12px !important;
    }
}
</style>