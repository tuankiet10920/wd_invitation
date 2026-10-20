<script setup lang="ts">
import ModalZoomCenterComponent from "../modal/ModalZoomCenterComponent.vue"
import AuthComponent from "./auth/AuthComponent.vue"
import InfoComponent from "./InfoComponent.vue"
import BaseIconComponent from "../icons/BaseIconComponent.vue"
import colors from "~~/config/colors.json"
import { useUserStore } from "~~/stores/user"

const route = useRoute()

type Auth = 'login' | 'register'

const auth_r = ref<Auth>('login')
const isMenuOpen = ref(false)

const store = useUserStore();

(async () => {
    await store.checkLogin()
})()

const navs = ref([
    {
        id: 1,
        text: 'Trang chủ',
        name: 'index',
        path: '/'
    },
    {
        id: 2,
        text: 'Mẫu thiệp',
        name: 'templates',
        path: '/templates'
    },
    {
        id: 3,
        text: 'Thiệp đã tạo',
        name: 'thiep-cuoi-khach-hang',
        path: '/thiep-cuoi/khach-hang'
    },
    {
        id: 4,
        text: 'Gói dịch vụ',
        name: 'pricing-plans',
        path: '/pricing-plans'
    },
    {
        id: 5,
        text: 'Liên hệ',
        name: 'contact',
        path: '/contact'
    },
    {
        id: 6,
        text: 'Tạo thiệp trọn gói',
        name: 'thiep-tron-goi',
        path: '/thiep-tron-goi'
    },
    {
        id: 7,
        text: 'Bài viết',
        name: 'danh-sach-loai-bai-viet',
        path: '/danh-sach-loai-bai-viet'
    },
])

const layout = computed(() => (route.meta.layout as string) || 'default')

const themeColors = computed(() => {
    return colors.user[layout.value as keyof typeof colors.user] || colors.user.default
})

const style = computed(() => ({
    '--mr-color': themeColors.value.header.link.default,
    '--mr-color-active': themeColors.value.header.link.active,
}))

watch(() => route.path, () => {
    isMenuOpen.value = false
})

</script>
<template>
    <div class="header-content flex-jb-ac" :style="style">
        <div class="logo-boxes flex-js-ac cursor-pointer" @click="navigateTo('/')">
            <NuxtImg src="/others/logo.svg" class="logo-icon" />
            <NuxtImg class="ms-1 ms-md-2 logo-text"
                :src="`/others/${layout == 'default' ? 'logo-text.svg' : 'logo-text-dark.svg'}`" />
        </div>

        <!-- Desktop Links -->
        <div class="links d-none d-lg-block">
            <NuxtLink v-for="item in navs" :key="item.id" class="link" :class="{
                'active': item.name == route.name
            }" :to="item.path">{{ item.text }}</NuxtLink>
        </div>

        <div class="d-flex align-items-center">
            <!-- Desktop Auth/Info -->
            <div class="d-none d-lg-flex align-items-center">
                <InfoComponent v-if="store.isLogin" />
                <div v-else class="auth">
                    <span class="link cursor-pointer" @click="store.openModal = true; auth_r = 'login'">Đăng nhập</span>
                    <span class="link cursor-pointer" @click="store.openModal = true; auth_r = 'register'">Đăng
                        ký</span>
                </div>
            </div>

            <!-- Mobile Auth/Info -->
            <div class="d-lg-none me-3">
                <InfoComponent v-if="store.isLogin" />
                <span v-else class="link cursor-pointer m-0" :style="{ color: layout == 'default' ? '#fff' : '#333' }"
                    @click="store.openModal = true; auth_r = 'login'">Đăng nhập</span>
            </div>

            <!-- Mobile Hamburger -->
            <button class="d-lg-none p-0 d-flex align-items-center" :class="[
                isMenuOpen
                    ? (layout === 'user-default' ? 'btn-hamburger-light' : 'btn-hamburger')
                    : 'btn border-0'
            ]" @click="isMenuOpen = !isMenuOpen">
                <BaseIconComponent name="menu" type="lucide" :size="22"
                    :color="layout === 'user-default' ? '#475569' : (isMenuOpen ? '#fff' : (layout == 'default' ? '#fff' : '#333'))" />
            </button>
        </div>

        <Teleport to="body">
            <div>
                <div v-if="isMenuOpen" class="mobile-menu-drawer shadow"
                    :class="{ 'open': isMenuOpen, 'user-default-layout': layout === 'user-default' }">
                    <div class="px-3 py-3 d-flex flex-column gap-1">
                        <NuxtLink v-for="item in navs" :key="item.id" class="mobile-link text-decoration-none"
                            :class="{ 'active': item.name == route.name }" :to="item.path">
                            {{ item.text }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Teleport>

        <ModalZoomCenterComponent v-model="store.openModal">
            <AuthComponent :auth="auth_r" />
        </ModalZoomCenterComponent>
    </div>
</template>
<style scoped>
.header-content {
    width: 100%;
    height: 85px;
}

.logo-icon {
    width: 32px;
    height: 32px;
}

.logo-text {
    width: 95px;
    height: auto;
}

@media (min-width: 992px) {
    .logo-icon {
        width: 40px;
        height: 40px;
    }

    .logo-text {
        width: 120px;
    }
}

.link {
    margin-right: 30px;
    color: var(--mr-color);
    font-size: 14px;
    text-decoration: none;
}

.link:last-child {
    margin-right: 0;
}

.link.active {
    color: var(--mr-color-active);
}

/* Mobile Menu Styles */
.mobile-menu-drawer {
    position: fixed;
    top: 85px;
    /* Ngay bên dưới header */
    left: 0;
    width: 100%;
    background: #111111;
    z-index: 1050;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu-drawer.user-default-layout {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
}

.mobile-link {
    font-size: 15px;
    padding: 7px 5px;
    color: #ffffff;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.user-default-layout .mobile-link {
    color: #333333;
    border-bottom: 1px solid #f9f9f9;
    border-radius: 6px;
    padding: 10px 12px;
}

.user-default-layout .mobile-link:last-child {
    border-bottom: none;
}

.mobile-link.active {
    background-color: #1a1a1a;
    color: #ff5e78;
    /* Pink/Red from design */
}

.user-default-layout .mobile-link.active {
    background-color: #3b82f6;
    color: #ffffff !important;
}

/* Hamburger Button Custom Style */
.btn-hamburger {
    background-color: #334155;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-hamburger:hover {
    background-color: #1e293b;
    border-color: rgba(255, 255, 255, 0.6);
}

.btn-hamburger-light {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-hamburger-light:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-100%);
}

@media (min-width: 2000px) {
    .header-content {
        margin: 0 auto;
        width: 93%;
    }
}
</style>