<script setup lang="ts">
import BreadcumbNormalComponent from '~/coms/breadcumb/BreadcumbNormalComponent.vue';
import type { DataSEO } from "~~/interfaces";

definePageMeta({
    layout: 'user-default'
})

const route = useRoute()
const slug = route.params.slug as string

const { data: response, pending } = await useFetch<any>(`/api/v1/client/news/${slug}`)

const articleObj = response.value?.data?.article;
const rawTitle = articleObj?.title_vi || 'Bài viết';
const desc = articleObj?.short_description_vi || 'Nội dung chi tiết bài viết';
const imagePath = articleObj ? `/images/news/IMAGE_NEWS_${articleObj.id}.png` : '';
const config = useRuntimeConfig();
const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;

const seoData: DataSEO = {
    title: rawTitle,
    description: desc,
    og_title: rawTitle,
    og_description: desc,
    og_image: imagePath,
    og_url: `${siteUrl}/bai-viet/${slug}`,
    og_type: "article",
    twitter_card: "summary_large_image",
    twitter_title: rawTitle,
    twitter_image: imagePath,
    twitter_site: "@cinelove"
};
useAppSeo(seoData);

const article = computed(() => {
    return response.value?.data?.article || null
})

const relatedArticles = computed(() => {
    return response.value?.data?.relatedArticles || []
})

const breadcumbConfig = computed(() => [
    { id: 1, text: 'Trang chủ', path: '/' },
    { id: 2, text: 'Bài viết', path: '/bai-viet' },
    { id: 3, text: article.value?.title_vi || '', path: '#' }
])

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN')
}
</script>

<template>
    <div class="article-detail-page">
        <!-- Breadcrumb Area -->
        <div class="breadcrumb-area py-3 bg-light mb-5 d-none d-md-block">
            <div class="container">
                <BreadcumbNormalComponent :config="breadcumbConfig" />
            </div>
        </div>

        <div class="container pb-5">
            <div class="row">
                <!-- Left Column: Content -->
                <div class="col-lg-8 pe-lg-5 mb-5 mb-lg-0">
                    <article v-if="article" class="article-main">
                        <h1 class="article-title display-5 fw-bold mb-3">{{ article.title_vi }}</h1>

                        <div class="meta-info d-flex align-items-center mb-4 text-muted border-bottom pb-3">
                            <span class="d-flex align-items-center me-4">
                                <i class="fas fa-user-circle fs-5 me-2"></i>
                                <span class="fw-medium">{{ article.user?.name || 'Admin' }}</span>
                            </span>
                            <span class="d-flex align-items-center">
                                <i class="far fa-clock fs-5 me-2"></i>
                                <span>{{ formatDate(article.createdAt) }}</span>
                            </span>
                        </div>

                        <div class="article-description lead mb-4 fst-italic text-secondary">
                            {{ article.short_description_vi }}
                        </div>

                        <div class="article-content" v-html="article.content_vi"></div>
                    </article>
                    <div v-else class="text-center py-5">
                        <h2 class="text-muted">Không tìm thấy bài viết</h2>
                    </div>

                    <!-- Share / Tags could go here -->
                </div>

                <!-- Right Column: Sidebar -->
                <div class="col-lg-4">
                    <aside class="sidebar-wrapper sticky-top" style="top: 100px; z-index: 10;">
                        <div class="sidebar-widget mb-5">
                            <h4 class="widget-title fw-bold mb-4 position-relative">
                                Bài viết liên quan
                                <span class="title-line"></span>
                            </h4>

                            <div v-if="relatedArticles.length > 0" class="related-list d-flex flex-column gap-4">
                                <div v-for="item in relatedArticles" :key="item.id" class="related-item group">
                                    <div class="d-flex align-items-start">
                                        <NuxtLink :to="`/bai-viet/${item.slug_vi}`"
                                            class="d-block flex-shrink-0 me-3 overflow-hidden rounded-3"
                                            style="width: 100px; height: 75px;">
                                            <img :src="item.image || 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop'"
                                                :alt="item.title_vi"
                                                class="img-fluid w-100 h-100 object-fit-cover zoom-effect">
                                        </NuxtLink>
                                        <div class="flex-grow-1">
                                            <h6 class="mb-1 lh-base">
                                                <NuxtLink :to="`/bai-viet/${item.slug_vi}`"
                                                    class="text-decoration-none text-dark fw-bold line-clamp-2 hover-primary">
                                                    {{ item.title_vi }}
                                                </NuxtLink>
                                            </h6>
                                            <small class="text-muted d-block mt-1">{{ formatDate(item.createdAt)
                                                }}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-secondary fst-italic">
                                Đang cập nhật...
                            </div>
                        </div>

                        <!-- Ads or other widgets could go here -->
                    </aside>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-title {
    color: #2c3e50;
    line-height: 1.3;
    font-size: 1.75rem; /* Default for mobile */
}

@media (min-width: 768px) {
    .article-title {
        font-size: 2.5rem;
    }
}

@media (min-width: 992px) {
    .article-title {
        font-size: 3rem;
    }
}

.article-content {
    color: #444;
    font-size: 1rem;
    line-height: 1.7;
}

@media (min-width: 768px) {
    .article-content {
        font-size: 1.1rem;
        line-height: 1.8;
    }
}

.article-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.article-content :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.article-content :deep(p) {
    margin-bottom: 1.2rem;
}

.article-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 1.2rem 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.title-line {
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: #ff8fa3;
    border-radius: 2px;
}

.widget-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.zoom-effect {
    transition: transform 0.3s ease;
}

.related-item:hover .zoom-effect {
    transform: scale(1.1);
}

.hover-primary {
    transition: color 0.2s ease;
}

.hover-primary:hover {
    color: #ff8fa3 !important;
}

.breadcrumb-area {
    border-bottom: 1px solid #f1f3f5;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
    .sidebar-wrapper {
        margin-top: 3rem;
        position: static !important;
    }
}

@media (max-width: 575.98px) {
    .meta-info {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 8px;
    }
    .meta-info span {
        margin-right: 0 !important;
    }
}
</style>
