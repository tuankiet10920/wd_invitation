<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    images: {
        type: Array as () => any[],
        default: () => []
    }
})

const emits = defineEmits(['update:modelValue', 'select'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const totalGB = computed(() => {
    // Thu thập tổng dung lượng từ mảng props.images nếu có thuộc tính 'size' (tính bằng bytes)
    const totalBytes = props.images.reduce((acc, curr) => acc + (curr.size || 0), 0);
    if (totalBytes === 0) return '0.0000';
    return (totalBytes / (1024 * 1024 * 1024)).toFixed(4);
});

const handleSelect = (img: any) => {
    emits('select', img);
    // Có đóng hay không tuỳ thuộc vào quy trình parent, tạm thời giữ mở.
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="custom-modal-container bg-white position-relative">
                
                <!-- Nút Tắt -->
                <button class="btn btn-link text-muted position-absolute bg-transparent border-0 p-3 shadow-none" 
                        style="top: 10px; right: 10px;" @click="isOpen = false">
                    <BaseIconComponent name="close" type="mdi" :size="24" color="#6c757d" />
                </button>

                <!-- Header -->
                <div class="p-4 pb-3">
                    <h5 class="fw-bold fs-5 mb-1 text-dark" style="font-size: 1.15rem !important;">Chọn hình nền cá nhân</h5>
                    <p class="text-secondary mb-0 mt-2" style="font-size: 0.92rem;">
                        Chọn ảnh bạn muốn sử dụng làm hình nền
                    </p>
                </div>

                <!-- Body Gallery -->
                <div class="px-4 pb-4" style="min-height: 180px; max-height: 50vh; overflow-y: auto;">
                    <div class="image-grid">
                        <div v-for="(img, idx) in images" :key="idx" 
                             class="image-item border rounded-1 overflow-hidden" 
                             @click="handleSelect(img)">
                            <img :src="img.url || img" class="w-100 h-100 object-fit-cover" />
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-4 py-3 d-flex justify-content-between align-items-center bg-white" style="border-top: 1px solid #f1f5f9;">
                    <span class="text-dark fw-medium" style="font-size: 0.9rem;">
                        Tổng {{ images.length }} ảnh ({{ totalGB }} GB)
                    </span>
                    <button class="btn btn-outline-light text-dark px-4 py-2" style="font-size: 0.95rem;" @click="isOpen = false">
                        Đóng
                    </button>
                </div>

            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.custom-modal-container {
    border-radius: 10px;
    width: 600px;
    max-width: 90vw;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 16px;
    margin-top: 10px;
}

.image-item {
    aspect-ratio: 1;
    cursor: pointer;
    transition: transform 0.2s;
}

.image-item:hover {
    transform: scale(1.02);
    border-color: #7B61FF !important;
}

.btn-outline-light {
    background-color: #fff;
    border: 1px solid #e5e7eb !important;
    border-radius: 8px;
    color: #374151 !important;
}

.btn-outline-light:hover {
    background-color: #f9fafb;
    border-color: #d1d5db !important;
}
</style>