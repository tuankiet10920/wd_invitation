<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('lien-he')
useAppSeo(seoData)

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
    <div class="container mt-3 mb-5 px-3 px-md-0">
        <h1 class="text-center fw-bold page-header">Kết nối với chúng tôi</h1>
        <p class="text-center desc">Theo dõi Cinelove trên các mạng xã hội</p>

        <div class="nav-breadcumb w-100 d-flex justify-content-between align-items-center">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <NuxtLink to="/">
                            <button class="d-flex align-items-center">
                                <BaseIconComponent class="me-1" :name="`house`" :color="`#00000073`" />
                                <span class="text">Trang chủ</span>
                            </button>
                        </NuxtLink>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        <button>
                            <span>Liên hệ</span>
                        </button>
                    </li>
                </ol>
            </nav>
        </div>

        <div class="boxes d-flex flex-wrap justify-content-center align-items-center mt-4">
            <a :href="socials.facebook_link" target="_blank"
                class="box d-flex flex-column align-items-center justify-content-center cursor-pointer text-decoration-none p-4">
                <div class="box-rounded shadow-sm" style="background-color: #1c64f2">
                    <BaseIconComponent :type="`fa6-brands`" :name="`facebook`" :color="`#ffffff`" :size="28" />
                </div>
                <h4 class="fw-bold mt-3 mb-1">Facebook</h4>
                <p class="mb-0 card-text">Theo dõi ngay</p>
            </a>
            <a :href="socials.instagram_link" target="_blank"
                class="box d-flex flex-column align-items-center justify-content-center cursor-pointer text-decoration-none p-4">
                <div class="box-rounded shadow-sm" style="background-color: #d61f69">
                    <BaseIconComponent :type="`fa6-brands`" :name="`instagram`" :color="`#ffffff`" :size="28" />
                </div>
                <h4 class="fw-bold mt-3 mb-1">Instagram</h4>
                <p class="mb-0 card-text">Theo dõi ngay</p>
            </a>
            <a :href="socials.tiktok_link" target="_blank"
                class="box d-flex flex-column align-items-center justify-content-center cursor-pointer text-decoration-none p-4">
                <div class="box-rounded shadow-sm" style="background-color: #1f2937">
                    <BaseIconComponent :type="`fa6-brands`" :name="`tiktok`" :color="`#ffffff`" :size="24" />
                </div>
                <h4 class="fw-bold mt-3 mb-1">TikTok</h4>
                <p class="mb-0 card-text">Theo dõi ngay</p>
            </a>
        </div>

        <div class="contact-footer text-center mt-5 py-4">
            <h4 class="fw-bold">Email liên hệ</h4>
            <p class="email mb-0 mt-2">cineslove.contact@gmail.com</p>
        </div>
        <hr class="mt-5 mb-5 opacity-25">
    </div>
</template>

<style scoped>
.page-header {
    font-size: 28px;
    margin-top: 20px;
}

@media (min-width: 768px) {
    .page-header {
        font-size: 35px;
    }
}

.box-rounded {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.box:hover .box-rounded {
    transform: scale(1.1);
}

.box {
    width: 100%;
    height: 180px;
    border-radius: 12px;
    border: 1px solid #f1f3f5;
    background-color: #fff;
    transition: all .3s ease;
}

@media (max-width: 576px) {
    h1 {
        font-size: 38px !important;
    }

    .desc {
        font-size: 17px !important;
    }

    .box {
        height: 200px;
    }
}

@media (min-width: 768px) {
    .box {
        width: 240px;
        height: 220px;
    }
}

.box:hover {
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
    border-color: #ff8fa3;
}

.boxes {
    gap: 15px;
    flex-direction: column;
}

@media (min-width: 768px) {
    .boxes {
        gap: 25px;
        flex-direction: row;
    }
}

.desc {
    color: #4b5563;
    font-size: 16px;
    margin-bottom: 30px;
    margin-top: 10px;
}

@media (min-width: 768px) {
    .desc {
        font-size: 18px;
        margin-bottom: 50px;
    }
}

h4 {
    color: #111c2d;
    font-size: 20px;
}

@media (min-width: 768px) {
    h4 {
        font-size: 24px;
    }
}

.email {
    color: #e74694;
    font-size: 18px;
    font-weight: 500;
}

.card-text {
    color: #6b7280;
    font-size: 13px;
}

.breadcrumb-item::before {
    color: #00000073 !important;
}

.breadcrumb-item button {
    background: none;
    border: none;
    padding: 2px 4px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 15px;
}

.breadcrumb-item button:hover {
    color: #000;
    background: #f8f9fa;
}

.nav-breadcumb {
    margin-top: 25px;
}

hr {
    width: 80%;
    margin: 0 auto;
}

a {
    text-decoration: none;
}
</style>