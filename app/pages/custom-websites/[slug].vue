<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'user-default'
})

const route = useRoute();
const slug = route.params.slug as string;

const { data: websiteResponse, pending } = await useFetch(`/api/v1/client/websites/${slug}`);
const website = computed(() => (websiteResponse.value as any)?.data || null);
const relatedWebsites = computed(() => (websiteResponse.value as any)?.related || []);

// State for active image in gallery (not fully implemented in seeder but good for UI)
const activeImage = ref('');
watchEffect(() => {
    if (website.value) {
        activeImage.value = website.value.image;
    }
});

useHead({
    title: website.value ? `${website.value.title} - Website đặc biệt` : 'Chi tiết website',
    meta: [
        { name: 'description', content: website.value?.meta_desc || '' }
    ]
})

const getLevelText = (level: number) => {
    switch (level) {
        case 1: return 'Rất dễ';
        case 2: return 'Dễ sử dụng';
        case 3: return 'Trung bình';
        default: return 'Dễ';
    }
}
</script>

<template>
    <div class="container py-4 website-detail-page" v-if="website">
        <!-- Breadcrumbs -->
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <NuxtLink to="/" class="flex-js-ac">
                        <BaseIconComponent name="house" class="me-1" color="#00000073" :size="14" />
                        Trang chủ
                    </NuxtLink>
                </li>
                <li class="breadcrumb-item">
                    <NuxtLink to="/templates">Website đặc biệt</NuxtLink>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ website.title }}</li>
            </ol>
        </nav>

        <!-- Back Button -->
        <div class="mb-4">
            <NuxtLink @click="$router.back()" class="btn-back flex-js-ac">
                <BaseIconComponent name="chevron-left" class="me-1" />
                Quay lại
            </NuxtLink>
        </div>

        <div class="row g-4">
            <!-- Left Column: Main Image & Gallery -->
            <div class="col-lg-6">
                <div class="main-preview-container position-relative mb-3">
                    <div class="badges-overlay">
                        <span class="badge rounded-pill bg-teal me-1" v-if="website.is_new">Mới</span>
                        <span class="badge rounded-pill bg-orange" v-if="website.is_hot">Nổi bật</span>
                    </div>
                    <img :src="activeImage" :alt="website.title" class="img-fluid rounded-4 shadow-sm main-img">
                </div>

                <!-- Thumbnails Gallery -->
                <div class="thumbnail-gallery d-flex gap-2 overflow-auto pb-2"
                    v-if="website.images && website.images.length > 1">
                    <div v-for="img in website.images" :key="img.id" class="thumb-item"
                        :class="{ active: activeImage === img.url }" @click="activeImage = img.url">
                        <img :src="img.url" alt="Thumbnail" class="rounded-3">
                    </div>
                </div>
            </div>

            <!-- Right Column: Info & Actions -->
            <div class="col-lg-6">
                <h1 class="fw-bold mb-3">{{ website.title }}</h1>
                <p class="text-muted description mb-4">{{ website.desc }}</p>

                <div class="row mb-4 metadata-row">
                    <div class="col-6">
                        <div class="label text-secondary mb-1">Độ khó</div>
                        <div class="value fw-medium">{{ getLevelText(website.level) }}</div>
                    </div>
                    <div class="col-6">
                        <div class="label text-secondary mb-1">Thời gian tạo ước tính</div>
                        <div class="value fw-medium">2-5 phút</div> <!-- Mocked duration as time_creator is a date -->
                    </div>
                </div>

                <div class="mb-4">
                    <div class="label text-secondary mb-2">Tags</div>
                    <div class="d-flex flex-wrap gap-2">
                        <span v-for="tag in website.tags" :key="tag.id" class="tag-pill">
                            {{ tag.name }}
                        </span>
                    </div>
                </div>

                <div class="d-flex gap-2 mb-5">
                    <NuxtLink :to="`/web/${slug}`" class="btn btn-outline-secondary flex-jc-ac btn-demo text-decoration-none">
                        <BaseIconComponent name="eye" class="me-2" />
                        Xem demo
                    </NuxtLink>
                    <NuxtLink :to="`/custom-websites/configure/${slug}`" class="btn btn-primary flex-jc-ac flex-grow-1 btn-create text-decoration-none">
                        <BaseIconComponent name="rocket-launch" color="#ffffff" class="me-2" />
                        Tạo website này
                    </NuxtLink>
                </div>

                <div class="features-section">
                    <h5 class="fw-bold mb-3">Tính năng nổi bật</h5>
                    <ul class="list-unstyled">
                        <li v-for="(feature, index) in website.features" :key="index"
                            class="feature-item d-flex align-items-center mb-2">
                            <BaseIconComponent name="check-circle" class="me-2 text-success" />
                            <span>{{ feature }}</span>
                        </li>
                        <li class="feature-item d-flex align-items-center mb-2">
                            <BaseIconComponent name="check-circle" class="me-2 text-success" />
                            <span>Hoạt động tốt trên mọi thiết bị</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Related Section -->
        <hr class="my-5">
        <div class="related-section">
            <h4 class="fw-bold mb-4">Website cùng danh mục</h4>

            <div v-if="relatedWebsites.length > 0" class="row g-4">
                <div v-for="item in relatedWebsites" :key="item.id" class="col-md-3">
                    <!-- Related Card -->
                    <NuxtLink :to="`/custom-websites/${item.slug}`" class="related-card-link">
                        <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                            <img :src="item.image" class="card-img-top" :alt="item.title">
                            <div class="card-body p-3">
                                <h6 class="card-title fw-bold mb-1">{{ item.title }}</h6>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
            <div v-else class="empty-state text-center py-5">
                <BaseIconComponent name="star" :size="48" color="#d1d5db" class="mb-3" />
                <p class="text-secondary">Sẽ sớm có thêm nhiều website tuyệt vời khác!</p>
            </div>
        </div>
    </div>

    <div v-else-if="pending" class="container py-5 text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else class="container py-5 text-center">
        <p>Không tìm thấy website bạn yêu cầu.</p>
        <NuxtLink to="/templates" class="btn btn-primary mt-3">Quay lại danh mục</NuxtLink>
    </div>
</template>

<style scoped>
.website-detail-page {
    background-color: #fff;
    min-height: 100vh;
}

.breadcrumb-item a {
    text-decoration: none;
    color: #00000073;
    font-size: 14px;
}

.breadcrumb-item.active {
    color: #4b5563;
    font-weight: 500;
}

.btn-back {
    background: none;
    border: none;
    padding: 0;
    color: #4b5563;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s;
}

.btn-back:hover {
    color: #000;
}

/* Badges */
.bg-teal {
    background-color: #14b8a6;
    color: white;
}

.bg-orange {
    background-color: #f59e0b;
    color: white;
}

.main-preview-container .badges-overlay {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 10;
}

.main-img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
}

.thumb-item {
    width: 120px;
    height: 80px;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
}

.thumb-item.active,
.thumb-item:hover {
    opacity: 1;
}

.thumb-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Info Section */
h1 {
    font-size: 2.5rem;
}

.description {
    line-height: 1.6;
    font-size: 15px;
}

.metadata-row .label {
    font-size: 13px;
    text-transform: none;
}

.metadata-row .value {
    font-size: 15px;
}

.tag-pill {
    background-color: #f3f4f6;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    color: #4b5563;
}

.btn-demo {
    padding: 12px 24px;
    border-radius: 10px;
    font-weight: 500;
}

.btn-create {
    padding: 12px 24px;
    background-color: #3b82f6;
    border-color: #3b82f6;
    border-radius: 10px;
    font-weight: 600;
}

.feature-item span {
    font-size: 15px;
    color: #4b5563;
}

/* Related section */
.related-card-link {
    text-decoration: none;
    color: inherit;
}

.related-card-link:hover .card {
    transform: translateY(-5px);
    transition: transform 0.3s;
}

.empty-state p {
    font-size: 14px;
}

.flex-js-ac {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.flex-jc-ac {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
