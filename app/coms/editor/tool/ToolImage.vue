<script setup lang="ts">
import ColorComponent from './childs/ColorComponent.vue';
import SymmetryComponent from './childs/SymmetryComponent.vue';
import BorderComponent from './childs/BorderComponent.vue';
import BoxShadowComponent from './childs/BoxShadowComponent.vue';
import ImageComponent from './childs/ImageComponent.vue';

</script>

<template>
    <div class="tool-image">
        <!-- Image Preview -->
        <ImageComponent class="mb-4" />

        <!-- Color Section -->
        <ColorComponent class="mb-2" />

        <!-- Symmetry Section -->
        <SymmetryComponent class="mb-2" />

        <!-- Border -->
        <BorderComponent class="mb-2" />

        <!-- Box Shadow -->
        <BoxShadowComponent class="mb-2" />

    </div>
</template>

<style>
.fs-14 {
    font-size: 14px;
}

.fs-13 {
    font-size: 13px;
}

.color-picker {
    width: 24px;
    height: 24px;
    background-color: transparent;
    border: 1px solid #dee2e6;
}

.custom-range::-webkit-slider-thumb {
    background: #fff;
    border: 2px solid #a5b4fc;
    box-shadow: 0 0 0 2px #fff;
    width: 16px;
    height: 16px;
}

.custom-range::-webkit-slider-runnable-track {
    background: #bfdbfe;
    height: 4px;
}

.form-check-input:checked {
    background-color: #a5b4fc;
    border-color: #a5b4fc;
}

.form-switch .form-check-input {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

.min-h-auto {
    min-height: auto;
}

.border-icon {
    width: 16px;
    height: 16px;
    border: 1px dashed #adb5bd;
    position: relative;
    border-radius: 2px;
}

.border-icon-tl::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 6px;
    height: 6px;
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    border-top-left-radius: 4px;
}

.border-icon-tr::after {
    content: '';
    position: absolute;
    top: -1px;
    right: -1px;
    width: 6px;
    height: 6px;
    border-top: 2px solid #000;
    border-right: 2px solid #000;
    border-top-right-radius: 4px;
}

.border-icon-bl::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: -1px;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #000;
    border-left: 2px solid #000;
    border-bottom-left-radius: 4px;
}

.border-icon-br::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 6px;
    height: 6px;
    border-bottom: 2px solid #000;
    border-right: 2px solid #000;
    border-bottom-right-radius: 4px;
}
</style>