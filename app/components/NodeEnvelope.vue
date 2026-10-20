<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps<{
    displayMode?: string;
    lockScroll?: boolean;
    imageSrc?: string;
    colorTop?: string;
    colorSides?: string;
    colorBottom?: string;
    enableAnimation?: boolean;
    isPreviewOpen?: boolean;
    modalText?: string;
    modalFontSize?: number;
    modalFontFamily?: string;
    modalColor?: string;
    backdropOpacity?: number;
}>();

const route = useRoute();
const isEditor = computed(() => route.path.includes('/editor'));
const isFloating = computed(() => route.path.includes('/s/') || route.path.includes('/template/') || route.path.includes('/invite/'));

const isOpen = ref(false);
const isFullyOpened = ref(false);
let openTimer: any;

const toggleOpen = () => {
    // In editor view mode, preview prop handles this usually from custom panel
    if (isEditor.value) return;

    isOpen.value = !isOpen.value;

    if (isOpen.value && props.displayMode === 'modal') {
        // wait for animation to complete before removing modal
        openTimer = setTimeout(() => {
            isFullyOpened.value = true;
        }, 1800); // 1.8s
    } else {
        isFullyOpened.value = false;
        clearTimeout(openTimer);
    }
}

watch(() => props.isPreviewOpen, (val) => {
    if (val !== undefined && isEditor.value) {
        isOpen.value = val;
    }
});

// Modal mode scroll lock
watch([isOpen, isFullyOpened, () => props.displayMode], () => {
    if (!isEditor.value && props.displayMode === 'modal') {
        if (isOpen.value && !isFullyOpened.value && props.lockScroll) {
             document.body.style.overflow = 'hidden';
        } else if (isFullyOpened.value || !isOpen.value) {
             document.body.style.overflow = '';
        }
    }
}, { immediate: true });

onUnmounted(() => {
    clearTimeout(openTimer);
    document.body.style.overflow = '';
});

</script>

<template>
    <div class="node-envelope" 
         :class="{ 'is-editor': isEditor, 'is-modal': displayMode === 'modal' && !isEditor, 'is-floating': isFloating }"
         :style="{ '--c-backdrop': `rgba(0,0,0,${((backdropOpacity !== undefined ? backdropOpacity : 60) / 100).toFixed(2)})` }">
        
        <!-- Shadow - Only visible when floating -->
        <div v-if="isFloating && !isEditor" class="env-shadow"></div>

        <div v-if="displayMode === 'modal' && !isEditor && !isFullyOpened" 
             class="modal-hint-text position-absolute w-100 text-center"
             :style="{ 
                 top: '30%', 
                 transform: 'translateY(-50%)',
                 zIndex: 10001,
                 fontSize: `${modalFontSize || 18}px`,
                 fontFamily: modalFontFamily || 'Arial',
                 color: modalColor || '#333333',
                 pointerEvents: 'none'
             }">
            {{ modalText || 'Chạm vào để mở' }}
        </div>

        <div v-show="!(displayMode === 'modal' && !isEditor && isFullyOpened)" class="env-wrapper"
            :class="{ 'fade-out': isFullyOpened && displayMode === 'modal' && !isEditor }">

            <div class="env-container" :class="{ 'no-anim': enableAnimation === false }" @click="toggleOpen"
                :style="{ '--c-top': colorTop || '#812927', '--c-sides': colorSides || '#A33F3D', '--c-bottom': colorBottom || '#A84644' }">

                <!-- Hearts Burst (Appear when opening) -->
                <div v-if="isOpen && !isEditor" class="heart-burst">
                    <div class="heart h1"><BaseIconComponent name="heart" type="mdi" :size="24" color="#ff4d4d" /></div>
                    <div class="heart h2"><BaseIconComponent name="heart" type="mdi" :size="20" color="#ff4d4d" /></div>
                    <div class="heart h3"><BaseIconComponent name="heart" type="mdi" :size="28" color="#ff4d4d" /></div>
                </div>

                <!-- Back Side (inside envelope) -->
                <div class="env-back bg-dark opacity-75 shadow-lg"></div>

                <!-- Flaps -->
                <div class="env-flap env-flap-left"></div>
                <div class="env-flap env-flap-right"></div>
                <div class="env-flap env-flap-bottom"></div>
                <div class="env-flap env-flap-top" :class="{ 'open': isOpen }"></div>

                <!-- Content Card - Moved to last child to be on top -->
                <div class="env-card" :class="{ 'open': isOpen }">
                    <img :src="imageSrc || '/others/map.jpg'"
                        class="w-100 h-100 object-fit-cover shadow-sm bg-white p-1" />
                </div>

                <!-- Seal -->
                <div class="env-seal" :class="{ 'open': isOpen }">
                    <div class="css-seal d-flex align-items-center justify-content-center">
                        <BaseIconComponent name="heart" type="mdi" :size="18" color="#bd7622" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.node-envelope {
    position: relative;
}

/* Floating animation */
.is-floating {
    animation: floatAnim 3s ease-in-out infinite;
}

@keyframes floatAnim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}

/* Dynamic Shadow */
.env-shadow {
    position: absolute;
    bottom: -35px;
    left: 10%;
    width: 80%;
    height: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    filter: blur(6px);
    z-index: -1;
    transition: all 0.3s ease;
    animation: shadowAnim 3s ease-in-out infinite;
}

@keyframes shadowAnim {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(0.85); opacity: 0.12; }
}

.node-envelope.is-modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: var(--c-backdrop, rgba(0, 0, 0, 0.65));
    z-index: 10000 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: none;
}

.env-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    transition: opacity 0.8s ease;
}

.node-envelope.is-modal .env-wrapper {
    width: 320px;
    height: 220px;
    max-width: 90vw;
    animation: floatAnim 3s ease-in-out infinite;
}

.env-container {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
    perspective: 1200px;
}

.env-back {
    position: absolute;
    inset: 0;
    border-radius: 4px;
}

.env-card {
    position: absolute;
    top: 6%;
    left: 6%;
    right: 6%;
    bottom: 6%;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.3s ease;
    z-index: 1;
}

.env-card.open {
    transform: translateY(-80%);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
    z-index: 10;
}

.env-flap {
    position: absolute;
    inset: 0;
    z-index: 2;
}

.env-flap-left {
    clip-path: polygon(0 0, 50% 50%, 0 100%);
    background: var(--c-sides);
}

.env-flap-right {
    clip-path: polygon(100% 0, 50% 50%, 100% 100%);
    background: var(--c-sides);
}

.env-flap-bottom {
    clip-path: polygon(0 100%, 50% 50%, 100% 100%);
    background: var(--c-bottom);
}

.env-flap-top {
    clip-path: polygon(0 0, 100% 0, 50% 50%);
    background: var(--c-top);
    z-index: 4;
    transform-origin: top;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), z-index 0.3s ease;
}

.env-flap-top.open {
    transform: rotateX(180deg);
    z-index: 0;
}

/* heart burst */
.heart-burst {
    position: absolute;
    top: 20%;
    left: 50%;
    z-index: 10;
    pointer-events: none;
}

.heart {
    position: absolute;
    opacity: 0;
}

.h1 { animation: heart1 1.5s ease-out forwards; }
.h2 { animation: heart2 1.5s ease-out 0.2s forwards; }
.h3 { animation: heart3 1.5s ease-out 0.4s forwards; }

@keyframes heart1 {
    0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translate(-150%, -100px) rotate(-20deg) scale(1.2); opacity: 0; }
}
@keyframes heart2 {
    0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translate(-50%, -150px) rotate(10deg) scale(1.1); opacity: 0; }
}
@keyframes heart3 {
    0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: translate(50%, -100px) rotate(30deg) scale(1.3); opacity: 0; }
}

.env-seal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 45px;
    height: 45px;
    z-index: 5;
    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
}

.env-seal.open {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
    pointer-events: none;
}

.css-seal {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, #fbdf88 0%, #d8942b 100%);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4);
    border: 1.5px solid #bd7622;
}

.no-anim .env-card,
.no-anim .env-flap-top,
.no-anim .env-seal,
.no-anim .env-wrapper {
    transition: none !important;
}

.fade-out {
    opacity: 0;
    pointer-events: none;
}
</style>