<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';

import colors from "~~/config/colors.json"
const route = useRoute()

const layout = computed(() => route.meta.layout || 'default')

const themeColors = computed(() => {
    return colors.user[layout.value as keyof typeof colors.user] || colors.user.default
})

const style = computed(() => ({
    '--mr-link': themeColors.value.footer.link.default,
    '--mr-link-active': themeColors.value.footer.link.active,
}))

const socials = ref({
    facebook_link: '',
    instagram_link: '',
    tiktok_link: ''
})

onMounted(async () => {
    try {
        const { data }: any = await $fetch('/api/v1/client/settings/socials');
        if (data) {
            socials.value = data;
        }
    } catch (e) {
        console.error(e);
    }
})
</script>
<template>
    <div class="footer-container w-100 pb-5" :style="style">
        <NuxtImg class="d-flex justify-self-center mb-4"
            :src="`/others/${layout == 'default' ? 'logo-text.svg' : 'logo-text-dark.svg'}`" width="122" height="32" />
        <div class="footer-links-grid d-flex flex-column flex-md-row justify-content-center align-items-center w-100 my-4 gap-3 gap-md-4">
            <div class="d-flex justify-content-center gap-4">
                <span class="text-policy color-text transtion-span">Chính sách bảo mật</span>
                <span class="text-policy color-text transtion-span">Điều khoản dịch vụ</span>
            </div>
            <div class="d-flex justify-content-center gap-4">
                <span class="text-policy color-text transtion-span">Happy Web</span>
                <span class="text-policy color-text transtion-span">Blog</span>
            </div>
        </div>
        <p class="text-center text-policy color-text transtion-span mb-4">© 2025 Cinelove™. All Rights Reserved.</p>
        <div class="icons flex-jc-ac w-100">
            <a :href="socials.facebook_link" target="_blank" class="text-decoration-none">
                <BaseIconComponent :type="`fa6-brands`" class="transtion-span ts-3" :name="`facebook`"
                    :color="`#666666`" :size="25" />
            </a>
            <a :href="socials.instagram_link" target="_blank" class="text-decoration-none mx-4">
                <BaseIconComponent class="transtion-span ts-3" :type="`fa6-brands`" :name="`instagram`"
                    :color="`#666666`" :size="25" />
            </a>
            <a :href="socials.tiktok_link" target="_blank" class="text-decoration-none">
                <BaseIconComponent :type="`fa6-brands`" class="transtion-span ts-3" :name="`tiktok`" :color="`#666666`"
                    :size="25" />
            </a>
        </div>
    </div>
</template>
<style scoped>
footer {
    padding: 30px 0;
}

.text-policy {
    font-size: 14px;
    line-height: 20px;
}

.color-text {
    color: var(--mr-link);
}

.transtion-span:hover {
    color: var(--mr-link-active) !important;
}
</style>