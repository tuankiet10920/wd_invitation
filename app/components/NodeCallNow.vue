<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isEditor = computed(() => route.path.includes('/editor'));

defineProps<{
    phoneNumber?: string;
    text?: string;
    showIcon?: boolean;
    iconSize?: number;
    iconColor?: string;
    backgroundColor?: string;
    textColor?: string;
    icon?: string;
    fontSize?: number;
    fontFamily?: string;
    opacity?: number;
}>();
</script>

<template>
    <a 
        class="node-call-now d-flex align-items-center justify-content-center gap-2"
        :href="phoneNumber ? `tel:${phoneNumber}` : 'javascript:void(0)'"
        :style="{ 
            background: backgroundColor || '#ff4757', 
            color: textColor || '#ffffff',
            opacity: opacity ?? 1,
            fontFamily: fontFamily || 'Arial',
            textDecoration: 'none'
        }"
        @click="(e) => { if (!phoneNumber || isEditor) e.preventDefault(); }"
    >
        <BaseIconComponent 
            v-if="showIcon !== false"
            :name="icon || 'phone-outline'" 
            type="mdi" 
            :size="iconSize || 20" 
            :color="iconColor || textColor || '#ffffff'" 
        />
        <span class="fw-bold" :style="{ fontSize: `${fontSize || 16}px` }">{{ text || 'Gọi ngay' }}</span>
    </a>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');

.node-call-now {
    padding: 10px 24px;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s;
    white-space: nowrap;
    display: inline-flex; /* Ensures it sizes with content gracefully */
}

.node-call-now:active {
    transform: scale(0.98);
}
</style>