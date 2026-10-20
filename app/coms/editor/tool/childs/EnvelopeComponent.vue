<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const useProp = (prop: string, defaultValue: any = null) => computed({
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

const displayMode = useProp('displayMode', 'design');
const lockScroll = useProp('lockScroll', true);
const imageSrc = useProp('imageSrc', '/others/map.jpg');
const colorTop = useProp('colorTop', '#812927');
const colorSides = useProp('colorSides', '#A33F3D');
const colorBottom = useProp('colorBottom', '#A84644');
const enableAnimation = useProp('enableAnimation', true);
const isPreviewOpen = useProp('isPreviewOpen', false);
const modalText = useProp('modalText', 'Chạm vào để mở');
const modalFontSize = useProp('modalFontSize', 18);
const modalFontFamily = useProp('modalFontFamily', 'Arial');
const modalColor = useProp('modalColor', '#333333');
const backdropOpacity = useProp('backdropOpacity', 60);

const themes = [
    { name: 'Blush Romance', top: '#eab8b8', sides: '#e6a8a8', bottom: '#f0c8c8' },
    { name: 'Lavender Dream', top: '#c4b5fd', sides: '#a78bfa', bottom: '#ddd6fe' },
    { name: 'Red Serenity', top: '#812927', sides: '#A33F3D', bottom: '#A84644' },
    { name: 'Olive Nature', top: '#a3b18a', sides: '#8b9a70', bottom: '#bcc7a6' },
    { name: 'Forest Green', top: '#344e41', sides: '#263a30', bottom: '#426252' },
    { name: 'Minimal Ivory', top: '#e6e2dd', sides: '#d0c9bd', bottom: '#f3f0ec' },
    { name: 'Mint Whisper', top: '#bbf7d0', sides: '#86efac', bottom: '#dcfce7' },
    { name: 'Sky Dream', top: '#bae6fd', sides: '#7dd3fc', bottom: '#e0f2fe' }
];

const applyTheme = (theme: any) => {
    colorTop.value = theme.top;
    colorSides.value = theme.sides;
    colorBottom.value = theme.bottom;
};

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    isUploading.value = true;
    try {
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
        });

        const response = await $fetch<any>('/api/v1/client/file/upload-personal', {
            method: 'POST',
            body: { images: [base64] }
        });

        if (response.success && response.data?.length > 0) {
            imageSrc.value = response.data[0].url;
        } else {
            imageSrc.value = base64;
        }
    } catch (e) {
        console.error(e);
        alert('Tải ảnh lên thất bại.');
    } finally {
        isUploading.value = false;
        if (target) target.value = '';
    }
}
</script>

<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="chevron-down" type="mdi" :size="20" />
                <span>Tuỳ chỉnh phong bì</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <!-- Chế độ hiển thị -->
                <div class="border rounded p-3" style="background-color: #fcfaff !important;">
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                        <BaseIconComponent name="cellphone" type="mdi" :size="18" />
                        Chế độ hiển thị
                    </h6>
                    <div class="d-flex gap-2 mb-2">
                        <div class="flex-fill border rounded p-2 text-center cursor-pointer bg-white" 
                             :class="{'border-primary bg-primary-subtle text-primary': displayMode === 'design'}"
                             @click="displayMode = 'design'">
                             <BaseIconComponent name="palette" type="mdi" :size="24" :color="displayMode === 'design' ? '#3b82f6' : '#a3a3a3'" />
                             <div class="fw-bold mt-1" style="font-size: 13px;">Design</div>
                             <div class="text-secondary" style="font-size: 11px;">Hiển thị trong thiết kế</div>
                        </div>
                        <div class="flex-fill border rounded p-2 text-center cursor-pointer bg-white"
                             :class="{'border-primary bg-primary-subtle text-primary': displayMode === 'modal'}"
                             @click="displayMode = 'modal'">
                             <BaseIconComponent name="window-maximize" type="mdi" :size="24" :color="displayMode === 'modal' ? '#3b82f6' : '#a3a3a3'" />
                             <div class="fw-bold mt-1" style="font-size: 13px;">Modal</div>
                             <div class="text-secondary" style="font-size: 11px;">Hiển thị toàn màn hình</div>
                        </div>
                    </div>
                    <div class="text-secondary mb-3" style="font-size: 12px; line-height: 1.4;">
                        <span class="text-danger me-1">📌</span>
                        Phong bì sẽ nằm trong thiết kế, có thể di chuyển và chỉnh sửa vị trí
                    </div>
                    
                    <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2 border-0" style="background-color: #3b82f6;" @click="isPreviewOpen = !isPreviewOpen">
                        <BaseIconComponent name="eye-outline" type="mdi" :size="16" color="#fff" />
                        <span>Xem trước hiệu ứng</span>
                    </button>
                    <div class="text-secondary mt-2" style="font-size: 12px; line-height: 1.4;">
                        <span class="text-warning me-1">💡</span>
                        Xem trước để trải nghiệm hiệu ứng tương tác với phong bì (mở/đóng)
                    </div>
                </div>

                <!-- Khóa cuộn trang -->
                <div class="border rounded p-3" style="background-color: #fffbeb; border-color: #fde68a !important;">
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                        <BaseIconComponent name="lock" type="mdi" :size="18" color="#d97706" />
                        Khóa cuộn trang
                    </h6>
                    <div class="d-flex align-items-start gap-2 mb-2">
                        <input type="checkbox" class="form-check-input mt-1" v-model="lockScroll">
                        <div class="text-dark" style="font-size: 13.5px;">Ngăn cuộn trang cho đến khi phong bì được mở</div>
                    </div>
                    <div class="text-secondary" style="font-size: 12px; line-height: 1.4;">
                        <span class="text-warning me-1">💡</span>
                        Khi bật, người xem không thể cuộn trang cho đến khi mở phong bì. Tắt để cho phép tự do cuộn ngay cả khi phong bì chưa mở.
                    </div>
                </div>

                <!-- Text hướng dẫn (Modal Mode) -->
                <div class="border rounded p-3" style="background-color: #fdfceb; border-color: #fde68a !important;" v-if="displayMode === 'modal'">
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                        <BaseIconComponent name="message-outline" type="mdi" :size="18" color="#a78bfa" />
                        Text hướng dẫn (Modal Mode)
                    </h6>
                    <div class="mb-3">
                        <label class="form-label fs-7 text-secondary mb-1">Nội dung text</label>
                        <input type="text" class="form-control form-control-sm border" v-model="modalText">
                    </div>

                    <div class="border rounded p-3 mb-2" style="background-color: #fdfceb;">
                        <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                            <BaseIconComponent name="chevron-down" type="mdi" :size="16" />
                            Kiểu chữ
                        </h6>
                        
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <label class="fs-7 fw-medium text-dark m-0" style="width: 70px;">Font size</label>
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary px-2 bg-white" type="button" @click="modalFontSize = Math.max(10, modalFontSize - 1)">-</button>
                                <input type="number" class="form-control text-center bg-white" v-model="modalFontSize">
                                <button class="btn btn-outline-secondary px-2 bg-white" type="button" @click="modalFontSize++">+</button>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <label class="fs-7 fw-medium text-dark m-0" style="width: 70px;">Font</label>
                            <select class="form-select form-select-sm" style="width: 120px;" v-model="modalFontFamily">
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Georgia">Georgia</option>
                            </select>
                        </div>
                        
                        <div class="d-flex align-items-center gap-3">
                            <label class="fs-7 fw-medium text-dark m-0" style="width: 70px;">Màu chữ</label>
                            <input type="color" class="color-picker-input border rounded p-0 m-0" style="width: 25px; height: 25px;" v-model="modalColor">
                        </div>
                    </div>
                    
                    <div class="text-secondary" style="font-size: 12px; line-height: 1.4;">
                        <span class="text-warning me-1">💡</span>
                        Text này sẽ hiển thị phía trên phong bì khi ở chế độ Modal
                    </div>
                </div>

                <!-- Độ mờ backdrop -->
                <div class="border rounded p-3" style="background-color: #f0f9ff; border-color: #bae6fd !important;" v-if="displayMode === 'modal'">
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                        <BaseIconComponent name="blur" type="mdi" :size="18" color="#38bdf8" />
                        Độ mờ backdrop
                    </h6>
                    <div class="d-flex flex-column gap-2 mb-2">
                        <div class="d-flex justify-content-between text-secondary" style="font-size: 13px;">
                            <span>Độ mờ: {{ backdropOpacity }}%</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" v-model="backdropOpacity">
                    </div>
                    <div class="text-secondary mt-1" style="font-size: 12px; line-height: 1.4;">
                        <span class="text-warning me-1">💡</span>
                        Điều chỉnh độ mờ của lớp phủ nền khi hiển thị modal
                    </div>
                </div>

                <!-- Ảnh trong phong bì -->
                <div class="border rounded p-3">
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3">
                        <BaseIconComponent name="image" type="mdi" :size="18" color="#10b981" />
                        Ảnh trong phong bì
                    </h6>
                    <div class="rounded overflow-hidden mb-2 border" style="height: 150px;">
                        <img :src="imageSrc" class="w-100 h-100 object-fit-cover" />
                    </div>
                    <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileChange">
                    <button class="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 bg-white text-dark border shadow-sm" @click="fileInput?.click()">
                        <span v-if="isUploading" class="spinner-border spinner-border-sm"></span>
                        <BaseIconComponent v-else name="camera-outline" type="mdi" :size="16" />
                        <span style="font-size: 14px;">Chọn ảnh khác</span>
                    </button>
                    <div class="text-secondary mt-2 text-center" style="font-size: 12px; line-height: 1.4;">
                        Ảnh sẽ hiển thị bên trong phong bì khi mở ra
                    </div>
                </div>

                <!-- Chọn theme màu nhanh -->
                <div>
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3 mt-1 text-dark">
                        <BaseIconComponent name="star-four-points" type="mdi" :size="18" color="#f59e0b" />
                        Chọn theme màu nhanh
                    </h6>
                    <div class="row g-2 mb-2">
                        <div v-for="theme in themes" :key="theme.name" class="col-6">
                            <div class="border rounded p-2 cursor-pointer theme-box bg-white" @click="applyTheme(theme)" style="height: 100%;">
                                <div class="fw-medium mb-2 text-dark" style="font-size: 13px;">{{ theme.name }}</div>
                                <div class="d-flex gap-1 justify-content-start">
                                    <div class="color-cube rounded" :style="{ backgroundColor: theme.top }"></div>
                                    <div class="color-cube rounded" :style="{ backgroundColor: theme.sides }"></div>
                                    <div class="color-cube rounded" :style="{ backgroundColor: theme.bottom }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-secondary mb-3 mt-2" style="font-size: 12px;">
                        Click vào theme để áp dụng màu cho toàn bộ phong bì
                    </div>
                </div>

                <hr class="m-0 text-muted border-secondary opacity-25">

                <!-- Tùy chỉnh màu chi tiết -->
                <div>
                    <h6 class="fs-7 fw-bold d-flex align-items-center gap-2 mb-3 mt-2 text-dark">
                        <BaseIconComponent name="palette-outline" type="mdi" :size="18" color="#ec4899" />
                        Tùy chỉnh màu chi tiết
                    </h6>
                    
                    <div class="mb-3">
                        <div class="text-secondary mb-1" style="font-size: 13px;">Nắp phong bì (phía trên)</div>
                        <div class="d-flex align-items-center gap-2 border rounded p-1 bg-white" style="width: 140px;">
                            <input type="color" class="color-picker-input m-0 p-0 border-0 rounded overflow-hidden" style="width: 30px; height: 30px;" v-model="colorTop">
                            <span class="text-dark fw-medium" style="font-size: 13px;">{{ colorTop.toUpperCase() }}</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="text-secondary mb-1" style="font-size: 13px;">Cạnh phong bì (trái & phải)</div>
                        <div class="d-flex align-items-center gap-2 border rounded p-1 bg-white" style="width: 140px;">
                            <input type="color" class="color-picker-input m-0 p-0 border-0 rounded overflow-hidden" style="width: 30px; height: 30px;" v-model="colorSides">
                            <span class="text-dark fw-medium" style="font-size: 13px;">{{ colorSides.toUpperCase() }}</span>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <div class="text-secondary mb-1" style="font-size: 13px;">Đáy phong bì (phía dưới)</div>
                        <div class="d-flex align-items-center gap-2 border rounded p-1 bg-white" style="width: 140px;">
                            <input type="color" class="color-picker-input m-0 p-0 border-0 rounded overflow-hidden" style="width: 30px; height: 30px;" v-model="colorBottom">
                            <span class="text-dark fw-medium" style="font-size: 13px;">{{ colorBottom.toUpperCase() }}</span>
                        </div>
                    </div>

                    <div class="text-secondary mb-3" style="font-size: 12px;">
                        Tùy chỉnh màu cho từng phần của phong bì
                    </div>
                </div>

                <hr class="m-0 text-muted border-secondary opacity-25">

                <!-- Hiệu ứng chuyển động -->
                <div>
                    <h6 class="fs-7 fw-bold text-dark mt-2" style="font-size: 14px;">Hiệu ứng chuyển động</h6>
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <span class="fw-medium text-dark" style="font-size: 13.5px;">Bật hiệu ứng</span>
                        <div class="form-check form-switch m-0 d-flex">
                            <input class="form-check-input flex-shrink-0 m-0 custom-switch" type="checkbox" role="switch" v-model="enableAnimation">
                        </div>
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
.cursor-pointer {
    cursor: pointer;
}
.color-cube {
    width: 34px;
    height: 18px;
    border: 1px solid rgba(0,0,0,0.1);
}
.theme-box {
    transition: all 0.2s;
    border-color: #e5e7eb !important;
}
.theme-box:hover {
    border-color: #3b82f6 !important;
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