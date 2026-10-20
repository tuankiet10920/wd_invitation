<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    wishId: {
        type: [Number, String],
        default: null
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

const handleConfirm = () => {
    emits('confirm', props.wishId)
    isOpen.value = false
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="delete-wish-modal-container">
                <div class="d-flex gap-3">
                    <div class="icon-wrapper">
                        <BaseIconComponent name="alert-circle" type="mdi" :size="32" color="#f59e0b" />
                    </div>
                    <div class="content-wrapper flex-grow-1">
                        <h5 class="fw-bold mb-2 text-dark title-text">Xác nhận xóa</h5>
                        <p class="description-text mb-0">Bạn có chắc chắn muốn xóa lời chúc này không?</p>

                        <div class="d-flex justify-content-end gap-2 mt-4">
                            <button class="btn-cancel" @click="isOpen = false">Hủy</button>
                            <button class="btn-delete" @click="handleConfirm">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.delete-wish-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 450px;
    max-width: 90vw;
}

.icon-wrapper {
    flex-shrink: 0;
}

.title-text {
    font-size: 1.1rem;
}

.description-text {
    color: #4b5563;
    font-size: 0.95rem;
}

.btn-cancel {
    background-color: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 6px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
}

.btn-cancel:hover {
    background-color: #f9fafb;
}

.btn-delete {
    background-color: #fff;
    border: 1px solid #ef4444;
    color: #ef4444;
    padding: 6px 24px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
}

.btn-delete:hover {
    background-color: #fef2f2;
}
</style>