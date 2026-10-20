<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const editor = useEditorStore();
const emits = defineEmits(['update:modelValue', 'add'])

const isOpen = ref(props.modelValue)
const displayName = ref('Cô dâu')
const receiverName = ref('')
const bankName = ref('')
const accountNumber = ref('')
const qrCodeUrl = ref('')
const selectedFile = ref<File | null>(null)

const displayOptions = ['Cô dâu', 'Chú rể', 'Bố cô dâu', 'Mẹ cô dâu', 'Bố chú rể', 'Mẹ chú rể']
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
    if (!val) {
        setTimeout(() => {
            displayName.value = 'Cô dâu'
            receiverName.value = ''
            bankName.value = ''
            accountNumber.value = ''
            qrCodeUrl.value = ''
            selectedFile.value = null
            isLoading.value = false
        }, 300)
    }
})

const handleUploadClick = () => {
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
        qrCodeUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

const { $toast } = useNuxtApp();

const handleSave = async () => {
    if (!receiverName.value || !bankName.value || !accountNumber.value || !selectedFile.value) {
        alert('Vui lòng điền đầy đủ thông tin và tải lên mã QR.')
        return
    }

    if (!editor.currentCardId || typeof editor.currentCardId === 'string') {
        alert('Vui lòng lưu bản nháp thiệp của bạn trước khi thêm thông tin tài khoản ngân hàng.')
        return
    }

    const formData = new FormData();
    formData.append('name', displayName.value);
    formData.append('name_reveive', receiverName.value);
    formData.append('name_bank', bankName.value);
    formData.append('number_bank', accountNumber.value);
    formData.append('id_wedding_card', String(editor.currentCardId));
    formData.append('image', selectedFile.value);

    try {
        isLoading.value = true;
        const res: any = await $fetch('/api/v1/client/qr-boxes', {
            method: 'POST',
            body: formData
        });

        if (res.success) {
            emits('add', {
                ...res.data,
                // Ensure we provide full URL for preview in UI
                qrCodeUrl: `/images/qr_codes/${res.data.image}`
            });
            isOpen.value = false;
        } else {
            alert('Lỗi: ' + (res.message || 'Không thể lưu tài khoản'));
        }
    } catch (e: any) {
        console.error(e);
        alert('Xảy ra lỗi trong quá trình lưu dữ liệu.');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="add-account-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0 text-dark">Thêm tài khoản mới</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Tên hiển thị -->
                <div class="mb-4">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Tên hiển thị</div>
                    <div class="custom-select-container">
                        <select class="custom-select" v-model="displayName">
                            <option v-for="opt in displayOptions" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                        <BaseIconComponent class="select-icon" name="chevron-down" type="mdi" :size="20" color="#6b7280" />
                    </div>
                </div>

                <!-- Tên người nhận -->
                <div class="mb-4">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Tên người nhận</div>
                    <div class="custom-input-group p-0">
                        <input type="text" class="custom-input px-3" placeholder="Nguyễn Văn A" v-model="receiverName" />
                    </div>
                </div>

                <!-- Tên ngân hàng -->
                <div class="mb-4">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Tên ngân hàng</div>
                    <div class="custom-input-group p-0">
                        <input type="text" class="custom-input px-3" placeholder="Vietcombank" v-model="bankName" />
                    </div>
                </div>

                <!-- Số tài khoản -->
                <div class="mb-4">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Số tài khoản</div>
                    <div class="custom-input-group p-0">
                        <input type="text" class="custom-input px-3" placeholder="1234567890" v-model="accountNumber" />
                    </div>
                </div>

                <!-- Mã QR chuyển khoản -->
                <div class="mb-4 text-center">
                    <div class="label-text mb-2 text-start"><span class="text-danger">*</span> Mã QR chuyển khoản</div>
                    <input type="file" ref="fileInput" accept="image/*" class="d-none" @change="handleFileChange" />
                    
                    <button class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 mb-2 upload-btn" 
                            @click="handleUploadClick" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                        <BaseIconComponent v-else name="upload" type="mdi" :size="18" />
                        Tải lên mã QR
                    </button>
                    <p class="text-muted help-text mb-2">Vui lòng tải lên hình ảnh mã QR của tài khoản ngân hàng</p>

                    <!-- Preview -->
                    <div v-if="qrCodeUrl" class="mt-2 text-start">
                        <img :src="qrCodeUrl" class="img-thumbnail" style="max-height: 100px; max-width: 100%;" />
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end mt-4 pt-2 gap-2">
                    <button class="btn btn-light border btn-cancel" @click="isOpen = false">Hủy</button>
                    <button class="btn-primary-custom d-flex align-items-center gap-2" @click="handleSave" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                        Lưu
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.add-account-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 480px;
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
    font-weight: 500;
    font-size: 15px;
}

.text-danger {
    color: #ef4444;
}

.custom-select-container {
    position: relative;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    height: 40px;
    background: #fff;
    transition: border-color 0.2s;
}

.custom-select-container:focus-within {
    border-color: #3b82f6;
}

.custom-select {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 36px 0 12px;
    font-size: 15px;
    appearance: none;
    background: transparent;
    color: #374151;
    cursor: pointer;
}

.select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.custom-input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    height: 40px;
    background: #fff;
    overflow: hidden;
    transition: border-color 0.2s;
}

.custom-input-group:focus-within {
    border-color: #3b82f6;
}

.custom-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    height: 100%;
    background: transparent;
    color: #374151;
}

.custom-input::placeholder {
    color: #9ca3af;
}

.upload-btn {
    border-radius: 4px;
    padding: 6px 16px;
    font-size: 14px;
    color: #4b5563;
    border-color: #d1d5db;
}
.upload-btn:hover {
    background-color: #f3f4f6;
    color: #374151;
}

.help-text {
    font-size: 14px;
    color: #9ca3af !important;
}

.btn-cancel {
    background-color: #fff;
    color: #4b5563;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 15px;
}
.btn-cancel:hover {
    background-color: #f9fafb;
}

.btn-primary-custom {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 24px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
}

.btn-primary-custom:hover {
    background-color: #2563eb;
}
</style>