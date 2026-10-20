<script setup lang="ts">
import BoxToolComponent from '../BoxToolComponent.vue';
import { useEditorStore } from '~~/stores/editor';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

// Watch for changes and update the node's src prop
const nodeProps = computed(() => editor.selectedNode?.props || {});

const address = ref('');
const lat = ref('');
const lng = ref('');

const useStyle = (prop: string, defaultValue: any = '') => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return editor.selectedNode.styles[prop] ?? defaultValue;
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNode) {
            if (!editor.selectedNode.styles) editor.selectedNode.styles = {};
            editor.selectedNode.styles[prop] = val;
        }
    }
});

// Radius
const borderRadius = useStyle('borderRadius', '0px');
const borderRadiusNum = computed({
    get: () => parseInt(borderRadius.value) || 0,
    set: (val) => borderRadius.value = `${val}px`
});

// Opacity
const opacity = useStyle('opacity', 1);

// Helper to update the actual node src
const updateMapSrc = () => {
    if (!editor.selectedNodeId) return;

    let src = '';
    // Priority: Coords > Address
    if (lat.value && lng.value) {
        // Using basic embed format for coords
        src = `https://maps.google.com/maps?q=${lat.value},${lng.value}&hl=vi&z=14&output=embed`;
    } else if (address.value) {
        src = `https://maps.google.com/maps?q=${encodeURIComponent(address.value)}&hl=vi&z=14&output=embed`;
    }

    if (src) {
        editor.updateNodeProps(editor.selectedNodeId, { src, address: address.value, lat: lat.value, lng: lng.value });
    } else {
        // Keep props in sync even if src isn't valid yet (e.g. empty)
        editor.updateNodeProps(editor.selectedNodeId, { address: address.value, lat: lat.value, lng: lng.value });
    }
};

// Sync local state from props when selection changes
watchEffect(() => {
    if (editor.selectedNode?.props) {
        address.value = editor.selectedNode.props.address || '';
        lat.value = editor.selectedNode.props.lat || '';
        lng.value = editor.selectedNode.props.lng || '';
    }
});

// Debounce updates to avoid rapid iframe reloads
let debounceTimer: NodeJS.Timeout;
const onInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateMapSrc, 800);
};

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold">Tuỳ chỉnh bản đồ</div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- Banner Image -->
                <div class="banner-image rounded overflow-hidden mb-1">
                    <img src="/others/map.jpg" alt="Map Banner" class="w-100 h-100 object-fit-cover">
                </div>

                <!-- Address -->
                <div>
                    <label class="form-label fs-7 fw-medium mb-1">Địa chỉ</label>
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-white border-end-0">
                            <BaseIconComponent name="map-marker" type="mdi" :size="16" color="#f472b6" />
                        </span>
                        <input type="text" class="form-control border-start-0 ps-0"
                            placeholder="Nhập địa chỉ (VD: 52 Miếu Đầm...)" v-model="address" @input="onInput">
                    </div>
                </div>

                <!-- Coordinates -->
                <div>
                    <label class="form-label fs-7 fw-medium mb-1">Tọa độ (Tùy chọn)</label>
                    <div class="d-flex gap-2">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0">
                                <BaseIconComponent name="map-marker-outline" type="mdi" :size="16" color="#f472b6" />
                            </span>
                            <input type="text" class="form-control border-start-0 ps-0" placeholder="Vĩ độ (Latitude)"
                                v-model="lat" @input="onInput">
                        </div>
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-white border-end-0">
                                <BaseIconComponent name="map-marker-outline" type="mdi" :size="16" color="#f472b6" />
                            </span>
                            <input type="text" class="form-control border-start-0 ps-0"
                                placeholder="Kinh độ (Longitude)" v-model="lng" @input="onInput">
                        </div>
                    </div>
                    <div class="form-text mt-2 d-flex gap-1 align-items-start" style="font-size: 11px; color: #666;">
                        <BaseIconComponent name="lightbulb-on-outline" type="mdi" :size="14" color="#d97706"
                            class="flex-shrink-0 mt-05" />
                        <span class="fst-italic">Nếu có tọa độ, hệ thống sẽ ưu tiên sử dụng tọa độ thay vì địa
                            chỉ</span>
                    </div>
                </div>

                <!-- Radius Setting -->
                <div>
                     <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="form-label fs-7 fw-medium mb-0">Bo góc (px)</span>
                        <input type="number" class="form-control form-control-sm text-center" v-model="borderRadiusNum"
                            style="width: 60px; font-size: 13px;">
                    </div>
                    <input type="range" class="form-range custom-range" v-model="borderRadiusNum" min="0" max="100" step="1">
                </div>

                <!-- Opacity -->
                <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="form-label fs-7 fw-medium mb-0">Độ mờ</span>
                        <input type="number" class="form-control form-control-sm text-center" v-model="opacity"
                            step="0.01" min="0" max="1" style="width: 60px; font-size: 13px;">
                    </div>
                    <input type="range" class="form-range custom-range" v-model="opacity" min="0" max="1" step="0.01">
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>

<style scoped>
.fs-7 {
    font-size: 0.875rem;
}

.banner-image {
    height: 120px;
    background-color: #fce7f3;
}

.mt-05 {
    margin-top: 1px;
}

/* Style adjustments for input group to look seamless */
.input-group-text {
    color: #f472b6;
}

.form-control:focus {
    box-shadow: none;
    border-color: #dee2e6;
    /* specific to keep it looking clean or match bootstrap focus if needed */
}

/* Focus within for the fake single input look */
.input-group:focus-within {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    border-radius: 0.375rem;
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .form-control {
    border-color: #86b7fe;
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
</style>