<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import InfoComponent from '../user/InfoComponent.vue';
import SidebarComponent from '~/coms/admin/default/SidebarComponent.vue';
import MangageSyncComponent from '~/coms/dashboard/modal/MangageSyncComponent.vue';
import { useEditorStore } from '~~/stores/editor';

import { useRoute } from 'vue-router';

const editorStore = useEditorStore();
const route = useRoute();
const showAutoSaveMenu = ref(false);
const showSidebar = ref(false);
const showSyncModal = ref(false);

const handlePreview = async () => {
    editorStore.isPreviewMode = !editorStore.isPreviewMode;
    if (editorStore.isPreviewMode) {
        // Tự động lưu bản nháp lên server trước khi xem trước để hiển thị chính xác nội dung mới nhất
        await editorStore.saveCard(true);
        // Đóng Drawer bằng cách reset activeMenu
        editorStore.activeMenu = null;
        // Xóa phần tử đang được chọn để ẩn khung Moveable
        editorStore.selectedNodeId = null;
        editorStore.selectedNodeIds = [];
        editorStore.currentTarget = null;
    }
};

</script>
<template>
    <header class="navbar navbar-light bg-white border-bottom px-3 justify-content-between shadow-sm">
        <div class="d-flex align-items-center">
            <!-- TOGGLE SIDEBAR -->
            <button class="btn btn-link text-dark p-1 me-2" @click="showSidebar = true">
                <BaseIconComponent name="menu" type="lucide" :size="20" />
            </button>

            <!-- Sidebar Drawer -->
            <Teleport to="body">
                <div>
                    <div v-if="showSidebar" class="position-fixed top-0 start-0 w-100 h-100"
                        style="z-index: 1040; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px);"
                        @click="showSidebar = false"></div>

                    <!-- Sidebar -->
                    <Transition name="slide">
                        <div v-if="showSidebar" class="position-fixed top-0 start-0 h-100 bg-white shadow"
                            style="z-index: 1050; width: 270px;">
                            <SidebarComponent />
                        </div>
                    </Transition>
                </div>
                <!-- Sync Manager Modal -->
                <MangageSyncComponent v-model="showSyncModal" />
            </Teleport>

            <div class="logo-brand d-flex align-items-center">
                <div class="d-flex align-items-center cursor-pointer" @click="navigateTo('/')">
                    <NuxtImg src="/others/logo.svg" :width="32" class="me-2" />
                    <NuxtImg src="/others/logo-text-dark.svg" :width="85" />
                </div>
                <div class="ms-3 d-flex gap-2 border-start ps-3 align-items-center">
                    <div :class="{ 'opacity-25 pe-none': !editorStore.canUndo }" class="cursor-pointer d-flex"
                        @click="editorStore.undo()">
                        <BaseIconComponent name="rotate-ccw" type="lucide" :size="18" color="#666" />
                    </div>
                    <div :class="{ 'opacity-25 pe-none': !editorStore.canRedo }" class="cursor-pointer d-flex"
                        @click="editorStore.redo()">
                        <BaseIconComponent name="rotate-cw" type="lucide" :size="18" color="#666" />
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="position-relative">
                <span class="text-success small d-flex align-items-center gap-1 fw-medium cursor-pointer"
                    style="font-size: 13px;" @click="showAutoSaveMenu = !showAutoSaveMenu">
                    <BaseIconComponent name="content-save" type="mdi" :size="16" /> Đã lưu thay đổi
                </span>

                <div v-if="showAutoSaveMenu"
                    class="dropdown-menu show position-absolute mt-2 p-1 border-0 shadow-lg rounded-3"
                    style="right: 0; min-width: 200px; z-index: 1000; top: 100%;">
                    <button class="dropdown-item d-flex align-items-center gap-2 rounded px-2 py-2 mb-1"
                        style="font-size: 14px;" @click="showSyncModal = true; showAutoSaveMenu = false">
                        <BaseIconComponent name="settings" type="lucide" :size="16" /> Cài đặt
                    </button>
                    <div class="dropdown-divider m-0 mb-1 opacity-25"></div>
                    <div class="px-2 py-1 text-secondary" style="font-size: 13px;">
                        Auto-save: Bật
                    </div>
                </div>

                <div v-if="showAutoSaveMenu" class="position-fixed inset-0 z-1" style="inset: 0; z-index: 999;"
                    @click="showAutoSaveMenu = false"></div>
            </div>

            <button class="btn btn-outline-secondary btn-sm px-3 border-light-subtle"
                @click="handlePreview">{{ editorStore.isPreviewMode ? 'Chỉnh sửa' : 'Xem trước' }}</button>

            <!-- XUAT BAN -->
            <button class="btn btn-primary btn-sm px-3 fw-bold shadow-sm" @click="editorStore.saveTemplate()">Xuất
                bản</button>
            <InfoComponent />
        </div>
    </header>
</template>
<style scoped>
.avatar-circle {
    width: 32px;
    height: 32px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 13px;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>