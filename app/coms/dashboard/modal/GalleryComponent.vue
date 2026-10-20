<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue', 'confirm'])

const isOpen = ref(props.modelValue)
const uploadedImages = ref<any[]>([])
const selectedImages = ref<string[]>([])
const isLoading = ref(false)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
    if (val) {
        fetchImages()
        selectedImages.value = []
    }
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const fetchImages = async () => {
    isLoading.value = true
    try {
        const response = await $fetch<any>('/api/v1/client/file/personal-images', { credentials: 'include' })
        if (response.success) {
            uploadedImages.value = response.data
        }
    } catch (e) {
        console.error('Lỗi khi lấy ảnh:', e)
    } finally {
        isLoading.value = false
    }
}

const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) return url;
    return `/images/personal_image/${url}`;
}

const toggleSelect = (url: string) => {
    const fullUrl = getImageUrl(url)
    const index = selectedImages.value.indexOf(fullUrl)
    if (index === -1) {
        selectedImages.value.push(fullUrl)
    } else {
        selectedImages.value.splice(index, 1)
    }
}

const handleConfirm = () => {
    emits('confirm', [...selectedImages.value])
    isOpen.value = false
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="gallery-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h4 class="fw-bold mb-1 text-dark">Chọn ảnh cho gallery</h4>
                        <p class="text-secondary small mb-0">Click vào ảnh để chọn/bỏ chọn. Có thể chọn nhiều ảnh cùng lúc.</p>
                    </div>
                    <button class="btn-close-modal mt-1" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Gallery Grid -->
                <div class="gallery-content py-4">
                    <div v-if="isLoading" class="d-flex justify-content-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="uploadedImages.length === 0" class="text-center py-5 text-muted small">
                        Bạn chưa tải hình ảnh nào lên thư viện.
                    </div>
                    <div v-else class="gallery-grid">
                        <div v-for="img in uploadedImages" :key="img.id" 
                            class="gallery-item rounded-3 border overflow-hidden position-relative"
                            :class="{ 'is-selected': selectedImages.includes(getImageUrl(img.url)) }"
                            @click="toggleSelect(img.url)">
                            <img :src="getImageUrl(img.url)" class="w-100 h-100 object-fit-cover" alt="Gallery item" />
                            <div class="selection-overlay" v-if="selectedImages.includes(getImageUrl(img.url))">
                                <BaseIconComponent name="check-circle" type="mdi" :size="24" color="#fff" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div class="text-secondary small">
                        Đã chọn {{ selectedImages.length }} ảnh
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn-cancel" @click="isOpen = false">Hủy</button>
                        <button class="btn-confirm" 
                            :disabled="selectedImages.length === 0" 
                            @click="handleConfirm">
                            Xác nhận ({{ selectedImages.length }})
                        </button>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.gallery-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 800px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.gallery-content {
    max-height: 50vh;
    overflow-y: auto;
}

/* Scrollbar styling */
.gallery-content::-webkit-scrollbar {
    width: 6px;
}
.gallery-content::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
.gallery-content::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}
.gallery-content::-webkit-scrollbar-thumb:hover {
    background: #bbb;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
}

.gallery-item {
    aspect-ratio: 1;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
}

.gallery-item:hover {
    transform: scale(1.02);
    border-color: #3b82f6 !important;
}

.gallery-item.is-selected {
    border: 3px solid #3b82f6 !important;
}

.selection-overlay {
    position: absolute;
    inset: 0;
    background: rgba(59, 130, 246, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-cancel {
    background-color: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.btn-cancel:hover {
    background-color: #f3f4f6;
}

.btn-confirm {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.btn-confirm:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn-confirm:disabled {
    background-color: #f3f4f6;
    border-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
}
</style>