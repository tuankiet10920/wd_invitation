<script setup lang="ts">
import BoxToolComponent from '../BoxToolComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editor = useEditorStore();

// Computed proxy to safely access/update selected node properties
const nodeProps = computed(() => editor.selectedNode?.props || {});

const updateProp = (key: string, value: any) => {
    if (editor.selectedNodeId) {
        editor.updateNodeProps(editor.selectedNodeId, { [key]: value });
    }
};

// --- Computed Properties for bindings ---

const date = computed({
    get: () => nodeProps.value.date || '',
    set: (val) => updateProp('date', val)
});

const showTwoDays = computed({
    get: () => nodeProps.value.showTwoDays || false,
    set: (val) => updateProp('showTwoDays', val)
});

const date2 = computed({
    get: () => nodeProps.value.date2 || '',
    set: (val) => updateProp('date2', val)
});

const calendarStyle = computed({
    get: () => nodeProps.value.calendarStyle || 'style1',
    set: (val) => {
        updateProp('calendarStyle', val);
        // Also clear out the buggy 'style' prop if it exists
        if (nodeProps.value.style) {
            updateProp('style', undefined);
        }
    }
});

const textColor = computed({
    get: () => nodeProps.value.textColor || '#666666',
    set: (val) => updateProp('textColor', val)
});

const backgroundColor = computed({
    get: () => nodeProps.value.backgroundColor || '#ffffff',
    set: (val) => updateProp('backgroundColor', val)
});

const themeColor = computed({
    get: () => nodeProps.value.themeColor || '#d0021b',
    set: (val) => updateProp('themeColor', val)
});

const fontSize = computed({
    get: () => nodeProps.value.fontSize || 16,
    set: (val) => updateProp('fontSize', val)
});

const fontFamily = computed({
    get: () => nodeProps.value.fontFamily || 'Roboto',
    set: (val) => updateProp('fontFamily', val)
});

const opacity = computed({
    get: () => nodeProps.value.opacity ?? 1,
    set: (val) => updateProp('opacity', parseFloat(val))
});

// Calculate current month bounds
const currentMonthBounds = computed(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    return {
        min: `${y}-${m}-01`,
        max: `${y}-${m}-${lastDay}`
    };
});

// --- Options ---
const styleOptions = [
    { value: 'style1', label: 'Kiểu 1' },
    { value: 'style2', label: 'Kiểu 2' },
    { value: 'style3', label: 'Kiểu 3' },
];

const fontOptions = [
    'Arial', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans', 'Dancing Script'
];

const increaseFontSize = () => {
    updateProp('fontSize', (fontSize.value || 16) + 1);
};

const decreaseFontSize = () => {
    updateProp('fontSize', Math.max(1, (fontSize.value || 16) - 1));
};

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold">Tùy chỉnh lịch</div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- Date Selection -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Chọn ngày</label>
                    <input type="date" class="form-control form-control-sm w-auto" v-model="date"
                        :min="currentMonthBounds.min" :max="currentMonthBounds.max" style="max-width: 130px;">
                </div>

                <!-- Show 2 days -->
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="showTwoDays" v-model="showTwoDays">
                    <label class="form-check-label fs-7" for="showTwoDays">
                        Hiển thị 2 ngày
                    </label>
                </div>

                <div class="d-flex align-items-center justify-content-between" v-if="showTwoDays">
                    <label class="form-label mb-0 fs-7 fw-medium">Ngày thứ 2</label>
                    <input type="date" class="form-control form-control-sm w-auto" v-model="date2"
                        :min="currentMonthBounds.min" :max="currentMonthBounds.max" style="max-width: 130px;">
                </div>

                <!-- Style -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Style</label>
                    <select class="form-select form-select-sm w-auto" v-model="calendarStyle" style="min-width: 120px;">
                        <option v-for="opt in styleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                </div>

                <!-- Colors -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu Chữ</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="textColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: textColor }"></div>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu nền</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="backgroundColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: backgroundColor }"></div>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu giao diện</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="themeColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: themeColor }"></div>
                    </div>
                </div>

                <!-- Font Size -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Font size</label>
                    <div class="input-group input-group-sm w-auto" style="max-width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" @click="decreaseFontSize">-</button>
                        <input type="number" class="form-control text-center" v-model="fontSize">
                        <button class="btn btn-outline-secondary" type="button" @click="increaseFontSize">+</button>
                    </div>
                </div>

                <!-- Font -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Font</label>
                    <select class="form-select form-select-sm w-auto" v-model="fontFamily" style="min-width: 150px;">
                        <option v-for="font in fontOptions" :key="font" :value="font">{{ font }}</option>
                    </select>
                </div>

                <!-- Opacity -->
                <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <label class="form-label mb-0 fs-7 fw-medium">Trong suốt</label>
                        <input type="number" class="form-control form-control-sm text-center" v-model="opacity"
                            step="0.01" min="0" max="1" style="width: 60px;">
                    </div>
                    <input type="range" class="form-range" min="0" max="1" step="0.01" v-model="opacity">
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>

<style scoped>
.fs-7 {
    font-size: 0.875rem;
}

.color-wrapper {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #dee2e6;
}

.color-preview {
    width: 100%;
    height: 100%;
}
</style>