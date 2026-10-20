<script setup lang="ts">
import CalendarComponent from './childs/CalendarComponent.vue';
import PaddingComponent from './childs/PaddingComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
</script>
<template>
    <div>
        <CalendarComponent class="mb-2" />
        <PaddingComponent class="mb-2" />
        <BorderComponent class="mb-2" />
        <BoxShadowComponent />
    </div>
</template>
<style scoped></style>
