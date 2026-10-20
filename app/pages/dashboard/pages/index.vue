<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

const myInvitations = ref<any[]>([]);
const isLoading = ref(true);

const totalViews = computed(() => {
    return myInvitations.value.reduce((sum, inv) => sum + (inv.views || 0), 0);
});

const maxViews = ref(300);

const viewPercentage = computed(() => {
    if (maxViews.value === 0) return 0;
    return Math.min(100, Math.round((totalViews.value / maxViews.value) * 100));
});

const fetchInvitations = async () => {
    isLoading.value = true;
    try {
        const { data }: any = await $fetch('/api/v1/client/card-template', {
            method: 'GET'
        });

        if (data && data.data) {
            myInvitations.value = data.data.map((card: any) => ({
                id: card.id,
                title: card.name || 'Thiệp không tên',
                status: card.is_publish ? 'Đã xuất bản' : 'Bản nháp',
                thumbnail: card.avatar || '/others/cinelove-default-thumbnail.jpg',
                slug: card.url,
                views: card.views || 0,
                createdAt: card.createdAt
            }));
        }
    } catch (error) {
        console.error("Failed to fetch invitations", error);
    } finally {
        isLoading.value = false;
    }
}

const fetchMyPlan = async () => {
    try {
        const { data, success }: any = await $fetch('/api/v1/client/my-plan', {
            method: 'GET'
        });

        if (success && data && data.maximum_views) {
            maxViews.value = data.maximum_views;
        }
    } catch (error) {
        console.error("Failed to fetch my plan", error);
    }
}

onMounted(() => {
    fetchInvitations();
    fetchMyPlan();
})

const createNewPage = () => {
    const isMobile = window.innerWidth < 992;
    const prefix = isMobile ? '/editor/m' : '/editor';
    navigateTo(`${prefix}/new-blank`);
}
</script>

<template>
    <div class="dashboard-cover dashboard-pages">
        <div class="mb-4 d-flex justify-content-between align-items-center pages-title">
            <h5 class="fw-bold mb-0 d-flex align-items-center">
                <BaseIconComponent name="layout" type="lucide" :size="20" color="#3b82f6" class="me-2" />
                Thiệp của tôi
            </h5>
            <button @click="createNewPage"
                class="btn btn-primary button-create rounded-3 px-3 py-1 d-flex align-items-center shadow-sm text-decoration-none text-white">
                <BaseIconComponent name="plus" type="lucide" :size="18" class="me-1" color="#fff" />
                Tạo trang mới
            </button>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-12">
                <div class="card shadow-sm border-0 rounded-4 p-4">
                    <div class="mb-4 info-views">
                        <h6 class="fw-bold text-dark mb-1 info-follow-title">Thống kê lượt xem</h6>
                        <p class="text-muted small mb-4 info-follow-text">Theo dõi tổng lượt xem từ các trang của bạn
                        </p>

                        <h2 class="fw-bold mb-1 text-dark">{{ totalViews.toLocaleString() }}</h2>
                        <div class="text-muted mb-4 info-progess-views" style="font-size: 14px;">/ {{
                            maxViews.toLocaleString() }} lượt xem
                        </div>
                    </div>

                    <!-- DA SU DUNG -->
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small text-dark fw-medium">Đã sử dụng</span>
                            <span class="small text-dark fw-medium">{{ viewPercentage }}%</span>
                        </div>
                        <div class="progress" style="height: 6px; border-radius: 10px; background-color: #f1f5f9;">
                            <div class="progress-bar bg-success" role="progressbar"
                                :style="{ width: viewPercentage + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card info-card-container shadow-sm border-0 rounded-4 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="selectAll">
                    <label class="form-check-label small text-muted" for="selectAll">Chọn tất cả (1)</label>
                </div>
                <span class="text-muted small">1 trang</span>
            </div>

            <!-- LIST WEDDING CARDS -->
            <div class="row g-4">
                <NuxtLink :to="`/dashboard/pages/${inv.slug}`" class="col-md-4 col-lg-3 text-decoration-none"
                    v-for="inv in myInvitations" :key="inv.id">
                    <div class="invitation-item-card border rounded-4 overflow-hidden shadow-sm hover-lift">
                        <div class="thumbnail-wrapper position-relative">
                            <NuxtImg :src="inv.thumbnail" :width="310" :height="310" class="img-fluid w-100"
                                style="height: 200px; object-fit: cover;" />
                            <span class="badge bg-success position-absolute top-0 end-0 m-3 py-1 px-2 fw-normal"
                                style="font-size: 10px;">
                                {{ inv.status }}
                            </span>
                            <div class="selection-overlay position-absolute top-0 start-0 m-3">
                                <input type="checkbox" class="form-check-input">
                            </div>
                            <div class="thumbnail-wrapper-overlay flex-jc-ac">
                                <span class="text-white fw-bold">Xem chi tiết</span>
                            </div>
                        </div>
                        <div class="p-3">
                            <h6 class="fw-bold text-dark mb-2 text-truncate" style="font-size: 14px;">{{ inv.title }}
                            </h6>
                            <p class="text-muted mb-0 text-truncate" style="font-size: 11px;">/{{ inv.id }}</p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-invitations-page {
    background-color: #f8fafc;
    padding: 25px;
}

.upgrade-card {
    background-color: #f0f7ff;
    border: 1px solid #cfe2ff !important;
}

.thumbnail-wrapper-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    opacity: 0;
    visibility: hidden;
    transition: all .3s ease;
}

.invitation-item-card:hover .thumbnail-wrapper-overlay {
    opacity: 1;
    visibility: visible;
}

.invitation-item-card {
    background-color: #fff;
    transition: all 0.3s ease;
    cursor: pointer;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.btn-primary {
    background-color: #3b82f6;
    border: none;
}

.rounded-4 {
    border-radius: 1rem !important;
}

.bg-warning {
    background-color: #f59e0b !important;
}

/* Tùy chỉnh thanh progress cho mềm mại */
.progress-bar {
    border-radius: 10px;
}

.thumbnail-wrapper img {
    background-color: #000;
}

@media (max-width: 768px) {
    .dashboard-pages {
        padding: 10px;
    }

    .pages-title {
        flex-direction: column;
        align-items: start !important;
    }

    .button-create {
        margin-top: 15px;
    }

    .info-views {
        margin-bottom: 0px !important;
    }

    .info-follow-text,
    .info-progess-views {
        margin-bottom: 10px !important;
    }

    .info-follow-title {
        font-size: 16px !important;
    }

    .info-follow-text {
        font-size: 12px !important;
        margin-top: 8px !important;
    }

    .info-card-container {
        padding: 15px !important;
        margin-bottom: 50px !important;
    }
}
</style>