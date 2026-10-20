<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainComponent from '~/coms/editor/MainComponent.vue';

definePageMeta({
    layout: 'blank'
})

const route = useRoute();
const router = useRouter();

const checkMobile = () => {
    if (import.meta.client && window.innerWidth < 768) {
        const slug = route.params.slug;
        router.replace(`/editor/m/${slug}`);
    }
};

onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
});
</script>
<template>
    <MainComponent />
</template>
<style scoped></style>