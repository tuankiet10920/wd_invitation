<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const fontGroups = ref<any[]>([]);
const searchFont = ref('');
const isFontDropdownOpen = ref(false);
const fontDropdownRef = ref<HTMLElement | null>(null);

const fetchFonts = async () => {
    try {
        const res: any = await $fetch('/api/v1/resources/fonts');
        if (res.success) {
            fontGroups.value = res.data.map((cat: any) => ({
                name: cat.name,
                fonts: cat.fonts || []
            }));
            injectFonts(res.data);
        }
    } catch (e) {
        console.error("Failed to fetch fonts", e);
    }
};

const injectFonts = (categories: any[]) => {
    let css = '';
    categories.forEach(cat => {
        cat.fonts?.forEach((f: any) => {
            css += `
            @font-face {
                font-family: '${f.name}';
                src: url('${f.path}') format('woff2');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
            `;
        });
    });

    const styleId = 'editor-font-loader';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
};

const allAvailableFonts = computed(() => {
    const list: { name: string, group: string }[] = [
        { name: 'Arial', group: 'Mặc định' },
        { name: 'Times New Roman', group: 'Mặc định' },
        { name: 'Be Vietnam Pro', group: 'Mặc định' }
    ];

    fontGroups.value.forEach(group => {
        group.fonts.forEach((f: any) => {
            list.push({
                name: f.name,
                group: group.name
            });
        });
    });
    return list;
});

const filteredFonts = computed(() => {
    if (!searchFont.value) return allAvailableFonts.value;
    const query = searchFont.value.toLowerCase();
    return allAvailableFonts.value.filter(f => f.name.toLowerCase().includes(query));
});

const selectFont = (name: string) => {
    fontFamily.value = name;
    isFontDropdownOpen.value = false;
    searchFont.value = '';
};

const handleClickOutside = (event: MouseEvent) => {
    if (fontDropdownRef.value && !fontDropdownRef.value.contains(event.target as Node)) {
        isFontDropdownOpen.value = false;
    }
};

onMounted(() => {
    fetchFonts();
    document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

// Helper to create two-way binding for props/styles
const useProp = (prop: string, defaultValue: any = '') => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.props) {
            return editor.selectedNode.props[prop] ?? defaultValue;
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNodeId) {
            editor.updateNodeProps(editor.selectedNodeId, { [prop]: val });
        }
    }
});

const useStyle = (prop: string, defaultValue: any = '') => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.styles) {
            return editor.selectedNode.styles[prop] ?? defaultValue;
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNodeId) {
            editor.updateNodeStyle(editor.selectedNodeId, { [prop]: val });
        }
    }
});

// Text Inputs
const formTitle = useProp('formTitle', 'Xác nhận tham dự');
const nameLabel = useProp('nameLabel', 'Họ và tên');
const namePlaceholder = useProp('namePlaceholder', 'Nhập tên của bạn');
const attendanceLabel = useProp('attendanceLabel', 'Bạn sẽ tham dự chứ?');
const attendYesLabel = useProp('attendYesLabel', 'Có, tôi sẽ tham dự');
const attendNoLabel = useProp('attendNoLabel', 'Tôi bận, rất tiếc không thể tham dự');
const submitLabel = useProp('submitLabel', 'Gửi xác nhận');
const successMessage = useProp('successMessage', 'Cảm ơn {name} đã xác nhận!');

// Colors
const color = useStyle('color', '#333333');
const backgroundColor = useStyle('backgroundColor', '#ffffff');
const inputBorderColor = useProp('inputBorderColor', '#dddddd');
const borderColor = useProp('borderColor', '#e0e0e0');
const submitButtonColor = useProp('submitButtonColor', '#ef5350');
const submitButtonTextColor = useProp('submitButtonTextColor', '#ffffff');

// Font
const fontSize = useStyle('fontSize', '16px');
const fontSizeNum = computed({
    get: () => parseInt(fontSize.value) || 16,
    set: (val) => fontSize.value = `${val}px`
});
const fontFamily = useStyle('fontFamily', 'Arial');

// Opacity
const opacity = useStyle('opacity', 1);

// Background Color Toggle
const showBackground = computed({
    get: () => backgroundColor.value !== 'transparent',
    set: (val) => {
        backgroundColor.value = val ? '#ffffff' : 'transparent';
    }
});

</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14">Cài đặt biểu mẫu</div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">

                <!-- Text Inputs -->
                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Tiêu đề biểu mẫu</label>
                    <input type="text" class="form-control form-control-sm" v-model="formTitle">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Nhãn trường tên</label>
                    <input type="text" class="form-control form-control-sm" v-model="nameLabel">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Placeholder trường tên</label>
                    <input type="text" class="form-control form-control-sm" v-model="namePlaceholder">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Nhãn xác nhận tham dự</label>
                    <input type="text" class="form-control form-control-sm" v-model="attendanceLabel">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Tùy chọn: Có tham dự</label>
                    <input type="text" class="form-control form-control-sm" v-model="attendYesLabel">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Tùy chọn: Không tham dự</label>
                    <input type="text" class="form-control form-control-sm" v-model="attendNoLabel">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Nội dung nút gửi</label>
                    <input type="text" class="form-control form-control-sm" v-model="submitLabel">
                </div>

                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-1">Lời cảm ơn (khi gửi)</label>
                    <input type="text" class="form-control form-control-sm" v-model="successMessage">
                </div>

                <!-- Colors Section -->
                <div>
                    <label class="form-label fs-13 fw-medium text-secondary mb-2">Màu sắc biểu mẫu</label>

                    <!-- Text & Background Color Row -->
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-13">Màu chữ</span>
                            <input type="color" v-model="color" class="color-picker-input border rounded cursor-pointer"
                                style="width: 28px; height: 28px; padding: 0;">
                        </div>

                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-13">Màu nền</span>
                            <div class="form-check m-0">
                                <input class="form-check-input" type="checkbox" v-model="showBackground"
                                    style="height: 16px; width: 16px;">
                            </div>
                            <input type="color" v-model="backgroundColor" :disabled="!showBackground"
                                class="color-picker-input border cursor-pointer"
                                :style="{ width: '28px', height: '28px', padding: 0, opacity: showBackground ? 1 : 0.5 }">
                        </div>
                    </div>

                    <!-- Form Border Color -->
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13">Màu viền biểu mẫu</span>
                        <input type="color" v-model="borderColor" class="color-picker-input border cursor-pointer"
                            style="width: 28px; height: 28px; padding: 0;">
                    </div>

                    <!-- Input Border Color -->
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13">Màu viền input</span>
                        <input type="color" v-model="inputBorderColor" class="color-picker-input border cursor-pointer"
                            style="width: 28px; height: 28px; padding: 0;">
                    </div>

                    <!-- Submit Button Color -->
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13">Màu nút gửi</span>
                        <input type="color" v-model="submitButtonColor" class="color-picker-input border cursor-pointer"
                            style="width: 28px; height: 28px; padding: 0;">
                    </div>

                    <!-- Submit Button Text Color -->
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13">Màu chữ nút gửi</span>
                        <input type="color" v-model="submitButtonTextColor"
                            class="color-picker-input border cursor-pointer"
                            style="width: 28px; height: 28px; padding: 0;">
                    </div>
                </div>

                <!-- Font Settings -->
                <div class="d-flex align-items-center gap-2">
                    <label class="fs-13 fw-medium text-secondary col-3 p-0">Font size</label>
                    <div class="input-group input-group-sm flex-grow-1">
                        <button class="btn btn-outline-secondary" type="button" @click="fontSizeNum--">-</button>
                        <input type="number" class="form-control text-center" v-model="fontSizeNum">
                        <button class="btn btn-outline-secondary" type="button" @click="fontSizeNum++">+</button>
                    </div>
                </div>

                <!-- Searchable Font Selector -->
                <div class="d-flex align-items-center justify-content-between position-relative" ref="fontDropdownRef">
                    <label class="fs-13 fw-bold text-secondary">Font</label>
                    <div class="custom-font-dropdown" style="width: 160px;">
                        <div class="font-selected-box d-flex align-items-center justify-content-between px-2 py-1 border rounded cursor-pointer fs-13" 
                             @click="isFontDropdownOpen = !isFontDropdownOpen">
                            <span class="text-truncate">{{ fontFamily }}</span>
                            <BaseIconComponent name="chevron-down" type="mdi" :size="16" />
                        </div>
                        
                        <div v-if="isFontDropdownOpen" class="font-list-panel border rounded shadow-sm bg-white position-absolute mt-1">
                            <div class="p-2 border-bottom sticky-top bg-white rounded-top">
                                <input type="text" class="form-control form-control-sm" v-model="searchFont" placeholder="Tìm kiếm font..." @click.stop focus>
                            </div>
                            <div class="font-items-scrollable custom-scrollbar">
                                <div v-for="font in filteredFonts" :key="font.name" 
                                     class="font-item px-2 py-2 cursor-pointer d-flex flex-column border-bottom-light"
                                     :class="{ 'active-font': fontFamily === font.name }"
                                     @click="selectFont(font.name)">
                                    <span class="fs-12 text-muted fw-500">{{ font.group }}</span>
                                    <span :style="{ fontFamily: font.name }" class="fs-14">{{ font.name }}</span>
                                </div>
                                <div v-if="filteredFonts.length === 0" class="p-3 text-center text-muted fs-12">
                                    Không tìm thấy font nào
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Opacity -->
                <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="fs-13 fw-bold text-secondary">Trong suốt</span>
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
.fs-13 {
    font-size: 13px;
}

.fs-14 {
    font-size: 14px;
}

.text-secondary {
    color: #6c757d !important;
}

.color-wrapper {
    width: 28px;
    height: 28px;
    cursor: pointer;
}

.color-wrapper.disabled {
    pointer-events: none;
    opacity: 0.5;
}

.color-preview {
    width: 100%;
    height: 100%;
    border: 1px solid #dee2e6 !important;
    position: relative;
    overflow: hidden;
}

.crossed-out::before,
.crossed-out::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 1px;
    background-color: #f00;
    transform: translate(-50%, -50%) rotate(45deg);
}

.crossed-out::after {
    transform: translate(-50%, -50%) rotate(-45deg);
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

/* Custom Font Dropdown */
.fs-12 { font-size: 12px; }
.fw-500 { font-weight: 500; }
.cursor-pointer { cursor: pointer; }

.custom-font-dropdown {
    position: relative;
    user-select: none;
}

.font-selected-box {
    background: white;
    min-height: 32px;
}

.font-list-panel {
    top: 100%;
    right: 0;
    width: 240px;
    z-index: 1000;
    max-height: 250px;
    display: flex;
    flex-direction: column;
}

.font-items-scrollable {
    overflow-y: auto;
    flex-grow: 1;
}

.font-item {
    transition: all 0.2s;
}

.font-item:hover {
    background-color: #f8fafc;
}

.active-font {
    background-color: #eff6ff !important;
    border-left: 3px solid #3b82f6;
}

.border-bottom-light {
    border-bottom: 1px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}
</style>