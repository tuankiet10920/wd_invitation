<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps<{
    images?: string[];
    width?: number | string;
    height?: number | string;
    
    // Display Props from Editor
    showThumbnail?: boolean;
    showNav?: boolean;
    showDots?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
    loop?: boolean;
}>();

const albumImages = computed(() => {
    return props.images || [];
});

const config = computed(() => ({
    showThumbnail: props.showThumbnail ?? true,
    showNav: props.showNav ?? true,
    showDots: props.showDots ?? true,
    autoplay: props.autoplay ?? true,
    autoplayDelay: props.autoplayDelay ?? 5000,
    loop: props.loop ?? true
}));

const activeIndex = ref(0);
const autoplayInterval = ref<any>(null);

const nextSlide = () => {
    if (albumImages.value.length === 0) return;
    
    if (activeIndex.value === albumImages.value.length - 1) {
        if (config.value.loop) {
            activeIndex.value = 0;
        } else {
            stopAutoplay();
        }
    } else {
        activeIndex.value++;
    }
};

const prevSlide = () => {
    if (albumImages.value.length === 0) return;
    
    if (activeIndex.value === 0) {
        if (config.value.loop) {
            activeIndex.value = albumImages.value.length - 1;
        }
    } else {
        activeIndex.value--;
    }
};

const goToSlide = (idx: number) => {
    if (idx < albumImages.value.length) {
        activeIndex.value = idx;
        resetAutoplay();
    }
};

const route = useRoute();
const editor = useEditorStore();
const isEditorCanvas = computed(() => {
    return route.path.startsWith('/editor') && !editor.isPreviewMode;
});

const startAutoplay = () => {
    stopAutoplay();
    if (isEditorCanvas.value) return; // Không tự động chạy slide khi đang thiết kế trong canvas
    if (config.value.autoplay && albumImages.value.length > 1) {
        autoplayInterval.value = setInterval(() => {
            nextSlide();
        }, config.value.autoplayDelay);
    }
};

const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        autoplayInterval.value = null;
    }
};

const resetAutoplay = () => {
    stopAutoplay();
    if (config.value.autoplay && !isEditorCanvas.value) {
        startAutoplay();
    }
};

onMounted(() => {
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
});

watch(() => editor.isPreviewMode, (preview) => {
    if (preview) {
        startAutoplay();
    } else {
        stopAutoplay();
    }
});

// Watch for prop changes from the Editor UI
watch(() => [config.value.autoplay, config.value.autoplayDelay], () => {
    resetAutoplay();
}, { deep: true });

watch(() => albumImages.value.length, (newLen) => {
    if (newLen > 0 && activeIndex.value >= newLen) {
        activeIndex.value = 0;
    }
    resetAutoplay();
});

// Calculate Thumbnail Track Transform
const thumbTrackTransform = computed(() => {
    if (!config.value.showThumbnail) return 'none';
    
    const thumbWidthPercent = 33.3333;
    let shiftIndex = 0;
    if (activeIndex.value >= 3) {
        shiftIndex = activeIndex.value - 2;
    }
    
    const maxShift = Math.max(0, albumImages.value.length - 3);
    shiftIndex = Math.min(shiftIndex, maxShift);
    
    return `translateX(-${shiftIndex * (thumbWidthPercent + 1)}%)`;
});

</script>

<template>
    <div class="node-photo-album d-flex flex-column gap-2 p-1 overflow-hidden"
        :style="{ width: '100%', height: '100%', minHeight: '300px' }">

        <!-- Main Area (Custom Slider) -->
        <div class="main-container flex-grow-1 position-relative w-100 overflow-hidden">
            <template v-if="albumImages.length > 0">
                <div class="slider-wrapper w-100 h-100">
                    <TransitionGroup name="fade">
                        <div v-for="(img, idx) in albumImages" 
                             :key="idx" 
                             v-show="idx === activeIndex"
                             class="slide-item position-absolute top-0 start-0 w-100 h-100">
                            <img :src="img" class="w-100 h-100 object-fit-cover rounded-2 shadow-sm" alt="Album Photo" />
                        </div>
                    </TransitionGroup>
                </div>

                <!-- Navigation Buttons -->
                <button v-if="config.showNav" class="nav-btn prev-btn" @click.stop="prevSlide">
                    <BaseIconComponent name="chevron-left" type="mdi" :size="20" color="#333" />
                </button>
                <button v-if="config.showNav" class="nav-btn next-btn" @click.stop="nextSlide">
                    <BaseIconComponent name="chevron-right" type="mdi" :size="20" color="#333" />
                </button>

                <!-- Indicator dots -->
                <div v-if="config.showDots" class="dots-overlay d-flex gap-1 justify-content-center w-100">
                    <div v-for="(dot, dIdx) in albumImages" :key="dIdx" 
                         class="indicator-dot" 
                         :class="{ 'active': dIdx === activeIndex }"
                         @click.stop="goToSlide(dIdx)">
                    </div>
                </div>
            </template>

            <div v-else
                class="main-placeholder w-100 h-100 d-flex flex-column align-items-center justify-content-center border-dashed">
                <BaseIconComponent name="image-outline" type="mdi" :size="48" color="#ccc" />
                <span class="text-secondary mt-2 fs-12">Chưa có ảnh</span>
            </div>
        </div>

        <!-- Thumbnails Area (Auto-scrolling Track) -->
        <div v-if="config.showThumbnail" 
             class="thumb-container overflow-hidden w-100 position-relative" style="height: 80px; min-height: 80px;">
            <template v-if="albumImages.length > 0">
                <div class="thumb-track d-flex gap-2 h-100" 
                     :style="{ transform: thumbTrackTransform }">
                    <div v-for="(img, idx) in albumImages" :key="idx" 
                        class="thumb-box overflow-hidden cursor-pointer flex-shrink-0"
                        :class="{ 'thumb-box--active': activeIndex === idx }"
                        @click.stop="goToSlide(idx)"
                        style="width: calc(33.333% - 6px);">
                        <img :src="img" class="w-100 h-100 object-fit-cover rounded-2" />
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="thumb-track d-flex gap-2 h-100 w-100">
                    <div v-for="i in 3" :key="i" 
                         class="thumb-box d-flex align-items-center justify-content-center bg-light-soft rounded-2 border flex-grow-1">
                        <BaseIconComponent name="image-outline" type="mdi" :size="20" color="#ccc" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.node-photo-album {
    border-radius: 12px;
    background-color: transparent;
}

.main-container {
    background-color: #f8f9fa;
    border-radius: 10px;
    z-index: 1;
    transition: height 0.3s ease;
}

.border-dashed {
    border: 1.5px dashed #ddd;
}

.thumb-track {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
}

.thumb-box {
    border: 1.5px solid #eee;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #fff;
    height: 100%;
}

.thumb-box--active {
    border: 2px solid #3b82f6 !important;
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);
}

.thumb-box:not(.thumb-box--active) {
    opacity: 0.8;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    background-color: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
}

.nav-btn:hover {
    background-color: #fff;
    transform: translateY(-50%) scale(1.1);
}

.prev-btn { left: 10px; }
.next-btn { right: 10px; }

.dots-overlay {
    position: absolute;
    bottom: 12px;
    left: 0;
    z-index: 5;
    pointer-events: none;
}

.indicator-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    pointer-events: auto;
    cursor: pointer;
}

.indicator-dot.active {
    background-color: #3b82f6;
    width: 18px;
    border-radius: 4px;
}

/* Slide Fade Transition */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fs-12 { font-size: 11px; }
.bg-light-soft { background-color: #f5f5f5; }

.slide-item {
    z-index: 1;
}
</style>