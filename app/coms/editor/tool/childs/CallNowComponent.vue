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
const phoneNumber = computed({
    get: () => nodeProps.value.phoneNumber || '',
    set: (val) => updateProp('phoneNumber', val)
});

const text = computed({
    get: () => nodeProps.value.text || 'Gọi ngay',
    set: (val) => updateProp('text', val)
});

const showIcon = computed({
    get: () => nodeProps.value.showIcon !== false, // default true
    set: (val) => updateProp('showIcon', val)
});

const iconSize = computed({
    get: () => nodeProps.value.iconSize || 20,
    set: (val) => updateProp('iconSize', val)
});

const iconColor = computed({
    get: () => nodeProps.value.iconColor || '#ffffff',
    set: (val) => updateProp('iconColor', val)
});

const textColor = computed({
    get: () => nodeProps.value.textColor || '#ffffff',
    set: (val) => updateProp('textColor', val)
});

const backgroundColor = computed({
    get: () => nodeProps.value.backgroundColor || '#ff4757',
    set: (val) => updateProp('backgroundColor', val)
});

const fontSize = computed({
    get: () => nodeProps.value.fontSize || 16,
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
    updateProp(prop, Math.max(1, current - 1));
};

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold">Thiết lập nút gọi</div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- Phone Number -->
                <div>
                    <label class="form-label fs-7 text-muted mb-1">Số điện thoại</label>
                    <input type="text" class="form-control form-control-sm" placeholder="Nhập số điện thoại"
                        v-model="phoneNumber">
                </div>

                <!-- Text Content -->
                <div>
                    <label class="form-label fs-7 text-muted mb-1">Nội dung nút</label>
                    <input type="text" class="form-control form-control-sm" v-model="text">
                </div>

                <hr class="m-0 border-light" />

                <!-- Icon Settings -->
                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 text-muted">Hiển thị icon điện thoại</label>
                    <div class="form-check form-switch m-0">
                        <input class="form-check-input" type="checkbox" role="switch" v-model="showIcon">
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Icon size</label>
                    <div class="input-group input-group-sm w-auto" style="max-width: 110px;">
                        <button class="btn btn-outline-secondary" type="button"
                            @click="decreaseProp('iconSize', iconSize)">-</button>
                        <input type="number" class="form-control text-center px-1" v-model="iconSize">
                        <button class="btn btn-outline-secondary" type="button"
                            @click="increaseProp('iconSize', iconSize)">+</button>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <label class="form-label mb-0 fs-7 fw-medium">Màu icon</label>
                    <div class="color-wrapper position-relative">
                        <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                            v-model="iconColor" style="z-index:10; cursor: pointer;">
                        <div class="color-preview shadow-sm" :style="{ backgroundColor: iconColor }"></div>
                    </div>
                </div>

                <hr class="m-0 border-light" />

                <!-- Button Colors -->
                <div>
                    <label class="form-label fs-7 text-muted mb-2">Màu sắc nút</label>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-7 fw-medium">Màu chữ</span>
                            <div class="color-wrapper position-relative">
                                <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                                    v-model="textColor" style="z-index:10; cursor: pointer;">
                                <div class="color-preview shadow-sm" :style="{ backgroundColor: textColor }"></div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-7 fw-medium">Màu nền</span>
                            <div class="color-wrapper position-relative">
                                <input type="color" class="color-input position-absolute w-100 h-100 opacity-0"
                                    v-model="backgroundColor" style="z-index:10; cursor: pointer;">
                                <div class="color-preview shadow-sm" :style="{ backgroundColor: backgroundColor }">
                                </div>
                            </div>
                        </div>
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

.form-check-input:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}
</style>