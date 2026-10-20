<script setup lang="ts">
import EditorNavbar from '~/coms/editor/EditorNavbar.vue';
import EditorToolPanel from '~/coms/editor/EditorToolPanel.vue';
import EditorSidebar from '~/coms/editor/EditorSidebar.vue';
import EditorDrawer from '~/coms/editor/EditorDrawer.vue';
import EditorCanvas from '~/coms/editor/EditorCanvas.vue';
import EditorMoveable from '~/coms/editor/EditorMoveable.vue';
import SettingTitleAvatarComponent from '~/coms/dashboard/modal/SettingTitleAvatarComponent.vue';
import ToastNotificationComponent from '~/coms/editor/ToastNotificationComponent.vue';
import { useUserStore } from "~~/stores/user"
import { useAdminStore } from "~~/stores/admin"
import { useEditorStore } from "~~/stores/editor"

const userStore = useUserStore()
const adminStore = useAdminStore()
const editorStore = useEditorStore()

const route = useRoute();

onMounted(async () => {
    // Check login state first
    await userStore.checkLogin();
    adminStore.init(); // Use init instead of checkLogin to avoid redirect loop if not admin

    if (route.path.includes('/admin/')) {
        editorStore.role = 'admin'
    } else if (userStore.isLogin) {
        editorStore.role = 'user'
    } else if (adminStore.isLogin) {
        editorStore.role = 'admin'
    } else {
        editorStore.role = null
    }

    if (route.params.slug) {
        await editorStore.loadFromSlug(route.params.slug as string);
    } else {
        editorStore.init();
    }
});

</script>

<template>
    <div class="editor-layout">
        <EditorNavbar />

        <main class="app-content d-flex">
            <Transition name="slide-left">
                <EditorSidebar v-if="!editorStore.isPreviewMode" />
            </Transition>

            <Transition name="slide-left-drawer">
                <EditorDrawer v-if="!editorStore.isPreviewMode" />
            </Transition>

            <div class="draw-canvas flex-grow-1">
                <EditorCanvas />
                <EditorMoveable v-if="!editorStore.isPreviewMode" />
            </div>

            <Transition name="slide-right">
                <EditorToolPanel v-if="!editorStore.isPreviewMode" />
            </Transition>
        </main>

        <SettingTitleAvatarComponent v-model="editorStore.showSettingModal" />
        <ToastNotificationComponent />
    </div>
</template>

<style scoped>
/* CANVAS AREA */
.draw-canvas {
    position: relative;
    /* Bắt buộc để Moveable tính tọa độ từ đây */
    overflow: auto;
    height: 100%;
}

/* RESET & LAYOUT */
.editor-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #E0E0E0;
    font-family: 'Inter', sans-serif;
}

.app-content {
    flex: 1;
    overflow: hidden;
}

/* Transition Animations for Preview Mode */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from,
.slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
    margin-left: -72px;
}

.slide-left-drawer-enter-active,
.slide-left-drawer-leave-active {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-drawer-enter-from,
.slide-left-drawer-leave-to {
    transform: translateX(-100%);
    opacity: 0;
    margin-left: -340px;
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
    margin-right: -350px;
}
</style>