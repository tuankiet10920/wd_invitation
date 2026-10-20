<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainComponent from '~/coms/mobiles/editor/MainComponent.vue'

definePageMeta({
    layout: 'blank'
})

const route = useRoute();
const router = useRouter();

const checkDesktop = () => {
    if (import.meta.client && window.innerWidth >= 768) {
        const slug = route.params.slug;
        router.replace(`/editor/${slug}`);
    }
};

onMounted(() => {
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkDesktop);
});
</script>
<template>
    <MainComponent />
</template>
<style scoped></style>