<script setup lang="ts">
import InvitationCauroselComponent from '../invitation/InvitationCauroselComponent.vue';
import InvitationImageBoxComponent from '../invitation/InvitationImageBoxComponent.vue';
import ButtonPinkComponent from '../button/ButtonPinkComponent.vue';

const { data: response } = await useFetch<any>('/api/v1/client/card-template', {
    query: {
        is_template_user: true,
        is_publish: true,
        limit: 12
    }
});

const items = computed(() => response.value?.data?.data || []);

const breakpoints = {
    0: {
        slidesPerView: 2.1,
        spaceBetween: 10,
    },
    375: {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    450: {
        slidesPerView: 2.6,
        spaceBetween: 12,
    },
    640: {
        slidesPerView: 3.2,
        spaceBetween: 15,
    },
    768: {
        slidesPerView: 4.2,
        spaceBetween: 20,
    },
    1024: {
        slidesPerView: 5.2,
        spaceBetween: 20,
    },
    1200: {
        slidesPerView: 6.2,
        spaceBetween: 20,
    },
    1350: {
        slidesPerView: 7.2,
        spaceBetween: 20,
    },
    1500: {
        slidesPerView: 7.8,
        spaceBetween: 20,
    },
    1600: {
        slidesPerView: 8,
        spaceBetween: 20,
    },
}
</script>
<template>
    <section class="irc w-100" v-if="items.length > 0">
        <div class="irc-container">
            <h4 class="text-white fw-bold mb-2">Thiệp từ khách hàng thực tế</h4>
            <InvitationCauroselComponent :breakpoints="breakpoints" :slides-per-view="6.4" :space-between="20"
                :watch-overflow="true">
                <swiper-slide v-for="item in items" :key="item.id">
                    <InvitationImageBoxComponent :item="item" />
                </swiper-slide>
            </InvitationCauroselComponent>
            <div class="d-flex justify-content-center w-100 mt-5">
                <ButtonPinkComponent :name="`Xem thêm thiệp đã thực hiện`"
                    @click="navigateTo('/thiep-cuoi/khach-hang')" />
            </div>
        </div>
    </section>
</template>
<style scoped>
.irc {
    padding: 60px 0;
}

.irc-container {
    width: 95.5%;
    max-width: 1920px;
    margin: 0 auto;
}

h4 {
    font-size: 2rem;
}

swiper-slide {
    padding-top: 20px;
}

/* Tablet and Mobile adjustments */
@media (max-width: 768px) {
    .irc {
        padding: 40px 0;
    }

    h4 {
        font-size: 1.3rem !important;
        text-align: left;
    }

    .irc-container {
        width: 86%;
    }

}

@media (max-width: 375px) {
    h4 {
        font-size: 1.25rem;
    }
}
</style>