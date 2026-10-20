<script setup lang="ts">
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

const email = ref('');
const loading = ref(false);
const sent = ref(false)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
    if (email.value.trim() == '') return console.log('Email is required!');

    loading.value = true;
    errorMessage.value = null
    // TODO: Implement actual API call here
    console.log('Reset password for:', email.value);

    try {
        await $fetch('/api/v1/auth/confirm-reset-password', {
            method: 'POST',
            body: {
                email: email.value
            }
        })

        sent.value = true

        setTimeout(() => {
            loading.value = false
            navigateTo('/')
        }, 3000)
    } catch (error: any) {
        console.log(error);
        errorMessage.value = error.data?.message
        loading.value = false
    }
};
</script>

<template>
    <div class="forgot-password-page">
        <div class="card border-none">
            <NotifcationComponent :is-show="sent" :message="`Kiểm tra email để đặt lại mật khẩu!`" />
            <div class="flex-jc-ac mb-3">
                <!-- Simple Logo Placeholder based on image -->
                <NuxtImg :src="`/others/logo.svg`" :width="35" :height="35" />
                <NuxtImg :src="`/others/logo-text-dark.svg`" class="ms-2" :width="90" />
            </div>

            <h2 class="title">Quên mật khẩu</h2>
            <p class="description">
                Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
            </p>

            <form @submit.prevent="handleSubmit" class="form-group">
                <div class="input-wrapper">
                    <label for="email" class="input-label">Email</label>
                    <input id="email" v-model="email" type="email" required class="input-field" placeholder="" />
                </div>

                <div v-if="errorMessage">
                    <p class="mb-0 text-danger">{{ errorMessage }}</p>
                </div>

                <button type="submit" class="submit-btn" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span v-else>Gửi link đặt lại mật khẩu</span>
                </button>
            </form>

            <div class="footer-link">
                <NuxtLink to="/" class="back-link">Quay lại trang chủ</NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Google Font Import if needed, but assuming system fonts or global fonts are adequate for now. 
   Using system fonts stack similar to common clean web apps. */

.forgot-password-page {
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
        /* Pinkish focus */
    }

    50% {
        background-position: 100% 50%;
        /* Bluish focus */
    }

    100% {
        background-position: 0% 50%;
        /* Bluish focus */
    }
}

.card {
    background: white;
    width: 100%;
    max-width: 380px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    text-align: center;
}

.heart-icon {
    width: 24px;
    height: 24px;
}

.brand-name {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #374151;
    /* Gray 700 */
    font-family: 'Check';
    /* Assuming a cursive font might be needed, but sticking to sans for logo text unless user has font setup */
}

.title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111827;
    /* Gray 900 */
    margin: 0 0 1rem 0;
}

.description {
    color: #6b7280;
    /* Gray 500 */
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 2rem;
    padding: 0 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.input-wrapper {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.input-field {
    width: 100%;
    padding: 0.6rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
    /* Important for padding */
}

.input-field:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.submit-btn {
    width: 100%;
    background-color: #3b82f6;
    /* Blue 500 */
    color: white;
    font-weight: 600;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.875rem;
}

.submit-btn:hover {
    background-color: #2563eb;
    /* Blue 600 */
}

.submit-btn:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}

.footer-link {
    font-size: 0.875rem;
}

.back-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
}

.back-link:hover {
    text-decoration: underline;
}
</style>