<script setup lang="ts">
import { useEditorStore } from '~~/stores/editor';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const selectedImage = computed(() => {
    return editor.selectedNode?.props?.url || 'https://placehold.co/200x200?text=No+Image';
});

const handleChangeImage = () => {
    const url = editor.selectedNode?.props?.url || '';
    editor.isReplacingImage = true;
    if (url.includes('/stocks/')) {
        editor.activeMenu = 'stock';
    } else {
        editor.activeMenu = 'image';
    }
};

</script>
<template>
    <div class="text-center" v-if="editor.selectedNode">
        <div class="image-preview mb-2 d-inline-block p-1 border rounded">
            <NuxtImg :src="selectedImage" alt="Preview" class="rounded object-fit-cover" width="120" height="120"
                :key="selectedImage" />
        </div>
        <div>
            <button @click="handleChangeImage" class="btn btn-primary btn-sm px-3 d-inline-flex align-items-center gap-2"
                style="background-color: #3b82f6; border-color: #3b82f6;">
                <BaseIconComponent name="image" type="lucide" :size="16" color="#fff" />
                <span>Thay đổi</span>
            </button>
        </div>
    </div>
</template>
<style scoped></style>