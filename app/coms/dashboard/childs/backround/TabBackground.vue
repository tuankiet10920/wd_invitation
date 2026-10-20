<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEditorStore } from "~~/stores/editor";
import SelectBackgroundComponent from '~/coms/dashboard/modal/SelectBackgroundComponent.vue';

const editor = useEditorStore();
const backgrounds = ref<any[]>([]);
const isLoading = ref(true);

const isPersonalModalOpen = ref(false);
const personalImages = ref<any[]>([]);

const fetchPersonalImages = async () => {
    try {
        const response: any = await $fetch('/api/v1/client/file/personal-images');
        personalImages.value = response?.data || [];
    } catch (e) {
        console.error("Failed to fetch personal images", e);
    }
}

const openPersonalModal = async () => {
    await fetchPersonalImages();
    isPersonalModalOpen.value = true;
}

const handleSelectPersonal = (img: any) => {
    applyBackground(img);
    isPersonalModalOpen.value = false;
}

const fetchBackgrounds = async () => {
    isLoading.value = true;
    try {
        const { data }: any = await $fetch('/api/v1/client/background-system');
        if (data && data.length > 0) {
            let allImages: any[] = [];
            data.forEach((cat: any) => {
                if (cat.images) {
                    allImages = [...allImages, ...cat.images];
                }
            });
            backgrounds.value = allImages;
        }
    } catch (err) {
        console.error("Error fetching backgrounds", err);
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchBackgrounds();
});

const applyBackground = (item: any) => {
    // Nếu URL không chứa dấu / thì giả định nằm trong /backgrounds/list/ hoặc tự động tuỳ user
    const finalUrl = item.url.includes('/') ? item.url : `backgrounds/list/${item.url}`;
    const cleanUrl = finalUrl.startsWith('/') ? finalUrl : `/${finalUrl}`;
    editor.background = `url('${cleanUrl}') center center / cover no-repeat`;
}
</script>
<template>
    <div class="h-100 overflow-auto p-3">
        <div class="text-center mb-4 mt-2">
            <p class="text-muted small mb-3">Chọn hình nền từ ảnh bạn đã tải lên</p>
            <button class="btn btn-primary w-100 py-2 rounded-2 fw-medium shadow-sm" style="font-size: 14px;" @click="openPersonalModal">
                Chọn hình nền cá nhân
            </button>
        </div>

        <div v-if="isLoading" class="text-center py-4">
            <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
            <div class="small text-muted mt-2">Đang tải dữ liệu...</div>
        </div>
        <div v-else class="background-grid">
            <div v-for="item in backgrounds" :key="item.id"
                class="bg-item border rounded-3 position-relative overflow-hidden" @click="applyBackground(item)">
                <NuxtImg :src="`/${(item.url.includes('/') ? item.url : 'backgrounds/thumbnails/' + item.url).replace(/\.[^/.]+$/, '.webp')}`"
                    class="w-100 h-100 object-fit-cover" loading="lazy" />
            </div>
            <div v-if="backgrounds.length === 0" class="col-12 text-center text-muted small mt-3">
                Hiện tại chưa có hình nền nào.
            </div>
        </div>
        <div class="pb-3"></div>
        
        <SelectBackgroundComponent v-model="isPersonalModalOpen" :images="personalImages" @select="handleSelectPersonal" />
    </div>
</template>
<style scoped>
.background-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.bg-item {
    aspect-ratio: 1;
    cursor: pointer;
    transition: all 0.2s ease;
    border-color: #dee2e6 !important;
}

.bg-item:hover {
    border-color: #3b82f6 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 1;
}
</style>