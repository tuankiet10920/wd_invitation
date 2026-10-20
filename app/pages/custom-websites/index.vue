<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'user-default'
})

const currentCategory = ref('all');

const { data: websiteTypeResponse } = await useFetch('/api/v1/client/website-types'); // Need this API
const websiteTypes = computed(() => (websiteTypeResponse.value as any)?.data || []);

const categories = computed(() => {
    const defaultCats = [{ id: 'all', name: 'Tất cả' }];
    return [...defaultCats, ...websiteTypes.value.map((t: any) => ({ id: t.id, name: t.name }))];
});

const { data: websiteResponse, refresh } = await useFetch('/api/v1/client/websites', {
    query: computed(() => ({
        id_website_type: currentCategory.value === 'all' ? undefined : currentCategory.value,
        limit: 50
    }))
});

const websites = computed(() => (websiteResponse.value as any)?.data?.data || []);

watch(currentCategory, () => {
    refresh();
});
</script>

<template>
    <div class="custom-websites-page py-5">
        <div class="container">
            <!-- Header -->
            <div class="text-center mb-5">
                <h2 class="fw-bold mb-3 display-6">Website đặc biệt</h2>
                <p class="text-secondary mx-auto" style="max-width: 600px;">
                    Khám phá bộ sưu tập website độc đáo được thiết kế mang lại những trải nghiệm cảm xúc đặc biệt
                </p>
            </div>

            <!-- Filters -->
            <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                <button v-for="cat in categories" :key="cat.id" @click="currentCategory = cat.id" class="btn rounded-pill px-4 fw-medium" :class="[
                    currentCategory === cat.id ? 'btn-gradient text-white border-0' : 'btn-light text-secondary bg-light-subtle border-0'
                ]">
                    {{ cat.name }}
                </button>
            </div>

            <!-- Breadcrumbs -->
            <div class="mb-4">
                <div class="d-flex align-items-center gap-2 text-muted small">
                    <NuxtLink to="/" class="d-flex align-items-center gap-1 text-decoration-none text-muted">
                        <BaseIconComponent name="house" :size="14" color="#6c757d" />
                        <span>Trang chủ</span>
                    </NuxtLink>
                    <span>/</span>
                    <span class="text-secondary">Website đặc biệt</span>
                </div>
            </div>

            <!-- Grid -->
            <div class="row g-4" v-if="websites.length > 0">
                <div v-for="site in websites" :key="site.id" class="col-md-4">
                    <NuxtLink :to="`/custom-websites/${site.slug}`" class="text-decoration-none">
                        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card cursor-pointer">
                            <!-- Image Container -->
                            <div class="position-relative">
                                <div class="aspect-ratio-box">
                                    <NuxtImg :src="site.image" :alt="site.title" class="w-100 h-100 object-fit-cover" />
                                </div>
                                <!-- Badges -->
                                <div class="position-absolute top-0 start-0 p-3 d-flex gap-2">
                                    <span class="badge rounded-pill fw-normal px-2 py-1 bg-teal" v-if="site.is_new">Mới</span>
                                    <span class="badge rounded-pill fw-normal px-2 py-1 bg-orange" v-if="site.is_hot">Nổi bật</span>
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="card-body p-4 d-flex flex-column text-dark">
                                <h5 class="fw-bold mb-2">{{ site.title }}</h5>
                                <p class="text-secondary small mb-3 flex-grow-1 line-clamp-2">
                                    {{ site.desc }}
                                </p>

                                <!-- Tags -->
                                <div class="d-flex flex-wrap gap-2 mb-4 align-items-center">
                                    <span v-for="tag in site.tags ? site.tags.slice(0, 3) : []" :key="tag.id"
                                        class="badge bg-light text-secondary fw-normal px-3 py-2 rounded-pill border-0">
                                        {{ tag.name }}
                                    </span>
                                    <span v-if="site.tags && site.tags.length > 3" class="text-secondary small ms-1" style="font-size: 13px;">
                                        +{{ site.tags.length - 3 }} thêm
                                    </span>
                                </div>

                                <!-- Footer -->
                                <div class="d-flex justify-content-between align-items-center pt-3 mt-auto border-top">
                                    <span class="text-secondary small fw-medium">{{ site.type?.name }}</span>
                                    <BaseIconComponent name="chevron-right" :size="16" class="text-secondary" />
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
            <div class="w-100 text-center py-5" v-else>
                <p class="text-secondary">Chưa có website nào trong danh mục này.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-gradient {
    background: linear-gradient(to right, #fb7185, #f472b6);
}

.bg-light-subtle {
    background-color: #f3f4f6 !important;
}

.aspect-ratio-box {
    padding-top: 66.67%;
    /* 3:2 Aspect Ratio */
    position: relative;
    background-color: #eee;
}

.aspect-ratio-box img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .08) !important;
}

.line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.bg-teal {
    background-color: #14b8a6;
    color: white;
}

.bg-orange {
    background-color: #f59e0b;
    color: white;
}
</style>