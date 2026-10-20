<script setup lang="ts">
import CountDownComponent from './childs/CountDownComponent.vue';
import PaddingComponent from './childs/PaddingComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
</script>

<template>
    <div>
        <CountDownComponent class="mb-2" />
        <PaddingComponent class="mb-2" />
        <BorderComponent class="mb-2" />
        <BoxShadowComponent />
    </div>
</template>

<style scoped></style>
