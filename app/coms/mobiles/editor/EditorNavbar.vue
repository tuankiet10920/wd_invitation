<script setup lang="ts">
import BaseIconComponent from '../../icons/BaseIconComponent.vue';
import InfoComponent from '~/coms/user/InfoComponent.vue';
import MangageSyncComponent from '~/coms/dashboard/modal/MangageSyncComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editorStore = useEditorStore();
const emit = defineEmits(['toggle-sidebar', 'toggle-settings']);

const isSyncModalOpen = ref(false);

const handlePublish = async () => {
    if (!editorStore.id_category_wedding_card) {
        editorStore.categoryError = true;
        emit('toggle-settings');
        return;
    }
    await editorStore.saveTemplate();
};
</script>

<template>
    <header
        class="mobile-navbar d-flex align-items-center justify-content-between px-3 bg-white border-bottom shadow-sm">
        <div class="d-flex align-items-center gap-2">
            <!-- Hamburger -->
            <button class="btn btn-link p-1 text-dark d-flex align-items-center" @click="emit('toggle-sidebar')">
                <BaseIconComponent name="menu" type="lucide" :size="24" />
            </button>

            <!-- Undo/Redo -->
            <div class="d-flex align-items-center gap-3 ms-2">
                <BaseIconComponent name="rotate-ccw" type="lucide" :size="20" color="#333" class="cursor-pointer" />
                <BaseIconComponent name="rotate-cw" type="lucide" :size="20" color="#ccc" class="cursor-pointer" />
            </div>
        </div>

        <div class="d-flex align-items-center gap-2">
            <!-- Save Icon with Notification Dot -->
            <div class="position-relative p-1 d-flex align-items-center cursor-pointer" @click="isSyncModalOpen = true">
                <BaseIconComponent 
                    :name="editorStore.is_saved ? 'content-save' : 'history'" 
                    :type="editorStore.is_saved ? 'mdi' : 'lucide'" 
                    :size="editorStore.is_saved ? 22 : 20" 
                    color="#333" />
                <span v-if="!editorStore.is_saved" class="save-dot"></span>
            </div>

            <!-- Publish Button (Rocket) -->
            <button class="btn btn-primary publish-btn d-flex align-items-center gap-2 px-3 fw-bold"
                @click="handlePublish">
                <BaseIconComponent name="rocket-launch-outline" type="mdi" :size="18" color="white" />
                <span>Xuất bản</span>
            </button>

            <!-- User Info Popover -->
            <InfoComponent class="ms-1" />
        </div>
    </header>

    <MangageSyncComponent v-model="isSyncModalOpen" />
</template>

<style scoped>
.mobile-navbar {
    height: 120px;
    z-index: 1000;
}

.save-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: #ff4d4f;
    border-radius: 50%;
    border: 2px solid white;
}

.publish-btn {
    height: 36px;
    border-radius: 8px;
    font-size: 14px;
    background-color: #3b82f6;
    border: none;
}
</style>
