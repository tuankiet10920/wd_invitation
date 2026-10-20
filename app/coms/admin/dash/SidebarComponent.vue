<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import type { IconType } from "~~/interfaces"
import { useAdminStore } from '~~/stores/admin';

const storeAdmin = useAdminStore();

defineProps({
    isSidebarOpen: {
        type: Boolean,
        default: true
    },
    isMobile: {
        type: Boolean,
        default: false
    }
})

interface Link {
    id: number | string
    text: string
    icon: string
    type: IconType
    href: string
    activePath?: string
    isChoose?: boolean
    isHover?: boolean
}

interface MenuGroup {
    id: string | number
    label?: string
    items: Link[]
}

const menuGroups = ref<MenuGroup[]>([
    {
        id: 'system',
        label: 'Hệ thống',
        items: [
            { id: 'dashboard', text: 'Dashboard', icon: 'home', type: 'lucide', href: '/admin', isChoose: true, isHover: false },
            { id: 'users', text: 'Quản lý người dùng', icon: 'users', type: 'lucide', href: '/admin/users/list', activePath: '/admin/users', isChoose: false, isHover: false },
            { id: 'config', text: 'Quản lý cấu hình', icon: 'settings', type: 'lucide', href: '/admin/settings/list', activePath: '/admin/settings', isChoose: false, isHover: false },
            // { id: 'tokens', text: 'Quản lý token imgur', icon: 'key', type: 'lucide', href: '/admin/imgur-tokens/list', activePath: '/admin/imgur-tokens', isChoose: false, isHover: false },
        ]
    },
    {
        id: 'packages',
        label: 'Quản lý Gói',
        items: [
            { id: 'pkg-list', text: 'Quản lý gói', icon: 'package', type: 'lucide', href: '/admin/packages/list', activePath: '/admin/packages', isChoose: false, isHover: false },
            { id: 'pkg-perm', text: 'Quản lý Features', icon: 'shield', type: 'lucide', href: '/admin/features/list', activePath: '/admin/features', isChoose: false, isHover: false },
            // { id: 'pkg-blocks', text: 'Quản lý các block theo gói', icon: 'box', type: 'lucide', href: '/admin/package-blocks/list', activePath: '/admin/package-blocks', isChoose: false, isHover: false },
        ]
    },
    {
        id: 'content',
        label: 'Nội dung & Mẫu',
        items: [
            { id: 'article-types', text: 'Quản lý loại bài viết', icon: 'list', type: 'lucide', href: '/admin/article-types/list', activePath: '/admin/article-types', isChoose: false, isHover: false },
            { id: 'articles', text: 'Quản lý bài viết', icon: 'file-text', type: 'lucide', href: '/admin/articles/list', activePath: '/admin/articles', isChoose: false, isHover: false },
            { id: 'seo-pages', text: 'Quản lý SEO Page', icon: 'search', type: 'lucide', href: '/admin/seo-pages/list', activePath: '/admin/seo-pages', isChoose: false, isHover: false },
            { id: 'card-templates', text: 'Quản lý thiệp', icon: 'layout', type: 'lucide', href: '/admin/card-templates/list', activePath: '/admin/card-templates', isChoose: false, isHover: false },
            { id: 'design-templates', text: 'Quản lý thiết kế', icon: 'image', type: 'lucide', href: '/admin/design-templates/list', activePath: '/admin/design-templates', isChoose: false, isHover: false },
        ]
    },
    {
        id: 'elements',
        label: 'Thành phần',
        items: [
            { id: 'widgets', text: 'Quản lý tiện ích', icon: 'list', type: 'lucide', href: '/admin/widgets/list', activePath: '/admin/widgets', isChoose: false, isHover: false },
            { id: 'animations', text: 'Hiệu ứng động', icon: 'list', type: 'lucide', href: '/admin/animations/list', activePath: '/admin/animations', isChoose: false, isHover: false },
            { id: 'falling', text: 'Hiệu ứng rơi', icon: 'list', type: 'lucide', href: '/admin/falling/list', activePath: '/admin/falling', isChoose: false, isHover: false },
            { id: 'openings', text: 'Hiệu ứng mở đầu', icon: 'list', type: 'lucide', href: '/admin/openings/list', activePath: '/admin/openings', isChoose: false, isHover: false },
            { id: 'backgrounds', text: 'Quản lý nền', icon: 'list', type: 'lucide', href: '/admin/backgrounds/list', activePath: '/admin/backgrounds', isChoose: false, isHover: false }
        ]
    },
    {
        id: 'musics',
        label: 'Âm nhạc',
        items: [
            { id: 'music_types', text: 'Quản lý thể loại', icon: 'list', type: 'lucide', href: '/admin/music-types/list', activePath: '/admin/music-types', isChoose: false, isHover: false },
            { id: 'musics_list', text: 'Quản lý bài hát', icon: 'list', type: 'lucide', href: '/admin/musics/list', activePath: '/admin/musics', isChoose: false, isHover: false },
        ]
    },
    {
        id: 'stocks',
        label: 'Kho ảnh / Stock',
        items: [
            { id: 'stock_types', text: 'Quản lý thể loại', icon: 'list', type: 'lucide', href: '/admin/stock-types/list', activePath: '/admin/stock-types', isChoose: false, isHover: false },
            { id: 'stocks_lists', text: 'Quản lý Stock', icon: 'list', type: 'lucide', href: '/admin/stocks/list', activePath: '/admin/stocks', isChoose: false, isHover: false },
        ]
    }
])

onMounted(async () => { })
</script>

<template>
    <aside class="sidebar" :class="{
        'collapsed': !isSidebarOpen && !isMobile,
        'mobile-hidden': !isSidebarOpen && isMobile,
        'mobile-open': isSidebarOpen && isMobile
    }">
        <div class="sidebar-header d-flex align-items-center justify-content-center py-4">
            <div class="logo-icon d-flex align-items-center justify-content-center me-2">
                <NuxtImg :src="`/others/logo-ntkservices.png`" :width="40" :height="40" />
            </div>
            <span class="logo-text fw-bold fs-4 animated-text" v-if="isSidebarOpen">NTK SERVICES</span>
        </div>

        <!-- INFO ADMIN -->
        <div class="user-profile text-center py-3" v-if="isSidebarOpen">
            <NuxtImg :src="`/images/avatars/${storeAdmin.image ?? `default-avatar.png`}`" :width="56" :height="56"
                class="rounded-circle mb-2" />
            <h6 class="mb-0 fw-bold user-name">{{ storeAdmin.name }}</h6>
            <small class="text-muted text-uppercase">{{ storeAdmin.role }}</small>
        </div>

        <nav class="sidebar-nav mt-3">
            <template v-for="group in menuGroups" :key="group.id">
                <div class="nav-category text-uppercase small text-muted px-4 mb-2 mt-3"
                    v-if="isSidebarOpen && group.label">
                    {{ group.label }}
                </div>
                <ul class="list-unstyled">
                    <li v-for="link in group.items" :key="link.id" class="position-relative" style="position: relative;"
                        @mouseenter="link.isHover = true" @mouseleave="link.isHover = false">
                        <NuxtLink :to="link.href" class="nav-link d-flex align-items-center gap-3"
                            :class="{ 'active': link.href === '/admin' ? $route.path === link.href : $route.path.startsWith(link.activePath || link.href) }">
                            <BaseIconComponent :name="link.icon" :type="link.type" :size="18" class="flex-shrink-0" />
                            <span v-if="isSidebarOpen" class="nav-link-text text-truncate">{{ link.text }}</span>
                        </NuxtLink>

                        <!-- Custom Tooltip -->
                        <div v-if="link.isHover" class="custom-tooltip">
                            {{ link.text }}
                        </div>
                    </li>
                </ul>
            </template>
        </nav>
    </aside>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=swap');

/* Custom Tooltip Styles */
.custom-tooltip {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #1e293b;
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: 1050;
    margin-left: 10px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    pointer-events: none;
}

.custom-tooltip::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent #1e293b transparent transparent;
}

.sidebar {
    width: var(--sidebar-width);
    background-color: var(--sidebar-bg);
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transition: all 0.3s ease;
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.sidebar::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

.sidebar.collapsed {
    width: 70px;
}

.sidebar.collapsed .sidebar-header .logo-text,
.sidebar.collapsed .user-profile,
.sidebar.collapsed .nav-category,
.sidebar.collapsed .nav-link .nav-link-text {
    display: none;
}

.sidebar.collapsed .logo-icon {
    margin-right: 0 !important;
}

.sidebar-header {
    height: 70px;
}

.logo-icon {
    width: 40px;
    height: 40px;
}

.nav-link {
    color: var(--text-muted);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    white-space: nowrap;
    /* Prevent text wrapping */
}

.sidebar.collapsed .nav-link {
    padding: 12px 0;
    justify-content: center;
}

.nav-link:hover,
.nav-link.active {
    color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
    border-left-color: #3b82f6;
}

/* Force icon to inherit/use active color, overriding explicitly set props */
.nav-link:hover :deep(*),
.nav-link.active :deep(*) {
    color: #3b82f6 !important;
}

.nav-link-text {
    flex: 1;
    min-width: 0;
    /* Critical for text-truncate in flexbox */
}

.text-muted {
    color: var(--text-muted) !important;
}

.animated-text {
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 300% 100%;
    animation: rainbow_animation 6s ease-in-out infinite;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.5px;
}

@keyframes rainbow_animation {

    0%,
    100% {
        background-position: 0 0;
    }

    50% {
        background-position: 100% 0;
    }
}

/* Mobile states using classes from prop */
.sidebar.mobile-hidden {
    transform: translateX(-100%);
    box-shadow: none;
}

.sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    z-index: 2000;
}

@media (max-width: 1279.98px) {
    .sidebar {
        width: var(--sidebar-width);
    }

    /* Force full content in mobile mode even when technically 'collapsed' 
       (though we now use mobile-hidden instead) */
    .sidebar.mobile-hidden .sidebar-header .logo-text,
    .sidebar.mobile-open .sidebar-header .logo-text,
    .sidebar.mobile-hidden .user-profile,
    .sidebar.mobile-open .user-profile,
    .sidebar.mobile-hidden .nav-link-text,
    .sidebar.mobile-open .nav-link-text {
        display: block !important;
    }

    .sidebar.mobile-hidden .logo-icon,
    .sidebar.mobile-open .logo-icon {
        margin-right: 0.5rem !important;
    }
}
</style>
