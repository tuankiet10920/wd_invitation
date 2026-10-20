<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue'])
const isOpen = ref(props.modelValue)

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const title = ref('Trang mới - 13/1/2026');
const maxTitleLength = 100;

const editorStore = useEditorStore();
const avatarUrl = ref(editorStore.avatar);
const cacheBust = ref(Date.now());
const fileInput = ref<HTMLInputElement | null>(null);

watch(() => props.modelValue, (val) => {
    isOpen.value = val
    if (val) {
        // Synchronize local state with the store when opening
        avatarUrl.value = editorStore.avatar;
        cacheBust.value = editorStore.avatarCacheBuster || Date.now();
        if (fileInput.value) {
            fileInput.value.value = '';
        }
    }
})

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const formData = new FormData();
        const filename = editorStore.currentCardId
            ? `WEDDING_CARD_AVATAR_${editorStore.currentCardId}`
            : `WEDDING_CARD_AVATAR_DRAFT_${Date.now()}`;

        formData.append('file', file);
        formData.append('filename', filename);

        if (editorStore.currentCardId) {
            formData.append('cardId', String(editorStore.currentCardId));
        }

        try {
            const data: any = await $fetch('/api/v1/client/file/upload-avatar', {
                method: 'POST',
                body: formData
            });

            if (data && data.success && data.path) {
                avatarUrl.value = data.path;
                cacheBust.value = Date.now();
            }
        } catch (error) {
            console.error('Lỗi khi tải ảnh lên:', error);
            alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
        }
    }
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const saveChanges = async () => {
    editorStore.avatar = avatarUrl.value;
    editorStore.avatarCacheBuster = cacheBust.value;
    await editorStore.saveCard();
    isOpen.value = false;
};

watch(() => editorStore.avatar, (newValue, oldValue) => {
    if (oldValue == null && newValue) {
        avatarUrl.value = editorStore.avatar;
        cacheBust.value = editorStore.avatarCacheBuster || Date.now();
    }
}, { immediate: true })

</script>
<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="setting-container">
                <!-- Header -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h5 class="fw-bold m-0" style="font-size: 16px;">Cài đặt tiêu đề và hình đại diện</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="20" class="text-secondary" />
                    </button>
                </div>

                <!-- Body -->
                <div class="mb-3">
                    <label class="form-label mb-2 fw-normal" style="font-size: 14px;">
                        <span class="text-danger">*</span> Tiêu đề trang
                    </label>
                    <div class="position-relative">
                        <input type="text" class="form-control shadow-none" v-model="title"
                            style="font-size: 14px; padding-right: 70px;">
                        <span class="position-absolute text-secondary"
                            style="font-size: 13px; right: 10px; top: 50%; transform: translateY(-50%);">
                            {{ title.length }} / {{ maxTitleLength }}
                        </span>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="form-label mb-2 fw-normal" style="font-size: 14px;">Hình đại diện</label>
                    <div class="bg-dark rounded overflow-hidden mb-2 mx-auto" style="width: 250px; height: 140px;">
                        <img :src="avatarUrl ? `${avatarUrl}?t=${cacheBust}` : ''" class="w-100 h-100 object-fit-cover" v-if="avatarUrl" />
                    </div>
                    <div class="text-center text-secondary mb-3" style="font-size: 12px;">Tỉ lệ khuyến nghị: 16:9</div>

                    <button @click="triggerFileInput"
                        class="btn w-100 border text-dark d-flex align-items-center justify-content-center gap-2 mb-2 bg-white"
                        style="font-size: 14px; padding: 8px;">
                        <BaseIconComponent name="eye-outline" type="mdi" :size="16" />
                        <span>Chọn hình đại diện khác</span>
                    </button>
                    <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload" />
                    <div class="text-center text-secondary" style="font-size: 12px;">
                        Ảnh sẽ được cắt theo tỉ lệ được chọn (4:3, 16:9, 3:2) để tối ưu hiển thị
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end gap-2 pt-2">
                    <button class="btn border text-secondary bg-white" style="font-size: 14px; min-width: 80px;"
                        @click="isOpen = false">Hủy</button>
                    <button class="btn btn-primary text-white border-0" @click="saveChanges"
                        style="background-color: #3b82f6; font-size: 14px; min-width: 80px;">Lưu thay đổi</button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>
<style scoped>
.setting-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 500px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
}

.btn-close-modal:hover {
    opacity: 0.7;
}

.form-control:focus {
    border-color: #3b82f6;
}
</style>