<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotifcationComponent from '~/coms/user/auth/NotifcationComponent.vue';
import { ref } from 'vue';

definePageMeta({
    layout: 'blank'
});

useHead({
    link: [
        {
            rel: 'stylesheet',
            href: '/css/index.css'
        }
    ]
})

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const isShowSuccess = ref(false)
const route = useRoute();
const token = route.params.token as string;
const errorMessage = ref<string | null>(null)

const passwordValidation = computed(() => {
    const pwd = password.value
    return {
        hasLength: pwd.length >= 8 && pwd.length <= 10,
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        hasNumber: /\d/.test(pwd),
        hasUpperCase: /[A-Z]/.test(pwd),
        hasLowerCase: /[a-z]/.test(pwd)
    }
})

const passwordStrength = computed(() => {
    const validations = passwordValidation.value
    const validCount = Object.values(validations).filter(Boolean).length

    if (validCount === 0) return { label: '', percentage: 0, color: '' }
    if (validCount <= 2) return { label: 'Yếu', percentage: 33, color: '#ef4444' }
    if (validCount <= 4) return { label: 'Trung bình', percentage: 66, color: '#f59e0b' }
    return { label: 'Mạnh', percentage: 100, color: '#10b981' }
})

const isNotSame = computed(() => {
    return password.value != confirmPassword.value
})

const handleSubmit = async () => {
    errorMessage.value = null

    if (!password.value || !confirmPassword.value) return errorMessage.value = 'Please fill in all information!';

    if (isNotSame.value) return errorMessage.value = 'Password is not same!';

    loading.value = true;
    console.log('Resetting password...');

    // TODO: Get token from route and Call API to reset password
    if (token.trim() == '') return errorMessage.value = "Token is required!";

    try {
        await $fetch('/api/v1/auth/reset-password', {
            method: 'POST',
            body: {
                token,
                password: password.value,
                confirm_password: confirmPassword.value
            }
        })

        isShowSuccess.value = true

        setTimeout(() => {
            loading.value = false;
            navigateTo('/');
        }, 2000);
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.data?.message
        loading.value = false;
    }
};
</script>

<template>
    <div class="reset-password-page">
        <div class="card border-none">
            <NotifcationComponent :is-show="isShowSuccess" :message="`Đặt mật khẩu thành công!`" />
            <div class="flex-jc-ac mb-3">
                <NuxtImg :src="`/others/logo.svg`" :width="35" :height="35" />
                <NuxtImg :src="`/others/logo-text-dark.svg`" class="ms-2" :width="90" />
            </div>

            <h2 class="title">Đặt lại mật khẩu</h2>

            <form @submit.prevent="handleSubmit" class="form-group">
                <div class="input-wrapper">
                    <label for="password" class="input-label">Mật khẩu mới</label>
                    <div class="password-input-container">
                        <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" required
                            class="input-field" placeholder="" />
                        <BaseIconComponent :name="!showPassword ? `visibility` : `visibility-off`"
                            @click="showPassword = !showPassword" class="eye-icon" :color="`#9ca3af`" :size="20" />
                    </div>
                </div>

                <div class="input-wrapper">
                    <label for="confirmPassword" class="input-label">Xác nhận mật khẩu</label>
                    <div class="password-input-container">
                        <input id="confirmPassword" v-model="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'" required class="input-field" :class="{
                                'border-danger': isNotSame
                            }" placeholder="" />
                        <BaseIconComponent :name="!showConfirmPassword ? `visibility` : `visibility-off`"
                            @click="showConfirmPassword = !showConfirmPassword" class="eye-icon" :color="`#9ca3af`"
                            :size="20" />
                    </div>
                </div>

                <!-- Password validation indicators -->
                <div v-if="password.length > 0" class="password-validation mt-2">
                    <div class="validation-badges mb-2">
                        <span class="validation-badge" :class="{ 'valid': passwordValidation.hasLength }">
                            <BaseIconComponent v-if="passwordValidation.hasLength" :name="'check'" :size="14"
                                :color="'#10b981'" />
                            8-10 ký tự
                        </span>
                        <span class="validation-badge" :class="{ 'valid': passwordValidation.hasSpecialChar }">
                            <BaseIconComponent v-if="passwordValidation.hasSpecialChar" :name="'check'" :size="14"
                                :color="'#10b981'" />
                            1 ký tự đặc biệt
                        </span>
                        <span class="validation-badge" :class="{ 'valid': passwordValidation.hasNumber }">
                            <BaseIconComponent v-if="passwordValidation.hasNumber" :name="'check'" :size="14"
                                :color="'#10b981'" />
                            1 số
                        </span>
                        <span class="validation-badge" :class="{ 'valid': passwordValidation.hasUpperCase }">
                            <BaseIconComponent v-if="passwordValidation.hasUpperCase" :name="'check'" :size="14"
                                :color="'#10b981'" />
                            1 chữ hoa
                        </span>
                        <span class="validation-badge" :class="{ 'valid': passwordValidation.hasLowerCase }">
                            <BaseIconComponent v-if="passwordValidation.hasLowerCase" :name="'check'" :size="14"
                                :color="'#10b981'" />
                            1 chữ thường
                        </span>
                    </div>
                    <!-- Strength bar -->
                    <div class="strength-bar-container">
                        <div class="strength-bar"
                            :style="{ width: passwordStrength.percentage + '%', backgroundColor: passwordStrength.color }">
                        </div>
                    </div>
                    <div v-if="passwordStrength.label" class="strength-label"
                        :style="{ color: passwordStrength.color }">
                        {{ passwordStrength.label }}
                    </div>
                </div>

                <div v-if="errorMessage">
                    <p class="mb-0 text-danger">{{ errorMessage }}</p>
                </div>

                <button type="submit" class="submit-btn" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span v-else>Đặt lại mật khẩu</span>
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.reset-password-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    width: 100%;
    /* Smooth background transitions */
    background: linear-gradient(45deg, rgba(238, 119, 82, 0.2), rgba(231, 60, 126, 0.2), rgba(35, 166, 213, 0.2), rgba(35, 213, 171, 0.2)) 0% 0% / 400% 400%;
    background-size: 200% 200%;
    animation: gradient 15s ease 0s infinite normal none running;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.card {
    background: white;
    width: 100%;
    max-width: 380px;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    text-align: center;
}

.title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 1.5rem 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.input-wrapper {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: #374151;
}

.password-input-container {
    position: relative;
    width: 100%;
}

.input-field {
    width: 100%;
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    /* Added right padding for icon */
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.input-field:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.eye-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.eye-icon svg {
    width: 100%;
    height: 100%;
}

.submit-btn {
    width: 100%;
    background-color: #3b82f6;
    color: white;
    font-weight: 600;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.submit-btn:hover {
    background-color: #2563eb;
}

.submit-btn:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}

/* Spinner styling from Bootstrap or custom if needed, simplified here implied by previous code using it */
.spinner-border {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: text-bottom;
    border: 0.2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
    to {
        transform: rotate(360deg);
    }
}

/* Password validation */
.password-validation {
    font-size: 13px;
}

.validation-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.validation-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    background: #f3f4f6;
    color: #6b7280;
    font-size: 12px;
    transition: all 0.2s ease;
}

.validation-badge.valid {
    background: #d1fae5;
    color: #065f46;
}

.strength-bar-container {
    width: 100%;
    height: 10px;
    background: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
}

.strength-bar {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.strength-label {
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
}
</style>