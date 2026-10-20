<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PropType } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotifcationComponent from './NotifcationComponent.vue';
import { useUserStore } from "~~/stores/user"
import { useRuntimeConfig } from '#app';

const showPassword = ref(false)

type Auth = 'login' | 'register'

const props = defineProps({
    auth: {
        type: String as PropType<Auth>,
        required: true
    }
})

const template = ref<Auth>(props.auth)
const store = useUserStore()

const name = ref('')
const email = ref('')
const password = ref('')
const remember = ref(false)
const sending = ref(false)
const showSuccessNotification = ref(false)
const isTruth = ref(false)
const errorMessage = ref<string | null>(null)
const sendingGoogle = ref(false)
const sendingFacebook = ref(false)

// Password validation
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

const authFunc = async () => {
    if (sending.value) return errorMessage.value = "Don't handle while authenication!"

    errorMessage.value = null

    if (template.value == 'login') {
        if (email.value.trim() == '' || password.value.trim() == '') return errorMessage.value = "Email ans Password is required!"

        try {
            sending.value = true
            await $fetch('/api/v1/auth/login', {
                method: "POST",
                body: {
                    email: email.value,
                    password: password.value,
                    remember: remember.value
                }
            })

            await store.checkLogin()

            if (store.isLogin && store.openModal) {
                sending.value = false
                store.openModal = false
                navigateTo('/dashboard')
            }
        } catch (error: any) {
            console.log(error);
            errorMessage.value = error.data?.message
            sending.value = false
        }
    } else {
        if (!isTruth.value) return errorMessage.value = 'Please accpeting our policy!'

        if (email.value.trim() == '' || password.value.trim() == '' || name.value.trim() == '') return errorMessage.value = 'Email, Password and Name is required!'

        try {
            sending.value = true
            await $fetch('/api/v1/auth/register', {
                method: "POST",
                body: {
                    name: name.value,
                    email: email.value,
                    password: password.value,
                    remember: remember.value
                }
            })

            if (store.openModal) {
                sending.value = false
                showSuccessNotification.value = true

                setTimeout(() => {
                    showSuccessNotification.value = false
                }, 5000)

                setTimeout(() => {
                    template.value = 'login'
                }, 2000)
            }
        } catch (error: any) {
            console.log(error);
            errorMessage.value = error.data?.message
            sending.value = false
        }
    }
}

const config = useRuntimeConfig()

type Social = 'facebook' | 'google';

const loginWithSocial = (social: Social) => {
    if (social == 'facebook') sendingFacebook.value = true
    else sendingGoogle.value = true
    const remember = useCookie('remember', { maxAge: 30 })
    remember.value = remember.value ? 'true' : 'false'
    const urlHost = (config.public.env === 'production' || config.public.env === 'test')
        ? config.public.siteUrl
        : (typeof window !== 'undefined' ? window.location.origin : config.public.urlLocalHost)
    window.location.href = `${urlHost}/api/v1/auth/${social}`
}
</script>

<template>
    <div class="login-overlay" :key="template">
        <form class="login-card" @submit.prevent="authFunc">
            <!-- NOTIFICATION REGISTER SUCCESSFULLY -->
            <NotifcationComponent :is-show="showSuccessNotification" />
            <!-- Logo -->
            <div class="text-center mb-4">
                <div class="flex-jc-ac">
                    <NuxtImg :src="`/others/logo.svg`" :width="40" :height="40" />
                    <NuxtImg class="ms-2" :src="`/others/logo-text-dark.svg`" :width="100" />
                </div>
                <div class="login-title mt-3">{{ template == 'login' ? 'Sign in' : 'Tạo tài khoản' }}</div>
            </div>

            <div v-if="template == 'register'" class="mb-3">
                <label for="name" class="form-label">Tên của bạn</label>
                <input type="text" id="name" name="name" v-model="name" class="form-control custom-input"
                    placeholder="" />
            </div>

            <!-- Email -->
            <div class="mb-3">
                <label class="form-label" for="email">Email</label>
                <input type="email" id="email" v-model="email" name="email" class="form-control custom-input"
                    placeholder="" />
            </div>

            <!-- Password -->
            <div class="mb-3 position-relative">
                <label class="form-label" for="password">Mật khẩu</label>
                <div class="position-relative">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" name="password"
                        class="form-control custom-input" autocomplete="true" />
                    <!-- <i class="bi bi-eye password-toggle" @click="showPassword = !showPassword"></i> -->
                    <BaseIconComponent :name="!showPassword ? `visibility` : `visibility-off`"
                        @click="showPassword = !showPassword" class="password-toggle" :color="`#6b7280`" :size="18" />
                </div>

                <!-- Password validation indicators (only show for register) -->
                <div v-if="template == 'register' && password.length > 0" class="password-validation mt-2">
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
            </div>

            <!-- Options -->
            <div v-if="template == 'login'" class="d-flex justify-content-between align-items-center mb-4">
                <div class="form-check">
                    <input class="form-check-input" v-model="remember" type="checkbox" id="remember" />
                    <label class="form-check-label" for="remember">
                        Ghi nhớ thiết bị này
                    </label>
                </div>
                <a href="#"></a>
                <NuxtLink class="forgot-link" to="/forgot-password">Quên mật khẩu?</NuxtLink>
            </div>

            <div v-else class="d-flex justify-content-start align-items-center mb-4">
                <div class="form-check">
                    <input class="form-check-input" v-model="isTruth" type="checkbox" id="accept" />
                    <label class="form-check-label" for="accept">
                        Tôi đồng ý với <a href="#" class="text-decoration-none">Điều khoản dịch vụ</a> và <a href="#"
                            class="text-decoration-none">Chính sách bảo mật</a> của CineLove
                    </label>
                </div>
            </div>

            <div v-if="errorMessage" class="mb-4">
                <p class="mb-0 text-danger">{{ errorMessage }}</p>
            </div>

            <!-- Button -->
            <button type="submit" class="btn btn-primary w-100 sign-in-btn"
                :disabled="sending || (template == 'register' && isTruth == false)">
                <span v-if="sending" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span v-else>{{ template == 'login' ? 'Sign in' : 'Đăng ký' }}</span>
            </button>

            <!-- Divider -->
            <div class="divider my-4">
                <span>Hoặc tiếp tục với</span>
            </div>

            <!-- Social login -->
            <div class="d-flex gap-3 mb-4">
                <button type="button" class="btn social-btn w-100" :disabled="sendingGoogle"
                    @click="loginWithSocial('google')">
                    <span v-if="sendingGoogle" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <div v-else class="flex-jc-ac">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
                        <span class="ms-2">Google</span>
                    </div>
                </button>
                <button type="button" class="btn social-btn w-100" :disabled="sendingFacebook"
                    @click="loginWithSocial('facebook')">
                    <span v-if="sendingFacebook" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <div v-else class="flex-jc-ac">
                        <BaseIconComponent :name="`facebook`" :type="`mdi`" :color="`#0866ff`" />
                        <span class="ms-2">Facebook</span>
                    </div>
                </button>
            </div>

            <!-- Footer -->
            <div v-if="template == 'login'" class="text-center register-text">
                Bạn chưa có tài khoản?
                <span @click="template = 'register'" class="mb-0 cursor-pointer">Tạo tài khoản</span>
            </div>
            <div v-else class="text-center register-text">
                Bạn đã có tài khoản?
                <span @click="template = 'login'" class="mb-0 cursor-pointer">Đăng nhập</span>
            </div>
        </form>
    </div>
</template>



<style scoped>
/* Overlay */
.login-overlay {
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 22px;
    overflow: hidden;
}

/* Card */
.login-card {
    width: 100%;
    max-width: none;
    background: #fff;
    padding: 24px 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    margin: auto;
    max-height: 90vh;
    overflow-y: auto;
}

@media (min-width: 768px) {
    .login-card {
        padding: 32px 36px;
        max-width: 500px;
        border-radius: 20px;
    }
}

@media (min-width: 1024px) {
    .login-card {
        max-width: 850px;
        width: 500px;
        padding: 48px 64px;
    }
}

/* Logo */
.brand-name {
    font-size: 20px;
    font-weight: 600;
}

@media (min-width: 768px) {
    .brand-name {
        font-size: 22px;
    }
}

.login-title {
    font-size: 14px;
    color: #64748b;
}

@media (min-width: 768px) {
    .login-title {
        font-size: 16px;
    }
}

/* Input */
.custom-input {
    height: 48px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    font-size: 15px;
}

.custom-input:focus {
    border-color: #ff8fa3;
    box-shadow: 0 0 0 2px rgba(255, 143, 163, 0.1);
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 6px;
}

/* Password toggle */
.password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    cursor: pointer;
    z-index: 5;
}

/* Links */
.forgot-link {
    font-size: 13px;
    color: #3a9bff;
    text-decoration: none;
    font-weight: 500;
}

.forgot-link:hover {
    text-decoration: underline;
}

/* Button */
.sign-in-btn {
    height: 50px;
    border-radius: 12px;
    font-size: 16px;
    background-color: #3a9bff;
    border-color: #3a9bff;
    box-shadow: 0 4px 6px -1px rgba(255, 143, 163, 0.2);
}

.sign-in-btn:hover:not(:disabled) {
    background-color: #ff768f;
    border-color: #ff768f;
}

.sign-in-btn:disabled {
    background-color: #cbd5e1;
    border-color: #cbd5e1;
    opacity: 0.8;
}

/* Divider */
.divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 400;
}

.divider::before,
.divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #f1f5f9;
}

.divider span {
    padding: 0 12px;
}

/* Social buttons */
.social-btn {
    height: 46px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #fff;
    transition: all .2s ease;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
}

.social-btn:hover:not(:disabled) {
    background-color: #f8fafc;
    border-color: #cbd5e1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.social-btn img {
    width: 18px;
    height: 18px;
}

/* Footer */
.register-text {
    font-size: 14px;
    color: #64748b;
}

.register-text span {
    color: #3a9bff;
    font-weight: 600;
}

.form-check-label {
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
}

/* Password validation */
.password-validation {
    font-size: 12px;
}

.validation-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.validation-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 11px;
    transition: all 0.2s ease;
}

.validation-badge.valid {
    background: #ecfdf5;
    color: #059669;
}

.strength-bar-container {
    width: 100%;
    height: 6px;
    background: #f1f5f9;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
}

.strength-bar {
    height: 100%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.strength-label {
    font-size: 11px;
    margin-top: 5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Custom Scrollbar for the card */
.login-card::-webkit-scrollbar {
    width: 4px;
}

.login-card::-webkit-scrollbar-track {
    background: transparent;
}

.login-card::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

@media (max-width: 768px) {

    .modal-container,
    .login-overlay {
        width: 100%;
    }
}
</style>
