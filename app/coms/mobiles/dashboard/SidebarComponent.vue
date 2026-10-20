<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NewDesignComponent from '~/coms/mobiles/modals/NewDesignComponent.vue';

const navItems = [
    { label: 'Tổng quan', icon: 'layout-grid', path: '/dashboard' },
    { label: 'Thiệp của tôi', icon: 'clipboard-list', path: '/dashboard/pages' },
    { label: 'Tạo mới', icon: 'plus', isCenter: true, path: '#' },
    { label: 'Hoạt động', icon: 'bell', path: '/dashboard/blessing-box' },
    { label: 'Tài khoản', icon: 'user', path: '/dashboard/profile' }
]

const showNewModal = ref(false)
const route = useRoute()

const isActive = (path: string) => {
    if (path === '/dashboard') {
        return route.path === '/dashboard'
    }
    return route.path.startsWith(path) && path !== '#'
}
</script>

<template>
    <div class="mobile-nav-wrapper d-xl-none">
        <div class="mobile-nav-container">
            <template v-for="(item, index) in navItems" :key="index">
                <!-- Special Central Button -->
                <div v-if="item.isCenter" class="nav-item center-item" @click="showNewModal = true">
                    <div class="center-button shadow-sm">
                        <BaseIconComponent :name="item.icon" type="lucide" :size="24" color="white" />
                    </div>
                    <span class="nav-label">{{ item.label }}</span>
                </div>

                <!-- Regular Item -->
                <NuxtLink v-else :to="item.path" class="nav-item" :class="{ 'active': isActive(item.path) }">
                    <div class="icon-wrapper">
                        <BaseIconComponent :name="item.icon" type="lucide" :size="20"
                            :color="isActive(item.path) ? '#FF5A5F' : '#000000'" />
                    </div>
                    <span class="nav-label">{{ item.label }}</span>
                </NuxtLink>
            </template>
        </div>

        <!-- New Design Modal -->
        <NewDesignComponent v-model="showNewModal" />
    </div>
</template>

<style scoped>
.mobile-nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75px;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    z-index: 2000;
    border-top: 1px solid #f0f0f0;
}

.mobile-nav-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    padding-bottom: 8px;
    position: relative;
    max-width: 500px;
    margin: 0 auto;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #8E919D;
    flex: 1;
    transition: all 0.2s ease;
}

.nav-item.active {
    color: #FF5A5F;
}

.icon-wrapper {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
}

.nav-label {
    font-size: 11px;
    font-weight: 500;
}

/* Center Menu Button Style */
.center-item {
    position: relative;
    height: 100%;
    justify-content: flex-end;
}

.center-button {
    width: 52px;
    height: 52px;
    background: linear-gradient(135deg, #2D3E50 0%, #1e2a38 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid white;
    color: white;
    transition: transform 0.2s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
}

.center-button:active {
    transform: translateX(-50%) scale(0.95);
}

.center-item .nav-label {
    margin-top: 4px;
}
</style>