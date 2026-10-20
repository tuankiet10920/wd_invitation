<script setup lang="ts">
const { $fancybox } = useNuxtApp()

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    dataFancybox: {
        type: String,
        required: false,
        default: 'gallery'
    },
    dataCaption: {
        type: String,
        required: false,
        default: 'Hình ảnh thuộc bản quyền của Phúc An Solutions!'
    },
    alt: {
        type: String,
        required: false,
        default: 'Hình ảnh thuộc bản quyền của Phúc An Solutions, vui lòng không copy!'
    },
    width: {
        type: [Number, String],
        required: false,
        default: 50
    },
    height: {
        type: [Number, String],
        required: false,
        default: 50
    },
    fit: {
        type: Boolean,
        required: false,
        default: false
    }
})

onMounted(() => {
    $fancybox.bind("[data-fancybox]", {
        dragToClose: true,
        fadeEffect: true
    })
})

onBeforeUnmount(() => {
    $fancybox.destroy();
})
</script>

<template>
    <a :href="url" :class="{
        'fit-image': props.fit,
        'image-hover': props.fit,
        'cursor-zoom-in': props.fit,
    }" :data-fancybox="dataFancybox" :data-caption="dataCaption">
        <NuxtImg class="ts-3" :class="{ 'fit-image': props.fit }" :src="url" :alt="alt" :width="width" :height="height" />
    </a>
</template>

<style scoped>
.fit-image {
    width: 100%;
    height: 100%;
}

.image-hover:hover img {
    scale: 1.2;
}
</style>