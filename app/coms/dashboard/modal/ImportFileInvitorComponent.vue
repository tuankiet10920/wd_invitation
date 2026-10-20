<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue', 'importFile', 'downloadSample'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const handleFileChoose = () => {
    const fileInput = document.getElementById('csvFileInput');
    if (fileInput) {
        fileInput.click();
    }
}

const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        emits('importFile', file);
    }
}

const handleDrop = (e: any) => {
    const file = e.dataTransfer.files[0];
    if (file) {
        emits('importFile', file);
    }
}

const handleDownloadSample = () => {
    emits('downloadSample');
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="import-file-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-start mb-4">
                    <div class="header-titles">
                        <h5 class="fw-bold mb-1 text-dark d-flex align-items-center gap-2" style="font-size: 18px;">
                            <span>📥</span> Import danh sách khách từ file CSV
                        </h5>
                        <div class="text-secondary" style="font-size: 14px;">Nhập hàng loạt khách mời từ file Excel/CSV
                        </div>
                    </div>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Format Information Box -->
                <div class="info-box mb-4">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span>📋</span>
                        <span class="info-title">Format file CSV:</span>
                    </div>

                    <div class="code-block mb-3">
                        Tên khách,Lời mời
                        Nguyễn Văn A,Kính mời
                        Trần Thị B,Thân mời
                        Lê Văn C,Trân trọng kính mời
                    </div>

                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span style="color: #22c55e;">
                            <BaseIconComponent name="check-box-outline" type="mdi" :size="20" />
                        </span>
                        <span class="info-title">Lời mời có thể dùng:</span>
                    </div>
                    <div class="info-text">
                        • Thân mời • Kính mời • Trân trọng kính mời • Trân trọng thân mời • Kính gửi • Gửi • Hoặc tự
                        nhập lời mời khác
                    </div>
                </div>

                <!-- Drag & Drop Area -->
                <div class="drag-drop-area mb-4" @click="handleFileChoose" @dragover.prevent @drop.prevent="handleDrop">
                    <input type="file" id="csvFileInput" accept=".csv" @change="handleFileChange"
                        style="display: none;" />
                    <!-- Using an icon similar to the upload arrow in image -->
                    <BaseIconComponent name="tray-arrow-up" type="mdi" :size="48" color="#3b82f6" class="mb-2" />
                    <div class="drag-drop-title mb-1">Click hoặc kéo file CSV vào đây để import</div>
                    <div class="drag-drop-desc">Hỗ trợ file CSV với encoding UTF-8. Dòng đầu tiên là tiêu đề cột.</div>
                </div>

                <!-- Divider -->
                <div class="divider-wrapper mb-4">
                    <div class="divider-line"></div>
                    <span class="divider-text">Hoặc</span>
                    <div class="divider-line"></div>
                </div>

                <!-- Download Sample Button -->
                <button class="btn-download-sample mb-4" @click="handleDownloadSample">
                    <BaseIconComponent name="download" type="mdi" :size="20" color="#fff" />
                    <span>Tải file mẫu CSV để bắt đầu</span>
                </button>

                <!-- Tip Box -->
                <div class="tip-box mt-3">
                    <div class="tip-content">
                        <span class="tip-icon">💡</span>
                        <span class="tip-bold">Mẹo:</span> Tải file mẫu, mở bằng Excel/Google Sheets, điền thông tin
                        khách mời, sau đó lưu lại và import vào đây.
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.import-file-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 600px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

/* Info Box */
.info-box {
    background-color: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    padding: 16px;
}

.info-title {
    color: #1f2937;
    font-weight: 600;
    font-size: 15px;
}

.code-block {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 12px;
    font-family: inherit;
    font-size: 14px;
    color: #374151;
    white-space: pre-wrap;
    line-height: 1.5;
}

.info-text {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    margin-left: 28px;
}

/* Drag & Drop Area */
.drag-drop-area {
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background-color: #fff;
}

.drag-drop-area:hover {
    border-color: #3b82f6;
    background-color: #f8fafc;
}

.drag-drop-title {
    color: #374151;
    font-size: 16px;
}

.drag-drop-desc {
    color: #9ca3af;
    font-size: 14px;
}

/* Divider */
.divider-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.divider-line {
    flex-grow: 1;
    height: 1px;
    background-color: #e5e7eb;
}

.divider-text {
    padding: 0 16px;
    color: #111827;
    font-weight: 600;
    font-size: 15px;
}

/* Download Sample Button */
.btn-download-sample {
    width: 100%;
    background-color: #3b82f6;
    border: none;
    color: #fff;
    padding: 12px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-download-sample:hover {
    background-color: #2563eb;
}

/* Tip Box */
.tip-box {
    background-color: #fafaf9;
    padding: 12px 16px;
    border-radius: 6px;
}

.tip-content {
    color: #6b7280;
    font-size: 13px;
    line-height: 1.5;
}

.tip-bold {
    font-weight: 600;
    color: #374151;
}
</style>