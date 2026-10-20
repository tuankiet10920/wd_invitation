<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import type { DataSEO } from "~~/interfaces";
import QrcodeVue from 'qrcode.vue';
import { useUserStore } from '~~/stores/user';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import AuthComponent from '~/coms/user/auth/AuthComponent.vue';

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
        og_url: `${siteUrl}/template/${slug}`,
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

const store = useUserStore();
const isUsing = ref(false);
type Auth = 'login' | 'register';
const auth_r = ref<Auth>('login');

const handleUse = async () => {
    if (!store.isLogin) {
        store.openModal = true;
        return;
    }

    if (isUsing.value || !cardItem) return;
    isUsing.value = true;

    try {
        const response = await $fetch<any>('/api/v1/client/card-template', {
            method: 'POST',
            body: {
                name: `Mẫu-${cardItem.name}`,
                properties: {
                    nodes: cardItem.nodes || cardItem.properties?.nodes || [],
                    background: cardItem.background,
                    music: cardItem.music || cardItem.properties?.music,
                    effect: cardItem.effect || cardItem.properties?.effect,
                    height: cardItem.height || cardItem.properties?.height || 1024
                }
            }
        });

        if (response.success && response.data?.url) {
            const url = response.data.url;
            const targetPath = window.innerWidth < 1024 ? `/editor/m/${url}` : `/editor/${url}`;
            navigateTo(targetPath);
        }
    } catch (e) {
        console.error("Failed to clone template", e);
        alert("Có lỗi xảy ra khi tạo thiệp. Vui lòng thử lại sau.");
    } finally {
        isUsing.value = false;
    }
};

const isDesktop = ref(true);
const isQrOpen = ref(true);
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
    
    // Increment view count
    $fetch('/api/v1/client/card-template/view', {
        method: 'POST',
        body: { slug }
    }).catch(() => { });
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateScaleAndLayout);
    }
});
</script>
<template>
    <div>
        <!-- Use Template Button -->
        <div class="position-fixed top-0 start-0 m-3 z-index-top">
            <button @click="handleUse" :disabled="isUsing" class="btn btn-primary shadow d-flex align-items-center rounded-pill px-3 py-2 border-0">
                <BaseIconComponent :name="isUsing ? 'loading' : 'content-copy'" :class="{ 'mdi-spin': isUsing }" type="mdi" :size="20" color="#fff" />
                <span class="fw-bold ms-2 fs-6">{{ isDesktop ? (isUsing ? 'Đang tạo...' : 'Dùng mẫu này') : (isUsing ? '...' : 'Dùng') }}</span>
            </button>
        </div>

        <!-- PC Layout -->
        <div v-if="isDesktop" class="pc-layout d-flex justify-content-center align-items-center position-relative">
            <WrapperComponent :card-data="cardData" :scale="scale" :slug="slug" :is-template="true" />

            <!-- QR WIDGET -->
            <div v-if="isQrOpen"
                class="qr-widget floating-effect position-fixed bottom-0 end-0 m-4 bg-white shadow rounded-3 p-3 z-index-top">
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
                class="qr-toggle floating-effect position-fixed bottom-0 end-0 m-4 shadow-sm bg-white rounded-circle d-flex align-items-center justify-content-center cursor-pointer z-index-top"
                @click="isQrOpen = true">
                <BaseIconComponent name="qrcode" type="mdi" :size="24" color="#333" />
            </div>
        </div>

        <!-- Mobile Layout -->
        <div v-else class="mobile-layout position-relative overflow-hidden w-100 vh-100">
            <WrapperComponent :card-data="cardData" :scale="1" :fullscreen="true" :slug="slug" :is-template="true" />
        </div>

        <!-- Auth Modal -->
        <ModalZoomCenterComponent v-model="store.openModal" style="z-index: 9999;">
            <AuthComponent :auth="auth_r" />
        </ModalZoomCenterComponent>
    </div>
</template>
<style scoped>
.z-index-top {
    z-index: 2000;
}

.pc-layout {
    min-height: 100vh;
    background-color: #f3f4f6;
}

.cursor-pointer {
    cursor: pointer;
}

.qr-toggle {
    width: 40px;
    height: 40px;
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

.floating-effect {
    animation: float 3s ease-in-out infinite;
}
</style>
