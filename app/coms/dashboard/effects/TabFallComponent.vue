<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonCustomCompomnent from '~/coms/button/ButtonCustomCompomnent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    effects: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});

const editor = useEditorStore();
const selectedEffect = ref(editor.effect?.falling || 'none');

const isEnabled = computed({
    get: () => selectedEffect.value !== 'none',
    set: (val) => {
        if (val) {
            selectedEffect.value = props.effects.length > 0 ? props.effects[0].slug : 'falling-snowflake';
        } else {
            selectedEffect.value = 'none';
        }
    }
});

const handleEffectSelect = (slug: string) => {
    if (!isEnabled.value) {
        isEnabled.value = true;
    }
    selectedEffect.value = slug;
};

// watch changes to save automatically
watch(selectedEffect, (val) => {
    if (editor.effect) {
        editor.effect.falling = val;
    }
});

const parseIcons = (iconsData: any) => {
    if (!iconsData) return [];
    if (typeof iconsData === 'string') {
        try {
            return JSON.parse(iconsData);
        } catch (e) {
            return [];
        }
    }
    return Array.isArray(iconsData) ? iconsData : [];
}


const fallingItems = computed(() => {
    if (!isEnabled.value || selectedEffect.value === 'none') return [];

    const effect = props.effects.find(e => e.slug === selectedEffect.value);
    if (!effect) return [];

    let icList = parseIcons(effect.icons);
    if (icList.length === 0) {
        icList = [{ name: effect.icon, type: effect.icon_type }];
    }

    const items = [];
    const baseDuration = 8; // seconds

    // 1. Standard 3 paths to ensure basic coverage
    const stdPositions = ['15vw', '50vw', '85vw']; 
    for (let i = 0; i < 3; i++) {
        let icObj;
        let colorIndex = i;

        if (icList.length === 1) {
            icObj = icList[0];
            colorIndex = 0;
        } else if (icList.length === 2) {
            icObj = (i === 1) ? icList[1] : icList[0];
            colorIndex = (i === 1) ? 1 : 0;
        } else {
            icObj = icList[i] || icList[0];
            colorIndex = i;
        }

        for (let j = 0; j < 2; j++) {
            const delay = (j * (baseDuration / 2)) + (i * 1.5);
            const waveDelay = (i * 0.7) + (j * 1.2);
            
            items.push({
                id: `${effect.slug}-std-${i}-${j}`,
                name: icObj.name,
                type: icObj.type,
                left: stdPositions[i],
                delay: `-${delay}s`,
                waveDelay: `-${waveDelay}s`,
                duration: `${baseDuration}s`,
                color: icObj.color || '#3b82f6'
            });
        }
    }

    // 2. Add completely random items for a full, natural screen coverage
    // Generate 15 random independent items
    for (let k = 0; k < 15; k++) {
        const colorIndex = Math.floor(Math.random() * icList.length);
        const icObj = icList[colorIndex];
        
        const randomLeft = `${Math.floor(Math.random() * 90) + 5}vw`;
        const randomDelay = `-${Math.random() * baseDuration}s`;
        const randomWaveDelay = `-${Math.random() * 3}s`;
        const randomDuration = `${baseDuration + Math.random() * 4 - 1}s`; // Vary falling speed

        items.push({
            id: `${effect.slug}-rnd-${k}`,
            name: icObj.name,
            type: icObj.type,
            left: randomLeft,
            delay: randomDelay,
            waveDelay: randomWaveDelay,
            duration: randomDuration,
            color: icObj.color || '#3b82f6'
        });
    }

    return items;
});
</script>

<template>
    <div>
        <div class="px-2 mb-4">
            <h6 class="fw-bold mb-1 text-dark">Chọn hiệu ứng</h6>
            <p class="text-muted small mb-3">Chọn loại hiệu ứng thả rơi bạn muốn hiển thị</p>

            <!-- BOX THONG TIN HIEU UNG ROI -->
            <div
                class="enable-panel p-3 mb-4 position-relative d-flex justify-content-between align-items-center bg-gray-50 rounded-lg">
                <div class="crown-icon position-absolute rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                    style="top: -10px; right: -10px; width: 26px; height: 26px; z-index: 10;">
                    <BaseIconComponent name="crown" type="mdi" :size="16" color="#fff" />
                </div>
                <div class="pe-2" style="max-width: 90%;">
                    <h6 class="fw-bold mb-1 text-dark">Hiệu ứng rơi</h6>
                    <p class="text-muted small mb-0 text-wrap">Thêm hiệu ứng rơi cho trang của bạn</p>
                </div>
                <div class="form-check form-switch m-0 fs-3">
                    <input class="form-check-input custom-switch cursor-pointer shadow-sm" type="checkbox" role="switch"
                        v-model="isEnabled">
                </div>
            </div>

            <div class="row g-3" v-if="isEnabled">
                <div v-for="effect in effects" :key="effect.id" class="col-4">
                    <div class="effect-item-square d-flex align-items-center justify-content-center position-relative"
                        :class="{ 'active': selectedEffect === effect.slug }" @click="handleEffectSelect(effect.slug)">

                        <div v-if="selectedEffect === effect.slug"
                            class="check-indicator position-absolute d-flex align-items-center justify-content-center bg-primary text-white rounded-circle"
                            style="top: 8px; right: 8px; width: 22px; height: 22px;">
                            <BaseIconComponent name="check" type="mdi" :size="16" color="#fff" />
                        </div>

                        <div class="effect-icon">
                            <!-- Render icons array if present, otherwise fallback to standard icon -->
                            <div v-if="parseIcons(effect.icons).length > 0" class="d-flex align-items-center gap-1">
                                <BaseIconComponent v-for="(icObj, index) in parseIcons(effect.icons)" :key="index"
                                    :name="icObj.name" :type="icObj.type"
                                    :size="icObj.name === 'snowflake' && effect.slug === 'falling-mixed' ? 16 : 16"
                                    :color="icObj.color || '#3b82f6'" />
                            </div>
                            <BaseIconComponent v-else :name="effect.icon" :type="effect.icon_type || 'mdi'" :size="16"
                                :color="'#3b82f6'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <div v-if="fallingItems.length > 0" class="falling-container">
                <div v-for="item in fallingItems" :key="item.id" class="falling-item"
                    :style="{ left: item.left, animationDelay: item.delay, animationDuration: item.duration }">
                    <div class="wavy" :style="{ animationDelay: item.waveDelay }">
                        <BaseIconComponent :name="item.name" :type="item.type" :size="20" :color="item.color" />
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.bg-gray-50 {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
}

.rounded-lg {
    border-radius: 12px;
}

.custom-switch:not(:checked) {
    background-color: #cbd5e1;
    /* slate-300 */
    border-color: #94a3b8;
    /* slate-400 */
}

.custom-switch:checked {
    background-color: #3b82f6;
    border-color: #2563eb;
}

.effect-item-square {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    height: 90px;
    background-color: #f9fafb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.effect-item-square:hover {
    border-color: #93c5fd;
    background-color: #eff6ff;
}

.effect-item-square.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
    border-width: 2px;
}

.check-indicator {
    z-index: 10;
}

.opacity-50 {
    opacity: 0.5;
}

.pointer-events-none {
    pointer-events: none;
}

.cursor-pointer {
    cursor: pointer;
}

/* Falling Animation Styles */
.falling-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
}

.falling-item {
    position: absolute;
    top: -50px;
    animation: fall linear infinite;
    opacity: 0.85;
}

.wavy {
    animation: wave 3s ease-in-out infinite alternate;
    will-change: transform;
}

@keyframes fall {
    0% {
        top: -50px;
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        top: 100vh;
        opacity: 0;
    }
}

@keyframes wave {
    0% {
        transform: translateX(-50px) rotate(-15deg);
    }

    100% {
        transform: translateX(50px) rotate(15deg);
    }
}
</style>