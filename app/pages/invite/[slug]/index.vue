<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import type { DataSEO } from "~~/interfaces";

definePageMeta({
    layout: 'blank'
})

const route = useRoute();
const token = route.params.slug as string; // in URL it's /invite/[slug]
const cardData = ref<{
    background: string;
    nodes: any[];
    music?: {
        icon: string;
        color: string;
        path: string;
    } | null;
    height?: number;
    effect?: any;
    likes?: number;
} | null>(null);

const { data: response } = await useFetch<any>(`/api/v1/client/invite/${token}`);
const inviteData = response.value?.data;
const cardItem = inviteData?.card;
const invitorItem = inviteData?.invitor;

const config = useRuntimeConfig();
const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;

if (cardItem) {
    // Determine guest name if possible
    let guestName = '';
    try {
        const contentData = JSON.parse(invitorItem?.content || '{}');
        guestName = contentData.value || '';
    } catch (e) {
        guestName = invitorItem?.content || '';
    }

    const rawTitle = cardItem.name || 'Thiệp Cưới Của Chúng Tôi';
    const desc = cardItem.meta_desc || `Mời ${guestName || 'bạn'} đến dự đám cưới của ${rawTitle}`;
    const imagePath = cardItem.avatar ? (cardItem.avatar.includes('/') ? cardItem.avatar : `/images/wcards/${cardItem.avatar}`) : '';

    const seoData: DataSEO = {
        title: rawTitle,
        description: desc,
        og_title: rawTitle,
        og_description: desc,
        og_image: imagePath,
        og_url: `${siteUrl}/invite/${token}`,
        og_type: "website",
        twitter_card: "summary_large_image",
        twitter_title: rawTitle,
        twitter_image: imagePath,
        twitter_site: "@cinelove"
    };
    useAppSeo(seoData);

    cardData.value = {
        background: cardItem.background || '#fff',
        nodes: cardItem.nodes || cardItem.properties?.nodes || [],
        music: cardItem.music || cardItem.properties?.music,
        effect: cardItem.effect || cardItem.properties?.effect,
        height: cardItem.height || cardItem.properties?.height || 1024,
        likes: cardItem.likes || cardItem.properties?.likes || 0
    };
}

const isDesktop = ref(true);
const scale = ref(1);

const updateScaleAndLayout = () => {
    if (typeof window === 'undefined') return;
    
    isDesktop.value = window.innerWidth > 1024;
    
    if (isDesktop.value) {
        const height = window.innerHeight;
        const padding = 40;
        const availableHeight = height - padding * 2;
        const standardMobileHeight = 850;
        scale.value = Math.min(1, availableHeight / standardMobileHeight);
    } else {
        scale.value = 1;
    }
};

onMounted(() => {
    updateScaleAndLayout();
    window.addEventListener('resize', updateScaleAndLayout);
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateScaleAndLayout);
    }
});
</script>

<template>
    <div>
        <!-- Notice if not found -->
        <div v-if="!cardItem" class="vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
            <BaseIconComponent name="alert-circle" type="lucide" :size="64" color="#dc3545" class="mb-3" />
            <h4 class="fw-bold">Không tìm thấy thiệp mời</h4>
            <p class="text-muted">Đường link này có thể đã hết hạn hoặc không tồn tại.</p>
        </div>

        <!-- PC Layout -->
        <div v-else-if="isDesktop" class="pc-layout d-flex justify-content-center align-items-center position-relative">
            <WrapperComponent :card-data="cardData" :scale="scale" :slug="cardItem.url" />
        </div>

        <!-- Mobile Layout -->
        <div v-else class="mobile-layout position-relative overflow-hidden w-100 vh-100">
            <WrapperComponent :card-data="cardData" :scale="1" :fullscreen="true" :slug="cardItem.url" />
        </div>
    </div>
</template>

<style scoped>
.pc-layout {
    min-height: 100vh;
    background-color: #f3f4f6;
}

.mobile-layout {
    background-color: #fff;
}
</style>
