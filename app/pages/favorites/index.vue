<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFavoriteStore } from '~~/stores/favorite';
import BreadcumbNormalComponent from '~/coms/breadcumb/BreadcumbNormalComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import InvitationImageScrollBoxCompomnent from '~/coms/invitation/InvitationImageScrollBoxCompomnent.vue';

definePageMeta({
    layout: 'user-default',
})

const favoriteStore = useFavoriteStore();
const breadcrumbConfig = computed(() => [
    { id: 1, text: 'Trang chủ', icon: 'house-outline', path: '/' },
    { id: 2, text: 'Mẫu thiệp', path: '/templates' },
    { id: 3, text: 'Yêu thích', path: '/favorites' }
])

const allTemplatesResponse = ref<any>(null);
const { data: response } = await useFetch<any>('/api/v1/client/card-template', {
    query: { is_template: true, limit: 100 }
});

const favoriteList = computed(() => {
    const list = response.value?.data?.data || [];
    return list.filter((item: any) => favoriteStore.isFavorite(item.id)).map((item: any) => ({
        ...item,
        id: item.id,
        type: item.package?.name?.toLowerCase() || 'free',
        image: `/images/wcards/IMAGE_WEDDING_CARD_${item.id}.png`,
        name: item.name
    }));
});
</script>

<template>
    <div class="favorites-page container py-5">
        <!-- Header -->
        <div class="header-section text-center mb-5">
            <h1 class="fw-bold d-flex align-items-center justify-content-center gap-2 mb-2">
                <BaseIconComponent name="favorite" color="#ff4d4f" :size="32" />
                Mẫu thiệp yêu thích
            </h1>
            <p class="text-muted">Danh sách mẫu thiệp bạn đã đánh dấu yêu thích</p>
        </div>

        <!-- Breadcrumb -->
        <div class="mb-5">
            <BreadcumbNormalComponent :config="breadcrumbConfig" />
        </div>

        <!-- Favorites List / Empty State -->
        <div class="content-section">
            <div v-if="favoriteList.length > 0" class="template-grid mt-4">
                <InvitationImageScrollBoxCompomnent 
                    class="template-box mb-2" 
                    v-for="template in favoriteList"
                    :key="template.id" 
                    :fit-width="false" 
                    :image="template.image" 
                    :type="template.type" 
                    :card="template" />
            </div>
            <div v-else class="empty-state text-center py-5">
                <div class="empty-icon mb-4">
                    <BaseIconComponent name="inbox-outline" color="#eeeeee" :size="80" type="material-symbols" />
                </div>
                <p class="text-muted mb-4">Bạn chưa có mẫu thiệp yêu thích nào</p>
                <NuxtLink to="/templates">
                    <button class="btn btn-primary px-4 py-2 rounded-3 shadow-sm border-0 explore-btn">
                        Khám phá mẫu thiệp
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.favorites-page {
    min-height: 60vh;
}

h1 {
    font-size: 2.25rem;
    color: #000;
}

.text-muted {
    font-size: 1rem;
    color: #666 !important;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.empty-icon {
    opacity: 0.6;
}

.explore-btn {
    background-color: #4096ff;
    transition: all 0.3s ease;
}

.explore-btn:hover {
    background-color: #1677ff;
    transform: translateY(-2px);
}

.template-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 50px;
}

@media (min-width: 576px) {
    .template-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 768px) {
    .template-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }
}

@media (min-width: 1024px) {
    .template-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.75rem;
    }
}
</style>