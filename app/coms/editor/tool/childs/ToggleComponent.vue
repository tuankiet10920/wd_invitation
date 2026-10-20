<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

function toggle() {
    emit('update:modelValue', !props.modelValue);
}
</script>

<template>
    <div class="toggle-switch" :class="{ 'active': modelValue }" @click="toggle">
        <div class="toggle-thumb"></div>
    </div>
</template>

<style scoped>
.toggle-switch {
    width: 44px;
    height: 24px;
    background-color: #d1d5db;
    /* Grey like the image */
    border-radius: 999px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    flex-shrink: 0;
}

.toggle-switch.active {
    background-color: #3b82f6;
    /* Blue active state */
}

.toggle-thumb {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
}

.toggle-switch.active .toggle-thumb {
    transform: translateX(20px);
}
</style>