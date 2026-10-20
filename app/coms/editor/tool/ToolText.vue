<script setup lang="ts">
import TextComponent from './childs/TextComponent.vue';
import PaddingComponent from './childs/PaddingComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
</script>
<template>
    <div>
        <!-- TEXT -->
        <TextComponent class="mb-2" />

        <!-- PADDING -->
        <PaddingComponent class="mb-2" />

        <!-- BORDER -->
        <BorderComponent class="mb-2" />

        <!-- BOX SHADOW -->
        <BoxShadowComponent class="mb-2" />
    </div>
</template>
<script setup></script>