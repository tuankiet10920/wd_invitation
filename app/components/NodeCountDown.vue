<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const props = defineProps<{
    date?: string;
    time?: string;
    direction?: string;
    gap?: number | string;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    fontSize?: number | string;
    fontFamily?: string;
    opacity?: number | string;
}>();

const timeUnits = ref([
    { value: 0, label: 'ngày' },
    { value: 0, label: 'giờ' },
    { value: 0, label: 'phút' },
    { value: 0, label: 'giây' },
]);

let timer: NodeJS.Timeout | null = null;

const updateCountdown = () => {
    if (!props.date) {
        setZeros();
        return;
    }

    const dateStr = props.time ? `${props.date}T${props.time}` : `${props.date}T00:00:00`;
    const targetDate = new Date(dateStr).getTime();
    
    if (isNaN(targetDate)) {
        setZeros();
        return;
    }

    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        setZeros();
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    timeUnits.value = [
        { value: d, label: 'ngày' },
        { value: h, label: 'giờ' },
        { value: m, label: 'phút' },
        { value: s, label: 'giây' },
    ];
};

const setZeros = () => {
    timeUnits.value = [
        { value: 0, label: 'ngày' },
        { value: 0, label: 'giờ' },
        { value: 0, label: 'phút' },
        { value: 0, label: 'giây' },
    ];
};

onMounted(() => {
    updateCountdown();
    timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});

watch(() => [props.date, props.time], () => {
    updateCountdown();
});

const wrapperStyle = computed(() => {
    return {
        display: 'flex',
        flexDirection: (props.direction === 'vertical' ? 'column' : 'row') as any,
        gap: `${props.gap ?? 20}px`,
        opacity: props.opacity ?? 1,
        fontFamily: props.fontFamily || 'Roboto',
    };
});

const itemStyle = computed(() => {
    const fs = Number(props.fontSize || 20);
    return {
        backgroundColor: props.backgroundColor || '#000000',
        borderColor: props.borderColor || '#000000',
        color: props.textColor || '#ffffff',
        borderWidth: '1px',
        borderStyle: 'solid',
        fontSize: `${fs}px`,
        width: `${fs * 3}px`,
        minWidth: '60px',
        padding: `${fs * 0.4}px 0`,
    };
});
</script>

<template>
    <div :style="wrapperStyle">
        <div v-for="(unit, index) in timeUnits" :key="index"
             class="countdown-item d-flex flex-column align-items-center justify-content-center shadow-sm"
             :style="itemStyle">
            <span class="number fw-bold" :style="{ lineHeight: 1.2 }">{{ unit.value < 10 && unit.value >= 0 ? '0' + unit.value : unit.value }}</span>
            <span class="label" :style="{ fontSize: `${Number(props.fontSize || 20) * 0.55}px` }">{{ unit.label }}</span>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Verdana&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Arial&display=swap');

.countdown-item {
    border-radius: 8px;
    transition: all 0.3s ease;
    user-select: none;
}
.number {
    display: block;
}
.label {
    text-transform: uppercase;
    font-weight: 500;
    opacity: 0.9;
    margin-top: 2px;
}
</style>