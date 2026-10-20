<script setup lang="ts">
import BreadcumbNormalComponent from '~/coms/breadcumb/BreadcumbNormalComponent.vue'
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue'
import PaginationUserTemplate from '~/coms/pagination/PaginationUserTemplate.vue'
import type { FetchInterface, DataSEO } from "~~/interfaces"

definePageMeta({
    layout: 'user-default'
})

const route = useRoute()
const slug = route.params.slug as string

const mockNews = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Đang tải dữ liệu...`,
    slug: `loading-${i + 1}`,
    image: `https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925&auto=format&fit=crop`,
    description: 'Vui lòng chờ...',
    createdAt: new Date().toISOString()
}))

const { data: response, pending } = await useFetch<any>(`/api/v1/client/news/by-category-slug/${slug}`)

const categoryObj = response.value?.data?.category;
const rawTitle = categoryObj?.name_vi || 'DANH SÁCH BÀI VIẾT';
const desc = `Danh sách bài viết chuyên mục ${rawTitle}. Cập nhật tin tức và thông tin hữu ích mới nhất.`;
const imagePath = categoryObj ? `/images/articles_types/IMAGE_TYPE_NEWS_${categoryObj.id}.png` : '';
const config = useRuntimeConfig();
const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;

const seoData: DataSEO = {
    title: rawTitle,
    description: desc,
    og_title: rawTitle,
    og_description: desc,
    og_image: imagePath,
    og_url: `${siteUrl}/loai-bai-viet/${slug}`,
    og_type: "website",
    twitter_card: "summary_large_image",
    twitter_title: rawTitle,
    twitter_image: imagePath,
    twitter_site: "@cinelove"
};
useAppSeo(seoData);

const categoryName = computed(() => {
    return rawTitle
})

const articles = computed(() => {
    if (response.value?.data?.data && response.value.data.data.length > 0) {
        return response.value.data.data
    }
    return pending.value ? mockNews : []
})

const breadcumb = computed(() => [
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
    {
        id: 3,
        text: categoryName.value,
        path: `/loai-bai-viet/${slug}`
    }
])

const currentPage = ref(1)

const formatDate = (dateString: string) => {
    if (!dateString) return '26/01/2026'
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

const getImage = (item: any) => {
    return item.image ? `/images/news/${item.image}` : 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925&auto=format&fit=crop'
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
            <h1 class="page-title text-uppercase mb-3">{{ categoryName }}</h1>
            <div class="title-divider"></div>
        </div>

        <!-- Grid -->
        <div class="row g-2 g-lg-3">
            <div v-for="item in articles" :key="item.id" class="col-12 col-md-6 col-lg-3">
                <!-- Assuming article link is /bai-viet/:slug -->
                <NuxtLink :to="`/bai-viet/${item.slug_vi}`" class="text-decoration-none card-link-wrapper">
                    <div class="design-card h-100">
                        <div class="card-img-wrapper position-relative">
                            <NuxtImg :src="`/images/news/IMAGE_NEWS_${item.id}.png`"
                                class="w-100 h-100 object-fit-cover transition-transform" :alt="item.title_vi" />
                            <div class="img-overlay"></div>

                            <!-- Date Badge (New Feature) -->
                            <div class="date-badge">
                                <BaseIconComponent name="calendar-days" type="lucide" :size="14" color="#fff"
                                    class="me-1" />
                                <span>{{ formatDate(item.createdAt) }}</span>
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h3 class="card-title text-uppercase">{{ item.title_vi }}</h3>
                            <!-- Description is likely not in the 'news' object in list view from `news-with-type` based on previous file review (`attributes: ["id", "title", "slug", "image", "id_type", "createdAt"]`) -->
                            <!-- So we might not have description. We can omit or use fallback text if visually required. -->
                            <!-- I'll omit description if missing, or maybe API creates one. -->

                            <div class="card-footer-action mt-auto">
                                <span class="view-more">Xem bài viết</span>
                                <span class="arrow-icon ms-2">⟶</span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
            <div v-if="articles.length === 0 && !pending" class="col-12 text-center py-5">
                <p class="text-muted fs-5">Chưa có bài viết nào trong chuyên mục này.</p>
            </div>
        </div>

        <!-- Pagination -->
        <PaginationUserTemplate v-if="response?.data?.totalPages > 1" :total="response.data.totalPages"
            :current="currentPage" @change="(val: number) => currentPage = val" />
    </div>
</template>

<style scoped>
/* Reuse styles from index.vue */
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

/* Card */
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

/* Date Badge styles */
.date-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 6px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    color: white;
    font-size: 12px;
    font-weight: 500;
    z-index: 2;
}

:deep(.breadcrumb) {
    justify-content: center;
    background: transparent;
}
</style>