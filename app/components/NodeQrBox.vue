<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="node-gift d-flex flex-column align-items-center justify-content-center cursor-pointer">
        <img src="/others/gift.png" alt="Gift" class="gift-icon" draggable="false"
            @dragstart.prevent
            style="user-select: none; -webkit-user-drag: none;" />
        <span class="gift-title fw-bold mt-1" v-if="title">{{ title }}</span>
    </div>
</template>

<style scoped>
.node-gift {
    text-align: center;
    min-width: 100px;
    min-height: 100px;
}
.gift-icon {
    width: 65px;
    height: 65px;
    object-fit: contain;
    animation: bounceShake 2s infinite ease-in-out;
    transform-origin: bottom center;
}
.gift-title {
    font-size: 14px;
    color: #4a4a4a;
    font-family: inherit;
}

@keyframes bounceShake {
    0%, 100% {
        transform: scale(1) rotate(0deg);
    }
    10% {
        transform: scale(1.15) rotate(-5deg);
    }
    20% {
        transform: scale(1.15) rotate(5deg);
    }
    30% {
        transform: scale(1.15) rotate(-5deg);
    }
    40% {
        transform: scale(1.15) rotate(5deg);
    }
    50% {
        transform: scale(1) rotate(0deg);
    }
}
</style>
