<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
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

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const title = ref('Wedding Day')
const subtitle = ref('Xin mời xem thiệp cưới của chúng mình nha')
const duration = ref(4)
const selectedImage = ref(0)
const activeTab = ref('available') // 'available' | 'custom'

const availableImages = ref<string[]>([
    '/images/effects/couple-1.png', 
    '/images/effects/couple-2.png',
    '/images/effects/couple-3.png',
    '/images/effects/couple-4.png'
]);

const fetchImages = async () => {
    try {
        const res: any = await $fetch('/api/v1/client/effects/opening-images');
        if (res && res.data && res.data.length > 0) {
            // Cập nhật lại mảng ảnh dựa theo database
            availableImages.value = res.data.map((img: any) => `/images/effects/opening_gifs/${img.url}`);
        }
    } catch (error) {
        console.error("Lỗi khi tải ảnh opening_effect_gif:", error);
    }
};

const customImages = ref<string[]>([]);

const fetchCustomImages = async () => {
    try {
        const res: any = await $fetch('/api/v1/client/file/personal-images');
        if (res && res.data && res.data.length > 0) {
            customImages.value = res.data.map((img: any) => img.url);
        }
    } catch (error) {
        console.error("Lỗi khi tải ảnh personal_image:", error);
    }
};

const currentImagesList = computed(() => {
    return activeTab.value === 'available' ? availableImages.value : customImages.value;
});

onMounted(() => {
    fetchImages();
    fetchCustomImages();
});

const handleConfirm = () => {
    emits('confirm', {
        title: title.value,
        subtitle: subtitle.value,
        duration: duration.value,
        image: currentImagesList.value[selectedImage.value] || availableImages.value[0] || null
    })
    isOpen.value = false
}

const handleImgError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    if (target) {
        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdib3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZWVlIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==';
    }
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="config-modal-container d-flex flex-column bg-white">
                
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h6 class="m-0 fw-bold text-dark fs-15">Cấu hình hiệu ứng Animated Image</h6>
                    <button class="btn-close shadow-none" aria-label="Close" @click="isOpen = false" style="font-size: 12px;"></button>
                </div>

                <!-- Body (Scrollable) -->
                <div class="modal-body-scroll p-3 flex-grow-1 overflow-y-auto" style="max-height: calc(100vh - 120px);">
                    
                    <!-- Tiêu đề chính -->
                    <div class="mb-3">
                        <label class="form-label mb-1 text-dark fs-14">
                            <span class="text-danger">*</span> Tiêu đề chính
                        </label>
                        <div class="position-relative">
                            <input type="text" class="form-control form-control-sm py-2 pe-5 fs-14" 
                                v-model="title" maxlength="50" placeholder="Nhập tiêu đề">
                            <div class="position-absolute top-0 end-0 h-100 d-flex align-items-center pe-2">
                                <span class="text-muted" style="font-size: 13px;">{{ title.length }} / 50</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tiêu đề phụ -->
                    <div class="mb-3">
                        <label class="form-label mb-1 text-dark fs-14">
                            <span class="text-danger">*</span> Tiêu đề phụ
                        </label>
                        <textarea class="form-control fs-14" v-model="subtitle" rows="2" maxlength="60" 
                            placeholder="Nhập tiêu đề phụ"></textarea>
                        <div class="d-flex justify-content-end mt-1">
                            <span class="text-muted" style="font-size: 13px;">{{ subtitle.length }} / 60</span>
                        </div>
                    </div>

                    <!-- Thời gian hiển thị -->
                    <div class="mb-3">
                        <label class="form-label mb-1 text-dark fs-14">
                            <span class="text-danger">*</span> Thời gian hiển thị (giây)
                        </label>
                        <div class="input-group input-group-sm">
                            <input type="number" class="form-control py-2 fs-14" v-model="duration" min="1">
                            <span class="input-group-text bg-light text-muted fs-14 px-3">giây</span>
                        </div>
                    </div>

                    <!-- Chọn ảnh -->
                    <div class="mb-3">
                        <label class="form-label mb-1 text-dark fs-14">
                            <span class="text-danger">*</span> Chọn ảnh
                        </label>
                        
                        <!-- Tabs -->
                        <div class="custom-tabs d-flex gap-4 border-bottom mb-3">
                            <div class="tab-item py-2 fw-medium cursor-pointer" 
                                :class="{ 'active': activeTab === 'available' }" 
                                @click="activeTab = 'available'; selectedImage = 0">
                                Ảnh có sẵn
                            </div>
                            <div class="tab-item py-2 fw-medium cursor-pointer" 
                                :class="{ 'active': activeTab === 'custom' }" 
                                @click="activeTab = 'custom'; selectedImage = 0">
                                Ảnh của bạn
                            </div>
                        </div>

                        <!-- Image List -->
                        <div class="d-flex gap-3 align-items-center mb-1 overflow-x-auto pb-2" style="scrollbar-width: thin;">
                            <template v-if="currentImagesList.length > 0">
                                <div v-for="(img, i) in currentImagesList" :key="i" 
                                     class="image-option flex-shrink-0 rounded d-flex align-items-center justify-content-center cursor-pointer p-1"
                                     :class="{ 'active': selectedImage === i }"
                                     @click="selectedImage = i">
                                     <img :src="img" class="w-100 h-100 object-fit-contain" alt="Avatar" 
                                        @error="handleImgError" />
                                </div>
                            </template>
                            <template v-else>
                                <div class="text-muted small py-3 fst-italic">
                                    {{ activeTab === 'available' ? 'Chưa có ảnh mẫu có sẵn.' : 'Chưa có ảnh cá nhân. Vui lòng tải lên ảnh ở mục "Hình ảnh".' }}
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Xem trước (Preview) -->
                    <div class="bg-gray-50 border rounded p-3 mt-4">
                        <div class="fw-medium text-dark mb-2 fs-14">Xem trước:</div>
                        
                        <!-- The dark red preview box -->
                        <div class="preview-box w-100 rounded d-flex flex-column align-items-center justify-content-center p-4">
                            
                            <!-- Main Title (Serif) -->
                            <div class="text-white text-center w-100 text-truncate px-2 mb-3 preview-title">
                                {{ title || 'Wedding Day' }}
                            </div>
                            
                            <!-- Center Image -->
                            <div class="preview-avatar mb-3">
                                <img :src="currentImagesList[selectedImage] || availableImages[0] || ''" 
                                    class="w-100 h-100 object-fit-contain" alt="Preview Image"
                                    @error="handleImgError" />
                            </div>

                            <!-- Subtitle (Sans-serif) -->
                            <div class="text-white text-center w-100 fw-bold px-2 preview-subtitle text-truncate">
                                {{ subtitle || 'Xin mời xem thiệp cưới của chúng mình nha' }}
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end gap-2 p-3 border-top">
                    <button class="btn btn-outline-light border px-4 py-2 fs-14 fw-medium text-dark bg-white" 
                        @click="isOpen = false">Hủy</button>
                    <button class="btn btn-primary px-4 py-2 fs-14 fw-medium text-white" 
                        @click="handleConfirm">Xác nhận</button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.config-modal-container {
    width: 520px;
    max-width: 95vw;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.fs-15 {
    font-size: 15px;
}

.fs-14 {
    font-size: 14px;
}

.modal-body-scroll::-webkit-scrollbar {
    width: 6px;
}
.modal-body-scroll::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
.modal-body-scroll::-webkit-scrollbar-thumb {
    background: #c1c1c1; 
    border-radius: 4px;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

/* Custom Tabs */
.custom-tabs .tab-item {
    font-size: 14px;
    color: #6c757d;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
}
.custom-tabs .tab-item:hover {
    color: #3b82f6;
}
.custom-tabs .tab-item.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
}

/* Image Selection */
.image-option {
    width: 86px;
    height: 86px;
    border: 2px solid transparent;
    background-color: #fff;
    transition: all 0.2s;
}
.image-option:hover {
    border-color: #cbd5e1;
}
.image-option.active {
    border-color: #3b82f6 !important;
    background-color: #f0f9ff;
}

/* Preview Box styling */
.preview-box {
    background-color: #580000; /* Deep maroon red matching screenshot */
    min-height: 260px;
}

.preview-title {
    font-family: 'Times New Roman', serif;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.preview-avatar {
    height: 110px;
    width: auto;
}

.preview-subtitle {
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
}

/* Form inputs styling */
.form-control, .input-group-text {
    border-color: #d1d5db;
}
.form-control:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
}

/* Buttons */
.btn-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
    border-radius: 6px;
    transition: all 0.2s;
}
.btn-primary:hover {
    background-color: #2563eb;
}
.btn-outline-light {
    border-radius: 6px;
    transition: all 0.2s;
}
.btn-outline-light:hover {
    background-color: #f3f4f6 !important;
}
</style>