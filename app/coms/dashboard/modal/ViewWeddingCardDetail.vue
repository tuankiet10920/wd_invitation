<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import QrcodeVue from 'qrcode.vue';
import { useRuntimeConfig } from '#app';
import { useUserStore } from '~~/stores/user';
import { useEditorStore } from '~~/stores/editor';
import { useFavoriteStore } from '~~/stores/favorite';

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
const favoriteStore = useFavoriteStore()

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

const isCardLimitReached = computed(() => {
    if (!store.isLogin || editorStore.role === 'admin' || store.role === 'admin') return false
    return store.isWebsiteLimitReached
})

const templateCode = computed(() => {
    if (props.card?.code) return props.card.code
    if (props.card?.id) return `C${props.card.id}`
    return 'C01'
})

const formatNumber = (num: any) => {
    const n = Number(num) || 0
    return n.toLocaleString('vi-VN')
}

const toggleSave = () => {
    if (props.card?.id) {
        favoriteStore.toggleFavorite(props.card.id)
    }
}

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

    // Effect handling - WrapperComponent expects animation string 
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
        rawEffect: props.card.effect,
        height: props.card.height || props.card.properties?.height || 1024
    };
})

const isUsing = ref(false)
const warningPulse = ref(false)

const handleUse = async () => {
    if (!store.isLogin && editorStore.role !== 'admin') {
        store.openModal = true
        isOpen.value = false
        return
    }

    if (!canUseTemplate.value) {
        const msg = `Mẫu này dành cho gói ${requiredPackageName.value} trở lên (Gói hiện tại của bạn: ${store.packageName || 'Free'})!`;
        editorStore.showNotification(msg, 'warning');
        warningPulse.value = true;
        setTimeout(() => { warningPulse.value = false; }, 600);
        return;
    }

    if (isCardLimitReached.value) {
        const msg = `Bạn đã đạt giới hạn tối đa ${store.currentWebsites}/${store.numberOfCards} trang thiệp của gói ${store.packageName || 'Free'}. Vui lòng nâng cấp gói hoặc xóa bớt trang cũ!`;
        editorStore.showNotification(msg, 'warning');
        warningPulse.value = true;
        setTimeout(() => { warningPulse.value = false; }, 600);
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
        <ModalZoomCenterComponent v-model="isOpen" :max-width="840">
            <div class="detail-container p-4">
                <!-- Header: Title + Code badge + Close button -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <h5 class="modal-title-text mb-0 fw-bold">Xem trước mẫu thiệp</h5>
                        <span class="code-badge">Mã mẫu {{ templateCode }}</span>
                    </div>
                    <button type="button" class="btn-close-top" @click="isOpen = false" aria-label="Đóng">
                        <BaseIconComponent name="x" type="lucide" :size="20" color="#6b7280" />
                    </button>
                </div>

                <!-- Main Content Row -->
                <div class="row g-4 main-content-row align-items-start">
                    <!-- Left Column: Phone Preview -->
                    <div class="col-12 col-md-5 d-flex justify-content-center">
                        <div class="phone-frame">
                            <div class="phone-content h-100 w-100 d-flex justify-content-center overflow-hidden"
                                v-if="cardData">
                                <WrapperComponent :card-data="cardData" :scale="0.528" container-height="100%"
                                    :active-bar="false" />
                            </div>
                            <div v-else class="h-100 d-flex align-items-center justify-content-center text-secondary small">
                                Chưa có nội dung bản xem trước
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Stats, Features, QR -->
                    <div class="col-12 col-md-7 d-flex flex-column">
                        <!-- Stats Row -->
                        <div class="stats-row d-flex align-items-center flex-wrap gap-3 pb-3 mb-3">
                            <div class="stat-item d-flex align-items-center gap-1">
                                <BaseIconComponent name="heart" type="lucide" :size="15" color="#6b7280" />
                                <strong class="text-dark">{{ formatNumber(card.likes) }}</strong>
                                <span class="text-muted">lượt thích</span>
                            </div>
                            <div class="stat-item d-flex align-items-center gap-1">
                                <BaseIconComponent name="eye" type="lucide" :size="15" color="#6b7280" />
                                <strong class="text-dark">{{ formatNumber(card.views) }}</strong>
                                <span class="text-muted">lượt xem</span>
                            </div>
                            <div class="stat-item d-flex align-items-center gap-1">
                                <BaseIconComponent name="edit-2" type="lucide" :size="14" color="#6b7280" />
                                <strong class="text-dark">{{ formatNumber(card.uses || card.views) }}</strong>
                                <span class="text-muted">lượt dùng</span>
                            </div>
                        </div>

                        <!-- Features List -->
                        <div class="features-section mb-4">
                            <div class="features-heading fw-bold mb-3">Dùng mẫu này để</div>
                            <div class="feature-row d-flex align-items-start gap-2 mb-2">
                                <BaseIconComponent name="check" type="lucide" :size="16" color="#6b7280" class="mt-1 flex-shrink-0" />
                                <span>Chỉnh sửa trực quan, không cần kinh nghiệm thiết kế</span>
                            </div>
                            <div class="feature-row d-flex align-items-start gap-2 mb-2">
                                <BaseIconComponent name="check" type="lucide" :size="16" color="#6b7280" class="mt-1 flex-shrink-0" />
                                <span>Gửi link cho khách qua Zalo, Messenger hoặc mạng xã hội</span>
                            </div>
                            <div class="feature-row d-flex align-items-start gap-2">
                                <BaseIconComponent name="check" type="lucide" :size="16" color="#6b7280" class="mt-1 flex-shrink-0" />
                                <span>Hiển thị đẹp trên điện thoại lẫn máy tính</span>
                            </div>
                        </div>

                        <!-- QR Box -->
                        <div class="qr-card d-flex align-items-center gap-3 p-3">
                            <div class="qr-box flex-shrink-0">
                                <qrcode-vue :value="getCardUrl" :size="88" level="H" render-as="svg" />
                            </div>
                            <div>
                                <div class="fw-bold text-dark mb-1" style="font-size: 14px;">Xem trên điện thoại</div>
                                <p class="text-muted mb-0" style="font-size: 13px; line-height: 1.45;">
                                    Quét mã bằng camera để mở mẫu đúng như khách mời sẽ thấy.
                                </p>
                            </div>
                        </div>

                        <!-- Package Warning if user's plan is lower than template's required plan or card limit reached -->
                        <div v-if="store.isLogin && (!canUseTemplate || isCardLimitReached)"
                            class="alert alert-warning d-flex align-items-center justify-content-between gap-2 py-2 px-3 mt-3 mb-0 rounded-3 small">
                            <div v-if="!canUseTemplate">
                                Mẫu này yêu cầu gói <strong>{{ requiredPackageName }}</strong> trở lên (Gói hiện tại: <strong>{{ store.packageName || 'Free' }}</strong>).
                            </div>
                            <div v-else>
                                Đã đạt giới hạn <strong>{{ store.currentWebsites }}/{{ store.numberOfCards }}</strong> trang thiệp của gói <strong>{{ store.packageName || 'Free' }}</strong>.
                            </div>
                            <button class="btn btn-sm btn-dark fw-bold text-nowrap rounded-pill px-3"
                                @click="isOpen = false; navigateTo('/pricing-plans')">
                                Nâng cấp
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer: Save button on left, Preview & Use buttons on right -->
                <div class="footer-actions d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4 pt-2">
                    <button type="button" class="btn-save-pill d-inline-flex align-items-center gap-2"
                        @click="toggleSave">
                        <BaseIconComponent
                            :name="favoriteStore.isFavorite(card.id) ? 'sharp-favorite' : 'sharp-favorite-border'"
                            type="ic"
                            color="#f43f5e"
                            :size="18" />
                        <span>{{ favoriteStore.isFavorite(card.id) ? 'Đã lưu' : 'Lưu mẫu' }}</span>
                    </button>

                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn-detail-pill d-inline-flex align-items-center gap-1"
                            @click="handleLivePreview">
                            <span>Xem chi tiết</span>
                            <BaseIconComponent name="arrow-right" type="lucide" :size="15" color="#111827" />
                        </button>
                        <button type="button" class="btn-use-pill"
                            :disabled="isUsing"
                            @click="handleUse">
                            {{ isUsing ? 'Đang xử lý...' : 'Dùng mẫu này' }}
                        </button>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.detail-container {
    background: #ffffff;
    border-radius: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    height: fit-content;
    position: relative;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14);
}

.modal-title-text {
    font-size: 18px;
    color: #111827;
}

.code-badge {
    background-color: #f3f4f6;
    color: #4b5563;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 6px;
}

.btn-close-top {
    border: none;
    background: transparent;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-close-top:hover {
    background-color: #f3f4f6;
}

.phone-frame {
    width: 280px;
    height: 520px;
    background: #ffffff;
    border-radius: 16px;
    border: 6px solid #f1f5f9;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    overflow: hidden;
    position: relative;
}

.phone-content {
    width: 100%;
    height: 100%;
}

.stats-row {
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
}

.stat-item strong {
    font-weight: 700;
    color: #111827;
}

.features-heading {
    font-size: 14px;
    color: #111827;
}

.feature-row {
    font-size: 13.5px;
    color: #4b5563;
    line-height: 1.5;
}

.qr-card {
    border: 1px solid #f1f5f9;
    border-radius: 14px;
    background-color: #ffffff;
}

.qr-box {
    background: #ffffff;
    padding: 4px;
    border-radius: 8px;
}

.btn-save-pill {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 8px 18px;
    font-size: 13.5px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-save-pill:hover {
    background: #fff1f2;
    border-color: #fecdd3;
}

.btn-detail-pill {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 9px 20px;
    font-size: 13.5px;
    font-weight: 600;
    color: #111827;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-detail-pill:hover {
    background: #f9fafb;
    border-color: #d1d5db;
}

.btn-use-pill {
    background: #111827;
    border: 1px solid #111827;
    border-radius: 999px;
    padding: 9px 22px;
    font-size: 13.5px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-use-pill:hover:not(:disabled) {
    background: #1f2937;
}

.btn-use-pill:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .detail-container {
        max-height: 90vh;
        border-radius: 18px;
    }

    .phone-frame {
        width: 260px;
        height: 460px;
    }
}
</style>
