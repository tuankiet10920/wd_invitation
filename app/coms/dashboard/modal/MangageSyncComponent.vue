<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const editorStore = useEditorStore();
const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const toggleAutoSave = (val: boolean) => {
    editorStore.auto_save = val;
    localStorage.setItem("auto_save", val ? "true" : "false");
}

</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="sync-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0">Quản lý bản sao lưu</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Auto Save Setting -->
                <div class="bg-light-blue rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <BaseIconComponent name="settings" type="lucide" :size="16" class="text-secondary" />
                            <span class="fw-bold" style="font-size: 15px; color: #4b5563;">Cài đặt tự động lưu</span>
                        </div>
                        <small class="text-secondary" style="font-size: 13px;">{{ editorStore.auto_save ? 'Đang bật (30 giây/lần)' : 'Đã tắt' }}</small>
                    </div>
                    <button class="btn btn-white border px-3 btn-sm fw-medium shadow-sm" v-if="!editorStore.auto_save"
                        @click="toggleAutoSave(true)">Bật</button>
                    <button class="btn btn-white border px-3 btn-sm fw-medium shadow-sm" v-else
                        @click="toggleAutoSave(false)">Tắt</button>
                </div>

                <!-- Info Box -->
                <div class="bg-light-blue rounded-3 p-3 mb-4">
                    <div class="d-flex gap-2 mb-2">
                        <BaseIconComponent name="lightbulb" type="lucide" :size="16" class="text-warning mt-1" />
                        <span class="fw-bold" style="font-size: 15px; color: #4b5563;">Thông tin về bản sao lưu:</span>
                    </div>
                    <ul class="mb-0 ps-3 text-secondary" style="font-size: 13px;">
                        <li class="mb-1"><strong class="text-dark">Tự động:</strong> Hệ thống tự động lưu & sao lưu mỗi
                            30 giây {{ !editorStore.auto_save ? '(đã tắt)' : '' }}</li>
                        <li class="mb-1"><strong class="text-dark">Lưu trữ:</strong> Chỉ giữ lại 3 bản sao lưu gần nhất
                        </li>
                        <li><strong class="text-dark">Dọn dẹp:</strong> Các bản sao lưu cũ hơn 7 ngày sẽ bị xóa</li>
                    </ul>
                </div>

                <!-- Empty State -->
                <div class="empty-state-wrapper text-center">
                    <div class="mb-3">
                        <div class="d-flex justify-content-center">
                            <BaseIconComponent name="inbox" type="lucide" :size="64" class="text-black-50 opacity-25" />
                        </div>
                    </div>
                    <p class="text-secondary" style="font-size: 14px;">Không có backup nào</p>
                </div>

                <!-- Footer button spacer -->
                <div class="mt-2"></div>

                <!-- Footer -->
                <div class="d-flex justify-content-end gap-2 pt-3">
                    <button class="btn btn-white border px-4 py-2 shadow-sm rounded-3">Làm mới</button>
                    <button class="btn btn-white border px-4 py-2 shadow-sm rounded-3" @click="isOpen = false">Đóng</button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.sync-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 600px;
    max-width: 95vw;
}

.bg-light-blue {
    background-color: #f0f7ff;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.btn-close-modal:hover {
    opacity: 0.7;
}

.btn-white {
    background-color: #fff;
    color: #333;
}

.btn-white:hover {
    background-color: #f8fafc;
}

ul {
    list-style-type: disc;
    padding-left: 20px;
}

.empty-state-wrapper {
    padding: 3rem 0;
}

@media (max-width: 768px) {
    .empty-state-wrapper {
        padding: 10px 0;
    }
}
</style>