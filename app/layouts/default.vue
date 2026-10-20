<script setup>
import HeaderComponent from '~/coms/user/HeaderComponent.vue';
import FooterComponent from '~/coms/user/FooterComponent.vue';
import ButtonContactComponent from '~/coms/button/ButtonContactComponent.vue';
useHead({
    link: [
        {
            rel: 'stylesheet',
            href: '/css/index.css'
        },
        {
            rel: 'stylesheet',
            href: '/css/user_1.css'
        },
    ]
})
</script>
<template>
    <div class="background-layout-user">
        <div class="overlay-bg">
            <div class="overlay-bg-container">
                <div class="overlay-bg-container-top"></div>
                <div class="overlay-bg-container-middle"></div>
                <div class="overlay-bg-container-bottom"></div>
            </div>
        </div>
        <header>
            <div class="header-container">
                <HeaderComponent />
            </div>
        </header>
        <main>
            <slot />
        </main>
        <footer class="w-100">
            <FooterComponent />
        </footer>
        <ButtonContactComponent />
    </div>
</template>
<style scoped>
header {
    width: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, .9), rgba(0, 0, 0, .85) 15%, rgba(0, 0, 0, .8) 30%, rgba(0, 0, 0, .7) 45%, rgba(0, 0, 0, .5) 60%, rgba(0, 0, 0, .3) 75%, rgba(0, 0, 0, .1) 90%, rgba(0, 0, 0, 0));
    position: relative;
    z-index: 2;
}

.header-container {
    width: 88%;
    max-width: 1920px;
    margin: 0 auto;
}

.overlay-bg {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    height: 65rem;
}

.overlay-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.overlay-bg-container-top {
    height: 62.5rem;
    background: radial-gradient(circle at center, #f7f0f3, #e1d7dd, #ccc);
    transition: background-image .2s ease-in-out;
    filter: blur(16px);
    position: absolute;
    width: 100%;
    opacity: .16;
    mask-image: linear-gradient(rgb(217, 217, 217) 78.62%, rgba(115, 115, 115, 0));
}

.overlay-bg-container-middle {
    opacity: 75%;
    background: radial-gradient(92.16% 100% at 49.87% 0, rgba(247, 99, 107, .3) 19.86%, rgba(0, 0, 0, 0) 100%);
    position: absolute;
    height: 75rem;
    width: 100%;
}

.overlay-bg-container-bottom {
    background: radial-gradient(50% 100% at 50% 0, rgba(44, 66, 156, .15) 0, rgba(0, 0, 0, 0) 100%);
    position: absolute;
    height: 75rem;
    width: 100%;
}
</style>