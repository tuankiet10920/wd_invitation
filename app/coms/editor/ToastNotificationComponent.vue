<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editorStore = useEditorStore();

const notification = computed(() => {
    return editorStore.notification || { show: false, message: '', type: 'success' };
});

const closeNotification = () => {
    if (editorStore.notification) {
        editorStore.notification.show = false;
    }
};
</script>

<template>
    <Transition name="toast-fade">
        <div v-if="notification.show" class="toast-wrapper">
            <div class="toast-card d-flex align-items-center gap-2 border-0 shadow-lg">
                <!-- Icon Success -->
                <div v-if="notification.type === 'success'" class="icon-circle bg-success-light text-success">
                    <BaseIconComponent name="check-circle" :size="16" color="#52C41A" />
                </div>
                <!-- Icon Error -->
                <div v-else-if="notification.type === 'error'" class="icon-circle bg-danger-light text-danger">
                    <BaseIconComponent name="brightness-alert" :size="16" />
                </div>
                <!-- Icon Warning -->
                <div v-else class="icon-circle bg-warning-light text-warning">
                    <BaseIconComponent name="exclamation" :size="16" />
                </div>

                <!-- Message -->
                <span class="toast-message fw-medium text-dark">{{ notification.message }}</span>

                <!-- Close Button -->
                <button class="btn-close-toast ms-2 border-0 bg-transparent p-0 d-flex" @click="closeNotification">
                    <BaseIconComponent name="close" type="mdi" :size="14" class="text-secondary" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.toast-wrapper {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100000;
    pointer-events: none;
}

.toast-card {
    pointer-events: auto;
    background: #ffffff;
    padding: 10px 16px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
    min-width: 220px;
    max-width: 90vw;
    animation: bounce 0.3s ease;
}

.icon-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Color palettes matching premium design guidelines */
.bg-success-light {
    background-color: #f0fdf4;
}

.text-success {
    color: #22c55e !important;
}

.bg-danger-light {
    background-color: #fef2f2;
}

.text-danger {
    color: #ef4444 !important;
}

.bg-warning-light {
    background-color: #fffbeb;
}

.text-warning {
    color: #f59e0b !important;
}

.toast-message {
    font-size: 13.5px;
    letter-spacing: -0.1px;
    white-space: nowrap;
}

.btn-close-toast {
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
}

.btn-close-toast:hover {
    opacity: 1;
}

/* Animations */
.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from {
    opacity: 0;
    transform: translate(-50%, -20px);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
}

@keyframes bounce {
    0% {
        transform: scale(0.95);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
