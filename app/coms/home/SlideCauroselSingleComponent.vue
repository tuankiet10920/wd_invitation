<script setup>
import ButtonPinkComponent from '../button/ButtonPinkComponent.vue'
import NewDesignComponent from '../mobiles/modals/NewDesignComponent.vue'

const isNewDesignOpen = ref(false)

const slides = [
    '/others/slider.webp',
    '/others/slider.webp',
    '/others/slider.webp',
]

const SPEED = 0.5 // pixels per frame for smooth animation

const slideCaurosel = ref(null)
let translateX = 0
let animationFrameId = null
let lastTimestamp = 0

const animation = (timestamp) => {
    if (!slideCaurosel.value) return

    // Calculate delta time for consistent animation speed
    if (!lastTimestamp) lastTimestamp = timestamp
    const deltaTime = timestamp - lastTimestamp
    lastTimestamp = timestamp

    const slideWidth = slideCaurosel.value.offsetWidth
    const totalWidth = slideWidth * slides.length

    // Update position based on delta time (60fps baseline)
    translateX += SPEED * (deltaTime / 16.67)

    // Reset position for seamless loop
    if (translateX >= slideWidth) {
        translateX = 0
    }

    // Apply transform with hardware acceleration
    slideCaurosel.value.style.transform = `translate3d(-${translateX}px, 0, 0)`

    // Continue animation
    animationFrameId = requestAnimationFrame(animation)
}

useHead({
    link: [
        {
            href: 'https://fonts.googleapis.com',
            rel: 'preconnect'
        },
        {
            href: 'https://fonts.gstatic.com',
            rel: 'preconnect',
            crossorigin: ''
        },
        {
            href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
            rel: 'stylesheet'
        },
    ]
})

onMounted(() => {
    if (slides.length > 1) {
        animationFrameId = requestAnimationFrame(animation)
    }
})

onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
})
</script>
<template>
    <div class="caurosel">
        <!-- SVG clipPath definition - only once -->
        <svg width="0" height="0" style="position:absolute;">
            <defs>
                <clipPath id="curvedBottom" clipPathUnits="objectBoundingBox">
                    <path d="M 0,0 L 1,0 L 1,0.95 Q 1,1 0.98,1 Q 0.5,0.9 0.02,1 Q 0,1 0,0.95 Z" />
                </clipPath>
            </defs>
        </svg>

        <div class="caurosel-container">
            <div class="slides" ref="slideCaurosel">
                <div class="slide" v-for="(item, index) in slides" :key="index">
                    <img :src="item" :alt="`Cinelove ${index + 1}`">
                </div>
            </div>
            <div class="caurosel-overlay"></div>
            <div class="content text-center">
                <p class="text-title mb-0 text-uppercase">cinelove</p>
                <p class="text-title">Make your love story</p>
                <p class="text-desc">Hãy để Cinelove giúp bạn kể câu chuyện tình yêu qua từng tấm thiệp – mang đầy
                    cảm
                    xúc như một thước
                    phim lãng mạn</p>
                <div class="d-flex justify-content-center w-100 mt-4">
                    <ButtonPinkComponent class="button-pink" :name="`Bắt đầu`" @click="isNewDesignOpen = true" />
                </div>
            </div>
        </div>

        <NewDesignComponent v-model="isNewDesignOpen" />
    </div>
</template>
<style scoped>
* {
    font-family: "Inter", sans-serif;
}

.caurosel {
    width: 100%;
    position: relative;
}

.caurosel-container {
    width: 95.5%;
    max-width: 1920px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    z-index: 1;
    clip-path: url('#curvedBottom');
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    position: relative;
    mask-image: -webkit-radial-gradient(white, black);
}

.content {
    position: absolute;
    left: 50%;
    bottom: 18%;
    transform: translateX(-50%);
    z-index: 3;
    max-width: 700px;
    width: 90%;
    padding: 0 20px;
}

.caurosel-overlay {
    position: absolute;
    width: calc(100%);
    height: calc(100%);
    background: linear-gradient(1turn, rgba(0, 0, 0, .84) 31.45%, rgba(0, 0, 0, .65) 75%, rgba(0, 0, 0, .55) 84.5%);
    right: 0;
    bottom: 0;
    z-index: 2;
    border-top-left-radius: 20px;
}

.slides {
    width: 100%;
    display: flex;
    position: relative;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.slide {
    flex: 0 0 100%;
    height: 700px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}

.slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.text-title {
    color: #fff;
    font-size: 48px;
    font-weight: 900;
    line-height: 1.2;
}

.text-desc {
    color: #fff;
    font-size: 17px;
    line-height: 27px;
    text-align: center;
    margin: 0 10px;
}

.text-title:first-child {
    letter-spacing: 3px;
}

.button-pink {
    justify-self: center;
    margin-top: 20px;
}

/* Responsive Styles */

/* Tablet and below (max-width: 1024px) */
@media (max-width: 1024px) {
    .caurosel-container {
        width: 96%;
        border-radius: 16px;
    }

    .slide {
        height: 480px;
    }

    .content {
        bottom: 15%;
        max-width: 600px;
    }

    .text-title {
        font-size: 40px;
    }

    .text-desc {
        font-size: 16px;
        line-height: 24px;
        margin: 0 30px;
    }
}

/* Mobile landscape and below (max-width: 768px) */
@media (max-width: 768px) {
    .caurosel-container {
        width: 94%;
        border-radius: 12px;
    }

    .slide {
        height: 480px;
    }

    .content {
        bottom: 19%;
        max-width: 500px;
        padding: 0 15px;
    }

    .text-title {
        font-size: 32px;
    }

    .text-desc {
        font-size: 15px;
        line-height: 22px;
        margin: 0 20px;
    }

    .button-pink {
        margin-top: 15px;
    }

    .caurosel::before {
        box-shadow: -10px 8px 150px 8px rgb(143, 74, 87);
    }
}

/* Mobile portrait (max-width: 480px) */
@media (max-width: 480px) {
    .caurosel-container {
        width: 86%;
        border-radius: 10px;
    }

    .slide {
        height: 450px;
    }

    .content {
        bottom: 20%;
        padding: 0;
    }

    .text-title {
        font-size: 24px !important;
        margin-bottom: 8px;
    }

    .text-title:first-child {
        letter-spacing: 2px;
        font-size: 20px;
    }

    .text-desc {
        font-size: 15px !important;
        line-height: 20px;
        margin: 20px 0px;
        text-align: center;
    }

    .button-pink {
        margin-top: 12px;
    }

    .caurosel::before {
        box-shadow: -8px 6px 100px 6px rgb(143, 74, 87);
    }
}

/* Very small mobile (max-width: 360px) */
@media (max-width: 360px) {
    .slide {
        height: 400px;
    }

    .text-title {
        font-size: 30px;
    }

    .text-title:first-child {
        font-size: 18px;
    }

    .text-desc {
        font-size: 12px;
        line-height: 18px;
        margin: 0 5px;
    }
}
</style>