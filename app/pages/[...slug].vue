<script setup lang="ts">
definePageMeta({
    layout: 'blank'
})
</script>

<template>
    <div class="error-page">
        <!-- Background Elements -->
        <div class="stars-bg"></div>

        <!-- Floating Objects -->
        <img src="/images/404/rocket.png" class="object rocket" alt="Rocket">
        <img src="/images/404/planet-purple.png" class="object planet-purple" alt="Purple Planet">
        <img src="/images/404/planet-orange.png" class="object planet-orange" alt="Orange Planet">
        <img src="/images/404/astronaut.png" class="object astronaut" alt="Astronaut">

        <!-- Main Content -->
        <div class="content">
            <div class="error-code-wrapper">
                <div class="error-code">
                    <span class="digit">4</span>
                    <div class="zero-moon">
                        <img src="/images/404/moon.png" alt="0">
                    </div>
                    <span class="digit">4</span>
                </div>
                <!-- Dynamic Ring -->
                <div class="ring-system">
                    <div class="ring"></div>
                </div>
            </div>

            <h2 class="title">OOOPSS...!!</h2>
            <h3 class="subtitle">It looks like you're lost...</h3>
            <p class="description">the page you are looking for no longer exists</p>

            <button @click="$router.back()" class="btn-home">
                <span>Quay lại trang trước</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');

.error-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #0b0d21 url('/images/404/bg.png') no-repeat center center;
    background-size: cover;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Nunito', sans-serif;
    color: white;
}

/* Objects Positioning */
.object {
    position: absolute;
    z-index: 1;
}

.rocket {
    width: 120px;
    top: 20%;
    left: 14%;
    transform: rotate(-45deg);
    animation: flight 20s linear infinite;
}

.planet-purple {
    width: 200px;
    bottom: -50px;
    left: -50px;
    opacity: 0.9;
}

.planet-orange {
    width: 150px;
    top: 10%;
    right: -30px;
}

.astronaut {
    width: 180px;
    bottom: 10%;
    right: 10%;
    animation: float 6s ease-in-out infinite;
}

/* Main Content */
.content {
    position: relative;
    z-index: 10;
    text-align: center;
}

.error-code-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
}

.error-code {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fredoka One', cursive;
    font-size: 180px;
    line-height: 1;
    position: relative;
    z-index: 2;
    text-shadow: 4px 4px 0px #2c3e50;
}

.digit {
    color: #fff;
    margin: 0 10px;
}

.zero-moon {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.zero-moon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: rotate 60s linear infinite;
}

/* Ring behind 404 */
.ring-system {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    width: 350px;
    height: 120px;
    z-index: 3;
    /* Matches the ring overlaping */
    pointer-events: none;
}

.ring {
    width: 100%;
    height: 100%;
    border: 15px solid #00a8ff;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(0, 168, 255, 0.5);
    position: relative;
}

/* To make the ring go *around* the numbers (behind and in front), 
   we usually need 3D or pseudo elements masking.
   Simple trick: z-index manipulation or just placing it visually.
   The user image shows the ring going *over* the left 4 and *behind* the right 4?
   Actually it looks like it goes over the whole text roughly.
   Let's keep it simple: Ring behind usually looks better for legibility, 
   but the image has it crossing.
*/

.ring-system {
    z-index: 1;
    /* Behind text */
}

.title {
    font-family: 'Fredoka One', cursive;
    font-size: 40px;
    margin-bottom: 10px;
    letter-spacing: 2px;
}

.subtitle {
    font-size: 24px;
    color: #f1c40f;
    /* Yellow */
    font-weight: 700;
    margin-bottom: 5px;
}

.description {
    font-size: 18px;
    color: #bdc3c7;
    margin-bottom: 30px;
}

.btn-home {
    display: inline-block;
    padding: 12px 30px;
    background: transparent;
    border: 2px solid white;
    color: white;
    font-weight: 700;
    text-decoration: none;
    border-radius: 50px;
    transition: all 0.3s ease;
}

.btn-home:hover {
    background: white;
    color: #0b0d21;
    transform: translateY(-2px);
}

/* Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(5deg);
    }

    50% {
        transform: translateY(-20px) rotate(-5deg);
    }
}

@keyframes flight {
    0% {
        transform: translate(0, 0) rotate(-45deg);
    }

    50% {
        transform: translate(20px, -20px) rotate(-40deg);
    }

    100% {
        transform: translate(0, 0) rotate(-45deg);
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .error-code {
        font-size: 100px;
    }

    .zero-moon {
        width: 90px;
        height: 90px;
    }

    .ring-system {
        width: 220px;
        height: 80px;
        border-width: 10px;
    }

    .title {
        font-size: 28px;
    }

    .subtitle {
        font-size: 18px;
    }

    .astronaut {
        width: 120px;
    }

    .planet-purple {
        width: 120px;
        bottom: -30px;
        left: -30px;
    }

    .planet-orange {
        width: 80px;
    }
}
</style>