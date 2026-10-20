<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import type { DataSEO } from "~~/interfaces";
import QrcodeVue from 'qrcode.vue';

definePageMeta({
    layout: 'blank'
})

const route = useRoute();
const slug = route.params.slug as string;
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

const { data: response } = await useFetch<any>(`/api/v1/client/card-template/${slug}`);
const cardItem = response.value?.data;

console.log('cardItem: ', cardItem);

const config = useRuntimeConfig();
const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;

const fullCardUrl = computed(() => {
    return `${siteUrl}/s/${slug}`;
});

if (cardItem) {
    const rawTitle = cardItem.name || 'Thiệp Cưới Của Chúng Tôi';
    const desc = cardItem.meta_desc || `Mời bạn đến dự đám cưới của ${rawTitle}`;
    const imagePath = cardItem.avatar ? (cardItem.avatar.includes('/') ? cardItem.avatar : `/images/wcards/${cardItem.avatar}`) : '';

    const seoData: DataSEO = {
        title: rawTitle,
        description: desc,
        og_title: rawTitle,
        og_description: desc,
        og_image: imagePath,
        og_url: `${siteUrl}/s/pc/${slug}`,
        og_type: "website",
        twitter_card: "summary_large_image",
        twitter_title: rawTitle,
        twitter_image: imagePath,
        twitter_site: "@cinelove"
    };
    useAppSeo(seoData);

    // Dynamic data mapping
    cardData.value = {
        background: cardItem.background || '#fff',
        nodes: cardItem.nodes || cardItem.properties?.nodes || [],
        music: cardItem.music || cardItem.properties?.music,
        effect: cardItem.effect || cardItem.properties?.effect,
        height: cardItem.height || cardItem.properties?.height || 1024,
        likes: cardItem.likes || cardItem.properties?.likes || 0
    };
}

const isQrOpen = ref(true);
const scale = ref(1);

const updateScale = () => {
    const height = window.innerHeight;
    const padding = 40;
    const availableHeight = height - padding * 2;
    // We want the card to fit a standard mobile height proportion visually (e.g. ~850px) 
    // instead of shrinking the entire design. The WrapperComponent will handle the overflow scroll.
    const standardMobileHeight = 850;
    scale.value = Math.min(1, availableHeight / standardMobileHeight);
};

onMounted(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScale);
});
</script>
<template>
    <div class="pc-layout d-flex justify-content-center align-items-center position-relative">
        <!-- TOP LEFT LOGO -->
        <div class="brand-logo position-fixed top-0 start-0 m-3">
            <div class="logo-circle d-flex align-items-center justify-content-center" @click="navigateTo('/')">
                <BaseIconComponent name="play-circle" type="mdi" :size="20" color="#fff" />
            </div>
        </div>

        <!-- WRAPPER -->
        <WrapperComponent :card-data="cardData" :scale="scale" :slug="slug" />

        <!-- QR WIDGET -->
        <div v-if="isQrOpen"
            class="qr-widget floating-effect position-fixed bottom-0 end-0 m-4 bg-white shadow rounded-3 p-3">
            <button class="btn-close position-absolute top-0 end-0 m-2" style="font-size: 0.7rem;"
                @click="isQrOpen = false"></button>
            <div class="qr-code mt-2 mb-2 bg-light d-flex align-items-center justify-content-center"
                style="width: 100px; height: 100px; overflow: hidden;">
                <qrcode-vue :value="fullCardUrl" :size="80" level="H" render-as="svg" />
            </div>
            <div class="text-center text-muted" style="font-size: 10px;">
                Quét mã QR để xem<br>trên điện thoại
            </div>
        </div>
        <div v-else
            class="qr-toggle floating-effect position-fixed bottom-0 end-0 m-4 shadow-sm bg-white rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
            @click="isQrOpen = true">
            <BaseIconComponent name="qrcode" type="mdi" :size="24" color="#333" />
        </div>
    </div>
</template>
<style scoped>
.pc-layout {
    min-height: 100vh;
    background-color: #f3f4f6;
}

.brand-logo .logo-circle {
    width: 32px;
    height: 32px;
    background-color: #ff4757;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(255, 71, 87, 0.4);
}

.cursor-pointer {
    cursor: pointer;
}

.qr-widget {
    z-index: 20;
}

.qr-toggle {
    width: 40px;
    height: 40px;
}

/* Floating animation */
@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }

    100% {
        transform: translateY(0px);
    }
}

.floating-effect {
    animation: float 3s ease-in-out infinite;
}
</style>
