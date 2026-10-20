<script setup lang="ts">
import BaseIconComponent from '../../icons/BaseIconComponent.vue';

const emit = defineEmits(['click']);

const handleClick = () => {
    emit('click');
}
</script>

<template>
    <div class="fab-wrapper" @click="handleClick">
        <div class="fab-button shadow">
            <BaseIconComponent name="settings" type="lucide" :size="24" color="#333" />
        </div>
    </div>
</template>

<style scoped>
.fab-wrapper {
    position: fixed;
    right: 20px;
    bottom: 15%;
    /* ABOVE BOTTOM NAV */
    z-index: 1040;
}

.fab-button {
    width: 54px;
    height: 54px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.fab-button:active {
    transform: scale(0.9);
}

.fab-button:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.shadow {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08) !important;
}
</style>
