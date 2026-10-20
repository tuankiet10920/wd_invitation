<script setup lang="ts">
const props = defineProps({
    active: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <Transition name="fade">
        <div v-if="active" class="loading-overlay">
            <div class="spinner">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    position: relative;
    width: 50px;
    height: 50px;
}

.dot {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #3b82f6;
    border-radius: 50%;
    top: 0;
    left: 20px;
    transform-origin: 5px 25px; /* Center of the spinner */
    animation: orbit 1.2s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -1.1s; }
.dot:nth-child(2) { animation-delay: -1.0s; }
.dot:nth-child(3) { animation-delay: -0.9s; }
.dot:nth-child(4) { animation-delay: -0.8s; }

@keyframes orbit {
    0% {
        transform: rotate(0deg);
        opacity: 1;
        scale: 1;
    }
    50% {
        scale: 0.7;
        opacity: 0.5;
    }
    100% {
        transform: rotate(360deg);
        opacity: 1;
        scale: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
