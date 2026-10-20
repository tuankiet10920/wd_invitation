<script setup lang="ts">
import type { PropType } from "vue";

interface PaginationInterface {
    clickable?: boolean;
    renderBullet?: any;
}
interface AutoplayInterface {
    delay?: number;
    disableOnInteraction?: boolean;
}

const containerRef = ref(null);

const props = defineProps({
    breakpoints: {
        type: Object,
        default: () => ({
            0: { slidesPerView: 1.3, spaceBetween: 10 },
            640: { slidesPerView: 3.3, spaceBetween: 20 },
            1024: { slidesPerView: 5.3, spaceBetween: 20 },
            1250: { slidesPerView: 6.3, spaceBetween: 20 },
        }),
    },
    autoplay: {
        type: [Object, Boolean] as PropType<AutoplayInterface | boolean>,
        default: false,
    },
    slidesPerView: { type: Number, default: 5 },
    spaceBetween: { type: Number, default: 15 },
    btnControl: { type: Boolean, default: true },
    pagination: {
        type: [Object, Boolean] as PropType<PaginationInterface | boolean>,
        default: false,
    },
    watchOverflow: { type: Boolean, default: true },
});
</script>

<template>
    <ClientOnly>
        <div class="swiper-parent">
            <swiper-container ref="containerRef" :slides-per-view="props.slidesPerView"
                :space-between="props.spaceBetween" :breakpoints="props.breakpoints" :autoplay="props.autoplay"
                :pagination="props.pagination" :navigation-next-el="'.custom-next-' + $.uid"
                :navigation-prev-el="'.custom-prev-' + $.uid" :watch-overflow="props.watchOverflow" class="my-swiper">
                <slot></slot>
            </swiper-container>

            <template v-if="btnControl">
                <div :class="['nav-button d-none d-lg-flex custom-prev-' + $.uid]">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </div>
                <div :class="['nav-button d-none d-lg-flex custom-next-' + $.uid]">
                    <svg viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </div>
            </template>
        </div>
    </ClientOnly>
</template>

<style scoped>
.swiper-parent {
    position: relative;
    width: 100%;
}

.nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    border: 0.5px solid #e5e7eb;
    transition: opacity 0.3s ease;
}

.nav-button svg {
    width: 24px;
    height: 24px;
    fill: #64748b;
}

.swiper-button-disabled {
    display: none !important;
}

.swiper-button-lock {
    display: none !important;
}

.nav-button:not(.custom-next-undefined):hover {
    background-color: #fff;
}

[class*="custom-prev-"] {
    left: -20px;
}

[class*="custom-next-"] {
    right: -20px;
}
</style>