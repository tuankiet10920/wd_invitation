<script setup lang="ts">
import SidebarComponent from '~/coms/admin/dash/SidebarComponent.vue';
import NavbarComponent from '~/coms/admin/dash/NavbarComponent.vue';
import MobileSidebarComponent from '~/coms/mobiles/dashboard/SidebarComponent.vue';

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

const isSidebarOpen = ref(true)
const isDarkMode = ref(false)
const isMobileMode = ref(false)
const isSmallMobileMode = ref(false)

const handleResize = () => {
    isMobileMode.value = window.innerWidth < 1280
    isSmallMobileMode.value = window.innerWidth < 768

    console.log('window.innerWidth: ', window.innerWidth);


    if (isMobileMode.value) {
        // Close sidebar by default on mobile entrance
        if (isSidebarOpen.value) isSidebarOpen.value = false
    } else {
        // Open sidebar by default on desktop entrance
        isSidebarOpen.value = true
    }
}

onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
}
</script>
<template>
    <div class="dashboard-wrapper"
        :class="{ 'dark-mode': isDarkMode, 'is-mobile-view': isMobileMode, 'is-small-mobile': isSmallMobileMode }">
        <!-- Sidebar (Desktop/Mobile) -->
        <SidebarComponent :is-sidebar-open="isSidebarOpen" :is-mobile="isMobileMode" />
    
        <!-- Main Content -->
        <main class="main-content" :class="{ 'expanded': !isSidebarOpen }">
            <!-- Header -->
            <NavbarComponent :is-dark-mode="isDarkMode" @toggle-sidebar="toggleSidebar" @toggle-theme="toggleTheme" />

            <slot></slot>

            <footer class="footer mt-auto py-3 bg-white text-center text-muted small shadow-sm">
                2026 © Thiep Cuoi. Designed by NTKServices
            </footer>
        </main>

        <!-- Mobile Overlay -->
        <div v-if="isSidebarOpen && isMobileMode" class="sidebar-overlay" @click="toggleSidebar">
        </div>
    </div>
</template>
<style scoped>
/* Theme Variables */
.dashboard-wrapper {
    --bg-body: #f4f7fb;
    --bg-card: #ffffff;
    --text-primary: #343a40;
    --text-muted: #878a99;
    --border-color: #f3f4f6;
    --sidebar-bg: #ffffff;
    --sidebar-width: 250px;
}

.dashboard-wrapper.dark-mode {
    --bg-body: #1a1d21;
    --bg-card: #22262a;
    --text-primary: #e9ecef;
    --text-muted: #adb5bd;
    --border-color: #2c3036;
    --sidebar-bg: #22262a;
}

/* Base Styles */
.dashboard-wrapper {
    min-height: 100vh;
    background-color: var(--bg-body);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease;
    overflow-x: hidden;
    position: relative;
}

/* Main Content */
.main-content {
    margin-left: var(--sidebar-width);
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.main-content.expanded {
    margin-left: 70px;
}

/* Sidebar Overlay */
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s ease;
}

/* Utilities */
.text-muted {
    color: var(--text-muted) !important;
}

/* Responsive */
.dashboard-wrapper.is-mobile-view .main-content {
    margin-left: 0 !important;
}

@media (max-width: 1279.98px) {
    .main-content {
        margin-left: 0 !important;
    }

    .main-content.expanded {
        margin-left: 0 !important;
    }
}
</style>