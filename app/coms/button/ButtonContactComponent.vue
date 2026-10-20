<script setup lang="ts">
import { ref, onMounted } from 'vue';
import SignupFullCreateWeddingCard from '~/coms/dashboard/modal/SignupFullCreateWeddingCard.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const isSignupModalOpen = ref(false)
const isMessageOpen = ref(false)
const isHovered = ref(false)

const openModal = () => {
    isSignupModalOpen.value = true;
}

const STORAGE_KEY = 'message_contact';

const checkMessageStatus = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!stored) {
        // Initial set: open = true, time = null
        const initialState = { open: true, time: null };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
        isMessageOpen.value = true;
    } else {
        const state = JSON.parse(stored);
        if (state.open) {
            isMessageOpen.value = true;
        } else if (state.time && now >= state.time) {
            // Re-open automatically after 3 hours
            const reopenedState = { open: true, time: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reopenedState));
            isMessageOpen.value = true;
        }
    }
}

const closeMessage = (e: Event) => {
    e.stopPropagation();
    isMessageOpen.value = false;
    const expiry = Date.now() + (3 * 60 * 60 * 1000); // 3 hours in milliseconds
    const closedState = { open: false, time: expiry };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(closedState));
}

onMounted(() => {
    checkMessageStatus();
});
</script>

<template>
    <div class="button-contact-wrapper fixed-bottom-right" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false">
        <!-- New Hover Tooltip (Shown on hover, separate from automated message) -->
        <Transition name="fade-slide">
            <div v-if="isHovered && !isMessageOpen" class="hover-tooltip shadow-lg" @click="openModal">
                <h5 class="tooltip-title mb-3">Tạo thiệp trọn gói</h5>
                <p class="tooltip-content mb-0">Chúng mình có thể hỗ trợ bạn tạo thiệp online trọn gói từ A-Z một cách
                    dễ dàng và nhanh chóng!</p>
                <div class="tooltip-arrow"></div>
            </div>
        </Transition>

        <!-- Existing Automated Message Bubble -->
        <Transition name="fade-slide">
            <div v-if="isMessageOpen" class="message-bubble shadow-lg" @click="openModal">
                <button class="btn-close-message" @click="closeMessage">
                    <BaseIconComponent name="close" type="mdi" :size="14" color="#FFFFFF" />
                </button>
                <h5 class="message-title mb-1">Bạn không có thời gian?</h5>
                <p class="message-content mb-0 text-white">Đăng ký tạo thiệp trọn gói</p>
                <p class="message-subtext mb-0 text-white">Hỗ trợ tạo thiệp cưới trọn gói từ A-Z</p>
                <div class="bubble-arrow"></div>
            </div>
        </Transition>

        <div class="pulse-wrapper">
            <button class="btn-contact-float shadow-lg" @click="openModal">
                <BaseIconComponent name="headset" type="mdi" :size="22" color="#FFFFFF" />
            </button>
        </div>

        <SignupFullCreateWeddingCard v-model="isSignupModalOpen" />
    </div>
</template>

<style scoped>
.fixed-bottom-right {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

/* ========== MESSAGE BUBBLE STYLE ========== */
.message-bubble {
    background: #fb7185;
    color: #fff;
    padding: 16px 20px;
    border-radius: 16px;
    margin-bottom: 20px;
    position: relative;
    max-width: 320px;
    cursor: pointer;
    animation: float 3s ease-in-out infinite;
    z-index: 1001;
}

.message-title {
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
    color: #fff;
}

.message-content {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.95;
    line-height: 1.4;
}

.message-subtext {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.95;
    line-height: 1.4;
}

.btn-close-message {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-close-message:hover {
    background: rgba(255, 255, 255, 0.4);
}

.bubble-arrow {
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fb7185;
}

/* ========== HOVER TOOLTIP STYLE (WHITE) ========== */
.hover-tooltip {
    background: #ffffff;
    padding: 24px 22px;
    border-radius: 12px;
    margin-bottom: 20px;
    position: relative;
    max-width: 290px;
    cursor: pointer;
    z-index: 1001;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.05);
}

.tooltip-title {
    font-size: 19px;
    font-weight: 800;
    line-height: 1.2;
    color: #0f172a;
}

.tooltip-content {
    font-size: 15px;
    font-weight: 400;
    color: #475569;
    line-height: 1.5;
}

.tooltip-arrow {
    position: absolute;
    bottom: -9px;
    right: 25px;
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid #ffffff;
}

/* Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
}

/* ========== CONTACT BUTTON STYLE ========== */
.btn-contact-float {
    width: 48px;
    height: 48px;
    background: #fb7185;
    color: #fff;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    padding: 0;
}

.btn-contact-float:hover {
    transform: scale(1.1) rotate(5deg);
    background: #f43f5e;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}

.btn-contact-float:active {
    transform: scale(0.95);
}

.pulse-wrapper {
    animation: pulse-left 3s infinite;
}

@keyframes pulse-left {

    0%,
    20%,
    100% {
        transform: translateX(0);
    }

    5% {
        transform: translateX(-12px);
    }

    10% {
        transform: translateX(0);
    }

    15% {
        transform: translateX(-12px);
    }
}

@media (max-width: 576px) {
    .fixed-bottom-right {
        bottom: 10%;
        right: 20px;
    }

    .message-bubble,
    .hover-tooltip {
        max-width: 320px;
        padding: 16px 18px;
    }

    .message-title,
    .tooltip-title {
        font-size: 16px;
    }

    .message-content,
    .message-subtext,
    .tooltip-content {
        font-size: 12px;
    }

    .pulse-wrapper {
        display: none;
    }
}
</style>