<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import EditorNavbar from '~/coms/mobiles/editor/EditorNavbar.vue';
import EditorBottomNav from '~/coms/mobiles/editor/EditorBottomNav.vue';
import EditorDrawer from '~/coms/mobiles/editor/EditorDrawer.vue';
import FABComponent from '~/coms/mobiles/editor/FABComponent.vue';
import EditorToolPanel from '~/coms/mobiles/editor/EditorToolPanel.vue';
import SettingTitleAvatarComponent from '~/coms/dashboard/modal/SettingTitleAvatarComponent.vue';
import ToastNotificationComponent from '~/coms/editor/ToastNotificationComponent.vue';

import SidebarAdminComponent from '~/coms/admin/default/SidebarComponent.vue';

import EditorCanvas from '~/coms/editor/EditorCanvas.vue';
import EditorMoveable from '~/coms/editor/EditorMoveable.vue';

import { useUserStore } from "~~/stores/user"
import { useAdminStore } from "~~/stores/admin"
import { useEditorStore } from "~~/stores/editor"
import { useElementStore } from '~~/stores/element'

const userStore = useUserStore()
const adminStore = useAdminStore()
const editorStore = useEditorStore()
const elementStore = useElementStore()
const route = useRoute();

const showSettings = ref(false);
const showAdminSidebar = ref(false);

onMounted(async () => {
    await userStore.checkLogin();
    adminStore.init();

    if (route.path.includes('/admin/')) {
        editorStore.role = 'admin'
    } else if (userStore.isLogin) {
        editorStore.role = 'user'
    } else if (adminStore.isLogin) {
        editorStore.role = 'admin'
    }

    if (route.params.slug) {
        await editorStore.loadFromSlug(route.params.slug as string);
    } else {
        editorStore.init();
    }
});
</script>

<template>
    <div class="mobile-editor-layout">
        <!-- Top Nav -->
        <EditorNavbar @toggle-sidebar="showAdminSidebar = true" @toggle-settings="showSettings = true" />

        <!-- Main Workspace -->
        <div class="canvas-area flex-grow-1">
            <EditorCanvas />
            <EditorMoveable />
        </div>

        <!-- Floating Settings Button (FAB) -->
        <FABComponent @click="showSettings = !showSettings" />

        <!-- Asset Drawer (Mobile version of Desktop EditorDrawer) -->
        <EditorDrawer />

        <!-- Tool Settings Panel (Mobile version of Desktop ToolPanel) -->
        <EditorToolPanel v-model="showSettings" />

        <!-- Bottom Navigation (Mobile version of Desktop Sidebar) -->
        <EditorBottomNav v-show="!elementStore.type || elementStore.type === 'Setup'" />

        <!-- Overlay Admin Sidebar -->
        <SidebarAdminComponent :is-open="showAdminSidebar" @close="showAdminSidebar = false" />

        <SettingTitleAvatarComponent v-model="editorStore.showSettingModal" />
        <ToastNotificationComponent />
    </div>
</template>

<style scoped>
.mobile-editor-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #E0E0E0;
}

.canvas-area {
    position: relative;
    overflow: auto;
    padding-bottom: 75px;
    /* Offset for Bottom Nav */
}
</style>