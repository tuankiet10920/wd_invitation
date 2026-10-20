<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    qrBoxes: {
        type: Array as () => any[],
        default: () => []
    },
    slug: {
        type: String,
        default: ''
    }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)
const localQrBoxes = ref<any[]>(props.qrBoxes || [])

watch(() => props.modelValue, (val) => {
    isOpen.value = val
    if (val && props.slug) {
        fetchQrBoxes();
    }
})

const fetchQrBoxes = async () => {
    if (!props.slug) return;
    try {
        const res: any = await $fetch(`/api/v1/client/qr-boxes/by-slug/${props.slug}`);
        if (res.success) {
            localQrBoxes.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch QR boxes by slug', e);
    }
}

onMounted(() => {
    if (props.slug) {
        fetchQrBoxes();
    }
})

watch(() => props.qrBoxes, (val) => {
    if (val && val.length > 0) {
        localQrBoxes.value = val;
    }
}, { immediate: true })

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        alert('Đã sao chép số tài khoản vào bộ nhớ tạm.');
    }).catch(err => {
        console.error('Lỗi sao chép: ', err);
    });
}

const getThemeColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cô dâu') || n.includes('mẹ cô dâu') || n.includes('bố cô dâu')) {
        return {
            text: '#e91e63',
            bg: '#fdf2f8',
            border: '#fbcfe8',
            btn: '#fdf2f8',
            btnText: '#e91e63',
            btnBorder: '#fbcfe8'
        };
    }
    return {
        text: '#3b82f6',
        bg: '#eff6ff',
        border: '#bfdbfe',
        btn: '#eff6ff',
        btnText: '#3b82f6',
        btnBorder: '#bfdbfe'
    };
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="love-gift-modal-container" :class="{ 'multi-box': localQrBoxes.length > 1 }">
                <!-- Title -->
                <div class="text-center mb-4">
                    <h4 class="fw-bold text-dark mb-2">Hộp Quà Yêu Thương</h4>
                    <p class="text-secondary subtitle">Quét QR code để gửi yêu thương trực tiếp tới:</p>
                </div>

                <!-- QR Boxes Container -->
                <div class="qr-boxes-grid" :class="{ 'single-box': localQrBoxes.length === 1 }">
                    <div v-for="(bank, index) in localQrBoxes" :key="index" class="qr-item-wrapper">
                        <!-- Owner Name (Tab Title style) -->
                        <div class="owner-name text-center mb-3" :style="{ color: getThemeColor(bank.name).text }">
                            {{ bank.name }}
                        </div>

                        <!-- Card Content -->
                        <div class="qr-card shadow-sm border rounded-4 p-3 bg-white d-flex"
                             :class="{ 'flex-column align-items-center text-center': localQrBoxes.length > 1, 'flex-row align-items-center text-start h-100': localQrBoxes.length === 1 }">
                            
                            <!-- QR Image -->
                            <div class="qr-image-container mb-3" 
                                 :class="{ 'me-4': localQrBoxes.length === 1, 'mb-3': localQrBoxes.length > 1 }"
                                 :style="{ borderColor: getThemeColor(bank.name).border, backgroundColor: getThemeColor(bank.name).bg }">
                                <img :src="`/images/qr_codes/${bank.image}`" alt="QR Code" class="img-fluid rounded-3" />
                            </div>

                            <!-- Bank Info -->
                            <div class="bank-info" :class="{ 'flex-grow-1': qrBoxes.length === 1 }">
                                <h6 class="fw-bold text-dark mb-1 fs-5">{{ bank.name_reveive }}</h6>
                                <p class="text-secondary mb-1 fs-6">{{ bank.name_bank }}</p>
                                <p class="text-muted mb-3 fs-6">{{ bank.number_bank }}</p>

                                <!-- Action Button -->
                                <button class="btn btn-copy d-flex align-items-center gap-1 border"
                                        :style="{ 
                                            background: getThemeColor(bank.name).btn, 
                                            color: getThemeColor(bank.name).btnText,
                                            borderColor: getThemeColor(bank.name).btnBorder
                                        }"
                                        @click="copyToClipboard(bank.number_bank)">
                                    Sao chép số TK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="text-center mt-4 pt-3 border-top w-100">
                    <button class="btn btn-light border px-4 py-2 rounded-2 fw-medium text-secondary" @click="isOpen = false">
                        Đóng
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.love-gift-modal-container {
    background: #fff;
    padding: 32px 24px 24px;
    border-radius: 20px;
    width: 600px;
    max-width: 95vw;
}

.love-gift-modal-container.multi-box {
    width: 750px;
}

.subtitle {
    font-size: 15px;
    color: #6b7280;
}

.owner-name {
    font-size: 18px;
    font-weight: 500;
}

/* Single Box Layout (Horizontal) */
.qr-boxes-grid.single-box .qr-card {
    min-height: 200px;
}

.qr-boxes-grid.single-box .qr-image-container {
    width: 160px;
    height: 160px;
    flex-shrink: 0;
}

/* Multi Box Layout (Grid) */
.qr-boxes-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

.multi-box .qr-boxes-grid {
    grid-template-columns: repeat(2, 1fr);
}

.qr-image-container {
    padding: 10px;
    border-width: 2px;
    border-style: solid;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 200px;
    overflow: hidden;
}

.qr-image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.bank-info h6 {
    letter-spacing: -0.01em;
}

.btn-copy {
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 100px;
    transition: filter 0.2s;
    justify-content: center;
}

.btn-copy:hover {
    filter: brightness(0.95);
}

@media (max-width: 768px) {
    .multi-box .qr-boxes-grid {
        grid-template-columns: 1fr;
    }
    
    .love-gift-modal-container {
        padding: 24px 16px;
    }

    .qr-boxes-grid.single-box .qr-card {
        flex-direction: column !important;
        text-align: center !important;
    }

    .qr-boxes-grid.single-box .qr-image-container {
        margin-right: 0 !important;
        margin-bottom: 16px !important;
        width: 180px;
        height: 180px;
    }
}
</style>