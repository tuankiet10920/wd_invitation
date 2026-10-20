<script setup lang="ts">
const props = defineProps({
    isShow: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: false,
        default: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản'
    }
})

const showSuccessNotification = ref(props.isShow)

const hideNotification = () => {
    showSuccessNotification.value = false
}

watch(() => props.isShow, (newValue) => {
    showSuccessNotification.value = newValue
}, { immediate: true })
</script>
<template>
    <div v-if="showSuccessNotification" class="success-notification">
        <div class="notification-content">
            <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ props.message }}</span>
        </div>
        <button type="button" class="close-notification" @click="hideNotification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
</template>
<style scoped>
/* Success Notification */
.success-notification {
    background: #d1fae5;
    border: 1px solid #6ee7b7;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.notification-content {
    display: flex;
    /* align-items: center; */
    gap: 10px;
    flex: 1;
    color: #065f46;
    font-size: 14px;
    line-height: 1.5;
}

.check-icon {
    flex-shrink: 0;
    color: #059669;
}

.close-notification {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
    flex-shrink: 0;
}

.close-notification:hover {
    background: rgba(5, 150, 105, 0.1);
}
</style>