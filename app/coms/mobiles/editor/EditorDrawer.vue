<script setup lang="ts">
import BaseIconComponent from '../../icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

// Asset Components
import ImageComponent from '~/coms/dashboard/ImageComponent.vue';
import StockComponent from '~/coms/dashboard/StockComponent.vue';
import BackgroundComponent from '~/coms/dashboard/BackgroundComponent.vue';
import MusicComponent from '~/coms/dashboard/MusicComponent.vue';
import WidgetComponent from '~/coms/dashboard/WidgetComponent.vue';
import TemplateComponent from '~/coms/dashboard/TemplateComponent.vue';
import EffectComponent from '~/coms/dashboard/EffectComponent.vue';

const editor = useEditorStore();

const close = () => {
    editor.activeMenu = null;
}

const getDrawerTitle = computed(() => {
    const titles: Record<string, string> = {
        'image': 'Thêm hình ảnh',
        'stock': 'Thư viện Stock',
        'bg': 'Đổi hình nền',
        'music': 'Thêm âm nhạc',
        'tool': 'Tiện ích tích hợp',
        'template': 'Mẫu có sẵn',
        'effects': 'Hiệu ứng trang'
    };
    return titles[editor.activeMenu as string] || 'Thêm nội dung';
})

const isOpen = computed(() => editor.activeMenu !== null && editor.activeMenu !== 'text');
</script>

<template>
    <div class="mobile-drawer-wrapper">
        <!-- Backdrop -->
        <Transition name="fade">
            <div v-if="isOpen" class="drawer-backdrop" @click="close"></div>
        </Transition>

        <!-- Drawer Content -->
        <Transition name="slide">
            <div v-if="isOpen" class="drawer-panel bg-white shadow-lg">
                <div class="drawer-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                    <span class="drawer-title fw-bold text-dark">{{ getDrawerTitle }}</span>
                    <button class="btn btn-link p-1 text-secondary" @click="close">
                        <BaseIconComponent name="close-circle-outline" type="mdi" :size="24" />
                    </button>
                    <div class="drawer-drag-handle"></div>
                </div>

                <div class="drawer-body p-3 overflow-auto">
                    <!-- CONTENT MATCHING DESKTOP EditorDrawer.vue -->
                    <ImageComponent v-if="editor.activeMenu === 'image'" />

                    <StockComponent v-if="editor.activeMenu === 'stock'" @select-image="(o_image: any) => {
                        editor.addNode('Image', {
                            props: { url: o_image.url }
                        });
                        close();
                    }" />

                    <BackgroundComponent v-if="editor.activeMenu === 'bg'" />
                    <MusicComponent v-if="editor.activeMenu === 'music'" />
                    <WidgetComponent v-if="editor.activeMenu === 'tool'" />
                    <TemplateComponent v-if="editor.activeMenu === 'template'" />
                    <EffectComponent v-if="editor.activeMenu === 'effects'" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.mobile-drawer-wrapper {
    position: fixed;
    bottom: 0px;
    /* Above the bottom nav */
    left: 0;
    width: 100%;
    z-index: 999999;
    pointer-events: none;
}

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

.drawer-panel {
    position: fixed;
    bottom: 1px;
    /* HEIGHT OF BOTTOM NAV */
    left: 0;
    width: 100%;
    height: 60vh;
    border-radius: 20px 20px 0 0;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
}

.drawer-header {
    height: 50px;
    position: relative;
}

.drawer-drag-handle {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background-color: #ddd;
    border-radius: 2px;
}

.drawer-body {
    flex: 1;
    scrollbar-width: none;
}

.drawer-body::-webkit-scrollbar {
    display: none;
}

.drawer-title {
    font-size: 15px;
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

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(100%);
}
</style>
