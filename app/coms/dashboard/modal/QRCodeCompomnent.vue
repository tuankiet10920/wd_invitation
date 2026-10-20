<script setup lang="ts">
import { ref, watch } from 'vue';
import QRCodeVue from 'qrcode.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    qrUrl: {
        type: String,
        default: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=example'
    },
    title: {
        type: String,
        default: 'QR Code - Trang mới - 19/2/2022'
    }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const handleCopy = async () => {
    try {
        if (!props.qrUrl) return;

        // Find the canvas element inside qr-image-wrapper
        const canvas = document.querySelector('.qr-image-wrapper canvas') as HTMLCanvasElement;
        if (!canvas) {
            console.error('QR code canvas not found');
            return;
        }

        // Convert canvas context to blob
        canvas.toBlob(async (blob) => {
            if (blob) {
                await navigator.clipboard.write([
                    new ClipboardItem({ [blob.type]: blob })
                ]);
            }
        });

    } catch (err) {
        console.error('Failed to copy image: ', err);
    }
}

const handleDownload = () => {
    if (props.qrUrl) {
        // Find the canvas element inside qr-image-wrapper
        const canvas = document.querySelector('.qr-image-wrapper canvas') as HTMLCanvasElement;
        if (!canvas) {
            console.error('QR code canvas not found');
            return;
        }

        const link = document.createElement('a')

        // Generate image data url from canvas
        const dataUrl = canvas.toDataURL('image/png')

        link.href = dataUrl
        link.download = 'qrcode.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="qr-code-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center gap-2">
                        <BaseIconComponent name="qrcode" type="mdi" :size="24" color="#3b82f6" />
                        <h5 class="fw-bold mb-0 text-dark header-title">{{ title }}</h5>
                    </div>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- QR Image -->
                <div class="qr-image-wrapper mb-4">
                    <QRCodeVue :value="qrUrl" :size="260" level="H" />
                </div>

                <!-- Info Box -->
                <div class="info-box mb-4">
                    <div class="d-flex align-items-start gap-2">
                        <BaseIconComponent name="lightbulb-on" type="mdi" :size="20" color="#3b82f6"
                            class="mt-1 flex-shrink-0" />
                        <div>
                            <div class="info-title">💡 Ý tưởng sử dụng QR code:</div>
                            <ul class="info-list mt-2 mb-0">
                                <li><strong>Thiệp giấy:</strong> In QR vào thiệp mời để khách xem thiệp online và gửi
                                    lời chúc ngay</li>
                                <li><strong>Ảnh cưới:</strong> Thêm QR vào ảnh cưới để lưu giữ kỷ niệm, khách quét để
                                    gửi lời chúc</li>
                                <li><strong>Cổng hoa/Backdrop:</strong> In QR lớn để khách quét và tương tác ngay tại
                                    tiệc</li>
                                <li><strong>Standee:</strong> Đặt QR ở lối vào, khách quét để check-in và gửi lời chúc
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end gap-3 mt-4">
                    <button class="btn-copy" @click="handleCopy">
                        <BaseIconComponent name="content-copy" type="mdi" :size="20" />
                        Sao chép ảnh
                    </button>
                    <button class="btn-download" @click="handleDownload">
                        <BaseIconComponent name="download" type="mdi" :size="20" color="#fff" />
                        Tải xuống
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.qr-code-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 580px;
    max-width: 95vw;
}

.header-title {
    font-size: 16px;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.qr-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    width: fit-content;
    margin: 0 auto;
}

.info-box {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 16px;
}

.info-title {
    color: #1f2937;
    font-weight: 600;
    font-size: 15px;
}

.info-list {
    padding-left: 20px;
}

.info-list li {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 8px;
    line-height: 1.5;
}

.info-list li:last-child {
    margin-bottom: 0;
}

.info-list li strong {
    color: #1f2937;
    font-weight: 600;
}

.info-list li::marker {
    color: #3b82f6;
}

.btn-copy {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
}

.btn-copy:hover {
    background-color: #f3f4f6;
}

.btn-download {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
}

.btn-download:hover {
    background-color: #2563eb;
}
</style>