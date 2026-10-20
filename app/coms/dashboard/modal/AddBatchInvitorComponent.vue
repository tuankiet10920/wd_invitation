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

const emits = defineEmits(['update:modelValue', 'addBatch'])

const isOpen = ref(props.modelValue)
const invitation = ref('')
const batchList = ref('')

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
    if (!val) {
        invitation.value = ''
        batchList.value = ''
    }
})

const handleAddAll = () => {
    const trimmedList = batchList.value.trim()
    if (!trimmedList) return
    emits('addBatch', { list: trimmedList, invitation: invitation.value.trim() })
    isOpen.value = false
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="add-batch-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0 text-dark">Thêm khách hàng loạt</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Lời mời -->
                <div class="mb-3">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Lời mời</div>
                    <textarea class="form-control custom-textarea" placeholder="Nhập lời mời của bạn... Vd: Thân mời"
                        v-model="invitation" rows="3"></textarea>
                </div>

                <!-- Textarea -->
                <div class="mb-3">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Danh sách giá trị</div>
                    <textarea class="form-control custom-textarea"
                        placeholder="Mỗi tên một dòng:&#10;Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C" v-model="batchList"
                        rows="6"></textarea>
                </div>

                <!-- Hint Box -->
                <div class="hint-box mb-4">
                    <div class="d-flex align-items-center gap-2">
                        <BaseIconComponent name="lightbulb-on-outline" type="mdi" :size="20" color="#eab308" />
                        <span class="hint-text">Mỗi tên trên một dòng. Dòng trống sẽ bỏ qua.</span>
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end mt-4">
                    <button class="btn-add-all" @click="handleAddAll">Thêm tất cả</button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.add-batch-modal-container {
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

.label-text {
    color: #4b5563;
    font-size: 14.5px;
    font-weight: 400;
}

.custom-textarea {
    width: 100%;
    resize: none;
    padding: 12px;
    font-size: 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
}

.custom-textarea::placeholder {
    color: #9ca3af;
    line-height: 1.6;
}

.custom-textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    outline: none;
}

.hint-box {
    background-color: #f0fdf4;
    background: #eff6ff;
    border-radius: 6px;
    padding: 12px 16px;
}

.hint-text {
    color: #4b5563;
    font-size: 14px;
}

.btn-add-all {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    min-width: 100px;
}

.btn-add-all:hover {
    background-color: #2563eb;
}
</style>