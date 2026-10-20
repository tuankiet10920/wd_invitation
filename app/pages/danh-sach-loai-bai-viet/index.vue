<script setup lang="ts">
import BreadcumbNormalComponent from '~/coms/breadcumb/BreadcumbNormalComponent.vue'
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue'
import PaginationUserTemplate from '~/coms/pagination/PaginationUserTemplate.vue'
import type { FetchInterface } from "~~/interfaces"

definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('bai-viet')
useAppSeo(seoData)

interface ResponseInterface extends FetchInterface {
    data: any[];
    totalPages: number;
}

const breadcumb = [
    {
        id: 1,
        text: 'Trang chủ',
        path: '/'
    },
    {
        id: 2,
        text: 'Các chủ đề',
        path: '/danh-sach-loai-bai-viet'
    },
]

const currentPage = ref(1)

const { data: response } = await useFetch<ResponseInterface>('/api/v1/client/article-types', {
    query: {
        page: currentPage,
        limit: 12
    }
})

const categories = computed(() => {
    return response.value?.data || []
})

const total = computed(() => {
    return response.value?.totalPages || 0
})

const getImage = (item: any) => {
    // Return dynamically generated article type image path
    return `/images/articles_types/IMAGE_TYPE_NEWS_${item.id}.png`
}

const handleImageError = (e: Event) => {
    // Fallback if image doesn't exist
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1600596542815-60c37c6525fa?q=80&w=2074&auto=format&fit=crop';
}
</script>

<template>
    <div class="page-container container my-5">
        <!-- Breadcrumb -->
        <div class="d-flex justify-content-center mb-5">
            <BreadcumbNormalComponent :config="breadcumb" />
        </div>

        <!-- Title -->
        <div class="text-center mb-5">
            <h1 class="page-title text-uppercase mb-3">CÁC CHỦ ĐỀ</h1>
            <div class="title-divider"></div>
        </div>

        <!-- Grid -->
        <div class="row g-2 g-lg-3">
            <div v-for="item in categories" :key="item.id" class="col-12 col-md-6 col-lg-3">
                <NuxtLink :to="`/loai-bai-viet/${item.slug_vi || item.id}`"
                    class="text-decoration-none card-link-wrapper">
                    <div class="design-card h-100">
                        <div class="card-img-wrapper position-relative">
                            <img :src="getImage(item)" @error="handleImageError"
                                class="w-100 h-100 object-fit-cover transition-transform" :alt="item.name_vi" />
                            <div class="img-overlay"></div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h3 class="card-title text-uppercase">{{ item.name_vi }}</h3>
                            <div class="card-footer-action mt-auto">
                                <span class="view-more">Xem chi tiết</span>
                                <span class="arrow-icon ms-2">⟶</span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
            <div v-if="categories.length === 0" class="col-12 text-center">
                <p>Đang cập nhật dữ liệu...</p>
            </div>
        </div>

        <!-- Pagination -->
        <PaginationUserTemplate :total="total" :current="currentPage" @change="(val: number) => currentPage = val" />
    </div>
</template>

<style scoped>
.page-container {
    padding-top: 20px;
    padding-bottom: 100px;
}

.page-title {
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a1a;
    letter-spacing: 2px;
}

.title-divider {
    width: 60px;
    height: 4px;
    background-color: #ff8fa3;
    margin: 0 auto;
    border-radius: 2px;
}

/* Card Styling */
.card-link-wrapper {
    display: block;
    height: 100%;
}

.design-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
    transition: all 0.4s ease;
    border: 1px solid rgba(0, 0, 0, 0.02);
}

.design-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
}

/* Image Wrapper */
.card-img-wrapper {
    aspect-ratio: 4/3;
    overflow: hidden;
    position: relative;
}

.transition-transform {
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.design-card:hover .transition-transform {
    transform: scale(1.08);
}

/* Text Content */
.card-body {
    padding: 1.5rem;
}

.card-title {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.4;
    color: #2c2c2c;
    margin-bottom: 0.75rem;
    transition: color 0.3s ease;
}

.design-card:hover .card-title {
    color: #ff8fa3;
}

.card-text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #6c757d;
    margin-bottom: 1.5rem;
}

.description-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Footer Action */
.card-footer-action {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: #ff8fa3;
    transition: all 0.3s ease;
}

.view-more {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 12px;
}

.arrow-icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.design-card:hover .arrow-icon {
    transform: translateX(5px);
}

/* Breadcrumb override */
:deep(.breadcrumb) {
    justify-content: center;
    background: transparent;
}
</style>