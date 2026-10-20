<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps<{
    src?: string;
    autoplay?: boolean;
    mute?: boolean;
    controls?: boolean;
}>();

const route = useRoute();
const isEditor = computed(() => route.path.includes('/editor'));

const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URL(url).searchParams;
            videoId = urlParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            videoId = (url.split('youtu.be/')[1] || '').split('?')[0] || '';
        } else if (url.includes('youtube.com/embed/')) {
            videoId = (url.split('youtube.com/embed/')[1] || '').split('?')[0] || '';
        } else {
            videoId = url; // assume it's just the ID
        }

        if (videoId) {
            let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
            if (props.autoplay && !isEditor.value) embedUrl += '&autoplay=1';
            if (props.mute) embedUrl += '&mute=1';
            if (props.controls === false) {
                embedUrl += '&controls=0';
            } else {
                embedUrl += '&controls=1';
            }

            return embedUrl;
        }
    } catch (e) {
        return '';
    }
    return '';
}

const embedSrc = computed(() => getEmbedUrl(props.src || ''));

</script>

<template>
    <div class="node-youtube position-relative">
        <template v-if="embedSrc">
            <iframe :src="embedSrc" class="w-100 h-100 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen :style="{ 'pointer-events': isEditor ? 'none' : 'auto' }"></iframe>
            <div v-if="isEditor" class="overlay position-absolute top-0 start-0"></div>
        </template>
        <template v-else>
            <div class="youtube-placeholder d-flex flex-column align-items-center justify-content-center w-100 h-100">
                <BaseIconComponent name="youtube" type="mdi" :size="48" color="#a3a3a3" />
                <span class="text-secondary fw-medium mt-2" style="font-size: 15px; color: #737373 !important;">Chưa có
                    video YouTube</span>
                <span class="text-muted mt-1" style="font-size: 13px; color: #a3a3a3 !important;">Nhập URL video từ
                    thanh công cụ</span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.youtube-placeholder {
    background-color: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
}

.node-youtube {
    min-width: 200px;
    min-height: 150px;
}

.overlay {
    z-index: 10;
}
</style>