<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';

const editor = useEditorStore();

const backgroundColor = computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return editor.selectedNode.styles.backgroundColor || '#ffffff';
        }
        return '#ffffff';
    },
    set: (val) => {
        if (editor.selectedNode) {
            editor.updateNodeStyle(editor.selectedNode.id, { backgroundColor: val });
        }
    }
});

const svgColor = computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return editor.selectedNode.styles.color || '#000000';
        }
        return '#000000';
    },
    set: (val) => {
        if (editor.selectedNode) {
            editor.updateNodeStyle(editor.selectedNode.id, { color: val });
        }
    }
});

const isSvg = computed(() => {
    return editor.selectedNode?.props?.imageType === 'svg';
});

const opacity = computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return editor.selectedNode.styles.opacity ?? 1;
        }
        return 1;
    },
    set: (val) => {
        if (editor.selectedNode) {
            editor.updateNodeStyle(editor.selectedNode.id, { opacity: val });
        }
    }
});
</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14">Màu sắc</div>
        </template>
        <template #body>
            <div class="d-flex align-items-center justify-content-between mb-2 p-2 px-3">
                <span class="fs-13">Màu nền</span>
                <input type="color" v-model="backgroundColor" class="color-picker-input border-0 p-0 overflow-hidden"
                    style="width: 28px; height: 28px; border-radius: 4px; cursor: pointer;">
            </div>

            <div v-if="isSvg" class="d-flex align-items-center justify-content-between mb-2 p-2 px-3">
                <span class="fs-13">Màu SVG</span>
                <input type="color" v-model="svgColor" class="color-picker-input border-0 p-0 overflow-hidden"
                    style="width: 28px; height: 28px; border-radius: 4px; cursor: pointer;">
            </div>

            <div class="p-2 px-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fs-13">Trong suốt</span>
                    <input type="number" class="form-control form-control-sm text-center" v-model="opacity" step="0.01"
                        min="0" max="1" style="width: 60px; font-size: 13px;">
                </div>
                <input type="range" class="form-range custom-range" v-model="opacity" min="0" max="1" step="0.01">
            </div>
        </template>
    </BoxToolComponent>
</template>
<style scoped></style>