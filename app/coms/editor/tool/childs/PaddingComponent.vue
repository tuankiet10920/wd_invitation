<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import BoxToolComponent from '../BoxToolComponent.vue';

const editor = useEditorStore();

const usePadding = (prop: string) => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return parseInt(editor.selectedNode.styles[prop]) || 0;
        }
        return 0;
    },
    set: (val) => {
        if (editor.selectedNode) {
            if (!editor.selectedNode.styles) editor.selectedNode.styles = {};
            editor.selectedNode.styles[prop] = `${val}px`;
        }
    }
});

const paddingTop = usePadding('paddingTop');
const paddingBottom = usePadding('paddingBottom');
const paddingLeft = usePadding('paddingLeft');
const paddingRight = usePadding('paddingRight');

</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold text-dark" style="font-size: 14px;">Khoảng đệm</div>
        </template>
        <template #body>
            <div class="p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-dark fw-medium" style="font-size: 13px;">Khoảng đệm (Padding)</span>
                    <BaseIconComponent name="link-minimalistic-2-linear" type="solar" :size="16" class="text-dark"
                        style="cursor: pointer;" />
                </div>

                <div class="d-flex flex-column align-items-center gap-2">
                    <!-- Top -->
                    <div style="width: 60px;">
                        <input type="number"
                            class="form-control form-control-sm text-center border-secondary-subtle px-1"
                            v-model="paddingTop" style="font-size: 13px;">
                    </div>

                    <!-- Middle Row -->
                    <div class="d-flex align-items-center gap-2">
                        <!-- Left -->
                        <div style="width: 60px;">
                            <input type="number"
                                class="form-control form-control-sm text-center border-secondary-subtle px-1"
                                v-model="paddingLeft" style="font-size: 13px;">
                        </div>

                        <!-- Block -->
                        <div class="d-flex align-items-center justify-content-center bg-secondary-subtle rounded border border-secondary-subtle"
                            style="width: 80px; height: 32px; background-color: #e5e7eb;">
                            <span class="text-dark" style="font-size: 13px;">Block</span>
                        </div>

                        <!-- Right -->
                        <div style="width: 60px;">
                            <input type="number"
                                class="form-control form-control-sm text-center border-secondary-subtle px-1"
                                v-model="paddingRight" style="font-size: 13px;">
                        </div>
                    </div>

                    <!-- Bottom -->
                    <div style="width: 60px;">
                        <input type="number"
                            class="form-control form-control-sm text-center border-secondary-subtle px-1"
                            v-model="paddingBottom" style="font-size: 13px;">
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>
<style scoped></style>