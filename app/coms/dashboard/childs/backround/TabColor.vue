<script setup lang="ts">
import { useEditorStore } from "~~/stores/editor";

const editor = useEditorStore();

// State cho color picker
const hueRef = ref<HTMLElement | null>(null);
const pickerRef = ref<HTMLElement | null>(null);
const hsv = reactive({ h: 260, s: 100, v: 100 });
const isDraggingMain = ref(false);
const isDraggingHue = ref(false);

// Chuyển đổi HSV sang RGB
const hsvToRgb = (h: number, s: number, v: number) => {
    s /= 100;
    v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

// Chuyển RGB sang Hex
const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
};

// Hex sang RGB
const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16)
    } : null;
};

// RGB sang HSV
const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0
    const v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
};

// Computed values
const rgb = computed(() => hsvToRgb(hsv.h, hsv.s, hsv.v));
const hexColor = computed(() => rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b));
const hueColor = computed(() => `hsl(${hsv.h}, 100%, 50%)`);

// Update store when color changes internally
const updateColor = () => {
    editor.background = hexColor.value;
};

// Watch store background changes (sync from outside)
watch(() => editor.background, (newVal) => {
    if (newVal && newVal.startsWith('#') && newVal !== hexColor.value) {
        const rgbVal = hexToRgb(newVal);
        if (rgbVal) {
            const hsvVal = rgbToHsv(rgbVal.r, rgbVal.g, rgbVal.b);
            hsv.h = hsvVal.h;
            hsv.s = hsvVal.s;
            hsv.v = hsvVal.v;
        }
    }
}, { immediate: true });

// Mouse Handlers
const handleMainMouseDown = (e: MouseEvent) => {
    isDraggingMain.value = true;
    updateMain(e);
    window.addEventListener('mousemove', handleMainMouseMove);
    window.addEventListener('mouseup', handleMainMouseUp);
};

const handleMainMouseMove = (e: MouseEvent) => {
    if (isDraggingMain.value) updateMain(e);
};

const handleMainMouseUp = () => {
    isDraggingMain.value = false;
    window.removeEventListener('mousemove', handleMainMouseMove);
    window.removeEventListener('mouseup', handleMainMouseUp);
};

const updateMain = (e: MouseEvent) => {
    if (!pickerRef.value) return;
    const rect = pickerRef.value.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    hsv.s = Math.round((x / rect.width) * 100);
    hsv.v = Math.round(100 - (y / rect.height) * 100);
    updateColor();
};

const handleHueMouseDown = (e: MouseEvent) => {
    isDraggingHue.value = true;
    updateHue(e);
    window.addEventListener('mousemove', handleHueMouseMove);
    window.addEventListener('mouseup', handleHueMouseUp);
};

const handleHueMouseMove = (e: MouseEvent) => {
    if (isDraggingHue.value) updateHue(e);
};

const handleHueMouseUp = () => {
    isDraggingHue.value = false;
    window.removeEventListener('mousemove', handleHueMouseMove);
    window.removeEventListener('mouseup', handleHueMouseUp);
};

const updateHue = (e: MouseEvent) => {
    if (!hueRef.value) return;
    const rect = hueRef.value.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    hsv.h = Math.round((x / rect.width) * 360);
    updateColor();
};

const onHexInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    if (/^#[0-9A-F]{6}$/i.test(val)) {
        editor.background = val; // Store watch will sync HSV
    }
};
</script>
<template>
    <div class="flex-grow-1 overflow-auto p-3">
        <div class="mb-4">
            <p class="text-muted small fw-bold mb-2">Màu nền hiện tại</p>
            <div class="color-item current-color shadow-sm border rounded-2" :style="{ background: editor.background }">
            </div>
        </div>

        <div class="mb-4">
            <p class="text-muted small fw-bold mb-2">Màu đơn</p>
            <div class="bg-color-grid">
                <div class="color-item border rounded-2 d-flex align-items-center justify-content-center bg-white"
                    @click="editor.background = 'transparent'">
                    <div style="width:100%; height:1px; background:red; transform: rotate(-45deg);">
                    </div>
                </div>
                <div v-for="color in ['#000', '#666', '#999', '#ccc', '#fff', '#c0392b', '#8e44ad', '#2980b9', '#16a085', '#27ae60', '#f39c12', '#d35400', '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#2ecc71', '#f1c40f', '#e67e22', '#fad7a0']"
                    :key="color" class="color-item shadow-sm border rounded-2" :style="{ background: color }"
                    @click="editor.background = color">
                </div>
            </div>
        </div>

        <div class="mb-4">
            <p class="text-muted small fw-bold mb-2">Màu nền gradient</p>
            <div class="bg-color-grid">
                <div v-for="grad in [
                    'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
                    'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
                    'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
                    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
                    'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
                    'linear-gradient(to top, #ff0844 0%, #ffb199 100%)',
                    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)'
                ]" :key="grad" class="color-item shadow-sm border rounded-2" :style="{ background: grad }"
                    @click="editor.background = grad">
                </div>
            </div>
        </div>

        <!-- COLOR PICKER -->
        <div class="mt-4 pt-3 border-top">
            <div class="color-picker-box border rounded-3 overflow-hidden shadow-sm">
                <div class="picker-main" ref="pickerRef" @mousedown="handleMainMouseDown"
                    :style="{ height: '150px', backgroundColor: hueColor }">
                    <div class="picker-saturation"></div>
                    <div class="picker-brightness"></div>
                    <div class="picker-pointer" :style="{ left: hsv.s + '%', top: (100 - hsv.v) + '%' }"></div>
                </div>
                <div class="p-2 bg-white">
                    <div class="hue-slider mb-2 position-relative" ref="hueRef" @mousedown="handleHueMouseDown"
                        style="height: 10px; background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red); border-radius: 5px;">
                        <div class="hue-pointer" :style="{ left: (hsv.h / 360 * 100) + '%' }"></div>
                    </div>
                    <div class="d-flex gap-2">
                        <div class="flex-grow-1">
                            <input type="text" class="form-control form-control-sm text-center" :value="hexColor"
                                @input="onHexInput" style="font-size: 11px;">
                        </div>
                        <div class="d-flex gap-1">
                            <input type="text" class="form-control form-control-sm text-center" :value="rgb.r" readonly
                                style="width: 35px; font-size: 10px;">
                            <input type="text" class="form-control form-control-sm text-center" :value="rgb.g" readonly
                                style="width: 35px; font-size: 10px;">
                            <input type="text" class="form-control form-control-sm text-center" :value="rgb.b" readonly
                                style="width: 35px; font-size: 10px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.bg-color-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    /* 6 ô trên một hàng như ảnh mẫu */
    gap: 8px;
}

.color-item {
    aspect-ratio: 1;
    cursor: pointer;
    transition: transform 0.1s ease;
}

.color-item:hover {
    transform: scale(1.1);
    z-index: 2;
    border-color: #3b82f6 !important;
}

.current-color {
    width: 45px;
    height: 45px;
}

/* COLOR PICKER STYLES */
.color-picker-box {
    border: 1px solid #eee;
}

.picker-main {
    position: relative;
    cursor: crosshair;
}

.picker-saturation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, #fff, transparent);
    pointer-events: none;
}

.picker-brightness {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, #000, transparent);
    pointer-events: none;
}

.picker-pointer {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    pointer-events: none;
}

.hue-slider {
    cursor: pointer;
}

.hue-pointer {
    position: absolute;
    top: 50%;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    pointer-events: none;
}
</style>