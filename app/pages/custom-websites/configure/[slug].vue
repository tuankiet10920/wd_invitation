<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const route = useRoute()
const slug = route.params.slug as string

// Fetch website data from backend
// useAsyncData with server: false ensures it runs on client
const { data: response, pending, error } = useAsyncData<any>(
    `config-website-${slug}`,
    () => $fetch(`/api/v1/client/websites/${slug}`),
    { server: false }
)

watchEffect(() => {
    if (response.value) {
        console.log("API Fetch success:", response.value);
    }
    if (error.value) {
        console.error("API Fetch error:", error.value);
    }
})

// Extract core data from API response structure { data: Website, status: 200, ... }
const website = computed(() => response.value?.data || null)
const websiteKey = computed(() => website.value?.key || '')

// Dynamically determine the configuration component name
// e.g., if key is "CrushKiller", we load ConfigCrushKiller.vue
import { defineAsyncComponent } from 'vue'
const configComponentName = computed(() => {
    if (!websiteKey.value) return null
    const componentName = `Config${websiteKey.value}`
    console.log("Loading dynamic component: ", componentName);
    
    return defineAsyncComponent({
        loader: () => import(`../../../components/${componentName}.vue`),
        loadingComponent: undefined,
        errorComponent: undefined,
    })
})

definePageMeta({
    layout: 'website',
})

// Update browser title
useHead({
    title: computed(() => website.value ? `Cấu hình ${website.value.title}` : 'Đang tải cấu hình...')
})
</script>

<template>
    <div>
        <!-- Loading State -->
        <div v-if="pending" class="d-flex flex-column align-items-center justify-content-center py-5">
            <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted fw-500">Đang tải dữ liệu cấu hình từ hệ thống...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error || !website" class="alert alert-danger p-4 text-center mt-4">
            <BaseIconComponent name="alert-circle" :size="48" color="#ef4444" class="mb-3" />
            <h4 class="fw-bold">Không thể tải cấu hình</h4>
            <p class="text-muted mb-4">Mẫu website này không tồn tại hoặc bạn không có quyền truy cập.</p>
            <NuxtLink to="/custom-websites" class="btn btn-primary px-4">
                Quay lại danh sách
            </NuxtLink>
        </div>

        <!-- Success Stated - Render Dynamic Component -->
        <template v-else>
            <!-- Render the specific config component for this website key -->
            <component :is="configComponentName" v-if="configComponentName" :website-data="website" />

            <div v-else class="alert alert-warning p-4 text-center mt-4">
                <BaseIconComponent name="help-circle" :size="48" color="#f59e0b" class="mb-3" />
                <h4 class="fw-bold">Chưa có giao diện cấu hình</h4>
                <p class="text-muted">Mẫu website <strong>{{ website.title }}</strong> chưa hỗ trợ giao diện cấu hình
                    trực tuyến.</p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.fw-500 {
    font-weight: 500;
}
</style>