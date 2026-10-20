<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const useProp = (prop: string, defaultValue: any = true) => computed({
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

const showThumbnail = useProp('showThumbnail', true);
const showNav = useProp('showNav', true);
const showDots = useProp('showDots', true);
const autoplay = useProp('autoplay', true);
const autoplayDelay = useProp('autoplayDelay', 5000);
const loop = useProp('loop', true);

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="settings-outline" type="mdi" :size="20" />
                <span>Tùy chọn hiển thị</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-13 fw-medium text-dark">Hiển thị ảnh nhỏ</span>
                    <div class="form-check form-switch m-0 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="showThumbnail">
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-13 fw-medium text-dark">Nút mũi tên điều hướng</span>
                    <div class="form-check form-switch m-0 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="showNav">
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-13 fw-medium text-dark">Dấu chấm trang (Dots)</span>
                    <div class="form-check form-switch m-0 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="showDots">
                    </div>
                </div>

                <div class="hr-border w-100 my-1"></div>

                <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-13 fw-medium text-dark">Tự động chạy ảnh</span>
                    <div class="form-check form-switch m-0 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="autoplay">
                    </div>
                </div>

                <div v-if="autoplay" class="d-flex flex-column gap-2 mt-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fs-12 text-secondary">Tốc độ trượt (ms)</span>
                        <span class="fs-12 text-primary fw-bold">{{ autoplayDelay }}ms</span>
                    </div>
                    <input type="range" class="form-range custom-range" min="1000" max="10000" step="500" v-model.number="autoplayDelay">
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <span class="fs-13 fw-medium text-dark">Lặp lại vô tận</span>
                    <div class="form-check form-switch m-0 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="loop">
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>

<style scoped>
.fs-14 { font-size: 14.5px; }
.fs-13 { font-size: 13.5px; }
.fs-12 { font-size: 12px; }
.custom-switch { width: 36px; height: 20px; cursor: pointer; }
.form-switch .form-check-input:checked { background-color: #3b82f6; border-color: #3b82f6; }
.hr-border { border-top: 1px solid #eee; }
.custom-range::-webkit-slider-thumb { background: #3b82f6; }
.custom-range::-moz-range-thumb { background: #3b82f6; }
</style>