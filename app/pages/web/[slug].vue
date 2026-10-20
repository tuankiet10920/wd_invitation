<script setup lang="ts">
import WebCrushKiller from '~/components/WebCrushKiller.vue';

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const slug = route.params.slug as string

// Map slugs to components
const componentMap: Record<string, any> = {
    'crush-killer': WebCrushKiller,
}

const currentComponent = computed(() => componentMap[slug] || null)
</script>

<template>
    <div class="web-viewer">
        <component v-if="currentComponent" :is="currentComponent" />
        
        <div v-else class="p-5 text-center">
            <h3>Component cho website này đang được phát triển...</h3>
            <NuxtLink to="/custom-websites" class="btn btn-primary mt-3">Quay lại</NuxtLink>
        </div>
    </div>
</template>

<style scoped>
.web-viewer {
    width: 100vw;
    height: 100vh;
}
</style>