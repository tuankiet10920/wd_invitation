<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    isLocked: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'duplicate',
    'delete',
    'bringToFront',
    'sendToBack',
    'bringForward',
    'sendBackward',
    'lock'
]);

const showMenu = ref(false);
const menuRef = ref<HTMLElement | null>(null);

// Close menu when clicking outside
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

// eslint-disable-next-line
const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
        showMenu.value = false;
    }
};

const toggleMenu = (event: MouseEvent) => {
    event.stopPropagation();
    showMenu.value = !showMenu.value;
};

const handleAction = (action: 'bringToFront' | 'sendToBack' | 'bringForward' | 'sendBackward' | 'lock') => {
    emit(action);
    showMenu.value = false;
};
</script>

<template>
    <div class="action-toolbar-container d-flex justify-content-center" ref="menuRef" @mousedown.stop>
        <div class="action-toolbar d-flex align-items-center bg-white shadow-sm">
            <div class="toolbar-btn d-flex align-items-center justify-content-center"
                :class="isLocked ? 'disabled' : 'cursor-pointer'" @click="!isLocked && $emit('duplicate')"
                title="Nhân bản">
                <BaseIconComponent name="content-copy" type="mdi" :size="18" :color="isLocked ? '#ccc' : '#555'" />
            </div>

            <div class="toolbar-btn d-flex align-items-center justify-content-center"
                :class="isLocked ? 'disabled' : 'cursor-pointer'" @click="!isLocked && $emit('delete')" title="Xóa">
                <BaseIconComponent name="trash-can-outline" type="mdi" :size="18" :color="isLocked ? '#ccc' : '#555'" />
            </div>

            <div class="toolbar-btn d-flex align-items-center justify-content-center cursor-pointer" @click="toggleMenu"
                title="Thêm">
                <BaseIconComponent name="dots-horizontal" type="mdi" :size="20" color="#555" />
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="showMenu" class="more-menu bg-white shadow rounded py-2 position-absolute">
            <div class="menu-item d-flex align-items-center gap-3 px-3 py-2"
                :class="isLocked ? 'text-muted' : 'cursor-pointer'" @click="!isLocked && handleAction('bringToFront')">
                <BaseIconComponent name="layers-triple-outline" type="mdi" :size="18"
                    :color="isLocked ? '#ccc' : '#555'" />
                <span class="menu-item-span">Đưa lên trên cùng</span>
            </div>
            <div class="menu-item d-flex align-items-center gap-3 px-3 py-2"
                :class="isLocked ? 'text-muted' : 'cursor-pointer'" @click="!isLocked && handleAction('sendToBack')">
                <BaseIconComponent name="layers-triple" type="mdi" :size="18" :color="isLocked ? '#ccc' : '#555'" />
                <span class="menu-item-span">Đưa xuống dưới cùng</span>
            </div>
            <div class="menu-item d-flex align-items-center gap-3 px-3 py-2"
                :class="isLocked ? 'text-muted' : 'cursor-pointer'" @click="!isLocked && handleAction('bringForward')">
                <BaseIconComponent name="arrow-up-thin" type="mdi" :size="18" :color="isLocked ? '#ccc' : '#555'" />
                <span class="menu-item-span">Đưa lên một lớp</span>
            </div>
            <div class="menu-item d-flex align-items-center gap-3 px-3 py-2"
                :class="isLocked ? 'text-muted' : 'cursor-pointer'" @click="!isLocked && handleAction('sendBackward')">
                <BaseIconComponent name="arrow-down-thin" type="mdi" :size="18" :color="isLocked ? '#ccc' : '#555'" />
                <span class="menu-item-span">Đưa xuống một lớp</span>
            </div>
            <div class="menu-item d-flex align-items-center gap-3 px-3 py-2 cursor-pointer"
                @click="handleAction('lock')">
                <BaseIconComponent :name="isLocked ? 'lock-open-variant-outline' : 'lock-outline'" type="mdi" :size="18"
                    :color="isLocked ? '#3b82f6' : '#555'" />
                <span class="menu-item-span text-nowrap" :class="{ 'text-primary': isLocked }">{{ isLocked ? `Mở khóa vị trí` : 'Khóa vị trí' }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.action-toolbar-container {
    width: fit-content;
}

.action-toolbar {
    border-radius: 50px;
    padding: 6px 16px;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    width: max-content;
}

.toolbar-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.toolbar-btn:not(.disabled):hover {
    background-color: #f3f4f6;
}

.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.more-menu {
    top: 100%;
    left: 100%;
    transform: translateX(-30%);
    margin-top: 8px;
    min-width: 200px;
    z-index: 2000;
}

.menu-item:hover {
    background-color: #f3f4f6;
}

.cursor-pointer {
    cursor: pointer;
}

.menu-item-span {
    font-size: 12px;
}
</style>