<script setup lang="ts">
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import type { DataSEO } from "~~/interfaces";

definePageMeta({
    layout: 'blank'
})

const route = useRoute();
const slug = route.params.slug as string;
const isViewLimitReached = ref(false);
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

if (cardItem) {
    isViewLimitReached.value = Boolean(cardItem.is_view_limit_reached);

    const rawTitle = cardItem.name || 'Thiệp Cưới Của Chúng Tôi';
    const desc = cardItem.meta_desc || `Mời bạn đến dự đám cưới của ${rawTitle}`;
    const imagePath = cardItem.avatar ? (cardItem.avatar.includes('/') ? cardItem.avatar : `/images/wcards/${cardItem.avatar}`) : '';

    const seoData: DataSEO = {
        title: rawTitle,
        description: desc,
        og_title: rawTitle,
        og_description: desc,
        og_image: imagePath,
        og_url: `${siteUrl}/s/${slug}`,
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

onMounted(async () => {
    // Redirect to PC version if screen is larger than tablet
    if (window.innerWidth > 1024) {
        navigateTo(`/s/pc/${slug}`, { replace: true });
        return;
    }

    if (isViewLimitReached.value) return;

    // Increment view count
    try {
        const res: any = await $fetch('/api/v1/client/card-template/view', {
            method: 'POST',
            body: { slug }
        });
        if (res && res.success === false) {
            isViewLimitReached.value = true;
        }
    } catch (e: any) {
        if (e?.status === 403 || e?.statusCode === 403) {
            isViewLimitReached.value = true;
        }
    }
});
</script>
<template>
    <div v-if="isViewLimitReached" class="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
        <div class="bg-white rounded-4 shadow-sm p-4 text-center" style="max-width: 420px;">
            <div class="fs-1 mb-2">🔒</div>
            <h5 class="fw-bold text-dark mb-2">Đã đạt giới hạn lượt xem</h5>
            <p class="text-muted small mb-3">
                Trang thiệp này đã đạt giới hạn lượt xem tối đa của gói dịch vụ hiện tại. Chủ sở hữu cần nâng cấp gói để tiếp tục mở xem thiệp.
            </p>
            <NuxtLink to="/" class="btn btn-dark rounded-pill px-4 btn-sm fw-bold">Về trang chủ</NuxtLink>
        </div>
    </div>
    <WrapperComponent v-else :card-data="cardData" :scale="1" :fullscreen="true" :slug="slug" />
</template>
