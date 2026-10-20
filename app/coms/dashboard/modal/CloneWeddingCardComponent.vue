<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    cardName: {
        type: String,
        default: ''
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
    emits('confirm')
    isOpen.value = false
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="clone-modal-container p-4">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold fs-5 mb-0 text-dark">Xác nhận nhân bản</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="x" type="lucide" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Content -->
                <p class="text-secondary mb-4" style="font-size: 0.95rem; line-height: 1.5;">
                    Bạn có chắc chắn muốn nhân bản trang <span class="fw-bold text-dark">"Bản sao: {{ cardName }}"</span>?
                </p>

                <!-- Actions -->
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-outline-light px-4 py-2 text-dark border" @click="isOpen = false">
                        Hủy
                    </button>
                    <button class="btn btn-primary px-4 py-2 fw-medium" @click="handleConfirm">
                        Nhân bản
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.clone-modal-container {
    background: #fff;
    border-radius: 12px;
    width: 500px;
    max-width: 90vw;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.btn-close-modal {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
    border-radius: 8px;
    font-size: 0.95rem;
    color: white;
}

.btn-primary:hover {
    background-color: #2563eb;
    border-color: #2563eb;
}

.btn-outline-light {
    background-color: #fff;
    border-color: #e5e7eb !important;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #374151 !important;
}

.btn-outline-light:hover {
    background-color: #f9fafb;
    border-color: #d1d5db !important;
}
</style>