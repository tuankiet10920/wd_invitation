<script setup lang="ts">
import ButtonPinkComponent from '../button/ButtonPinkComponent.vue';
import InvitationCauroselComponent from '../invitation/InvitationCauroselComponent.vue';
import InvitationImageScrollBoxCompomnent from '../invitation/InvitationImageScrollBoxCompomnent.vue';

const breakpoints = {
    0: {
        slidesPerView: 2.1,
        spaceBetween: 10,
    },
    375: {
        slidesPerView: 2,
        spaceBetween: 23,
    },
    450: {
        slidesPerView: 2.6,
        spaceBetween: 25,
    },
    640: {
        slidesPerView: 3.2,
        spaceBetween: 25,
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
const templates = ref<any[]>([]);

const fetchTemplates = async () => {
    try {
        const response: any = await $fetch('/api/v1/client/card-template', {
            query: {
                is_template: true,
                limit: 12
            }
        });
        if (response && response.data && response.data.data) {
            templates.value = response.data.data;
        }
    } catch (error) {
        console.error("Failed to fetch templates:", error);
    }
}

const handleNavigate = (path: string) => {
    navigateTo(path);
}

onMounted(() => {
    fetchTemplates();
});
</script>
<template>
    <section class="template w-100">
        <div class="template-container">
            <h4 class="text-white fw-bold mb-2">Mẫu thiết kế phổ biến</h4>
            <InvitationCauroselComponent v-if="templates.length > 0" :breakpoints="breakpoints" :slides-per-view="7.4"
                :space-between="20" :watch-overflow="true">
                <swiper-slide v-for="item in templates" :key="item.id">
                    <InvitationImageScrollBoxCompomnent :fit-width="false" type="premium"
                        :image="`/images/wcards/IMAGE_WEDDING_CARD_${item.id}.png`" :card="item" />
                </swiper-slide>
            </InvitationCauroselComponent>
            <div class="d-flex justify-content-center w-100 btn-view-more position-relative" style="z-index: 5;">
                <ButtonPinkComponent :name="`Xem thêm mẫu thiết kế`" @click="handleNavigate('/templates')" />
            </div>
        </div>
    </section>
</template>
<style scoped>
.template {
    padding: 5px 0;
}

.btn-view-more {
    margin-top: 43px;
}

.template-container {
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
    .template {
        padding: 40px 0;
    }

    h4 {
        font-size: 1.5rem;
        padding-left: 0;
        text-align: left;
    }

    .template-container {
        width: 86%;
    }
}

@media (max-width: 375px) {
    h4 {
        font-size: 1.3rem !important;
        color: #fff !important;
        position: relative;
        z-index: 1000;
    }
}
</style>