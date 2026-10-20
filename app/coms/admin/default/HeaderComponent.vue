<script setup lang="ts">
import InfoComponent from '~/coms/user/InfoComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const emit = defineEmits(['toggle-sidebar'])
</script>
<template>
    <nav class="d-flex justify-content-between align-items-center px-3">
        <button class="btn border-0 d-lg-none d-none d-md-block" @click="emit('toggle-sidebar')">
            <BaseIconComponent name="menu" type="lucide" :size="24" />
        </button>
        <div class="ms-auto">
            <InfoComponent />
        </div>
    </nav>
</template>
<style scoped>
nav {
    width: 100%;
    height: 80px;
    background-color: #fff;
}

.box {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(37, 76, 192);
}
</style>