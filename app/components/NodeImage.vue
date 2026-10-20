<script setup lang="ts">
const props = defineProps({
    url: {
        type: String,
        required: true
    },
    imageType: {
        type: String,
        default: 'img'
    }
})
</script>
<template>
    <div class="node-image-container" style="width: 100%; height: 100%; overflow: hidden; user-select: none;">
        <!-- If SVG, use mask-image to allow color changes -->
        <div v-if="imageType === 'svg'" class="svg-mask" :style="({
            width: '100%',
            height: '100%',
            backgroundColor: 'currentColor',
            maskImage: `url(${url})`,
            WebkitMaskImage: `url(${url})`,
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            userSelect: 'none'
        } as any)"></div>
        <!-- Standard image -->
        <img v-else :src="url" alt="user-image" crossorigin="anonymous" draggable="false"
            @dragstart.prevent
            style="width: 100%; height: 100%; object-fit: cover; display: block; user-select: none; -webkit-user-drag: none;" />
    </div>
</template>
<style scoped>
.node-image-container {
    user-select: none;
    -webkit-user-select: none;
}
</style>