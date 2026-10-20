<script setup lang="ts">
import MapComponent from './childs/MapComponent.vue';
import PaddingComponent from './childs/PaddingComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
import ColorComponent from './childs/ColorComponent.vue';
</script>

<template>
    <div>
        <MapComponent class="mb-2" />
        <ColorComponent class="mb-2" />
        <PaddingComponent class="mb-2" />
        <BorderComponent class="mb-2" />
        <BoxShadowComponent />
    </div>
</template>

<style scoped></style>
