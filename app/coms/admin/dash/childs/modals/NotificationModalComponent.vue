<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Success!'
    },
    message: {
        type: String,
        default: 'Operation completed successfully.'
    },
    type: {
        type: String as PropType<'success' | 'error'>,
        default: 'success'
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
    isOpen.value = false
    emits('confirm')
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="notification-modal-container text-center">
                <!-- Icon Header (Floating Top) -->
                <div class="icon-header">
                    <div class="icon-circle" :class="type">
                        <BaseIconComponent v-if="type === 'success'" name="check-circle" :size="40" color="#ffffff" />
                        <BaseIconComponent v-else name="cancel" :size="40" color="#ffffff" />
                    </div>
                </div>

                <!-- Body Content -->
                <div class="modal-content pt-5 pb-4 px-4">
                    <h4 class="fw-bold mt-3 mb-2 text-dark">{{ title }}</h4>
                    <p class="text-secondary mb-4">{{ message }}</p>

                    <button class="btn btn-outline-success w-100 py-2 fw-medium" v-if="type === 'success'"
                        @click="handleConfirm">
                        Ok
                    </button>
                    <button class="btn btn-outline-danger w-100 py-2 fw-medium" v-else @click="handleConfirm">
                        Close
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.notification-modal-container {
    background: #fff;
    border-radius: 4px;
    width: 400px;
    max-width: 90vw;
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-top: 30px;
    /* Space for the floating icon */
}

.icon-header {
    position: absolute;
    top: -40px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 10;
}

.icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.icon-circle.success {
    background-color: #2ecc71;
}

.icon-circle.error {
    background-color: #e74c3c;
}

h4 {
    color: #333;
    font-size: 1.5rem;
}

p {
    font-size: 0.95rem;
    color: #7f8c8d;
    line-height: 1.5;
}

.btn-outline-success {
    color: #2ecc71;
    border-color: #2ecc71;
}

.btn-outline-success:hover {
    background-color: #2ecc71;
    color: white;
}

.btn-outline-danger {
    color: #e74c3c;
    border-color: #e74c3c;
}

.btn-outline-danger:hover {
    background-color: #e74c3c;
    color: white;
}
</style>