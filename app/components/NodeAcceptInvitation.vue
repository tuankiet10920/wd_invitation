<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
    formTitle: { type: String, default: 'Xác nhận tham dự' },
    nameLabel: { type: String, default: 'Họ và tên' },
    namePlaceholder: { type: String, default: 'Nhập tên của bạn' },
    attendanceLabel: { type: String, default: 'Bạn sẽ tham dự chứ?' },
    attendYesLabel: { type: String, default: 'Có, tôi sẽ tham dự' },
    attendNoLabel: { type: String, default: 'Tôi bận, rất tiếc không thể tham dự' },
    submitLabel: { type: String, default: 'Gửi xác nhận' },
    successMessage: { type: String, default: 'Cảm ơn {name} đã xác nhận!' },
    inputBorderColor: { type: String, default: '#dddddd' },
    borderColor: { type: String, default: '#e0e0e0' },
    submitButtonColor: { type: String, default: '#ef5350' },
    submitButtonTextColor: { type: String, default: '#ffffff' },
});

const name = ref('');
const isAttending = ref(true); // true for "Có", false for "Không"
const isSubmitted = ref(false);

const isSubmitting = ref(false);

const handleSubmit = async () => {
    if (!name.value.trim()) {
        alert('Vui lòng nhập họ và tên');
        return;
    }

    if (route.path.includes('/template/')) {
        alert('Đây là chế độ xem mẫu, không thể gửi xác nhận tham dự');
        return;
    }

    const slug = route.params.slug as string;
    if (!slug) {
        console.error('Slug not found in route params');
        return;
    }

    isSubmitting.value = true;
    try {
        const response: any = await $fetch('/api/v1/client/accept-invitation', {
            method: 'POST',
            body: {
                slug,
                content: { name: name.value },
                is_accept: isAttending.value
            }
        });

        if (response.success) {
            isSubmitted.value = true;
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    } catch (error) {
        console.error('Failed to submit RSVP:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
        isSubmitting.value = false;
    }
};

// Computed styles for dynamic colors
const buttonStyle = computed(() => ({
    backgroundColor: props.submitButtonColor,
    color: props.submitButtonTextColor
}));

</script>

<template>
    <div class="invitation-card-container">
        <div class="invitation-card">
            <template v-if="!isSubmitted">
                <div class="form-content">
                    <h2 class="title">{{ formTitle }}</h2>

                    <div class="form-group">
                        <label class="label">{{ nameLabel }}</label>
                        <input type="text" v-model="name" class="form-control" :placeholder="namePlaceholder"
                            :style="{ borderColor: inputBorderColor }">
                    </div>

                    <div class="form-group">
                        <label class="label">{{ attendanceLabel }}</label>

                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" :value="true" v-model="isAttending" name="attendance">
                                <span class="radio-text">{{ attendYesLabel }}</span>
                            </label>

                            <label class="radio-option">
                                <input type="radio" :value="false" v-model="isAttending" name="attendance">
                                <span class="radio-text">{{ attendNoLabel }}</span>
                            </label>
                        </div>
                    </div>

                    <button class="submit-btn d-flex align-items-center justify-content-center gap-2" :disabled="isSubmitting" @click="handleSubmit" :style="buttonStyle">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"></span>
                        {{ submitLabel }}
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="form-content d-flex flex-column align-items-center justify-content-center text-center success-view">
                    <h2 class="title">{{ formTitle }}</h2>
                    <svg viewBox="0 0 24 24" fill="none" class="success-icon" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4CAF50" stroke-width="2"/>
                        <path d="M7 12L10.5 15.5L18 8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3 class="success-msg">{{ successMessage.replace('{name}', name || 'bạn') }}</h3>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
/* 
   Sử dụng CSS Container Queries để resize toàn bộ thành phần bên trong.
   1cqw = 1% chiều rộng của khung .invitation-card-container 
*/
.invitation-card-container {
    width: 100%;
    height: 100%;
    container-type: size; /* Định nghĩa thẻ này là container để các thẻ con tính toán cqw/cqh */
    overflow: hidden;
}

.invitation-card {
    background: inherit;
    color: inherit;
    padding: 10cqw; /* Khoảng cách đệm = 10% chiều rộng khung */
    border-radius: 2cqw;
    box-shadow: 0 1cqw 3cqw rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    font-family: inherit;
    border: 0.25cqw solid v-bind('props.borderColor');
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.form-content {
    width: 100%;
    max-width: 80cqw;
}

.success-view {
    min-height: 60cqw;
}

.success-icon {
    width: 20cqw;
    height: 20cqw;
    margin-bottom: 4cqw;
    margin-top: 2cqw;
}

.success-msg {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 4.5cqw;
    color: #4CAF50;
}

.title {
    text-align: center;
    font-size: 6cqw; /* Chữ tiêu đề = 6% chiều rộng khung */
    font-weight: 700;
    margin-bottom: 7.5cqw;
    color: inherit;
    line-height: 1.2;
}

.form-group {
    margin-bottom: 6.25cqw;
}

.label {
    display: block;
    margin-bottom: 2.5cqw;
    color: inherit;
    font-size: 4cqw;
    font-weight: 500;
}

.form-control {
    width: 100%;
    padding: 3cqw 3.75cqw;
    border-width: 0.25cqw;
    border-style: solid;
    border-radius: 1.5cqw;
    font-size: 4cqw;
    color: #333;
    outline: none;
    box-sizing: border-box;
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 3.75cqw;
}

.radio-option {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 4cqw;
    color: inherit;
}

.radio-option input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    width: 6cqw;
    height: 6cqw;
    border: 0.5cqw solid v-bind('props.inputBorderColor');
    border-radius: 50%;
    margin-right: 3cqw;
    position: relative;
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
}

.radio-option input[type="radio"]:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3cqw;
    height: 3cqw;
    background-color: v-bind('props.submitButtonColor');
    border-radius: 50%;
}

.submit-btn {
    width: 100%;
    padding: 3.5cqw;
    border: none;
    border-radius: 1.5cqw;
    font-size: 4cqw;
    font-weight: 500;
    cursor: pointer;
    margin-top: 2.5cqw;
    box-sizing: border-box;
}

.radio-text {
    line-height: 1.4;
}
</style>
