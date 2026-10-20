<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

const router = useRouter();
</script>

<template>
    <div class="development-page d-flex flex-column align-items-center justify-content-center text-center p-5">
        <div class="icon-wrapper mb-4 animate-bounce">
            <BaseIconComponent name="settings" type="lucide" :size="80" color="#6c5ce7" />
        </div>
        <h2 class="fw-bold text-dark mb-3">Tính năng đang phát triển</h2>
        <p class="text-secondary mb-4 mx-auto" style="max-width: 500px; line-height: 1.6;">
            Chào bạn! Cảm ơn bạn đã quan tâm đến tính năng này. Hiện tại đội ngũ Cinelove đang nỗ lực hoàn thiện để mang đến cho bạn trải nghiệm tốt nhất. Hãy quay lại sau nhé!
        </p>
        <button class="btn btn-primary px-4 py-2 rounded-pill fw-medium d-flex align-items-center gap-2" @click="router.back()">
            <BaseIconComponent name="arrow-left" type="lucide" :size="18" color="white" />
            <span>Quay lại</span>
        </button>
    </div>
</template>

<style scoped>
.development-page {
    min-height: calc(100vh - 200px);
    background-color: #fff;
    border-radius: 24px;
    margin: 20px;
}

.icon-wrapper {
    background-color: #f3f0ff;
    padding: 30px;
    border-radius: 50%;
}

.btn-primary {
    background-color: #6c5ce7;
    border-color: #6c5ce7;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #5849c4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
}

@keyframes bounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
}

.animate-bounce {
    animation: bounce 3s ease-in-out infinite;
}
</style>
