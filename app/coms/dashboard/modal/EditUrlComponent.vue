<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    currentUrl: {
        type: String,
        default: 'https://cinelove.me/s/ddd755e4-9346-4bbe-9123-426e8869972a'
    },
    domainUrl: {
        type: String,
        default: 'https://cinelove.me/s/'
    }
})

const emits = defineEmits(['update:modelValue', 'updateUrl'])

const isOpen = ref(props.modelValue)
const newUrl = ref('')

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
    if (!val) {
        newUrl.value = ''
    }
})

const handleUpdate = () => {
    const trimmedUrl = newUrl.value.trim()
    if (!trimmedUrl) return
    emits('updateUrl', trimmedUrl)
    isOpen.value = false
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="edit-url-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0 text-dark">Tùy chỉnh URL</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Alert Box -->
                <div class="warning-box mb-4">
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <BaseIconComponent name="alert" type="mdi" :size="20" color="#a16207" />
                        <span class="warning-title">Lưu ý</span>
                    </div>
                    <div class="warning-text">
                        URL chỉ được tùy chỉnh một lần duy nhất và không thể thay đổi sau đó.
                    </div>
                </div>

                <!-- Current URL -->
                <div class="mb-4">
                    <div class="label-text mb-2">URL hiện tại:</div>
                    <div class="current-url-text">{{ currentUrl }}</div>
                </div>

                <!-- New URL -->
                <div class="mb-2">
                    <div class="label-text mb-2">URL mới:</div>
                    <div class="custom-input-group">
                        <span class="prefix-domain">{{ domainUrl }}</span>
                        <input type="text" class="custom-input" placeholder="Nhập URL tùy chỉnh" v-model="newUrl" />
                    </div>
                </div>

                <div class="hint-text mb-4">
                    * URL chỉ được chứa chữ cái, số và dấu gạch ngang
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end gap-3 mt-4 pt-2">
                    <button class="btn-cancel" @click="isOpen = false">Hủy</button>
                    <button class="btn-update" @click="handleUpdate">Cập nhật</button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.edit-url-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 600px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.warning-box {
    background-color: #fefce8;
    border: 1px solid #fde047;
    border-radius: 8px;
    padding: 12px 16px;
}

.warning-title {
    color: #a16207;
    font-weight: 600;
    font-size: 15px;
}

.warning-text {
    color: #a16207;
    font-size: 14px;
    margin-left: 28px;
}

.label-text {
    color: #4b5563;
    font-weight: 600;
    font-size: 15px;
}

.current-url-text {
    color: #374151;
    font-size: 15px;
    word-break: break-all;
}

.custom-input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
    height: 40px;
}

.custom-input-group:focus-within {
    border-color: #3b82f6;
}

.prefix-domain {
    padding: 0 0 0 12px;
    color: #374151;
    background: #fff;
    font-size: 15px;
}

.custom-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0 12px 0 2px;
    font-size: 15px;
    height: 100%;
}

.custom-input::placeholder {
    color: #9ca3af;
}

.hint-text {
    color: #6b7280;
    font-size: 13px;
    margin-top: 8px;
}

.btn-cancel {
    background-color: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
    min-width: 80px;
}

.btn-cancel:hover {
    background-color: #f3f4f6;
}

.btn-update {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
    min-width: 100px;
}

.btn-update:hover {
    background-color: #2563eb;
}
</style>