<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    effectSlug: {
        type: String,
        default: 'none'
    }
});

const allEffects = ref<any[]>([]);

const fetchEffects = async () => {
    try {
        const res: any = await $fetch('/api/v1/client/effects');
        if (res && res.data) {
            allEffects.value = res.data.effects || [];
        }
    } catch (e) {
        console.error("Failed to fetch falling effects", e);
    }
};

onMounted(() => {
    if (props.effectSlug !== 'none') {
        fetchEffects();
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
};

const fallingItems = computed(() => {
    if (props.effectSlug === 'none') return [];

    const effect = allEffects.value.find(e => e.slug === props.effectSlug);
    if (!effect) return [];

    let icList = parseIcons(effect.icons);
    if (icList.length === 0) {
        icList = [{ name: effect.icon, type: effect.icon_type }];
    }

    const items = [];
    const baseDuration = 8; // seconds

    // Generate 15-20 balanced falling items for preview
    for (let k = 0; k < 20; k++) {
        const icObj = icList[Math.floor(Math.random() * icList.length)];
        
        const randomLeft = `${Math.floor(Math.random() * 90) + 5}%`;
        const randomDelay = `-${Math.random() * baseDuration}s`;
        const randomWaveDelay = `-${Math.random() * 3}s`;
        const randomDuration = `${baseDuration + Math.random() * 4 - 1}s`;

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
    <div v-if="fallingItems.length > 0" class="falling-wrapper">
        <div v-for="item in fallingItems" :key="item.id" class="falling-item"
            :style="{ left: item.left, animationDelay: item.delay, animationDuration: item.duration }">
            <div class="wavy" :style="{ animationDelay: item.waveDelay }">
                <BaseIconComponent :name="item.name" :type="item.type" :size="20" :color="item.color" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.falling-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
    overflow: hidden;
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
        top: 105%;
        opacity: 0;
    }
}

@keyframes wave {
    0% {
        transform: translateX(-30px) rotate(-15deg);
    }
    100% {
        transform: translateX(30px) rotate(15deg);
    }
}
</style>
