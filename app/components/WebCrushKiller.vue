<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPopup = ref(true)
const noButton = ref<HTMLElement | null>(null)
const noButtonStyle = ref({
    top: '56%',
    left: '38%'
})

const showFormPopup = ref(false)
const reasonValue = ref('')

const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 150)
    const y = Math.random() * (window.innerHeight - 100)
    noButtonStyle.value = {
        top: `${y}px`,
        left: `${x}px`
    }
}

const handleAccept = () => {
    showFormPopup.value = true
}

const handleSubmit = () => {
    if (!reasonValue.value) return
    alert(`Tớ nhận được rồi nha! Lý do: ${reasonValue.value}. Cảm ơn cậu! ❤️`)
    showFormPopup.value = false
}
</script>

<template>
    <div class="crush-killer-wrapper">
        <!-- Background -->
        <NuxtImg src="/images/web/puung3.jpg" class="bg-image-tag" :quality="80" format="webp" />

        <!-- Nyan Cat (Top Left) -->
        <div class="nyan-cat-container" v-if="showFormPopup">
            <NuxtImg src="/images/web/giphy2.gif" class="nyan-cat" alt="Nyan Cat" />
        </div>

        <!-- Content -->
        <div class="content-overlay" v-if="!showPopup && !showFormPopup">
            <h1 class="main-title">Cậu yêu tớ có phải không nào ._.</h1>
            <p class="sub-title">Nếu cậu ko trả lời mà thoát ra tức là muốn làm vợ tớ rồi đó nha :v</p>

            <div class="buttons-container">
                <button ref="noButton" class="btn-no" :style="noButtonStyle" @mouseover="moveButton"
                    @click="moveButton">
                    Cậu mơ à
                </button>

                <button class="btn-yes" @click="handleAccept" v-html="`Yêu ơi là yêu <3`"></button>
            </div>
        </div>

        <!-- Initial Popup -->
        <Transition name="fade">
            <div v-if="showPopup" class="intro-popup-overlay">
                <div class="intro-popup-card">
                    <div class="cat-image-container">
                        <NuxtImg src="/images/web/cuteCat.jpg" alt="Cute Cat" class="cat-img" :width="400"
                            :height="250" />
                    </div>
                    <div class="popup-body">
                        <h2 class="popup-title">He luu cậu!</h2>
                        <p class="popup-text">Tớ có điều này muốn hỏi cậu nhớ phải trả lời thật lòng nhaaa.</p>
                        <button class="btn-ok" @click="showPopup = false">OK</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Form Popup -->
        <Transition name="fade">
            <div v-if="showFormPopup" class="intro-popup-overlay">
                <div class="intro-popup-card form-card">
                    <div class="popup-body">
                        <h2 class="popup-title mb-4">Lí do cậu thích tớ đi :vvvv</h2>
                        <div class="mb-4">
                            <input v-model="reasonValue" type="text" class="form-control custom-input"
                                placeholder="Whyyy" @keyup.enter="handleSubmit">
                        </div>
                        <button class="btn-submit" @click="handleSubmit" v-html="`Gửi cho tớ <3`"></button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Footer -->
        <div class="footer-text">
            Made with <span class="heart">💖</span> by Cinelove
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500;700&display=swap');

.crush-killer-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.bg-image-tag {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(15px);
    transform: scale(1.1);
    z-index: 1;
}

.nyan-cat-container {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1100;
    animation: slideIn 1s ease-out;
}

.nyan-cat {
    width: 400px;
}

.intro-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.intro-popup-card {
    background: #111d2b;
    width: 380px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.form-card {
    width: 500px;
    padding: 20px;
}

.cat-image-container {
    width: 100%;
    height: 250px;
}

.cat-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.popup-body {
    padding: 30px;
    text-align: center;
    color: #fff;
}

.popup-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 10px;
}

.popup-text {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 25px;
    opacity: 0.9;
}

.custom-input {
    background: #fff;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    text-align: center;
    width: 80%;
    margin: 0 auto;
}

.btn-ok {
    background: #6366f1;
    color: white;
    border: none;
    padding: 8px 40px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-submit {
    background: #f87171;
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
}

.btn-ok:hover {
    background: #4f46e5;
}

.content-overlay {
    position: relative;
    z-index: 2;
    text-align: center;
    width: 90%;
    max-width: 800px;
}

.main-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
    animation: fadeInDown 1s ease-out;
}

.sub-title {
    font-size: 1.1rem;
    color: #d63384;
    font-weight: 500;
    margin-bottom: 50px;
    animation: fadeIn 1.5s ease-out;
}

.buttons-container {
    position: relative;
    height: 200px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
}

.btn-no {
    position: fixed;
    padding: 10px 25px;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    transition: all 0.2s;
    z-index: 100;
}

.btn-yes {
    padding: 10px 25px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.footer-text {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
}

/* Animations */
@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slideIn {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .main-title {
        font-size: 2rem;
    }

    .intro-popup-card {
        width: 90%;
    }
}
</style>