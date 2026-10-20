<script setup lang="ts">
import NewDesignComponent from '../mobiles/modals/NewDesignComponent.vue'

const isNewDesignOpen = ref(false)

const solutions = [
    {
        title: 'Kho mẫu thiệp đa dạng & tinh tế',
        desc: 'Hàng trăm mẫu thiệp cưới online được thiết kế chỉn chu, từ truyền thống trang nhã đến hiện đại cinematic, phù hợp với mọi phong cách và câu chuyện tình yêu.',
        icon: '✨'
    },
    {
        title: 'Cá nhân hoá theo cách của bạn',
        desc: 'Dễ dàng tuỳ chỉnh màu sắc, phông chữ, hình ảnh và nội dung để tạo nên một tấm thiệp cưới mang đậm dấu ấn cá nhân – không trùng lặp, không rập khuôn.',
        icon: '🎨'
    },
    {
        title: 'Chia sẻ nhanh – Trân trọng từng khách mời',
        desc: 'Gửi thiệp cưới điện tử chỉ trong vài giây qua Facebook, Messenger, Zalo hoặc bất kỳ nền tảng nào bạn muốn. Đặc biệt, bạn có thể <b>cá nhân hoá tên từng khách mời</b>, để mỗi người nhận đều cảm thấy được trân trọng và ghi nhớ.',
        icon: '🚀'
    }
]
</script>
<template>
    <div class="solution w-100">
        <div class="solution-container container">
            <div class="row align-items-center justify-content-between">
                <div class="col-12 col-lg-5 mb-5 mb-lg-0 left">
                    <h2 class="title fw-bold mb-0">CINELOVE - Nơi thiệp cưới trở thành kỷ niệm đáng nhớ</h2>
                    <p class="desc my-4">Cinelove mang đến giải pháp thiệp cưới online hiện đại, giúp bạn dễ dàng tạo
                        nên
                        những tấm thiệp
                        online độc đáo, đầy cảm xúc mà không cần kỹ năng thiết kế. Hãy để mỗi tấm thiệp kể câu chuyện
                        tình
                        yêu của riêng bạn!</p>
                    <div class="boxes">
                        <div class="box d-flex mb-4" v-for="(item, index) in solutions" :key="index">
                            <div class="icon me-3 d-flex justify-content-center align-items-center flex-shrink-0"
                                style="font-size: 1.5rem;">
                                {{ item.icon }}
                            </div>
                            <div class="content">
                                <p class="content-title text-white fw-bold mb-1">{{ item.title }}</p>
                                <p class="content-desc mb-0"
                                    style="font-size: 0.95rem; line-height: 1.5; color: #e0e4e7;" v-html="item.desc">
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="btn-create-card w-100 mt-3">
                        <button type="button" @click="isNewDesignOpen = true">Bắt đầu tạo thiệp</button>
                    </div>
                </div>
                <div class="col-12 col-lg-6 right">
                    <div class="image mx-auto mx-lg-0">
                        <NuxtImg src="/others/invitation-wedding.webp" class="image-big img-fluid" width="460"
                            height="400" alt="cinelove" />
                        <div class="float-image-1">
                            <NuxtImg src="https://assets.cinelove.me/images/ntro-image-2.webp"
                                class="image-small img-fluid" width="180" height="250" alt="cinelove" />
                        </div>
                        <div class="float-image-2">
                            <NuxtImg
                                src="https://assets.cinelove.me/images/cinelove-thiep-cuoi-online-hero-intro-2.webp"
                                class="image-small img-fluid" width="180" height="250" alt="cinelove" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NewDesignComponent v-model="isNewDesignOpen" />
    </div>
</template>
<style scoped>
button {
    background: linear-gradient(to right, rgb(255, 94, 98), rgb(255, 153, 102));
    border-radius: 30px;
    color: #fff;
    font-weight: 600;
    line-height: 20px;
    padding: 12px 24px;
    text-align: center;
    border: none;
    transition: all .3s ease-in-out;
}

.btn-create-card {
    display: flex;
    justify-content: start;
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px 0 rgb(255, 94, 98);
}

.title {
    font-size: 40px;
    margin-bottom: 20px;
    background: linear-gradient(to right, #ff9966, #ff5e62);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: normal;
}



.desc {
    font-size: 19px;
    line-height: 30px;
    color: #e0e4e7;
}

.content-title {
    font-size: 17px;
    line-height: 20px;
    font-weight: 600;
}

.content-desc {
    font-size: 15px;
    line-height: 22px;
    color: #e0e4e7;
}

.icon {
    width: 55px;
    min-width: 55px;
    height: 55px;
    border-radius: 50px;
    background-color: rgba(255, 255, 255, .1);
}

.image {
    width: fit-content;
    position: relative;
    max-width: 100%;
}

.float-image-1 {
    position: absolute;
    z-index: 2;
    top: 15px;
    left: 80%;
    width: 40%;
    /* Responsive width */
    max-width: 180px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    -webkit-transform: rotate(8deg);
    -ms-transform: rotate(8deg);
    transform: rotate(8deg);
    -webkit-animation: floating 5s ease-in-out infinite;
    animation: floating 5s ease-in-out infinite;
}

.float-image-2 {
    position: absolute;
    z-index: 3;
    top: 40%;
    left: 65%;
    width: 40%;
    /* Responsive width */
    max-width: 180px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
    -webkit-transform: rotate(-5deg);
    -ms-transform: rotate(-5deg);
    transform: rotate(-5deg);
    -webkit-animation: floating 6s ease-in-out 1s infinite;
    animation: floating 6s ease-in-out 1s infinite;
}

.image-small {
    border-radius: 15px;
    width: 100%;
    height: auto;
}

.image-big {
    border-radius: 20px;
    max-width: 100%;
    height: auto;
}

@keyframes floating {
    0% {
        transform: translateY(0) rotate(-5deg);
    }

    50% {
        transform: translateY(-15px) rotate(-2deg);
    }

    100% {
        transform: translateY(0) rotate(-5deg);
    }
}

@media (max-width: 768px) {
    .right {
        margin-top: 0px;
        margin-bottom: 40px;
    }

    .btn-create-card {
        justify-content: center;
    }

    .title {
        font-size: 32px;
        text-align: center;
    }

    .desc {
        font-size: 16px;
        line-height: normal;
        text-align: center;
    }

    .image-big {
        width: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transform: translate3d(0, 0, 0);
    }

    .float-image-1 {
        left: 65%;
        width: 38%;
    }

    .float-image-2 {
        left: 50%;
        width: 38%;
    }
}

@media (max-width: 576px) {
    .title {
        font-size: 32px !important;
        text-align: left;
    }

    .solution-container {
        width: 86%;
    }

    button {
        width: 100%;
    }

    .desc {
        text-align: left;
        line-height: 26px;
        font-size: 16px !important;
        text-align: justify;
    }

    .image-big {
        width: 95%;
        margin: 0 auto;
        display: flex;
        justify-self: center;
        height: 280px;
    }

    .float-image-1 {
        left: 58%;
        top: 10%;
        width: 45%;
        height: 190px;
    }

    .image-small {
        object-fit: cover;
        height: 190px;
    }

    .float-image-2 {
        left: 38%;
        top: 60%;
        width: 47%;
        height: 190px;
    }

    .solution {
        margin-bottom: 50px;
    }

    .content-title {
        font-size: 18px !important;
    }

    .content-desc {
        font-size: 17px !important;
    }
}
</style>