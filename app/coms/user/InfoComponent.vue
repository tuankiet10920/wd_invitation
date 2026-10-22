<script setup lang="ts">
import { useUserStore } from "~~/stores/user"
import { useAdminStore } from "~~/stores/admin"
import { useEditorStore } from "~~/stores/editor"
import NewDesignComponent from "~/coms/dashboard/modal/NewDesignComponent.vue";

const userStore = useUserStore()
const adminStore = useAdminStore()
const editorStore = useEditorStore()

const currentStore = computed(() => {
    if (editorStore.role === 'admin') return adminStore
    return userStore
})

const isOpenNewDesign = ref(false);
const route = useRoute();

(async () => {
    if (editorStore.role === 'admin') {
        await adminStore.checkLogin()
    } else {
        await userStore.checkLogin()
    }
})()

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

watch(isOpen, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside)
        }, 0)
    } else {
        document.removeEventListener('click', handleClickOutside)
    }
})

type Layout = "dashboard" | "website" | undefined | "blank" | "user-default"

const currentLayout = ref<Layout>(undefined)

watch(() => route.meta.layout, (newValue) => {
    currentLayout.value = newValue as Layout
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
    <div class="position-relative">
        <div class="box" @click="isOpen = true">
            <NuxtImg
                :src="currentStore.avatarUrl"
                :width="40" :height="40" />
        </div>
        <!--- INFO HERE  -->
        <div v-if="isOpen" ref="panelRef" class="info-panel" :class="{
            'info-panel-dashboard': currentLayout == 'dashboard' || currentLayout == 'blank' || currentLayout == 'website',
            'info-panel-default': currentLayout == undefined || currentLayout == 'user-default'
        }">
            <div class="user-info">
                <div class="user-name">{{ currentStore.name || 'Unnamed' }}</div>
                <div class="user-id">{{ currentStore.email || 'anonymous@anonymous.net' }}</div>
                <div class="badge-free" v-if="editorStore.role !== 'admin'">Free</div>
                <div class="badge-free" v-else>Admin</div>
            </div>

            <nav class="menu" v-if="editorStore.role !== 'admin'">
                <NuxtLink to="/dashboard" class="menu-item">
                    <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Tổng quan</span>
                </NuxtLink>

                <NuxtLink to="/dashboard/pages" class="menu-item">
                    <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Thiết kế của tôi</span>
                </NuxtLink>

                <NuxtLink to="/dashboard/my-custom-web" class="menu-item">
                    <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                        </path>
                    </svg>
                    <span>Mẫu yêu thích</span>
                </NuxtLink>

                <button type="button" class="menu-item" @click="isOpenNewDesign = true">
                    <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Tạo thiết kế</span>
                </button>
            </nav>

            <button class="logout-btn" @click="currentStore.logout">
                Đăng xuất
            </button>
        </div>
    </div>
    <NewDesignComponent v-model="isOpenNewDesign" />
</template>
<style scoped>
.box {
    width: 37px;
    height: 37px;
    border-radius: 50%;
    overflow: hidden;
}

.box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.info-panel {
    background: white;
    border-radius: 8px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    padding: 0;
    width: 180px;
    margin-top: 8px;
    overflow: hidden;
    position: absolute;
    top: 100%;
    z-index: 3;
}

.info-panel-default {
    left: 50%;
    transform: translateX(-60%);
}

.info-panel-dashboard {
    right: 0;
    transform: translateX(15px);
}

.user-info {
    padding: 20px 16px;
    border-bottom: 1px solid #f0f0f0;
}

.user-name {
    font-size: 13px;
    color: #1a1a1a;
    margin: 0 0 4px 0;
}

.user-id {
    font-size: 12px;
    color: #999;
    margin: 0 0 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.badge-free {
    display: inline-block;
    background: transparent;
    color: #0066ff;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 0;
    text-align: center;
    width: 100%;
    border-radius: 9999px;
    background-color: #f3f4f6;
}

.menu {
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #333;
    text-decoration: none;
    font-size: 14px;
    transition: background 0.15s ease;
    border: none;
    background: transparent;
}

.menu-item:hover {
    background: #f8f8f8;
}

.menu-item.router-link-active {
    background: #f0f7ff;
    color: #0066ff;
}

.menu-item .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
}

.logout-btn {
    width: calc(100% - 32px);
    margin: 8px 16px 16px 16px;
    padding: 10px;
    border: 1px solid #0066ff;
    background: white;
    color: #0066ff;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logout-btn:hover {
    background: #f0f7ff;
}
</style>