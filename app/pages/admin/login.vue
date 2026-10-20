<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import type { FetchInterface } from "~~/interfaces"

definePageMeta({
    layout: 'blank'
})

const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const loading = ref(false)

const showPassword = ref(false)

// Ripple Effect Logic
const ripples = ref<{ id: number, x: number, y: number }[]>([])
let rippleIdCounter = 0

interface Data {
    email: string
    name: string,
    image: string
}

interface Response extends FetchInterface {
    data: Data
}

const spawnRipple = () => {
    const x = Math.random() * 100 // percent
    const y = Math.random() * 100 // percent
    const id = rippleIdCounter++

    ripples.value.push({ id, x, y })

    // Remove ripple after animation
    setTimeout(() => {
        ripples.value = ripples.value.filter(r => r.id !== id)
    }, 4000) // Match animation duration
}

onMounted(() => {
    // Spawn ripples periodically with some randomness
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to spawn
            spawnRipple()
        }
    }, 2000)
})

const handleLogin = async () => {
    errorMessage.value = null
    if (email.value.trim() == '' || password.value.trim() == '') errorMessage.value = "Username and password are required!"

    loading.value = true;
    try {
        const { data } = await $fetch<Response>('/api/v1/auth/login', {
            method: "POST",
            body: {
                email: email.value,
                password: password.value,
                remember: true,
                isAdmin: true
            }
        })
        console.log('data: ', data);
        navigateTo('/admin')
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.data?.message
        loading.value = false;
    }
}
</script>

<template>
    <div class="login-wrapper d-flex justify-content-center align-items-center vh-100 position-relative">
        <!-- Background Wallpaper with Animated Orbs -->
        <div class="position-absolute top-0 start-0 w-100 h-100 z-0 overflow-hidden bg-animated">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
            <div class="orb orb-4"></div>

            <!-- Ripples -->
            <div v-for="ripple in ripples" :key="ripple.id" class="ripple"
                :style="{ top: ripple.y + '%', left: ripple.x + '%' }"></div>
        </div>

        <!-- Login Card -->
        <div class="login-card bg-white rounded-4 shadow-lg d-flex flex-column flex-lg-row z-1 overflow-hidden">
            <!-- Left Side: Form -->
            <div class="card-left p-5 d-flex flex-column justify-content-center bg-white">
                <div class="w-100 mx-auto" style="max-width: 380px;">
                    <!-- Logo -->
                    <div class="text-center mb-5">
                        <NuxtImg src="/others/logo-ntkservices.png" width="90" height="90" class="mb-3" />
                        <h3 class="fw-bold animated-text mb-0">NTK SERVICES</h3>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="handleLogin">
                        <div class="mb-3 input-group-custom">
                            <span class="icon-wrapper">
                                <BaseIconComponent name="user" type="lucide" :size="20" />
                            </span>
                            <input type="text" class="form-control ps-5 py-3" placeholder="Your username or e-mail"
                                v-model="email" required autocomplete="on">
                        </div>

                        <!-- PASSWORD -->
                        <div class="mb-4 input-group-custom">
                            <span class="icon-wrapper">
                                <BaseIconComponent name="lock" type="lucide" :size="20" />
                            </span>
                            <input :type="showPassword ? 'text' : 'password'" class="form-control ps-5 py-3 pe-5"
                                placeholder="Your password" v-model="password" required autocomplete="on">
                            <button type="button"
                                class="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 text-decoration-none d-flex justify-content-center align-items-center"
                                @click="showPassword = !showPassword" style="z-index: 10;">
                                <BaseIconComponent :name="showPassword ? 'eye-off' : 'eye'" type="lucide" :size="20" />
                            </button>
                        </div>

                        <!-- ERROR MESSAGE -->
                        <div v-if="errorMessage" class="alert alert-danger mt-3">
                            {{ errorMessage }}
                        </div>
                        <!-- BUTTON SIGN IN -->
                        <div class="d-flex justify-content-center align-items-center mt-5">
                            <button type="submit" class="btn btn-login px-4 py-2 text-white" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                <span v-else>Sign in</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right Side: Image -->
            <div class="card-right position-relative d-none d-lg-block flex-grow-1">
                <NuxtImg src="/others/background-login-admin.webp" class="w-100 h-100 object-fit-cover" />

                <!-- Return Link Overlay -->
                <div class="position-absolute bottom-0 end-0 p-4 m-2">
                    <NuxtLink to="/"
                        class="text-white text-decoration-none d-flex align-items-center gap-2 return-link">
                        <span class="fs-5 fw-medium">Return to website</span>
                        <BaseIconComponent name="arrow-right" type="lucide" :size="20" :color="`#FFFFFF`" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-wrapper {
    background-color: #f0f2f5;
    /* Light gray fall back */
}

/* Animated Background Styles */
.bg-animated {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.6;
    animation: float 20s infinite ease-in-out;
    box-shadow: inset 10px 10px 30px rgba(255, 255, 255, 0.4),
        10px 10px 30px rgba(0, 0, 0, 0.1);
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(to right, #6a11cb, #2575fc);
    top: -50px;
    left: -50px;
    animation-delay: 0s;
}

.orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(to right, #ff9a9e, #fecfef);
    bottom: -100px;
    right: -50px;
    animation-delay: -5s;
    animation-duration: 25s;
}

.orb-3 {
    width: 200px;
    height: 200px;
    background: linear-gradient(to right, #84fab0, #8fd3f4);
    top: 40%;
    left: 20%;
    animation-delay: -10s;
    animation-duration: 18s;
}

.orb-4 {
    width: 250px;
    height: 250px;
    background: linear-gradient(to right, #4facfe, #00f2fe);
    bottom: 20%;
    left: 60%;
    animation-delay: -15s;
    animation-duration: 22s;
}

@keyframes float {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }

    25% {
        transform: translate(50px, 50px) rotate(45deg) scale(1.1);
    }

    50% {
        transform: translate(0, 100px) rotate(90deg) scale(1.2);
    }

    75% {
        transform: translate(-50px, 50px) rotate(135deg) scale(1.1);
    }
}

.login-card {
    width: 90%;
    max-width: 1000px;
    height: 600px;
    /* Fixed height for the card look */
    max-height: 90vh;
}

.card-left {
    flex: 0 0 45%;
    /* Typically form side is slightly narrower or equal */
}

@media (max-width: 991px) {
    .login-card {
        height: auto;
        max-width: 500px;
    }

    .card-left {
        flex: 1;
        padding: 3rem 2rem !important;
    }
}

/* Input Styles */
.input-group-custom {
    position: relative;
}

.icon-wrapper {
    position: absolute;
    top: 50%;
    left: 18px;
    transform: translateY(-50%);
    color: #6c757d;
    z-index: 5;
    pointer-events: none;
}

.form-control {
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 0.95rem;
    color: #495057;
}

.form-control:focus {
    box-shadow: none;
    border-color: #a0a0a0;
}

.form-control::placeholder {
    color: #adb5bd;
}

/* Button Styles */
.btn-login {
    background-color: #6b90c9;
    /* Slate blue/gray match */
    border: none;
    border-radius: 8px;
    /* Slightly more rounded */
    font-size: 1.05rem;
    font-weight: 600;
    width: 140px;
    /* Fixed width */
    height: 48px;
    /* Fixed height */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(102, 119, 144, 0.2);
}

.btn-login:hover {
    background-color: #1958ac;
    box-shadow: 0 6px 12px rgba(102, 119, 144, 0.3);
    transform: translateY(-1px);
}

.btn-login:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Animated Text */
.animated-text {
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 300% 100%;
    animation: rainbow_animation 6s ease-in-out infinite;
}

@keyframes rainbow_animation {

    0%,
    100% {
        background-position: 0 0;
    }

    50% {
        background-position: 100% 0;
    }
}

/* Return Link */
.return-link {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    opacity: 0.9;
    transition: all 0.2s;
}

.return-link:hover {
    opacity: 1;
    transform: translateX(3px);
}
</style>