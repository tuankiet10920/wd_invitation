<script setup lang="ts">
import BoxToolComponent from '../BoxToolComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editor = useEditorStore();

const nodeProps = computed(() => editor.selectedNode?.props || {});

const updateProp = (key: string, value: any) => {
    if (editor.selectedNodeId) {
        editor.updateNodeProps(editor.selectedNodeId, { [key]: value });
    }
};

// --- Bindings ---
const date = computed({
    get: () => nodeProps.value.date || '',
    set: (val) => updateProp('date', val)
});


const time = computed({
    get: () => nodeProps.value.time || '00:00',
    set: (val) => updateProp('time', val)
});

const direction = computed({
    get: () => nodeProps.value.direction || 'horizontal',
    set: (val) => updateProp('direction', val)
});

const gap = computed({
    get: () => nodeProps.value.gap || 20,
    set: (val) => updateProp('gap', val)
});

const textColor = computed({
    get: () => nodeProps.value.textColor || '#ffffff',
    set: (val) => updateProp('textColor', val)
});

const borderColor = computed({
    get: () => nodeProps.value.borderColor || '#000000',
    set: (val) => updateProp('borderColor', val)
});

const backgroundColor = computed({
    get: () => nodeProps.value.backgroundColor || '#000000',
    set: (val) => updateProp('backgroundColor', val)
});

const fontSize = computed({
    get: () => nodeProps.value.fontSize || 14,
    set: (val) => updateProp('fontSize', val)
});

const fontFamily = computed({
    get: () => nodeProps.value.fontFamily || 'Arial',
    set: (val) => updateProp('fontFamily', val)
});

const opacity = computed({
    get: () => nodeProps.value.opacity ?? 1,
    set: (val) => updateProp('opacity', parseFloat(val))
});

const fontOptions = [
    'Arial', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans', 'Dancing Script'
];

const increaseProp = (prop: string, current: number) => {
    updateProp(prop, current + 1);
};

const decreaseProp = (prop: string, current: number) => {
    updateProp(prop, Math.max(0, current - 1));
};

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold">Tùy chỉnh đếm ngược</div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- Date Selection -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Chọn ngày</label>
                    <input type="date" class="form-control form-control-sm w-auto" v-model="date"
                        style="max-width: 130px;">
                </div>


                <!-- Time Selection -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Chọn giờ</label>
                    <input type="time" class="form-control form-control-sm w-auto" v-model="time"
                        style="max-width: 130px;">
                </div>

                <!-- Direction -->
                <div>
                    <label class="form-label fs-7 fw-medium mb-1">Hướng hiển thị</label>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm flex-fill"
                            :class="direction === 'horizontal' ? 'btn-primary' : 'btn-light border'"
                            @click="direction = 'horizontal'">
                            Ngang
                        </button>
                        <button class="btn btn-sm flex-fill"
                            :class="direction === 'vertical' ? 'btn-primary' : 'btn-light border'"
                            @click="direction = 'vertical'">
                            Dọc
                        </button>
                    </div>
                </div>

                <!-- Gap -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Khoảng cách</label>
                    <div class="input-group input-group-sm w-auto" style="max-width: 100px;">
                        <input type="number" class="form-control text-center px-1" v-model="gap">
                        <span class="input-group-text px-1">px</span>
                    </div>
                </div>
                <input type="range" class="form-range" min="0" max="100" step="1" v-model="gap">


                <!-- Colors -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu chữ</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="textColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: textColor }"></div>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu khung</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="borderColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: borderColor }"></div>
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

                <!-- Font Size -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Font size</label>
                    <div class="input-group input-group-sm w-auto" style="max-width: 110px;">
                        <button class="btn btn-outline-secondary" type="button"
                            @click="decreaseProp('fontSize', fontSize)">-</button>
                        <input type="number" class="form-control text-center px-1" v-model="fontSize">
                        <button class="btn btn-outline-secondary" type="button"
                            @click="increaseProp('fontSize', fontSize)">+</button>
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