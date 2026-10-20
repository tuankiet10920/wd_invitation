<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import GalleryComponent from '~/coms/dashboard/modal/GalleryComponent.vue';

const editor = useEditorStore();
const isGalleryOpen = ref(false);

const useProp = (prop: string, defaultValue: any = []) => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.props && prop in editor.selectedNode.props) {
            return editor.selectedNode.props[prop];
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNode) {
            if (!editor.selectedNode.props) editor.selectedNode.props = {};
            editor.selectedNode.props[prop] = val;
        }
    }
});

const images = useProp('images', []);

const handleUploadClick = () => {
    isGalleryOpen.value = true;
}

const handleGalleryConfirm = (urls: string[]) => {
    images.value = [...(images.value || []), ...urls];
}

const removeImage = (index: number) => {
    const arr = [...(images.value || [])];
    arr.splice(index, 1);
    images.value = arr;
}
</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="chevron-down" type="mdi" :size="20" />
                <span>Danh sách ảnh</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <div v-if="!images || images.length === 0" class="text-secondary" style="font-size: 13.5px;">
                    Chưa có ảnh nào được chọn
                </div>
                
                <div v-else class="d-flex flex-wrap gap-2">
                    <div v-for="(img, idx) in images" :key="idx" class="position-relative border rounded" style="width: 60px; height: 60px;">
                        <img :src="img" class="w-100 h-100 object-fit-cover rounded" />
                        <button class="btn btn-sm text-white position-absolute p-0 bg-danger border-0 d-flex align-items-center justify-content-center" 
                            style="top: -5px; right: -5px; width: 16px; height: 16px; border-radius: 50%; z-index: 2;" 
                            @click="removeImage(Number(idx))">
                            <BaseIconComponent name="close" type="mdi" :size="12" />
                        </button>
                    </div>
                </div>
                
                <button class="btn w-100 text-white d-flex align-items-center justify-content-center gap-1 py-1 border-0 mt-1"
                    style="font-size: 14px; background-color: #3b82f6; border-radius: 6px; padding-top: 6px; padding-bottom: 6px;"
                    @click="handleUploadClick">
                    <BaseIconComponent name="plus" type="mdi" :size="18" color="#fff" />
                    <span>Chọn ảnh từ thư viện</span>
                </button>

                <GalleryComponent v-model="isGalleryOpen" @confirm="handleGalleryConfirm" />
            </div>
        </template>
    </BoxToolComponent>
</template>

<style scoped>
.fs-14 { font-size: 14.5px; }
</style>