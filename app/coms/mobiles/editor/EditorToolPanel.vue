<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import BaseIconComponent from '../../icons/BaseIconComponent.vue';
import { useElementStore } from '~~/stores/element';
import { useEditorStore } from '~~/stores/editor';

// Import child components
import TextComponent from '~/coms/editor/tool/childs/TextComponent.vue';
import PaddingComponent from '~/coms/editor/tool/childs/PaddingComponent.vue';
import BorderComponent from '~/coms/editor/tool/childs/BorderComponent.vue';
import BoxShadowComponent from '~/coms/editor/tool/childs/BoxShadowComponent.vue';
import ImageComponent from '~/coms/editor/tool/childs/ImageComponent.vue';
import ColorComponent from '~/coms/editor/tool/childs/ColorComponent.vue';
import SymmetryComponent from '~/coms/editor/tool/childs/SymmetryComponent.vue';
import MapComponent from '~/coms/editor/tool/childs/MapComponent.vue';
import YoutubeComponent from '~/coms/editor/tool/childs/YoutubeComponent.vue';
import QrBoxComponent from '~/coms/editor/tool/childs/QrBoxComponent.vue';
import PhotoAlbumComponent from '~/coms/editor/tool/childs/PhotoAlbumComponent.vue';
import CustomShowPhotoAlbumComponent from '~/coms/editor/tool/childs/CustomShowPhotoAlbumComponent.vue';
import GuestNameComponent from '~/coms/editor/tool/childs/GuestNameComponent.vue';
import EnvelopeComponent from '~/coms/editor/tool/childs/EnvelopeComponent.vue';
import CountDownComponent from '~/coms/editor/tool/childs/CountDownComponent.vue';
import CallNowComponent from '~/coms/editor/tool/childs/CallNowComponent.vue';
import CalendarComponent from '~/coms/editor/tool/childs/CalendarComponent.vue';
import AcceptInvitation from '~/coms/editor/tool/childs/AcceptInvitation.vue';

import ToolSetup from '~/coms/editor/tool/ToolSetup.vue';
import ToolMusic from '~/coms/editor/tool/ToolMusic.vue';

const element = useElementStore();
const editor = useEditorStore();

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue']);

// Map components for dynamic rendering
const compMap: Record<string, any> = {
    TextComponent, PaddingComponent, BorderComponent, BoxShadowComponent,
    ImageComponent, ColorComponent, SymmetryComponent, MapComponent,
    YoutubeComponent, QrBoxComponent, PhotoAlbumComponent, CustomShowPhotoAlbumComponent,
    GuestNameComponent, EnvelopeComponent, CountDownComponent, CallNowComponent,
    CalendarComponent, AcceptInvitation, ToolSetup, ToolMusic
};

type ToolbarTool = { id: string, label: string, icon: string, type: 'lucide' | 'mdi' | 'solar' | 'bi' | 'mynaui' };

const typeTools: Record<string, ToolbarTool[]> = {
    'Text': [
        { id: 'edit-text', label: 'Sửa', icon: 'pen', type: 'lucide' },
        { id: 'TextComponent', label: 'Kiểu chữ', icon: 'format-text', type: 'mdi' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' }
    ],
    'Image': [
        { id: 'ImageComponent', label: 'Thay ảnh', icon: 'image', type: 'lucide' },
        { id: 'ColorComponent', label: 'Màu sắc', icon: 'palette', type: 'lucide' },
        { id: 'SymmetryComponent', label: 'Lật', icon: 'flip-horizontal', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'Map': [
        { id: 'MapComponent', label: 'Sửa map', icon: 'map', type: 'lucide' },
        { id: 'ColorComponent', label: 'Màu sắc', icon: 'palette', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'Youtube': [
        { id: 'YoutubeComponent', label: 'Youtube', icon: 'youtube', type: 'lucide' },
        { id: 'ColorComponent', label: 'Màu sắc', icon: 'palette', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'QrBox': [
        { id: 'QrBoxComponent', label: 'Mã QR', icon: 'qr-code', type: 'lucide' },
        { id: 'TextComponent', label: 'Kiểu chữ', icon: 'format-text', type: 'mdi' },
    ],
    'PhotoAlbum': [
        { id: 'PhotoAlbumComponent', label: 'Album', icon: 'images', type: 'lucide' },
        { id: 'CustomShowPhotoAlbumComponent', label: 'Kiểu hiển thị', icon: 'layout', type: 'lucide' },
        { id: 'ColorComponent', label: 'Màu sắc', icon: 'palette', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'GuestName': [
        { id: 'GuestNameComponent', label: 'Tên khách', icon: 'user', type: 'lucide' },
        { id: 'TextComponent', label: 'Kiểu chữ', icon: 'format-text', type: 'mdi' },
        { id: 'ColorComponent', label: 'Màu sắc', icon: 'palette', type: 'lucide' },
    ],
    'Envelope': [
        { id: 'EnvelopeComponent', label: 'Mừng cưới', icon: 'mail', type: 'lucide' },
    ],
    'CountDown': [
        { id: 'CountDownComponent', label: 'Đếm ngược', icon: 'timer', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'CallNow': [
        { id: 'CallNowComponent', label: 'Gọi ngay', icon: 'phone', type: 'lucide' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'Calendar': [
        { id: 'CalendarComponent', label: 'Lịch', icon: 'calendar', type: 'lucide' },
        { id: 'PaddingComponent', label: 'Khoảng đệm', icon: 'fullscreen', type: 'mdi' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
        { id: 'BoxShadowComponent', label: 'Đổ bóng', icon: 'layers', type: 'lucide' },
    ],
    'AcceptInvitation': [
        { id: 'AcceptInvitation', label: 'Xác nhận', icon: 'check-circle', type: 'lucide' },
        { id: 'BorderComponent', label: 'Đường viền', icon: 'crop-square', type: 'mdi' },
    ],
    'Music': [
        { id: 'ToolMusic', label: 'Âm nhạc', icon: 'music', type: 'lucide' },
    ]
};

const activeConfig = ref<ToolbarTool | null>(null);

const currentToolbar = computed(() => {
    return element.type ? (typeTools[element.type] || []) : [];
});

const isDrawerOpen = computed(() => {
    return activeConfig.value !== null || props.modelValue;
});

const activeComponent = computed(() => {
    if (activeConfig.value && compMap[activeConfig.value.id]) {
        return compMap[activeConfig.value.id];
    }
    return null;
});

const drawerTitle = computed(() => {
    if (activeConfig.value) return activeConfig.value.label;
    if (props.modelValue) return 'Cài đặt thiết kế';
    return '';
});

const openConfig = (item: ToolbarTool) => {
    activeConfig.value = item;
};

const closeDrawer = () => {
    activeConfig.value = null;
    emit('update:modelValue', false);
};

const closeToolbar = () => {
    element.type = '';
    editor.selectedNodeId = null;
};

// Reset active tool when changing selection
watch(() => element.type, () => {
    activeConfig.value = null;
});

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('close-tool-setup', closeDrawer);
    }
});

onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener('close-tool-setup', closeDrawer);
    }
});
</script>

<template>
    <!-- Hide tool panel entirely when asset drawer (activeMenu) is open to avoid overlapping on mobile -->
    <div v-if="editor.activeMenu === null" class="mobile-tool-panel-wrapper">

        <!-- Contextual Floating Toolbar (Only shows when an element is active & drawer is closed) -->
        <Transition name="slide-up">
            <div v-if="element.type && element.type !== 'Setup' && !isDrawerOpen" class="context-toolbar-container">
                <!-- Floating Close Button -->
                <div class="toolbar-close-btn cursor-pointer d-flex align-items-center justify-content-center position-absolute shadow-sm"
                    style="top: -17px; right: 15px; z-index: 10;" @click="closeToolbar">
                    <BaseIconComponent name="close" type="mdi" :size="20" color="#555" />
                </div>

                <div
                    class="context-toolbar d-flex align-items-center bg-white shadow-lg border-top overflow-auto position-relative">
                    <template v-if="currentToolbar.length > 0">
                        <div v-for="item in currentToolbar" :key="item.id"
                            class="toolbar-item d-flex flex-column align-items-center justify-content-center cursor-pointer"
                            @click="openConfig(item)">
                            <div class="toolbar-icon-bg mb-1 d-flex align-items-center justify-content-center">
                                <span v-if="item.label === 'Kiểu chữ'" class="fs-15 fw-bold"
                                    style="color: #333;">Aa</span>
                                <BaseIconComponent v-else :name="item.icon" :type="item.type" :size="20" color="#333" />
                            </div>
                            <span class="toolbar-label text-nowrap">{{ item.label }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </Transition>

        <!-- Config Drawer (Bottom sheet) -->
        <!-- Backdrop -->
        <Transition name="fade">
            <div v-if="isDrawerOpen" class="drawer-backdrop" @click="closeDrawer"></div>
        </Transition>

        <!-- Drawer Content -->
        <Transition name="slide">
            <div v-if="isDrawerOpen" class="drawer-panel bg-white shadow-lg">
                <div
                    class="drawer-header d-flex align-items-center justify-content-center px-3 py-2 border-bottom position-relative">
                    <span class="drawer-title fw-bold text-dark">{{ drawerTitle }}</span>
                    <button class="btn btn-link p-1 text-secondary position-absolute" style="right: 15px;"
                        @click="closeDrawer">
                        <BaseIconComponent name="close" type="mdi" :size="22" />
                    </button>
                    <!-- Small drag indiciator above header could go here if needed -->
                </div>

                <!-- EDIT TEXT -->
                <div class="drawer-body p-0 overflow-auto">
                    <!-- Specific Sửa Edit Text UI -->
                    <div v-if="activeConfig?.id === 'edit-text'" class="p-3 h-100 d-flex flex-column bg-light-subtle">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fs-13 text-secondary">Nội dung văn bản</span>
                            <span class="fs-12 text-muted">{{ editor.selectedNode?.props?.content?.length || 0
                                }}/1000</span>
                        </div>
                        <div class="bg-white rounded border border-light-subtle p-2 flex-grow-1">
                            <textarea v-if="editor.selectedNode && editor.selectedNode.props"
                                class="form-control border-0 focus-ring focus-ring-light bg-transparent w-100 h-100 p-0"
                                v-model="editor.selectedNode.props.content"
                                style="min-height: 120px; font-size: 14px; resize: none; color: #333;"
                                placeholder="Text"></textarea>
                        </div>
                        <p class="fs-12 text-muted mt-2 mb-0">Nhấn Enter để xuống dòng</p>
                    </div>

                    <!-- Setup -->
                    <ToolSetup v-else-if="props.modelValue && (!element.type || element.type === 'Setup')"
                        class="p-3" />

                    <!-- Selected Config Component -->
                    <component v-else-if="activeComponent" :is="activeComponent" class="m-0" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* Toolbar Area */
.mobile-tool-panel-wrapper {
    position: fixed;
    bottom: 0px;
    left: 0;
    width: 100%;
    z-index: 1000000;
    pointer-events: none;
}

.context-toolbar-container {
    position: absolute;
    bottom: 0;
    /* Snaps exactly to bottom replacing nav */
    left: 0;
    width: 100%;
    pointer-events: auto;
}

.context-toolbar {
    height: 100px;
    /* Match bottom nav height */
    padding: 0 12px;
    scrollbar-width: none;
}

.context-toolbar::-webkit-scrollbar {
    display: none;
}

.toolbar-item {
    min-width: 60px;
    margin-right: 10px;
}

.toolbar-icon-bg {
    width: 44px;
    height: 44px;
    background-color: #f8f9fa;
    border-radius: 12px;
}

.toolbar-label {
    font-size: 11px;
    color: #4b5563;
    margin-top: 4px;
}

.toolbar-close-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Background Drop */
.drawer-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    pointer-events: auto;
    z-index: -1;
}

/* Bottom Sheet */
.drawer-panel {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 60vh;
    border-radius: 20px 20px 0 0;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.drawer-header {
    height: 54px;
}

.drawer-body {
    flex: 1;
}

.drawer-title {
    font-size: 15px;
}

.fs-12 {
    font-size: 12px;
}

.fs-13 {
    font-size: 13px;
}

.fs-15 {
    font-size: 15px;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(100%);
}
</style>
