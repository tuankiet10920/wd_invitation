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

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const handleRegister = () => {
    isOpen.value = false;
    navigateTo('/thiep-tron-goi');
}

const openFacebook = () => {
    window.open('https://facebook.com/cinelove.invitation', '_blank');
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="signup-modal-container">
                <!-- Close Button -->
                <button class="close-btn" @click="isOpen = false">
                    <BaseIconComponent name="close" type="mdi" :size="24" color="#9ca3af" />
                </button>

                <!-- Header -->
                <div class="text-start mb-4 title-create">
                    <h2 class="modal-title fw-bold">
                        Đăng ký <span class="highlight">Tạo thiệp trọn gói</span>
                    </h2>
                </div>

                <div class="divider mb-4"></div>

                <!-- Section 1 -->
                <div class="section-container text-start mb-5">
                    <p class="section-subtitle fw-bold mb-3">BẠN MUỐN TẠO THIỆP CƯỚI CHUYÊN NGHIỆP?</p>

                    <div class="fb-contact-box cursor-pointer shadow-sm border" @click="openFacebook">
                        <BaseIconComponent name="facebook" type="mdi" :size="32" color="#1877F2" class="mb-2" />
                        <span class="fb-text">Liên hệ qua Facebook</span>
                    </div>
                </div>

                <!-- Section 2 -->
                <div class="section-container text-center mb-4">
                    <p class="section-title-alarm fw-bold mb-3 d-flex align-items-center justify-content-center gap-2">
                        <span class="alarm-emoji">⏰</span>
                        BẠN KHÔNG CÓ THỜI GIAN?
                        <span class="alarm-emoji">⏰</span>
                    </p>

                    <div class="description-text text-start px-md-4">
                        <p class="mb-3">Bạn đang bận rộn chuẩn bị cho ngày trọng đại và cần gấp thiệp cưới online?</p>
                        <p class="mb-4">Đừng lo, hãy để chúng mình thiết kế giúp bạn chiếc thiệp cưới online với những
                            mẫu đẹp lung linh của Cinelove.</p>

                        <div class="bullet-list d-flex flex-column gap-2 mb-4">
                            <div class="bullet-item d-flex gap-2">
                                <span class="emoji">⚡</span>
                                <span>Hoàn thành trong 1-3 ngày làm việc, sẵn sàng sử dụng ngay!</span>
                            </div>
                            <div class="bullet-item d-flex gap-2">
                                <span class="emoji">✨</span>
                                <span>Tư vấn miễn phí, chỉnh sửa không giới hạn, giao thiệp hoàn chỉnh!</span>
                            </div>
                            <div class="bullet-item d-flex gap-2">
                                <span class="emoji">✨</span>
                                <span>Tiết kiệm thời gian, giảm áp lực, tập trung cho những điều quan trọng hơn!</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="footer-action">
                    <button class="btn-register-full shadow-sm" @click="handleRegister">
                        Đăng ký tạo thiệp trọn gói
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.signup-modal-container {
    background: #fff;
    padding: 32px 24px;
    border-radius: 12px;
    width: 500px;
    max-width: 95vw;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 10;
}

.modal-title {
    font-size: 24px;
    color: #1f2937;
}

.highlight {
    color: #fb7185;
    /* Pink color matching Image 1 */
}

.divider {
    height: 1px;
    background-color: #e5e7eb;
}

.section-subtitle {
    color: #1e40af;
    /* Deep blue color */
    font-size: 14px;
    letter-spacing: 0.05em;
}

.fb-contact-box {
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.2s ease;
    background: #fff;
}

.fb-contact-box:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

.fb-text {
    font-size: 14px;
    color: #374151;
}

.section-title-alarm {
    color: #dc2626;
    /* Red color matching alarm section */
    font-size: 16px;
}

.alarm-emoji {
    font-size: 20px;
}

.description-text {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
}

.bullet-item {
    font-size: 13.5px;
}

.btn-register-full {
    width: 100%;
    padding: 14px;
    background: #ff8fa3;
    /* Main pink theme */
    color: #fff;
    border: none;
    border-radius: 100px;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.2s ease;
}

.btn-register-full:hover {
    filter: brightness(0.95);
    transform: translateY(-1px);
}

.cursor-pointer {
    cursor: pointer;
}

@media (max-width: 768px) {
    .signup-modal-container {
        padding: 30px;
        /* scale: .8; */
    }

    .modal-title {
        font-size: 18px !important;
    }

    .fb-contact-box {
        width: 100%;
        padding: 10px;
    }

    .section-container {
        margin-bottom: 13px !important;
    }

    .description-text p,
    .description-text span {
        font-size: 12px !important;
    }

    .description-text p {
        margin-bottom: 3px !important;
    }

    .section-title-alarm {
        margin-bottom: 3px !important;
    }

    .title-create {
        margin-bottom: 10px !important;
    }

    .divider {
        margin-bottom: 10px !important;
    }

    .btn-register-full {
        padding-top: 10px;
        padding-bottom: 10px;
    }
}
</style>