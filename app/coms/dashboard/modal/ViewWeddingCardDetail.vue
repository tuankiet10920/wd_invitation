<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import QrcodeVue from 'qrcode.vue';
import { useRuntimeConfig } from '#app';
import { useUserStore } from '~~/stores/user';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    card: {
        type: Object,
        default: () => ({})
    }
})

const configs = useRuntimeConfig()
const emits = defineEmits(['update:modelValue', 'use'])
const isOpen = ref(props.modelValue)
const store = useUserStore()
const editorStore = useEditorStore()

const PACKAGE_LEVELS: Record<string, number> = {
    free: 1,
    basic: 2,
    pro: 3,
    premium: 4,
}

const requiredPackageName = computed(() => {
    const raw = props.card?.package?.name || props.card?.type || 'Free'
    return String(raw).charAt(0).toUpperCase() + String(raw).slice(1).toLowerCase()
})

const requiredPackageLevel = computed(() => {
    const key = requiredPackageName.value.toLowerCase()
    return PACKAGE_LEVELS[key] || Number(props.card?.id_package) || 1
})

const userPackageLevel = computed(() => {
    if (editorStore.role === 'admin' || store.role === 'admin') return 99
    return Number(store.packageLevel) || PACKAGE_LEVELS[(store.packageName || 'free').toLowerCase()] || 1
})

const canUseTemplate = computed(() => {
    if (!store.isLogin) return true
    return userPackageLevel.value >= requiredPackageLevel.value
})

watch(() => props.modelValue, async (val) => {
    isOpen.value = val
    if (val && store.isLogin) {
        await store.fetchPlan()
    }
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const getCardUrl = computed(() => {
    if (!props.card.url) return '';
    const baseUrl = configs.public.env == "production" ? configs.public.siteUrl : configs.public.urlLocalHost
    return `${baseUrl}/template/${props.card.url}`;
})

const cardData = computed(() => {
    if (!props.card) return null;

    let nodes = props.card.nodes || [];
    if (typeof nodes === 'string') {
        try {
            nodes = JSON.parse(nodes);
        } catch (e) {
            nodes = [];
        }
    }

    if (props.card.properties && props.card.properties.nodes) {
        nodes = props.card.properties.nodes;
    }

    // Prepare music
    let music = props.card.music;
    if (typeof music === 'string') {
        try {
            music = JSON.parse(music);
        } catch (e) {
            music = null;
        }
    }

    // Effect handling - WrapperComponent expects animaion string 
    const eff = props.card.effect;
    let animationEffect = 'none';

    if (typeof eff === 'string') {
        try {
            const effObj = JSON.parse(eff);
            animationEffect = effObj.dynamic || 'none';
        } catch (e) {
            animationEffect = eff; // assume simple string for legacy
        }
    } else if (typeof eff === 'object' && eff !== null) {
        animationEffect = eff.dynamic || 'none';
    }

    return {
        background: props.card.background || '#ffffff',
        nodes: nodes,
        music: music,
        effect: animationEffect,
        rawEffect: props.card.effect, // passing raw for other renders like falling 
        height: props.card.height || props.card.properties?.height || 1024
    };
})

const isUsing = ref(false)

const handleUse = async () => {
    if (!store.isLogin && editorStore.role !== 'admin') {
        store.openModal = true
        isOpen.value = false
        return
    }

    if (!canUseTemplate.value) {
        const msg = `Mẫu này dành cho gói ${requiredPackageName.value} trở lên (Gói hiện tại của bạn: ${store.packageName || 'Free'})!`;
        editorStore.showNotification(msg, 'warning');
        return;
    }

    if (isUsing.value) return;
    isUsing.value = true;

    try {
        const response = await $fetch<any>('/api/v1/client/card-template', {
            method: 'POST',
            body: {
                name: `Mẫu-${props.card.name}`,
                template_id: props.card.id,
                properties: {
                    nodes: props.card.nodes,
                    background: props.card.background,
                    music: props.card.music,
                    effect: props.card.effect,
                    height: props.card.height || 1024
                }
            }
        });

        if (response.success && response.data?.url) {
            isOpen.value = false;

            const url = response.data.url;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
            const targetPath = isMobile ? `/editor/m/${url}` : `/editor/${url}`;

            navigateTo(targetPath);
        } else {
            const errMsg = response.message || "Không thể sử dụng mẫu này.";
            editorStore.showNotification(errMsg, 'warning');
        }
    } catch (e: any) {
        console.error("Failed to clone template", e);
        const errMsg = e?.data?.message || "Có lỗi xảy ra khi tạo thiệp. Vui lòng thử lại sau.";
        editorStore.showNotification(errMsg, 'error');
    } finally {
        isUsing.value = false;
    }
}

const handleLivePreview = () => {
    if (getCardUrl.value) {
        window.open(getCardUrl.value, '_blank');
    }
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen" :max-width="900">
            <div class="detail-container">
                <!-- Close Button (Heart circle top-left on Desktop) -->
                <button class="btn-like d-none d-md-flex" @click="isOpen = false">
                    <BaseIconComponent name="heart-outline" type="mdi" :size="24" class="text-secondary" />
                </button>

                <!-- Mobile Header Stats -->
                <div class="modal-header-mobile d-flex d-md-none justify-content-between p-3">
                    <button class="btn-heart-mobile" @click="isOpen = false">
                        <BaseIconComponent name="heart-outline" type="mdi" :size="28" class="text-danger" />
                    </button>
                    <div class="bar-love">
                        <div class="badge-stat badge-like">
                            <BaseIconComponent name="heart" type="mdi" :size="16" color="#FFFFFF" />
                            <span>{{ card.likes }}</span>
                        </div>
                        <div class="badge-stat badge-view">
                            <BaseIconComponent name="eye" type="mdi" :size="16" color="#FFFFFF" />
                            <span>{{ card.views }}</span>
                        </div>
                    </div>
                </div>

                <div class="row g-0 main-content-row">
                    <!-- Left Column: Phone Mockup -->
                    <div class="col-md-5 d-flex align-items-center mt-2 justify-content-center p-4 left-panel">
                        <div class="phone-frame">
                            <div class="phone-content h-100 w-100 d-flex justify-content-center overflow-hidden"
                                v-if="cardData">
                                <WrapperComponent :card-data="cardData" :scale="0.528" container-height="100%"
                                    :active-bar="false" />
                            </div>
                            <div v-else class="h-100 d-flex align-items-center justify-content-center text-secondary">
                                Chưa có nội dung bản xem trước
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Info & Actions -->
                    <div class="col-md-7 p-3 p-md-5 detail-panel d-flex flex-column">
                        <!-- Stat Badges (Desktop Only) -->
                        <div class="d-none d-md-flex justify-content-between align-items-center gap-2 mb-4">
                            <span class="badge rounded-pill px-3 py-2 fw-bold text-uppercase"
                                :class="{
                                    'bg-success': requiredPackageName.toLowerCase() === 'free',
                                    'bg-primary': requiredPackageName.toLowerCase() === 'basic',
                                    'bg-warning text-dark': requiredPackageName.toLowerCase() === 'pro',
                                    'bg-purple text-white': requiredPackageName.toLowerCase() === 'premium'
                                }">
                                Gói {{ requiredPackageName }}
                            </span>
                            <div class="d-flex gap-2">
                                <div class="badge-stat badge-like">
                                    <BaseIconComponent name="heart" type="mdi" :size="16" color="#FFFFFF" />
                                    <span>{{ card.likes }}</span>
                                </div>
                                <div class="badge-stat badge-view">
                                    <BaseIconComponent name="eye" type="mdi" :size="16" color="#FFFFFF" />
                                    <span>{{ card.views }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Features (Hidden on mobile) -->
                        <div class="feature-list mb-auto d-none d-md-block">
                            <div class="feature-item">
                                <span class="feature-label">Chuyên nghiệp:</span>
                                <span class="feature-desc">Thiết kế đẹp mắt, phù hợp nhiều phong cách</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-label">Dễ dàng:</span>
                                <span class="feature-desc">Chỉnh sửa trực quan, không cần kinh nghiệm</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-label">Tiện lợi:</span>
                                <span class="feature-desc">Chia sẻ ngay qua mạng xã hội hoặc tin nhắn</span>
                            </div>
                        </div>

                        <!-- Cảnh báo gói nếu gói hiện tại thấp hơn gói yêu cầu của mẫu -->
                        <div v-if="store.isLogin && !canUseTemplate"
                            class="alert alert-warning d-flex align-items-center justify-content-between gap-2 py-2 px-3 mb-3 rounded-3 small">
                            <div>
                                🔒 Mẫu này yêu cầu gói <strong>{{ requiredPackageName }}</strong> trở lên (Gói hiện tại: <strong>{{ store.packageName || 'Free' }}</strong>).
                            </div>
                            <button class="btn btn-sm btn-primary fw-bold text-nowrap rounded-pill px-3"
                                @click="isOpen = false; navigateTo('/pricing-plans')">
                                Nâng cấp
                            </button>
                        </div>

                        <!-- Actions -->
                        <div class="d-flex gap-2 gap-md-3 mb-4 mb-md-5 justify-content-center mt-3 mt-md-0">
                            <button class="btn btn-outline-secondary btn-action" @click="handleLivePreview">
                                Xem trực tiếp
                            </button>
                            <button class="btn btn-primary btn-action btn-main"
                                :class="{ 'opacity-75': store.isLogin && !canUseTemplate }"
                                @click="handleUse">
                                {{ store.isLogin && !canUseTemplate ? `Yêu cầu gói ${requiredPackageName}` : 'Dùng mẫu này' }}
                            </button>
                        </div>

                        <!-- QR Section -->
                        <div class="qr-section text-center">
                            <div class="qr-wrapper mx-auto mb-3">
                                <qrcode-vue :value="getCardUrl" :size="120" level="H" render-as="svg" />
                            </div>
                            <p class="qr-text mb-4">Quét mã QR để xem trên điện thoại</p>
                        </div>

                        <!-- Close Button Mobile -->
                        <button
                            class="btn btn-close-mobile d-md-none d-flex align-items-center justify-content-center gap-2"
                            @click="isOpen = false">
                            <BaseIconComponent name="close" type="mdi" :size="20" />
                            <span>Đóng</span>
                        </button>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.bg-purple {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.detail-container {
    background: #fff;
    border-radius: 30px;
    overflow-y: auto;
    overflow-x: hidden;
    height: fit-content;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.modal-header-mobile {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    background: transparent;
    pointer-events: none;
}

.modal-header-mobile * {
    pointer-events: auto;
}

.bar-love {
    display: flex;
    gap: 5px;
    flex-direction: column;
    align-items: end;
}

.btn-heart-mobile {
    border: none;
    background: transparent;
    padding: 0;
    height: fit-content;
}

.btn-like {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    z-index: 10;
    transition: transform 0.2s;
}

.btn-like:hover {
    transform: scale(1.05);
}

.left-panel {
    background: #f8f9fa;
    border-right: 1px solid #eee;
}

.phone-frame {
    width: 280px;
    height: 560px;
    background: #fff;
    border-radius: 3;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    overflow: hidden;
    /* border: 8px solid #333; */
    position: relative;
}

.phone-content {
    width: 100%;
    height: 100%;
}

.detail-panel {
    background: #fff;
}

.badge-stat {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 6px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 13px;
    color: #fff;
}

@media (max-width: 768px) {
    .badge-stat span {
        font-size: 12px !important;
    }
}

.badge-like {
    background: #ff5e7e;
}

.badge-view {
    background: #4a90e2;
}

.feature-list {
    margin-top: 20px;
}

.feature-item {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 1.5;
}

.feature-label {
    font-weight: 700;
    color: #333;
    margin-right: 5px;
}

.feature-desc {
    color: #666;
}

.btn-action {
    flex: 1;
    border-radius: 10px;
    padding: 10px 15px;
    font-weight: 600;
    font-size: 14px;
}

.btn-main {
    background-color: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

.btn-main:hover {
    background-color: #2563eb;
    border-color: #2563eb;
}

.btn-outline-secondary {
    border-color: #ccc;
    color: #333;
    background: #fff;
}

.qr-section {
    padding-top: 15px;
}

.qr-wrapper {
    background: #fff;
    display: inline-block;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 10px;
}

.qr-text {
    font-size: 14px;
    color: #888;
    margin: 0;
}

.btn-close-mobile {
    width: 100%;
    background: #f1f3f5;
    border: none;
    padding: 14px;
    border-radius: 12px;
    font-weight: 600;
    color: #495057;
    transition: background 0.2s;
}

.btn-close-mobile:active {
    background: #e9ecef;
}

@media (max-width: 768px) {
    .detail-container {
        height: 90vh;
        border-radius: 20px;
    }

    .main-content-row {
        height: auto !important;
    }

    .left-panel {
        background: transparent;
        border-right: none;
        padding: 15px !important;
    }

    .phone-frame {
        width: 260px;
        height: 500px;
        /* border: 4px solid #333; */
    }

    .detail-panel {
        padding-top: 5px !important;
    }
}
</style>
