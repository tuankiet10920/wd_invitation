<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { services } from '~~/composables/FuncServices';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        default: () => ({
            name: 'Nguyễn Thị D',
            greeting: 'Thân mời',
            statusConfirm: 'Chưa xác nhận',
            views: 0,
            statusSend: 'Chưa gửi',
            url: 'https://cinelove.me/invite/NTD-R0VUYJ',
            createdAt: '21:46 03/03/2026'
        })
    }
})

const emits = defineEmits(['update:modelValue', 'edit'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const handleEdit = () => {
    emits('edit')
}

const handleCopy = () => {
    navigator.clipboard.writeText(props.data.url)
}

const handlePreview = () => {
    window.open(props.data.url, '_blank')
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="detail-invitor-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0 text-dark">Chi tiết khách mời</h5>
                    <div class="d-flex align-items-center gap-3">
                        <button class="btn-edit" @click="handleEdit">
                            <BaseIconComponent name="pencil" :color="`#ffffff`" type="mdi" :size="16" />
                            <span>Chỉnh sửa</span>
                        </button>
                        <button class="btn-close-modal" @click="isOpen = false">
                            <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                        </button>
                    </div>
                </div>

                <!-- User Info Card -->
                <div class="user-info-card">
                    <div class="avatar-circle">
                        {{ data.name ? data.name.charAt(0).toUpperCase() : 'N' }}
                    </div>
                    <div class="user-info-text">
                        <div class="user-name">{{ data.name }}</div>
                        <div class="user-greeting">{{ data.greeting }}</div>
                    </div>
                </div>

                <!-- Status section -->
                <div class="section-box">
                    <div class="section-header">
                        Trạng thái
                    </div>
                    <div class="section-body">
                        <div class="status-grid">
                            <div class="status-item">
                                <div class="status-label">Xác nhận</div>
                                <div class="status-badge badge-gray">{{ data.statusConfirm }}</div>
                            </div>
                            <div class="status-item">
                                <div class="status-label">Lượt xem</div>
                                <div class="status-value-blue">{{ data.views }}</div>
                            </div>
                            <div class="status-item">
                                <div class="status-label">Đã gửi</div>
                                <div class="status-badge badge-yellow">{{ data.statusSend }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- URL section -->
                <div class="section-box">
                    <div class="section-header">
                        URL khách mời
                    </div>
                    <div class="section-body">
                        <div class="url-input-container">
                            <code>{{ data.url }}</code>
                        </div>
                        <div class="action-buttons-row">
                            <button class="btn-action btn-copy" @click="handleCopy">
                                <BaseIconComponent name="content-copy" type="mdi" :size="18" color="#3b82f6" />
                                <span>Copy</span>
                            </button>
                            <button class="btn-action btn-preview" @click="handlePreview">
                                <BaseIconComponent name="link" type="mdi" :size="18" />
                                <span>Xem</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Time section -->
                <div class="section-box mb-0">
                    <div class="section-header">
                        Thời gian
                    </div>
                    <div class="section-body p-3">
                        <div class="time-box p-3 rounded-2 bg-light-soft">
                            <div class="time-label mb-1">Ngày tạo</div>
                            <div class="time-value">{{ data.createdAt ? services.formatDaytimeOrder(data.createdAt) :
                                'N/A'
                            }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.detail-invitor-modal-container {
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-edit {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-edit:hover {
    background-color: #2563eb;
}

.user-info-card {
    background-color: #f5f8ff;
    border: 1px solid #e0e7ff;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.avatar-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5, #8b5cf6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.user-info-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.user-name {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
}

.user-greeting {
    font-size: 14px;
    color: #6b7280;
}

.section-box {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 20px;
    overflow: hidden;
}

.section-header {
    background-color: #fff;
    padding: 14px 16px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
    font-size: 15px;
}

.section-body {
    padding: 16px;
    background-color: #fff;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 8px;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    background-color: #fff;
    min-width: 0;
}

.status-label,
.time-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
    text-align: center;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
}

.badge-gray {
    background-color: #f1f5f9;
    color: #64748b;
}

.badge-yellow {
    background-color: #fff7ed;
    color: #f59e0b;
}

.status-value-blue {
    color: #3b82f6;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
}

.bg-light-soft {
    background-color: #f8fafc;
}

.url-input-container {
    background-color: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    padding: 20px 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.url-input-container code {
    color: #475569;
    font-size: 12px;
    word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
}

.action-buttons-row {
    display: flex;
    gap: 12px;
}

.btn-action {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    background-color: #fff;
    transition: all 0.2s;
}

.btn-copy {
    border: 1px solid #3b82f6;
    color: #3b82f6;
}

.btn-copy:hover {
    background-color: #eff6ff;
}

.btn-preview {
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-preview:hover {
    background-color: #f3f4f6;
}

.time-value {
    font-size: 15px;
    color: #111827;
    font-weight: 600;
}

.mb-0 {
    margin-bottom: 0 !important;
}

@media (max-width: 768px) {
    .detail-invitor-modal-container {
        padding: 10px;
    }

    .status-badge {
        font-size: 9px;
    }
}
</style>