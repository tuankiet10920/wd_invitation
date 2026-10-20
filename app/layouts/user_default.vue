<script setup lang="ts">
import HeaderComponent from '~/coms/user/HeaderComponent.vue';
import FooterComponent from '~/coms/user/FooterComponent.vue';
import ButtonContactComponent from '~/coms/button/ButtonContactComponent.vue';

const header = ref<HTMLElement | null>(null)

useHead({
    link: [
        {
            rel: 'stylesheet',
            href: '/css/index.css'
        },
        {
            rel: 'stylesheet',
            href: '/css/user_2.css'
        },
    ]
})
</script>
<template>
    <div>
        <header ref="header" class="w-100">
            <div class="container">
                <HeaderComponent />
            </div>
        </header>
        <div v-if="header" class="header-above" :style="{
            width: '100%',
            height: `${header.offsetHeight}px`
        }"></div>
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
    top: 0;
    position: fixed;
    background-color: #fff;
    z-index: 10;
    animation: shadow-reveal linear both;
    animation-timeline: scroll();
    animation-range: 0px 50px;
}

@keyframes shadow-reveal {
    from {
        box-shadow: none;
    }

    to {
        box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    }
}

footer {
    padding-bottom: 65px;
    padding-top: 30px;
}
</style>