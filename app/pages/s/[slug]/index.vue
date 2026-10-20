<script setup lang="ts">
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import type { DataSEO } from "~~/interfaces";

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

onMounted(() => {
    // Increment view count
    $fetch('/api/v1/client/card-template/view', {
        method: 'POST',
        body: { slug }
    }).catch(() => { });

    // Redirect to PC version if screen is larger than tablet
    if (window.innerWidth > 1024) {
        navigateTo(`/s/pc/${slug}`, { replace: true });
        return;
    }
});
</script>
<template>
    <WrapperComponent :card-data="cardData" :scale="1" :fullscreen="true" :slug="slug" />
</template>