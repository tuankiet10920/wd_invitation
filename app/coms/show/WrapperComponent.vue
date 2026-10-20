<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NodeImage from '~/components/NodeImage.vue';
import NodeText from '~/components/NodeText.vue';
import NodeCallNow from '~/components/NodeCallNow.vue';
import NodeCountDown from '~/components/NodeCountDown.vue';
import NodeMap from '~/components/NodeMap.vue';
import NodeGuestName from '~/components/NodeGuestName.vue';
import NodeQrBox from '~/components/NodeQrBox.vue';
import NodeYoutube from '~/components/NodeYoutube.vue';
import NodePhotoAlbum from '~/components/NodePhotoAlbum.vue';
import NodeEnvelope from '~/components/NodeEnvelope.vue';
import NodeCalendar from '~/components/NodeCalendar.vue';
import NodeAcceptInvitation from '~/components/NodeAcceptInvitation.vue';
import BadgeComponent from '~/coms/dashboard/childs/badge/BadgeComponent.vue';
import WishComponent from '~/coms/show/WishComponent.vue';
import GiftComponent from '~/coms/show/GiftComponent.vue';
import FallingEffectRenderer from '~/coms/effects/FallingEffectRenderer.vue';
import { useRoute } from 'vue-router';
import { provide, ref, onMounted, onUnmounted } from 'vue';
import LoveGiftComponent from '~/coms/dashboard/modal/LoveGiftComponent.vue';
import ToastNotificationComponent from '~/coms/editor/ToastNotificationComponent.vue';

const props = withDefaults(defineProps<{
    cardData: {
        background: string;
        nodes: any[];
        music?: {
            icon: string;
            color: string;
            path: string;
        } | null;
        height?: number;
        effect?: any;
        likes?: number;
    } | null;
    scale: number;
    fullscreen?: boolean;
    slug?: string;
    previewEffect?: string;
    containerHeight?: string;
    activeBar?: boolean;
    isTemplate?: boolean;
}>(), {
    fullscreen: false,
    containerHeight: 'calc(100vh - 100px)',
    activeBar: true,
    isTemplate: false
});

const isTemplateMode = computed(() => props.isTemplate || (typeof route.path === 'string' && route.path.includes('/template/')));

const invitorTokenData = ref<any>(null);
provide('invitorData', invitorTokenData);

const mainCardRef = ref<HTMLElement | null>(null);
const scrollAreaRef = ref<HTMLElement | null>(null);
const showWish = ref(false);
const showGift = ref(false);
const autoSelectFirstGift = ref(false);

const autoScrollActive = ref(false);
const scrollAnimationId = ref<number | null>(null);

const stopAutoScroll = () => {
    if (autoScrollActive.value) {
        autoScrollActive.value = false;
        if (scrollAnimationId.value) {
            cancelAnimationFrame(scrollAnimationId.value);
            scrollAnimationId.value = null;
        }
    }
};

const startAutoScroll = () => {
    if (autoScrollActive.value) return;

    // Begin scrolling 1 second after invoking
    setTimeout(() => {
        autoScrollActive.value = true;
        let lastTime = performance.now();

        const scrollStep = (time: number) => {
            if (!autoScrollActive.value || !scrollAreaRef.value) return;

            const el = scrollAreaRef.value;
            // Stop logic if reached bottom
            if (Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight) {
                autoScrollActive.value = false;
                return;
            }

            // Frame independence ~ 60px per second
            const delta = time - lastTime;
            lastTime = time;
            el.scrollTop += (60 / 1000) * delta;

            scrollAnimationId.value = requestAnimationFrame(scrollStep);
        };
        scrollAnimationId.value = requestAnimationFrame(scrollStep);
    }, 1000);
};

const openGift = (autoSelect = false) => {
    autoSelectFirstGift.value = autoSelect;
    showGift.value = true;
};

const route = useRoute();


const showLoveGift = ref(false);

const handleNodeClick = (type: string) => {
    if ((route.path.includes('/s/') || route.path.includes('/template/') || route.path.includes('/invite/')) && type === 'QrBox') {
        showLoveGift.value = true;
    } else if (!route.path.includes('/editor') && type === 'QrBox') {
        openGift(false);
    }
};

const coms: Record<string, any> = {
    Image: NodeImage,
    Text: NodeText,
    CallNow: NodeCallNow,
    CountDown: NodeCountDown,
    GuestName: NodeGuestName,
    QrBox: NodeQrBox,
    Map: NodeMap,
    Youtube: NodeYoutube,
    PhotoAlbum: NodePhotoAlbum,
    Envelope: NodeEnvelope,
    Calendar: NodeCalendar,
    AcceptInvitation: NodeAcceptInvitation
}

const isLiked = ref(false);
const localLikes = ref(0);
const isOpened = ref(false);
const isReady = ref(false);
const isOpeningDone = ref(false);
const openingImages = ref<{ left: string, right: string } | null>(null);

watch(() => props.cardData?.likes, (val) => {
    if (val !== undefined) localLikes.value = val;
}, { immediate: true });

const robustParse = (val: any) => {
    let res = val;
    while (typeof res === 'string' && (res.startsWith('{') || res.startsWith('[') || res.startsWith('"'))) {
        try {
            const parsed = JSON.parse(res);
            if (parsed === res) break;
            res = parsed;
        } catch (e) { break; }
    }
    return res;
};

const parsedEffect = computed(() => {
    let eff = props.cardData?.effect;
    if (!eff && (props.cardData as any)?.properties?.effect) {
        eff = (props.cardData as any).properties.effect;
    }
    return robustParse(eff) || { dynamic: 'none', falling: 'none', opening: { isCustom: false, slug: 'none' } };
});

watch(() => parsedEffect.value, async (val) => {
    const opening = val?.opening;
    if (opening && !opening.isCustom && opening.slug && opening.slug !== 'none') {
        try {
            const res: any = await $fetch(`/api/v1/client/effects/opening/${opening.slug}`);
            if (res.success && res.data) {
                const prefix = '/images/effects/opening_images/';
                openingImages.value = {
                    left: `${prefix}${res.data.image_left}`,
                    right: `${prefix}${res.data.image_right}`
                };

                // Clear any previous state
                isOpened.value = false;
                isReady.value = false;
                isOpeningDone.value = false;

                // Move curtains apart after 1s
                setTimeout(() => {
                    isOpened.value = true;
                    // Content is ready after curtains slide out (1.5s animation)
                    setTimeout(() => {
                        isReady.value = true;
                    }, 200);

                    // Unmount the opening effect entirely after the 1.5s animation completes 
                    setTimeout(() => {
                        isOpeningDone.value = true;
                        startAutoScroll();
                    }, 1500);
                }, 1000);
            }
        } catch (e) {
            console.error("Failed to fetch opening effect", e);
            openingImages.value = null;
            isReady.value = true;
            isOpeningDone.value = true;
            startAutoScroll();
        }
    } else {
        openingImages.value = null;
        isOpened.value = false;
        isReady.value = true;
        isOpeningDone.value = true;
        startAutoScroll();
    }
}, { immediate: true });

const handleLike = async () => {
    if (!props.slug) return;

    // 1. Get current likes from storage
    const likedStr = localStorage.getItem('wd_liked_cards');
    let likedObj: Record<string, boolean> = {};
    if (likedStr) {
        try { likedObj = JSON.parse(likedStr); } catch (e) {
            console.log(e);
        }
    }

    // 2. Check if already liked
    if (likedObj[props.slug]) {
        alert('Bạn đã thích thiệp cưới này rồi! Hãy gửi lời chúc cho chúng mình nhé.');
        return;
    }

    // 3. Update storage and local state
    likedObj[props.slug] = true;
    localStorage.setItem('wd_liked_cards', JSON.stringify(likedObj));
    isLiked.value = true;
    localLikes.value++;

    // 4. Increment likes in DB via API
    try {
        await $fetch('/api/v1/client/card-template/like', {
            method: 'POST',
            body: { slug: props.slug }
        });
    } catch (e) {
        console.error("Failed to sync like with server", e);
    }
};

const fetchFonts = async () => {
    try {
        // Only fetch if not already loaded globally
        if (document.getElementById('wd-font-loader')) return;

        const res: any = await $fetch('/api/v1/resources/fonts');
        if (res.success) {
            injectFonts(res.data);
        }
    } catch (e) {
        console.error("Failed to fetch fonts", e);
    }
};

const injectFonts = (categories: any[]) => {
    let css = '';
    categories.forEach(cat => {
        cat.fonts?.forEach((f: any) => {
            css += `
            @font-face {
                font-family: '${f.name}';
                src: url('${f.path}') format('woff2');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
            `;
        });
    });

    const styleId = 'wd-font-loader';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
};


const mobileScale = ref(1);

const updateMobileScale = () => {
    if (typeof window !== 'undefined') {
        const sw = window.innerWidth;
        if (sw < 500) {
            mobileScale.value = sw / 500;
        } else {
            mobileScale.value = 1;
        }
    }
};

onMounted(() => {
    if (props.slug) {
        const likedStr = localStorage.getItem('wd_liked_cards');
        if (likedStr) {
            try {
                const likedObj = JSON.parse(likedStr);
                isLiked.value = !!likedObj[props.slug];
            } catch (e) {
                console.log(e);
            }
        }
    }

    // FETCH INVITOR IF IN INVITE PAGE AND GUEST NAME NODE EXISTS
    if (route.path.includes('/invite/') && parsedNodes.value.some((n: any) => n.type === 'GuestName' || n.type === 'GuestName')) {
        const token = route.params.slug as string;
        if (token) {
            $fetch<any>(`/api/v1/client/invite/${token}`).then((res: any) => {
                if (res.success && res.data) {
                    invitorTokenData.value = res.data.invitor;
                }
            }).catch(e => console.error("Wrapper: Failed to fetch invitor", e));
        }
    }

    fetchFonts();

    if (props.fullscreen) {
        updateMobileScale();
        window.addEventListener('resize', updateMobileScale);
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateMobileScale);
    }
});

const parsedNodes = computed(() => {
    let nodes = props.cardData?.nodes;

    // Fallback to properties.nodes if root nodes is missing
    if (!nodes && (props.cardData as any)?.properties?.nodes) {
        nodes = (props.cardData as any).properties.nodes;
    }

    return robustParse(nodes) || [];
});

const dynamicEffect = computed(() => {
    if (props.previewEffect) return props.previewEffect;
    return parsedEffect.value.dynamic || 'none';
});

const fallingEffect = computed(() => {
    return parsedEffect.value.falling || 'none';
});

const parsedMusic = computed(() => {
    let music = props.cardData?.music;
    if (!music && (props.cardData as any)?.properties?.music) {
        music = (props.cardData as any).properties.music;
    }

    if (!music) return { icon: 'music-circle-outline', color: '#ffffff', path: '' };

    if (typeof music === 'string') {
        try {
            let res = music as any;
            while (typeof res === 'string' && (res.startsWith('{') || res.startsWith('"'))) {
                const parsed = JSON.parse(res);
                if (parsed === res) break;
                res = parsed;
            }
            return {
                icon: (res as any).icon || 'music-circle-outline',
                color: (res as any).color || '#ffffff',
                path: (res as any).path || ''
            };
        } catch (e) {
            return { icon: 'music-circle-outline', color: '#ffffff', path: '' };
        }
    }
    return {
        icon: music.icon || 'music-circle-outline',
        color: music.color || '#ffffff',
        path: music.path || ''
    };
});

const getMotionConfig = (index: number, styles: any) => {
    const effect = dynamicEffect.value;

    // Parse rotation from styles.transform to preserve it during v-motion overwrites
    let rotation = 0;
    if (styles?.transform) {
        const rotateMatch = styles.transform.match(/rotate\(([-\d.]+)deg\)/);
        if (rotateMatch && rotateMatch[1]) {
            rotation = parseFloat(rotateMatch[1]);
        }
    }

    if (effect === 'none' || !effect) {
        if (rotation !== 0) {
            return {
                initial: { rotate: rotation },
                visibleOnce: { rotate: rotation }
            };
        }
        return undefined;
    }

    if (effect === 'fade-in-all') {
        return {
            initial: { opacity: 0, rotate: rotation },
            visibleOnce: { opacity: 1, rotate: rotation, transition: { duration: 600, ease: 'easeOut', delay: 100 } }
        }
    }
    if (effect === 'slide-up-all') {
        return {
            initial: { opacity: 0, y: 50, rotate: rotation },
            visibleOnce: { opacity: 1, y: 0, rotate: rotation, transition: { duration: 600, ease: 'easeOut', delay: 100 } }
        }
    }
    if (effect === 'scale-in-all') {
        return {
            initial: { opacity: 0, scale: 0.8, rotate: rotation },
            visibleOnce: { opacity: 1, scale: 1, rotate: rotation, transition: { duration: 600, ease: 'easeOut', delay: 100 } }
        }
    }
    if (effect === 'flip-in-all') {
        return {
            initial: { opacity: 0, rotateX: 90, rotate: rotation },
            visibleOnce: { opacity: 1, rotateX: 0, rotate: rotation, transition: { duration: 800, ease: 'easeOut', delay: 100 } }
        }
    }
    if (effect === 'slide-up-mix') {
        return {
            initial: { opacity: 0, y: index % 2 === 0 ? 50 : -50, rotate: rotation },
            visibleOnce: { opacity: 1, y: 0, rotate: rotation, transition: { duration: 600, ease: 'easeOut', delay: 100 + (index % 3) * 150 } }
        }
    }
    if (effect === 'fade-in-mix') {
        return {
            initial: { opacity: 0, rotate: rotation },
            visibleOnce: { opacity: 1, rotate: rotation, transition: { duration: 600, ease: 'easeOut', delay: 100 + (index % 5) * 150 } }
        }
    }

    if (rotation !== 0) {
        return {
            initial: { rotate: rotation },
            visibleOnce: { rotate: rotation }
        };
    }
    return undefined;
}
</script>
<template>
    <!-- WRAPPER to hold the scaled space and enable scrolling -->
    <div class="card-wrapper position-relative mx-auto drop-shadow d-flex flex-column"
        :class="{ 'card-wrapper--fullscreen': fullscreen }" :style="!fullscreen ? {
            width: `${500 * scale}px`,
            height: containerHeight,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '8px'
        } : {
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        }">
        <!-- Inner scrollable area -->
        <div ref="scrollAreaRef" class="scroll-area w-100"
            style="flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: none;"
            @wheel="stopAutoScroll" @touchstart="stopAutoScroll" @mousedown="stopAutoScroll">

            <!-- Scaler Wrapper to fix empty scrolling space caused by transform: scale -->
            <div class="main-card-scaler" :style="!fullscreen ? {
                width: `${500 * scale}px`,
                height: `${(cardData?.height || 1024) * scale}px`,
                margin: '0 auto',
                overflow: 'hidden'
            } : {
                width: `${500 * mobileScale}px`,
                height: `${(cardData?.height || 1024) * mobileScale}px`,
                margin: '0 auto',
                overflow: 'hidden'
            }">

                <!-- MAIN CARD FRAME -->
                <div ref="mainCardRef" class="main-card overflow-hidden position-relative mx-auto"
                    :class="{ 'main-card--fullscreen': fullscreen, 'shadow-lg': !fullscreen }" :style="!fullscreen ? {
                        width: '500px',
                        height: `${cardData?.height || 1024}px`,
                        background: cardData?.background || '#fff',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                    } : {
                        width: '500px',
                        height: `${cardData?.height || 1024}px`,
                        background: cardData?.background || '#fff',
                        transform: `scale(${mobileScale})`,
                        transformOrigin: 'top left'
                    }">
                    <!-- Removed Opening Effect from main-card due to CSS transform bounding box -->

                    <template v-if="cardData && isReady">
                        <FallingEffectRenderer :effect-slug="fallingEffect" />
                        <component v-for="(item, index) in parsedNodes" :key="index" :is="coms[item.type]"
                            v-bind="item.props" :style="{
                                position: 'absolute',
                                ...item.styles,
                                zIndex: item.styles?.zIndex || 1
                            }" @click="handleNodeClick(item.type)"
                            v-motion="getMotionConfig(index as number, item.styles)" />
                    </template>
                    <div v-else-if="!cardData"
                        class="h-100 d-flex align-items-center justify-content-center text-muted">
                        Loading or Not Found...
                    </div>
                </div> <!-- END OF MAIN CARD -->
            </div> <!-- END OF SCALER -->
        </div> <!-- END OF SCROLL AREA -->

        <!-- Music Badge Fixed to Wrapper -->
        <div class="music-badge-wrapper position-absolute" :style="{
            top: '0px',
            right: '0px',
            zIndex: 50,
            transform: `scale(${fullscreen ? mobileScale : scale})`,
            transformOrigin: 'top right'
        }">
            <BadgeComponent v-if="cardData" :icon="parsedMusic.icon" :color="parsedMusic.color"
                :path="parsedMusic.path" />
        </div>

        <!-- Opening Effect (Overlay) -->
        <div v-if="openingImages && !isOpeningDone" class="opening-effect-container position-fixed h-100" :style="{
            zIndex: 99999,
            top: 0,
            left: 0,
            width: '100vw',
            pointerEvents: 'none'
        }">
            <!-- Left Door -->
            <div class="opening-door" :style="{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                backgroundColor: '#fff',
                backgroundImage: `url(${openingImages.left})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat',
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isOpened ? 'translateX(-100%)' : 'translateX(0)',
                boxShadow: isOpened ? 'none' : '5px 0 15px rgba(0,0,0,0.1)'
            }"></div>
            <!-- Right Door -->
            <div class="opening-door" :style="{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '50%',
                height: '100%',
                backgroundColor: '#fff',
                backgroundImage: `url(${openingImages.right})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'left center',
                backgroundRepeat: 'no-repeat',
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isOpened ? 'translateX(100%)' : 'translateX(0)',
                boxShadow: isOpened ? 'none' : '-5px 0 15px rgba(0,0,0,0.1)'
            }"></div>
        </div>

        <!-- VERTICAL TEXT -->
        <div class="vertical-text position-absolute">
            Made with Thiep Cuoi
        </div>

        <!-- BOTTOM ACTION BAR -->
        <div v-if="activeBar" style="z-index: 1000;"
            class="action-bar position-absolute bottom-0 start-50 d-flex align-items-center gap-3 mb-4" :style="{
                transform: `translateX(-50%) scale(${fullscreen ? mobileScale : scale})`,
                transformOrigin: 'bottom center',
                width: 'max-content'
            }">
            <!-- Gửi lời chúc -->
            <div class="action-pill bg-light text-muted d-flex align-items-center gap-2 px-3 py-2 cursor-pointer"
                @click="showWish = true">
                <BaseIconComponent name="message-text-outline" type="mdi" :size="20" color="#999" />
                <span class="fs-7 fw-bold">Gửi lời chúc...</span>
            </div>

            <div class="d-flex align-items-center gap-2">
                <!-- Bắn tim -->
                <div @click="openGift(true)"
                    class="action-pill heart-pill d-flex align-items-center gap-2 px-3 py-2 cursor-pointer text-white">
                    <BaseIconComponent name="hand-heart" type="mdi" :size="20" color="#fff" />
                    <span class="fs-7 fw-bold">Bắn tim</span>
                </div>

                <!-- Gift -->
                <div class="action-circle gift-circle d-flex align-items-center justify-content-center cursor-pointer shadow-sm"
                    @click="openGift(false)">
                    <BaseIconComponent name="gift" type="mdi" :size="24" color="#fff" />
                </div>

                <!-- Like -->
                <div @click="handleLike"
                    class="action-circle like-circle d-flex align-items-center justify-content-center cursor-pointer shadow-sm text-white position-relative"
                    :class="isLiked ? 'bg-danger animate-pulse' : 'bg-secondary'">
                    <BaseIconComponent :name="isLiked ? 'thumb-up' : 'thumb-up-outline'" type="mdi" :size="24"
                        color="#fff" />
                    <!-- Like Badge -->
                    <div v-if="localLikes > 0"
                        class="like-badge position-absolute top-0 end-0 translate-middle text-white fw-bold d-flex align-items-center justify-content-center rounded-circle"
                        style="width: 22px; height: 22px; font-size: 10px; background-color: #ff5e7e; border: 2px solid #fff; margin-top: 5px; margin-right: -16px;">
                        {{ localLikes }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Popups Canvas (Scaled perfectly to match main-card) -->
        <div class="popups-canvas position-absolute top-0 start-0 overflow-hidden"
            style="pointer-events: none; z-index: 1050;" :style="{
                width: '500px',
                height: `${100 / (fullscreen ? mobileScale : scale)}%`,
                transform: `scale(${fullscreen ? mobileScale : scale})`,
                transformOrigin: 'top left'
            }">

            <!-- Wish Popup -->
            <Transition name="wish-slide">
                <WishComponent v-if="showWish" :slug="slug" :is-template="isTemplateMode" @close="showWish = false" style="pointer-events: auto;" />
            </Transition>

            <!-- Gift Popup -->
            <Transition name="wish-slide">
                <GiftComponent v-if="showGift" :slug="slug" :is-template="isTemplateMode" :auto-select-first="autoSelectFirstGift"
                    @close="showGift = false" style="pointer-events: auto;" />
            </Transition>

            <!-- Love Gift Modal (QR Boxes) -->
            <LoveGiftComponent v-model="showLoveGift" :slug="slug" />
        </div>

        <!-- Toast Notification -->
        <ToastNotificationComponent />
    </div>
</template>
<style scoped>
.main-card {
    width: 500px;
    height: 1024px;
    border-radius: 4px;
}

.card-wrapper--fullscreen {
    width: 100vw !important;
    height: 100vh !important;
}

.main-card--fullscreen {
    border-radius: 0;
}

.vertical-text {
    right: -100px;
    top: 80%;
    transform: rotate(-90deg);
    transform-origin: 0 0;
    font-size: 12px;
    color: #999;
    letter-spacing: 1px;
}

.action-bar {
    z-index: 10;
}

.action-pill {
    border-radius: 50px;
    min-width: 160px;
    transition: all 0.2s ease;
}

.heart-pill {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
    box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
}

.action-circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    transition: transform 0.2s ease;
}

.action-circle:hover,
.action-pill:hover {
    transform: translateY(-2px);
}

.gift-circle {
    background: #ff6b6b;
}

.like-circle {
    background: #95a5a6 !important;
}

.cursor-pointer {
    cursor: pointer;
}

.fs-7 {
    font-size: 0.9rem;
}

.wish-slide-enter-active,
.wish-slide-leave-active {
    transition: all 0.35s ease;
}

.wish-slide-enter-from,
.wish-slide-leave-to {
    opacity: 0;
    transform: translateY(100%);
}
</style>