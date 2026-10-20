<script setup lang="ts">
import PhotoAlbumComponent from './childs/PhotoAlbumComponent.vue';
import CustomShowPhotoAlbumComponent from './childs/CustomShowPhotoAlbumComponent.vue';
import PaddingComponent from './childs/PaddingComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
import ColorComponent from './childs/ColorComponent.vue';
</script>

<template>
    <div>
        <PhotoAlbumComponent class="mb-2" />
        <CustomShowPhotoAlbumComponent class="mb-2" />
        <ColorComponent class="mb-2" />
        <PaddingComponent class="mb-2" />
        <BorderComponent class="mb-2" />
        <BoxShadowComponent />
    </div>
</template>

<style scoped></style>