<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import ButtonCustomCompomnent from '../button/ButtonCustomCompomnent.vue';
import ViewWeddingCardDetail from '../dashboard/modal/ViewWeddingCardDetail.vue';

import { useFavoriteStore } from '~~/stores/favorite';

const props = defineProps({
    fitWidth: {
        type: Boolean,
        required: false,
        default: true
    },
    type: {
        type: String,
        default: 'premium' // 'premium' | 'basic'
    },
    image: {
        type: String,
        default: '/others/invitation-image.webp'
    },
    height: {
        type: Number,
        default: () => {
            return window.innerWidth < 992 ? 230 : 300
        }
    },
    card: {
        type: Object,
        default: () => ({})
    }
})

const favoriteStore = useFavoriteStore();
const isDetailOpen = ref(false);

const handleUse = (card: any) => {
    // Navigate to editor with this template
    const isMobile = window.innerWidth < 992;
    const prefix = isMobile ? '/editor/m' : '/editor';
    navigateTo(`${prefix}/${card.url}`);
}

const toggleFav = () => {
    if (props.card && props.card.id) {
        favoriteStore.toggleFavorite(props.card.id);
    }
}
</script>
<template>
    <div class="box" :style="{
        width: props.fitWidth ? '210px' : '100%',
        '--box-height': `${props.height}px`
    }">
        <div class="image">
            <NuxtImg :src="props.image" :width="210" class="w-100 h-auto d-block" />
        </div>
        <ButtonCustomCompomnent class="btn-type text-uppercase"
            :background="props.type === 'premium' ? `linear-gradient(135deg,#8b5cf6,#7c3aed)` : `#3b82f6`">
            {{ props.type }}
        </ButtonCustomCompomnent>
        <div class="control">
            <div class="position-absolute cursor-pointer" style="top: 10px; left: 10px; z-index: 10;"
                @click.stop="toggleFav">
                <BaseIconComponent
                    :name="favoriteStore.isFavorite(props.card.id) ? 'sharp-favorite' : 'sharp-favorite-border'"
                    :type="`ic`" :color="`#ff4d6d`" :size="30" />
            </div>

            <!-- TEAM HEART -->
            <div class="position-absolute d-flex flex-column gap-2 align-items-end" style="top: 10px; right: 10px;">
                <div class="stat-pill d-flex align-items-center gap-1" style="background-color: #ff4d6d;">
                    <BaseIconComponent :name="`cards-heart`" :type="`mdi`" :color="`#ffffff`" :size="14" />
                    <span class="fw-bold text-white lh-1" style="font-size: 11px;">{{ card.likes || 0 }}</span>
                </div>
                <div class="stat-pill d-flex align-items-center gap-1" style="background-color: #3b82f6;">
                    <BaseIconComponent :name="`eye`" :type="`mdi`" :color="`#ffffff`" :size="14" />
                    <span class="fw-bold text-white lh-1" style="font-size: 11px;">{{ card.views || 0 }}</span>
                </div>
            </div>

            <!-- VIEW SAMPLE -->
            <div class="position-absolute w-100 d-flex justify-content-center" style="bottom: 15px;">
                <ButtonCustomCompomnent @click="isDetailOpen = true"
                    class="btn-view-sample text-white fw-bold shadow-sm"
                    :background="`linear-gradient(135deg, #fa7f98, #e66f87)`">
                    Xem mẫu
                </ButtonCustomCompomnent>
            </div>
        </div>

        <ViewWeddingCardDetail v-model="isDetailOpen" :card="card" @use="handleUse" />
    </div>
</template>
<style scoped>
.box {
    height: var(--box-height);
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    transition: all .3s ease;
    cursor: pointer;
}

.image {
    position: relative;
    z-index: 1;
    transition: transform 1s ease-out;
    will-change: transform;
}

.box:hover .image {
    transition: all 5s ease-in-out;
    transform: translateY(calc(-100% + var(--box-height)));
    /* filter: brightness(0.9); */
}

.box:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.control {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    visibility: hidden;
    opacity: 0;
    background: rgba(0, 0, 0, 0.2);
    transition: all .3s ease;
    /* backdrop-filter: blur(2px); */
}

.box:hover .control {
    visibility: visible;
    opacity: 1;
}

.stat-pill {
    padding: 4px 10px;
    border-radius: 99px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 60px;
    justify-content: center;
}

.btn-view-sample {
    padding: 5px 6px;
    border-radius: 99px;
    font-size: 13px;
    border: none;
    min-width: 100px;
    opacity: .7;
}

.btn-type {
    font-size: 11px;
    font-weight: 700;
    line-height: 20px;
    padding: 1px 7px;
    border-radius: 10px;
    border: none;
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
    transition: all .3s ease;
    opacity: 1;
    visibility: visible;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box:hover .btn-type {
    transform: translateY(-15px);
    opacity: 0;
    visibility: hidden;
}
</style>