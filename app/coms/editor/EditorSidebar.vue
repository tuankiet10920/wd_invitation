<script setup lang="ts">
import type { IconType } from "~~/interfaces"
import BaseIconComponent from "../icons/BaseIconComponent.vue";
import { useEditorStore } from '~~/stores/editor'
import { useElementStore } from '~~/stores/element'

const editor = useEditorStore()
const element = useElementStore()

interface Item {
    id: string; label: string; icon: string; tooltip: string; type?: IconType
}

const hoveredMenu = ref<string | null>(null);

const menuItems: Item[] = [
    { id: 'text', label: 'Văn bản', icon: 'type', tooltip: 'Thêm văn bản' },
    { id: 'image', label: 'Hình ảnh', icon: 'image', tooltip: 'Thêm hình ảnh' },
    { id: 'stock', label: 'Stock', icon: 'heart', tooltip: 'Kho ảnh mẫu' },
    { id: 'bg', label: 'Nền', icon: 'grid-3x3-gap', tooltip: 'Đổi hình nền', type: 'bi' },
    { id: 'music', label: 'Âm nhạc', icon: 'music', tooltip: 'Thêm nhạc' },
    { id: 'tool', label: 'Tiện ích', icon: 'calendar-check', tooltip: 'Công cụ hỗ trợ' },
    { id: 'template', label: 'Mẫu', icon: 'layout-template', tooltip: 'Dùng mẫu có sẵn' },
    { id: 'effect', label: 'Hiệu ứng', icon: 'wand-sparkles', tooltip: 'Thêm hiệu ứng' },
];

const handleMenuClick = (menuId: string) => {
    if (menuId === 'text') {
        editor.addNode('Text')
        editor.activeMenu = null
        return;
    }

    // Toggle Drawer cho các mục khác
    editor.activeMenu = editor.activeMenu === menuId ? null : menuId

    if (menuId === 'music') return element.type = 'Music'
};
</script>
<template>
    <aside class="main-sidebar border-end bg-white d-flex flex-column align-items-center py-2">
        <div v-for="item in menuItems" :key="item.id" class="menu-item-wrapper" @mouseenter="hoveredMenu = item.id"
            @mouseleave="hoveredMenu = null" @click="handleMenuClick(item.id)">

            <div :class="['menu-icon', {
                'active': editor.activeMenu === item.id,
                'text-primary': hoveredMenu === item.id && item.id === 'text'
            }]">
                <BaseIconComponent :name="item.icon" :type="item.type || 'lucide'" :size="20"
                    :color="editor.activeMenu == item.id ? '#3b82f6' : '#000000'" />
                <span>{{ item.label }}</span>
            </div>

            <Transition name="slide-tooltip">
                <div v-if="hoveredMenu === item.id && editor.activeMenu !== item.id" class="menu-tooltip">
                    {{ item.tooltip }}
                </div>
            </Transition>
        </div>

        <div class="mt-auto menu-icon text-muted">
            <BaseIconComponent name="help-circle" type="lucide" :size="20" />
            <span>Hỗ trợ</span>
        </div>

        <!-- TOGGLE DRAWER -->
        <div v-if="editor.activeMenu" class="sidebar-toggle-btn" @click="editor.activeMenu = null">
            <BaseIconComponent name="chevron-left" type="lucide" :size="16" />
        </div>
    </aside>
</template>
<style scoped>
/* SIDEBAR */
.main-sidebar {
    width: 72px;
    z-index: 900;
    flex-shrink: 0;
    position: relative;
}

.sidebar-toggle-btn {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-radius: 0 12px 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.05);
    /* Shadow on the right side */
    z-index: 2;
    /* Lower than tooltip */
    color: #6c757d;
    transition: all 0.2s;
    margin-left: 320px;
    /* Width of the drawer/tool panel */
}

.sidebar-toggle-btn:hover {
    color: #3b82f6;
    background-color: #f8f9fa;
}

.menu-item-wrapper {
    width: 100%;
    position: relative;
}

.menu-icon {
    width: 100%;
    padding: 14px 0;
    text-align: center;
    font-size: 10px;
    color: #444;
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
}

.menu-icon span {
    margin-top: 5px;
    font-weight: 400;
}

.menu-icon:hover,
.menu-icon.active {
    color: #3b82f6;
}

/* TOOLTIP ĐEN */
.menu-tooltip {
    position: absolute;
    left: 74px;
    top: 50%;
    transform: translateY(-50%);
    background: #212529;
    color: white;
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1100;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-tooltip::before {
    content: "";
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 5px solid #212529;
}
</style>