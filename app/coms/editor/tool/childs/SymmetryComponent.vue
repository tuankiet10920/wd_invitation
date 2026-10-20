<script setup lang="ts">
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import ToggleComponent from './ToggleComponent.vue';

const editor = useEditorStore();

const isFlipH = ref(false);
const isFlipV = ref(false);

const updateTransform = () => {
    if (!editor.selectedNode) return;

    const scaleX = isFlipH.value ? -1 : 1;
    const scaleY = isFlipV.value ? -1 : 1;

    // Check if we just have normal scale, removing transform could be cleaner but keeping it explicit is fine
    if (scaleX === 1 && scaleY === 1) {
        editor.updateNodeStyle(editor.selectedNode.id, { transform: 'none' });
    } else {
        editor.updateNodeStyle(editor.selectedNode.id, { transform: `scale(${scaleX}, ${scaleY})` });
    }
}

watch(() => editor.selectedNode, (node) => {
    if (node && node.styles?.transform) {
        const transform = node.styles.transform;
        // Parse scale(x, y)
        const match = transform.match(/scale\((-?\d+),\s*(-?\d+)\)/);
        if (match) {
            isFlipH.value = parseInt(match[1]!) === -1;
            isFlipV.value = parseInt(match[2]!) === -1;
        } else {
            isFlipH.value = false;
            isFlipV.value = false;
        }
    } else {
        isFlipH.value = false;
        isFlipV.value = false;
    }
}, { immediate: true });

watch([isFlipH, isFlipV], () => {
    updateTransform();
});
</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14">
                Đối xứng
            </div>
        </template>
        <template #body>
            <div class="d-flex align-items-center justify-content-between gap-3 p-2">
                <div class="d-flex align-items-center gap-2">
                    <span class="fs-13">Lật ngang:</span>
                    <div class="m-0 min-h-auto">
                        <ToggleComponent v-model="isFlipH" />
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fs-13">Lật dọc:</span>
                    <div class="m-0 min-h-auto">
                        <ToggleComponent v-model="isFlipV" />
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>
<style scoped></style>