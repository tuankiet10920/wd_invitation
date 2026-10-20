<script setup lang="ts">
import SidebarComponent from '~/coms/admin/default/SidebarComponent.vue';
import HeaderComponent from '~/coms/admin/default/HeaderComponent.vue';
import MobileSidebarComponent from '~/coms/mobiles/dashboard/SidebarComponent.vue';
import ButtonContactComponent from '~/coms/button/ButtonContactComponent.vue';

const isShowSidebar = ref(false)
const isMobileMode = ref(false)
const isSmallMobileMode = ref(false)

const handleToggleSidebar = () => {
    isShowSidebar.value = !isShowSidebar.value
}

const handleCloseSidebar = () => {
    isShowSidebar.value = false
}

const handleResize = () => {
    isMobileMode.value = window.innerWidth < 1280
    isSmallMobileMode.value = window.innerWidth < 768

    console.log('Dashboard window.innerWidth: ', window.innerWidth);

    if (isMobileMode.value) {
        if (isShowSidebar.value) isShowSidebar.value = false
    } else {
        isShowSidebar.value = true
    }
}

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

useHead({
    meta: [
        { name: 'robots', content: 'noindex, nofollow' }
    ],
    link: [
        {
            rel: 'stylesheet',
            href: '/css/index.css'
        }
    ]
})
</script>
<template>
    <div :class="{ 'is-mobile-view': isMobileMode, 'is-small-mobile': isSmallMobileMode }">
        <!-- Desktop/Tablet Sidebar -->
        <SidebarComponent v-if="!isSmallMobileMode" :is-open="isShowSidebar" @close="handleCloseSidebar" />

        <div class="cover-layer">
            <div class="content-dashboard" :class="{ 'full-width': !isShowSidebar || isSmallMobileMode }">
                <HeaderComponent v-if="!isSmallMobileMode" @toggle-sidebar="handleToggleSidebar" />
                <slot></slot>
            </div>
        </div>

        <!-- Mobile Bottom Nav -->
        <MobileSidebarComponent v-if="isSmallMobileMode" />

        <!-- Mobile Overlay -->
        <div v-if="isShowSidebar && isMobileMode && !isSmallMobileMode" class="sidebar-overlay"
            @click="handleCloseSidebar"></div>
        <ButtonContactComponent />
    </div>
</template>
<style>
.cover-layer {
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: start;
    padding: 0 10px;
}

.content-dashboard {
    width: calc(100% - 250px);
    min-height: calc(100vh - 20px);
    background-color: #F4F7FB;
    transition: all 0.3s ease;
}

.content-dashboard.full-width {
    width: 100%;
}

.dashboard-cover {
    margin: 0 auto;
    width: 80%;
    margin-top: 65px;
    margin-bottom: 20px;
}

/* Sidebar Overlay */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1999;
}

@media screen and (max-width: 1550px) {
    .dashboard-cover {
        width: 95%;
        margin-top: 25px;
    }
}

@media screen and (max-width: 1279.98px) {
    .content-dashboard {
        width: 100% !important;
    }

    .cover-layer {
        padding: 0;
    }
}

@media screen and (max-width: 767.98px) {
    .content-dashboard {
        padding: 10px;
    }

    .content-dashboard,
    .dashboard-cover {
        margin: 0;
        width: 100%;
    }

    .content-dashboard {
        margin-bottom: 50px;
    }

    .dashboard-content {
        padding: 0 !important;
    }
}
</style>