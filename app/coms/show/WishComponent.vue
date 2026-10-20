<script setup lang="ts">
import { useEditorStore } from '~~/stores/editor';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    slug?: string;
    isTemplate?: boolean;
}>(), {
    isTemplate: false
})

const emit = defineEmits(['close'])

const route = useRoute()
const name = ref('')
const message = ref('')
const isSubmitting = ref(false)
const editorStore = useEditorStore()

const isTemplateMode = computed(() => props.isTemplate || (typeof route.path === 'string' && route.path.includes('/template/')))

const handleSubmit = async () => {
    if (!name.value.trim() || !message.value.trim()) return
    if (!props.slug) return

    if (isTemplateMode.value) {
        editorStore.showNotification('Đây là chế độ xem mẫu, không thể gửi lời chúc!', 'warning')
        name.value = ''
        message.value = ''
        emit('close')
        return
    }

    isSubmitting.value = true
    try {
        const response = await $fetch<any>('/api/v1/client/wish', {
            method: 'POST',
            body: {
                name: name.value,
                content: message.value,
                slug: props.slug
            }
        })

        if (response.success) {
            name.value = ''
            message.value = ''
            editorStore.showNotification('Cảm ơn bạn đã gửi lời chúc!', 'success')
            emit('close')
        }
    } catch (error) {
        console.error('Lỗi khi gửi lời chúc:', error)
        editorStore.showNotification('Có lỗi xảy ra, vui lòng thử lại sau.', 'error')
    } finally {
        isSubmitting.value = false
    }
}
</script>
<template>
    <div class="wish-overlay" @click.self="emit('close')">
        <div class="wish-card">
            <!-- Close button -->
            <button class="wish-close" @click="emit('close')">✕</button>

            <!-- Heart icon -->
            <div class="wish-heart-wrapper">
                <div class="wish-heart-bubble">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <!-- Floating mini hearts -->
                <span class="mini-heart mini-heart-1">💕</span>
                <span class="mini-heart mini-heart-2">💗</span>
                <span class="mini-heart mini-heart-3">💕</span>
            </div>

            <!-- Title -->
            <h5 class="wish-title">Lời chúc</h5>

            <!-- Form -->
            <div class="wish-form">
                <input v-model="name" type="text" class="wish-input" placeholder="Tên của bạn" />
                <textarea v-model="message" class="wish-textarea" placeholder="Lời chúc của bạn" rows="4"></textarea>
                <button class="wish-submit" @click="handleSubmit">Gửi Lời Chúc</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.wish-overlay {
    position: absolute;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
}

.wish-card {
    position: relative;
    width: 100%;
    background: linear-gradient(180deg, #fff5f7 0%, #ffffff 40%);
    border-radius: 20px 20px 0 0;
    padding: 50px 28px 32px;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    animation: wishSlideUp 0.3s ease;
}

@keyframes wishSlideUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.96);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.wish-close {
    position: absolute;
    top: 16px;
    right: 18px;
    background: none;
    border: none;
    font-size: 18px;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
}

.wish-close:hover {
    color: #999;
}

.wish-heart-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 8px;
}

.wish-heart-bubble {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #ff6b8a 0%, #ee5a7a 100%);
    border-radius: 16px 16px 16px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 6px 20px rgba(238, 90, 122, 0.35);
}

.mini-heart {
    position: absolute;
    font-size: 14px;
    animation: floatHeart 2s ease-in-out infinite;
}

.mini-heart-1 {
    top: -8px;
    left: -16px;
    animation-delay: 0s;
}

.mini-heart-2 {
    top: -12px;
    right: -18px;
    animation-delay: 0.5s;
}

.mini-heart-3 {
    top: 4px;
    right: -24px;
    font-size: 11px;
    animation-delay: 1s;
}

@keyframes floatHeart {

    0%,
    100% {
        transform: translateY(0);
        opacity: 0.7;
    }

    50% {
        transform: translateY(-6px);
        opacity: 1;
    }
}

.wish-title {
    font-weight: 700;
    font-size: 20px;
    color: #2d2d2d;
    margin: 12px 0 20px;
}

.wish-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.wish-input,
.wish-textarea {
    width: 100%;
    border: 1.5px solid #f0e0e4;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    color: #333;
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
}

.wish-input::placeholder,
.wish-textarea::placeholder {
    color: #c5a3ab;
}

.wish-input:focus,
.wish-textarea:focus {
    border-color: #ee5a7a;
}

.wish-textarea {
    min-height: 90px;
}

.wish-submit {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #ff6b8a 0%, #ee5a7a 100%);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(238, 90, 122, 0.3);
    margin-top: 4px;
}

.wish-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(238, 90, 122, 0.45);
}

.wish-submit:active {
    transform: translateY(0);
}
</style>