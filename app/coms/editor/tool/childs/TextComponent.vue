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

// Helper to create two-way binding for styles
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

// Font Styles
const fontWeight = useStyle('fontWeight', 'normal');
const fontStyle = useStyle('fontStyle', 'normal');
const textDecoration = useStyle('textDecoration', 'none');
const textTransform = useStyle('textTransform', 'none');

// Alignment
const textAlign = useStyle('textAlign', 'left');

// Font Size
const fontSize = useStyle('fontSize', '16px');
const fontSizeNum = computed({
    get: () => parseInt(fontSize.value) || 16,
    set: (val) => fontSize.value = `${val}px`
});

// Font Family
const fontFamily = useStyle('fontFamily', 'Arial');

// Colors
const color = useStyle('color', '#000000');
const backgroundColor = useStyle('backgroundColor', 'transparent');

// Opacity
const opacity = useStyle('opacity', 1);

// Toggle functions
const toggleBold = () => fontWeight.value = fontWeight.value === 'bold' ? 'normal' : 'bold';
const toggleItalic = () => fontStyle.value = fontStyle.value === 'italic' ? 'normal' : 'italic';
const toggleUnderline = () => textDecoration.value = textDecoration.value.includes('underline') ? 'none' : 'underline';
const toggleStrikethrough = () => textDecoration.value = textDecoration.value.includes('line-through') ? 'none' : 'line-through';
const toggleUppercase = () => textTransform.value = textTransform.value === 'uppercase' ? 'none' : 'uppercase';

// Helper for alignment active state
const isAlign = (align: string) => textAlign.value === align;

</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14">Kiểu chữ</div>
        </template>
        <template #body>
            <div class="p-2">
                <!-- Toolbar Row -->
                <div class="d-flex justify-content-between align-items-center mb-3 px-1">
                    <button class="btn btn-sm p-1 border-0" :class="{ 'active-tool': fontWeight === 'bold' }"
                        @click="toggleBold">
                        <BaseIconComponent name="format-bold-rounded" :size="20" />
                    </button>
                    <button class="btn btn-sm p-1 border-0" :class="{ 'active-tool': fontStyle === 'italic' }"
                        @click="toggleItalic">
                        <BaseIconComponent name="format-italic" :size="20" />
                    </button>
                    <button class="btn btn-sm p-1 border-0"
                        :class="{ 'active-tool': textDecoration.includes('line-through') }"
                        @click="toggleStrikethrough">
                        <BaseIconComponent name="strikethrough-s-rounded" :size="20" />
                    </button>
                    <button class="btn btn-sm p-1 border-0"
                        :class="{ 'active-tool': textDecoration.includes('underline') }" @click="toggleUnderline">
                        <BaseIconComponent name="format-underlined" :size="20" />
                    </button>
                    <button class="btn btn-sm p-1 border-0" :class="{ 'active-tool': textTransform === 'uppercase' }"
                        @click="toggleUppercase">
                        <BaseIconComponent name="uppercase" :size="20" />
                    </button>
                    <button class="btn btn-sm p-1 border-0">
                        <BaseIconComponent name="list-arrow-down" type="solar" :size="20" />
                    </button>
                </div>

                <!-- Alignment -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <label class="fs-13 fw-bold text-secondary">Căn chỉnh</label>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-secondary btn-sm p-1 px-2 d-flex flex-jc-ac"
                            :class="{ 'active': isAlign('left') }" @click="textAlign = 'left'">
                            <BaseIconComponent name="text-align-left" type="mynaui" :size="18" />
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm p-1 px-2 d-flex flex-jc-ac"
                            :class="{ 'active': isAlign('center') }" @click="textAlign = 'center'">
                            <BaseIconComponent name="text-align-center" type="mynaui" :size="18" />
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm p-1 px-2 d-flex flex-jc-ac"
                            :class="{ 'active': isAlign('right') }" @click="textAlign = 'right'">
                            <BaseIconComponent name="text-align-right" type="mynaui" :size="18" />
                        </button>
                        <button type="button" class="btn btn-outline-secondary btn-sm p-1 px-2 d-flex flex-jc-ac"
                            :class="{ 'active': isAlign('justify') }" @click="textAlign = 'justify'">
                            <BaseIconComponent name="text-align-justify" type="majesticons" :size="18" />
                        </button>
                    </div>
                </div>

                <!-- Font Size -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <label class="fs-13 fw-bold text-secondary">Font size</label>
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" @click="fontSizeNum--">-</button>
                        <input type="number" class="form-control text-center" v-model="fontSizeNum">
                        <button class="btn btn-outline-secondary" type="button" @click="fontSizeNum++">+</button>
                    </div>
                </div>

                <!-- Searchable Font Selector -->
                <div class="d-flex align-items-center justify-content-between mb-3 position-relative" ref="fontDropdownRef">
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

                <!-- Colors -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-2">
                        <label class="fs-13 fw-bold text-secondary">Màu chữ</label>
                        <div class="color-wrapper position-relative">
                            <input type="color" class="color-input opacity-0 position-absolute w-100 h-100"
                                v-model="color">
                            <div class="color-preview rounded border" :style="{ backgroundColor: color }"></div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <label class="fs-13 fw-bold text-secondary">Màu nền</label>
                        <div class="color-wrapper position-relative">
                            <input type="color" class="color-input opacity-0 position-absolute w-100 h-100"
                                v-model="backgroundColor">
                            <div class="color-preview rounded border" :style="{ backgroundColor: backgroundColor }">
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
.fs-12 { font-size: 12px; }
.fs-13 { font-size: 13px; }
.fs-14 { font-size: 14px; }
.fw-500 { font-weight: 500; }

.cursor-pointer { cursor: pointer; }

.active-tool {
    background-color: #eef2ff;
    color: #3b82f6;
    border-radius: 4px;
}

/* Custom Font Dropdown */
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
    max-height: 300px;
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

.color-wrapper {
    width: 28px;
    height: 28px;
    cursor: pointer;
}

.color-preview {
    width: 100%;
    height: 100%;
    border: 1px solid #dee2e6 !important;
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

/* Override btn-group active state */
.btn-group .btn.active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.btn-group .btn {
    border-color: #dee2e6;
    color: #4b5563;
}

.btn-group .btn:hover {
    background-color: #f3f4f6;
}
</style>