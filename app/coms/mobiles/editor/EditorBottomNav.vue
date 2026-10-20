<script setup lang="ts">
import BaseIconComponent from '../../icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';
import { useElementStore } from '~~/stores/element';

const items = [
    { id: 'text', label: 'Văn bản', icon: 'type', type: 'lucide' as const },
    { id: 'image', label: 'Hình ảnh', icon: 'image', type: 'lucide' as const },
    { id: 'stock', label: 'Stock', icon: 'heart-outline', type: 'mdi' as const },
    { id: 'bg', label: 'Hình nền', icon: 'texture', type: 'mdi' as const },
    { id: 'music', label: 'Âm nhạc', icon: 'music', type: 'lucide' as const },
    { id: 'tool', label: 'Tiện ích', icon: 'calendar-check', type: 'lucide' as const },
    { id: 'effects', label: 'Hiệu ứng', icon: 'sparkles', type: 'lucide' as const }
]

const editor = useEditorStore();
const element = useElementStore();

const selectTab = (id: string) => {
    if (id === 'text') {
        editor.addNode('Text')
        editor.activeMenu = null
        return;
    }

    editor.activeMenu = editor.activeMenu === id ? null : id
    if (id === 'music') element.type = 'Music'
}
</script>

<template>
    <div class="bottom-nav-wrapper bg-white border-top shadow-sm">
        <div class="bottom-nav-tabs d-flex align-items-center overflow-auto px-2">
            <template v-for="item in items" :key="item.id">
                <div class="nav-tab-item d-flex flex-column align-items-center justify-content-center p-2"
                    :class="{ 'active': editor.activeMenu === item.id }" @click="selectTab(item.id)">
                    <div class="icon-box mb-1">
                        <BaseIconComponent :name="item.icon" :type="item.type" :size="24"
                            :color="editor.activeMenu === item.id ? '#3b82f6' : '#000000'" />
                    </div>
                    <span class="tab-label text-nowrap">{{ item.label }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.bottom-nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 75px;
    z-index: 1050;
}

.bottom-nav-tabs {
    height: 100%;
    gap: 15px;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.bottom-nav-tabs::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.nav-tab-item {
    min-width: 70px;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 8px;
}

.nav-tab-item.active {
    background-color: rgba(59, 130, 246, 0.05);
}

.tab-label {
    font-size: 11px;
    font-weight: 500;
    color: #555;
    transition: color 0.2s;
}

.nav-tab-item.active .tab-label {
    color: #3b82f6;
}

.icon-box {
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
