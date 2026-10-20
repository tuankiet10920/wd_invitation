<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue);

watch(isOpen, (newValue) => {
    if (import.meta.client) document.body.style.overflow = newValue ? 'hidden' : ''
    emits('update:modelValue', newValue)
});

watch(() => props.modelValue, (newValue) => {
    isOpen.value = newValue
})

onUnmounted(() => {
    if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
    <div class="modal-auth">
        <Transition name="paper-extract">
            <div v-if="isOpen" class="modal-full-wrapper">
                <div class="modal-overlay" @click="isOpen = false"></div>

                <!-- <button class="close-btn d-lg-none" @click="isOpen = false">✕</button> -->

                <div class="modal-container">
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: black;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10005;
    cursor: pointer;
    backdrop-filter: blur(4px);
}

.modal-auth {
    position: absolute;
}

.contact-trigger {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    z-index: 10000;
    border: none;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

.modal-full-wrapper {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    /* Gốc loang từ vị trí nút bấm (góc dưới phải) */
}

.modal-container {
    position: relative;
    z-index: 1001;
}

/* HIỆU ỨNG RÚT GIẤY (PAPER EXTRACT) */

/* 1. Animation cho toàn bộ Wrapper (bao gồm Overlay) */
.paper-extract-enter-active,
.paper-extract-leave-active {
    transition: opacity 0.4s ease;
}

.paper-extract-enter-from,
.paper-extract-leave-to {
    opacity: 0;
}

/* 2. Animation riêng cho phần Content */
.paper-extract-enter-active .modal-container {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.paper-extract-enter-from .modal-container {
    opacity: 0;
    transform: scale(0.9);
}

.paper-extract-leave-active .modal-container {
    transition: all 0.3s ease;
}

.paper-extract-leave-to .modal-container {
    opacity: 0;
    transform: scale(0.95);
}

@media (max-width: 768px) {
    .modal-container {
        max-width: 95%;
        width: auto;
        padding: 4px;
        box-sizing: border-box;
        height: 90vh;
        display: flex;
    }

    .close-btn {
        top: 15px;
        right: 15px;
        width: 36px;
        height: 36px;
    }
}

@media (min-width: 1024px) {
    .modal-container {
        height: fit-content;
    }
}
</style>