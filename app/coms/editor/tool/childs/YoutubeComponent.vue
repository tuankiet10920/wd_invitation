<script setup lang="ts">
import { computed, watch } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const useProp = (prop: string, defaultValue: any = '') => computed({
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

const src = useProp('src', '');
const autoplay = useProp('autoplay', false);
const mute = useProp('mute', false);
const controls = useProp('controls', true);

watch(autoplay, (newVal) => {
    if (newVal) {
        mute.value = true;
    }
});
</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="chevron-down" type="mdi" :size="20" />
                <span>Cài đặt video</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- URL Field -->
                <div>
                    <label class="form-label fs-7 fw-medium mb-1 text-dark" style="font-size: 13.5px;">URL video YouTube</label>
                    <input type="text" class="form-control border text-dark" style="font-size: 14px;"
                        placeholder="https://www.youtube.com/watch?v..." v-model="src">
                    <div class="form-text mt-1 text-secondary" style="font-size: 12px;">Dán link video YouTube hoặc mã video (Video ID)</div>
                </div>

                <!-- Autoplay -->
                <div class="d-flex align-items-center justify-content-between pt-1">
                    <span class="fs-7 fw-medium text-dark" style="font-size: 13.5px;">Tự động phát</span>
                    <div class="form-check form-switch m-0 mt-1 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="autoplay">
                    </div>
                </div>

                <!-- Mute -->
                <div class="d-flex align-items-center justify-content-between pt-1">
                    <span class="fs-7 fw-medium text-dark" style="font-size: 13.5px;">Tắt tiếng</span>
                    <div class="form-check form-switch m-0 mt-1 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="mute" :disabled="autoplay">
                    </div>
                </div>

                <!-- Show Controls -->
                <div class="d-flex align-items-center justify-content-between pt-1">
                    <span class="fs-7 fw-medium text-dark" style="font-size: 13.5px;">Hiển thị điều khiển</span>
                    <div class="form-check form-switch m-0 mt-1 d-flex">
                        <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="controls">
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>

<style scoped>
.fs-14 {
    font-size: 14.5px;
}

.fs-7 {
    font-size: 13.5px;
}

.form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
    border-color: #3b82f6;
}

.custom-switch {
    width: 36px;
    height: 20px;
    cursor: pointer;
}
.form-switch .form-check-input:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}
</style>