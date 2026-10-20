<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Are you sure?'
    },
    description: {
        type: String,
        default: 'This action cannot be undone. All values associated with this field will be lost.'
    },
    confirmText: {
        type: String,
        default: 'Delete'
    },
    cancelText: {
        type: String,
        default: 'Cancel'
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
            <div class="delete-modal-container d-flex flex-column align-items-center text-center">
                <!-- Icon -->
                <div class="icon-wrapper mb-3">
                    <BaseIconComponent name="alert-triangle" type="lucide" :size="24" class="text-danger" />
                </div>

                <!-- Content -->
                <h5 class="fw-bold fs-5 mb-2 text-dark">{{ title }}</h5>
                <p class="text-muted mb-4 px-2" style="font-size: 0.95rem; line-height: 1.5;">
                    {{ description }}
                </p>

                <!-- Actions -->
                <div class="w-100 d-flex flex-column gap-2">
                    <button class="btn btn-danger w-100 fw-medium py-2" @click="handleConfirm">
                        {{ confirmText }}
                    </button>
                    <button class="btn btn-outline-light w-100 fw-medium py-2 text-dark border" @click="isOpen = false">
                        {{ cancelText }}
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.delete-modal-container {
    background: #fff;
    padding: 32px 24px;
    border-radius: 16px;
    width: 400px;
    max-width: 90vw;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #fee2e2;
    /* Light red/rose */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #fef2f2;
    /* Lighter border ring */
}

.text-danger {
    color: #dc2626 !important;
}

.btn-danger {
    background-color: #dc2626;
    border-color: #dc2626;
    border-radius: 8px;
    font-size: 0.95rem;
}

.btn-danger:hover {
    background-color: #b91c1c;
    border-color: #b91c1c;
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