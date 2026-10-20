<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import BoxToolComponent from '../BoxToolComponent.vue';

const editor = useEditorStore();

const borderPosition = ref('all'); // all, top, bottom, left, right
const isBorderRadiusLinked = ref(true);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Persistent store for the "current" border size user intended
const currentSize = ref(0);

const positionMap: Record<string, string[]> = {
    all: ['Top', 'Bottom', 'Left', 'Right'],
    top: ['Top'],
    bottom: ['Bottom'],
    left: ['Left'],
    right: ['Right'],
    leftRight: ['Left', 'Right'],
    topBottom: ['Top', 'Bottom'],
    topLeft: ['Top', 'Left'],
    topRight: ['Top', 'Right'],
    bottomLeft: ['Bottom', 'Left'],
    bottomRight: ['Bottom', 'Right']
};

const getPropsList = (type: 'Width' | 'Color' | 'Style') => {
    if (borderPosition.value === 'all') return [`border${type}`]; 
    const sides = positionMap[borderPosition.value] || ['Top', 'Bottom', 'Left', 'Right'];
    return sides.map(side => `border${side}${type}`);
};

// Generic helper for border properties
const useBorderProp = (type: 'Width' | 'Color' | 'Style', defaultValue: any) => computed({
    get: () => {
        if (!editor.selectedNode?.styles) return defaultValue;

        if (type === 'Width') return currentSize.value;

        const props = getPropsList(type);
        const propName = props[0] as string;
        let val = editor.selectedNode.styles[propName];
        if (!val && borderPosition.value === 'all') {
            val = editor.selectedNode.styles[`borderTop${type}` as string];
        }
        return val || defaultValue;
    },
    set: (val) => {
        if (!editor.selectedNode) return;
        if (!editor.selectedNode.styles) editor.selectedNode.styles = {};

        const value = type === 'Width' ? `${val}px` : val;
        
        const props = getPropsList(type);
        props.forEach(prop => {
            editor.selectedNode!.styles[prop] = value;
        });

        if (type === 'Width') {
            currentSize.value = typeof val === 'string' ? parseInt(val) : val;

            if (currentSize.value > 0) {
                const styleProps = getPropsList('Style');
                styleProps.forEach(sp => {
                    if (!editor.selectedNode!.styles[sp] || editor.selectedNode!.styles[sp] === 'none') {
                        editor.selectedNode!.styles[sp] = borderStyle.value !== 'none' ? borderStyle.value : 'solid';
                    }
                });
                
                const colorProps = getPropsList('Color');
                colorProps.forEach(cp => {
                     if (!editor.selectedNode!.styles[cp]) {
                         editor.selectedNode!.styles[cp] = borderColor.value;
                     }
                });
            }
        }
    }
});

const borderSize = useBorderProp('Width', 0);
const borderColor = useBorderProp('Color', '#000000');
const borderStyle = useBorderProp('Style', 'solid');

// Watch selection to sync state
watch(() => editor.selectedNode, (node) => {
    if (!node || !node.styles) {
        currentSize.value = 0;
        borderPosition.value = 'all';
        return;
    }

    // Try to find an existing border width
    const top = parseInt(node.styles.borderTopWidth) || 0;
    const bottom = parseInt(node.styles.borderBottomWidth) || 0;
    const left = parseInt(node.styles.borderLeftWidth) || 0;
    const right = parseInt(node.styles.borderRightWidth) || 0;
    const all = parseInt(node.styles.borderWidth) || 0;

    if (all > 0) {
        currentSize.value = all; borderPosition.value = 'all';
    } else if (top > 0 && top === bottom && top === left && top === right) {
        currentSize.value = top; borderPosition.value = 'all';
    } else if (left > 0 && right > 0 && left === right && top === 0 && bottom === 0) {
        currentSize.value = left; borderPosition.value = 'leftRight';
    } else if (top > 0 && bottom > 0 && top === bottom && left === 0 && right === 0) {
        currentSize.value = top; borderPosition.value = 'topBottom';
    } else if (top > 0 && left > 0 && top === left && bottom === 0 && right === 0) {
        currentSize.value = top; borderPosition.value = 'topLeft';
    } else if (top > 0 && right > 0 && top === right && bottom === 0 && left === 0) {
        currentSize.value = top; borderPosition.value = 'topRight';
    } else if (bottom > 0 && left > 0 && bottom === left && top === 0 && right === 0) {
        currentSize.value = bottom; borderPosition.value = 'bottomLeft';
    } else if (bottom > 0 && right > 0 && bottom === right && top === 0 && left === 0) {
        currentSize.value = bottom; borderPosition.value = 'bottomRight';
    } else if (top > 0) { currentSize.value = top; borderPosition.value = 'top'; }
    else if (bottom > 0) { currentSize.value = bottom; borderPosition.value = 'bottom'; }
    else if (left > 0) { currentSize.value = left; borderPosition.value = 'left'; }
    else if (right > 0) { currentSize.value = right; borderPosition.value = 'right'; }
    else {
        currentSize.value = 0;
        borderPosition.value = 'all';
    }
}, { immediate: true });

// Watch for position change to reset others
watch(borderPosition, (newPos) => {
    if (!editor.selectedNode || !editor.selectedNode.styles) return;

    if (currentSize.value === 0) return; // No need to manipulate if size is 0

    const allSides = ['Top', 'Bottom', 'Left', 'Right'];

    if (newPos === 'all') {
        allSides.forEach(side => {
            editor.selectedNode!.styles[`border${side}Width`] = `${currentSize.value}px`;
        });
        editor.selectedNode!.styles['borderWidth'] = `${currentSize.value}px`;
    } else {
        editor.selectedNode!.styles['borderWidth'] = '0px';

        const activeSides = positionMap[newPos] || [];

        allSides.forEach(side => {
            const prop = `border${side}Width`;

            if (activeSides.includes(side)) {
                editor.selectedNode!.styles[prop] = `${currentSize.value}px`;

                const styleProp = `border${side}Style`;
                const colorProp = `border${side}Color`;

                if (!editor.selectedNode!.styles[styleProp] || editor.selectedNode!.styles[styleProp] === 'none') {
                    editor.selectedNode!.styles[styleProp] = borderStyle.value !== 'none' ? borderStyle.value : 'solid';
                }
                if (!editor.selectedNode!.styles[colorProp]) {
                    editor.selectedNode!.styles[colorProp] = borderColor.value;
                }
            } else {
                editor.selectedNode!.styles[prop] = '0px';
            }
        });
    }
});

// Border Radius Helper
const useBorderRadius = (corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight') => computed({
    get: () => {
        if (!editor.selectedNode?.styles) return 0;
        const prop = `border${corner}Radius`;
        return parseInt(editor.selectedNode.styles[prop]) || 0;
    },
    set: (val) => {
        if (!editor.selectedNode) return;
        if (!editor.selectedNode.styles) editor.selectedNode.styles = {};

        const value = `${val}px`;

        if (isBorderRadiusLinked.value) {
            // Update all corners if linked
            ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'].forEach(c => {
                editor.selectedNode!.styles[`border${c}Radius`] = value;
            });
            // Also set shorthand
            editor.selectedNode!.styles['borderRadius'] = value;
        } else {
            const prop = `border${corner}Radius`;
            editor.selectedNode.styles[prop] = value;
        }
    }
});

const borderRadiusTL = useBorderRadius('TopLeft');
const borderRadiusTR = useBorderRadius('TopRight');
const borderRadiusBL = useBorderRadius('BottomLeft');
const borderRadiusBR = useBorderRadius('BottomRight');

</script>
<template>
    <BoxToolComponent class="mb-2">
        <template #header>
            <div class="fw-bold fs-14">
                Đường viền
            </div>
        </template>
        <template #body>
            <div class="p-2">
                <!-- Size & Color -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <span class="fs-13">Size:</span>
                        <input type="number" class="form-control form-control-sm text-center" v-model="borderSize"
                            min="0" style="width: 60px;">
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fs-13">Màu:</span>
                        <div class="color-wrapper position-relative" style="width: 30px; height: 30px;">
                            <input type="color" class="color-input opacity-0 position-absolute w-100 h-100"
                                v-model="borderColor" style="z-index: 10; cursor: pointer;">
                            <div class="color-preview rounded border w-100 h-100"
                                :style="{ backgroundColor: borderColor }"></div>
                        </div>
                    </div>
                </div>

                <!-- Style -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="fs-13">Kiểu:</span>
                    <select class="form-select form-select-sm" v-model="borderStyle"
                        style="width: 150px; font-size: 13px;">
                        <option value="solid">Nét liền</option>
                        <option value="dashed">Nét đứt</option>
                        <option value="dotted">Nét chấm</option>
                        <option value="double">Nét đôi</option>
                        <option value="none">Không viền</option>
                    </select>
                </div>

                <!-- Position -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="fs-13">Vị trí:</span>
                    <select class="form-select form-select-sm" v-model="borderPosition"
                        style="width: 150px; font-size: 13px;">
                        <option value="all">Toàn bộ</option>
                        <option value="top">Trên</option>
                        <option value="bottom">Dưới</option>
                        <option value="left">Trái</option>
                        <option value="right">Phải</option>
                        <option value="leftRight">Trái & Phải</option>
                        <option value="topBottom">Trên & Dưới</option>
                        <option value="topLeft">Trên & Trái</option>
                        <option value="topRight">Trên & Phải</option>
                        <option value="bottomLeft">Dưới & Trái</option>
                        <option value="bottomRight">Dưới & Phải</option>
                    </select>
                </div>

                <!-- Radius -->
                <div class="mb-2">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13">Bo góc</span>
                        <button class="btn btn-link p-0 text-dark"
                            @click="isBorderRadiusLinked = !isBorderRadiusLinked">
                            <BaseIconComponent :name="isBorderRadiusLinked ? 'link' : 'unlink'" type="lucide"
                                :size="16" />
                        </button>
                    </div>
                    <div class="row g-2">
                        <div class="col-6 d-flex align-items-center gap-2">
                            <div class="border-icon border-icon-tl"></div>
                            <input type="number" class="form-control form-control-sm" v-model="borderRadiusTL">
                        </div>
                        <div class="col-6 d-flex align-items-center gap-2">
                            <input type="number" class="form-control form-control-sm" v-model="borderRadiusTR">
                            <div class="border-icon border-icon-tr"></div>
                        </div>
                        <div class="col-6 d-flex align-items-center gap-2">
                            <div class="border-icon border-icon-bl"></div>
                            <input type="number" class="form-control form-control-sm" v-model="borderRadiusBL">
                        </div>
                        <div class="col-6 d-flex align-items-center gap-2">
                            <input type="number" class="form-control form-control-sm" v-model="borderRadiusBR">
                            <div class="border-icon border-icon-br"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>
<style scoped></style>