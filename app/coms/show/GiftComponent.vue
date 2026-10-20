<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEditorStore } from '~~/stores/editor'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<{
    autoSelectFirst?: boolean
    slug?: string
    isTemplate?: boolean
}>(), {
    autoSelectFirst: false,
    slug: '',
    isTemplate: false
})

const emit = defineEmits(['close', 'play-gift'])

const route = useRoute()
const editorStore = useEditorStore()
const isTemplateMode = computed(() => props.isTemplate || (typeof route.path === 'string' && route.path.includes('/template/')))

const gifts = ref<any[]>([])
const selectedGift = ref<number | null>(null)

const selectedGiftItem = computed(() => {
    return gifts.value.find(g => g.id === selectedGift.value)
})

const giftCanvasRef = ref<HTMLCanvasElement | null>(null);
let svgaDownloader: any = null;
let svgaParser: any = null;
let svgaPlayer: any = null;
const isPlaying = ref(false);

const playGiftAnim = async (fileName: string) => {
    try {
        if (typeof window === 'undefined') return;
        
        isPlaying.value = true;

        if (!svgaDownloader) {
            const svga = await import('svga.lite');
            svgaDownloader = new svga.Downloader();
            svgaParser = new svga.Parser();
        }
        if (!svgaPlayer && giftCanvasRef.value) {
            const svga = await import('svga.lite');
            svgaPlayer = new svga.Player(giftCanvasRef.value);
            svgaPlayer.set({ loop: 2 });
            svgaPlayer.$on('end', () => {
                svgaPlayer.clear();
                isPlaying.value = false;
            });
        }

        const fileData = await svgaDownloader.get(`/images/gifts/${fileName}`);
        const svgaData = await svgaParser.do(fileData);
        await svgaPlayer.mount(svgaData);
        svgaPlayer.start();
    } catch (error) {
        console.error('SVGA Play Error:', error);
        isPlaying.value = false;
    }
};

const selectGift = (gift: any) => {
    selectedGift.value = gift.id;
    if (gift.file) {
        emit('play-gift', gift.file);
        playGiftAnim(gift.file);
    }
}

const name = ref('')
const giftMessage = ref('')
const showConfirmModal = ref(false)
const selectedAvatarIndex = ref(0)
const customAvatarUrl = ref<string | null>(null)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const nameInputRef = ref<HTMLInputElement | null>(null)

const presetAvatars = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo'
]

const selectedAvatarUrl = computed(() => {
    if (customAvatarUrl.value) return customAvatarUrl.value
    return presetAvatars[selectedAvatarIndex.value] || userAvatar.value || '/images/default-avatar.png'
})

const fetchGifts = async () => {
    try {
        const response = await $fetch<any>('/api/v1/client/gifts')
        if (response.success && response.data) {
            gifts.value = response.data.data || []
            if (props.autoSelectFirst && gifts.value.length > 0 && selectedGift.value === null) {
                selectGift(gifts.value[0])
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách quà:', error)
    }
}

const userAvatar = ref<string | null>(null)
const fetchCardInfo = async () => {
    if (!props.slug) return;
    try {
        const response = await $fetch<any>(`/api/v1/client/cards/${props.slug}`);
        if (response.success && response.data && response.data.User && response.data.User.avatar) {
            userAvatar.value = response.data.User.avatar.startsWith('http')
                ? response.data.User.avatar
                : `/images/avatars/${response.data.User.avatar}`; // Adjust path if needed, fallback to direct path
        }
    } catch (error) {
        console.error('Lỗi tải thông tin thiệp:', error);
    }
}

onMounted(() => {
    fetchGifts()
    fetchCardInfo()
})

const handleSend = () => {
    if (!name.value.trim() || !selectedGift.value) {
        alert('Vui lòng nhập tên và chọn quà!');
        return;
    }
    showConfirmModal.value = true;
}

const handlePaymentSubmit = () => {
    if (isTemplateMode.value) {
        editorStore.showNotification('Đây là chế độ xem mẫu, không thể tặng quà!', 'warning');
        showConfirmModal.value = false;
        name.value = '';
        emit('close');
        return;
    }

    const transferCode = 'SEVQRGIFT' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const amountVnd = (selectedGiftItem.value?.price || 0) * 10 || 13140;

    const paymentData = {
        code: transferCode,
        amount: amountVnd,
        giftName: selectedGiftItem.value?.name,
        senderName: name.value,
        message: giftMessage.value,
        avatar: selectedAvatarUrl.value,
        slug: props.slug,
        backUrl: window.location.href
    };

    $fetch('/api/v1/client/payment/create', {
        method: 'POST',
        body: paymentData
    }).catch(e => console.error('Failed to register payment on server', e));

    if (typeof window !== 'undefined') {
        sessionStorage.setItem('sepay_payment_data', JSON.stringify(paymentData));
    }

    showConfirmModal.value = false;
    emit('close');

    navigateTo({
        path: '/payment',
        query: {
            code: transferCode,
            amount: amountVnd,
            gift: selectedGiftItem.value?.name,
            sender: name.value,
            slug: props.slug
        }
    });
}

const triggerAvatarUpload = () => {
    avatarInputRef.value?.click();
}

const handleAvatarFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            customAvatarUrl.value = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
}

const focusNameInput = () => {
    nameInputRef.value?.focus();
}

const formatCurrency = (val: number) => {
    return val.toLocaleString('vi-VN');
}
</script>

<template>
    <div class="gift-overlay" @click.self="emit('close')">
        <!-- SVGA Canvas -->
        <canvas v-show="isPlaying" ref="giftCanvasRef" class="gift-canvas pointer-events-none"></canvas>

        <!-- GIFT CARD -->
        <div class="gift-card">
            <!-- GIFT BACKGROUND -->
            <div v-if="selectedGiftItem && isPlaying" :key="selectedGiftItem.id" class="gift-preview-banner">
                <div class="preview-bg-wrapper">
                    <img v-if="selectedGiftItem.background" :src="`/images/gift_bg/${selectedGiftItem.background}`"
                        class="preview-bg" alt="GIFT BG" />
                    <div class="preview-content">
                        <div class="preview-avatar">
                            <!-- preview-avatar-->
                            <img :src="userAvatar ? userAvatar : '/images/default-avatar.png'" alt="Avatar"
                                onerror="this.src='https://ui-avatars.com/api/?name=User&background=random&color=fff'" />
                        </div>
                        <div class="preview-text">
                            <span class="preview-name">{{ name ? name : '[Tên bạn]' }}</span>
                            <span class="preview-message">Gửi {{ selectedGiftItem.name }}</span>
                        </div>
                    </div>
                </div>
                <img v-if="selectedGiftItem.image" :src="`/images/gift_images/${selectedGiftItem.image}`"
                    class="preview-img" alt="GIFT IMG" />
            </div>

            <!-- Close button -->
            <button class="gift-close" @click="emit('close')">✕</button>

            <!-- Title -->
            <div class="gift-header">
                <h5 class="gift-title">Tặng Quà</h5>
                <div class="title-underline">
                    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 2C8.5 7 15.5 7 21.5 2" stroke="#f25767" stroke-width="3" stroke-linecap="round" />
                    </svg>
                </div>
            </div>

            <!-- Gift List Container (Scrollable) -->
            <div class="gift-list-wrapper">
                <div class="gift-list">
                    <div v-for="gift in gifts" :key="gift.id" class="gift-item"
                        :class="{ 'is-selected': selectedGift === gift.id }" @click="selectGift(gift)">
                        <!-- Image wrapper -->
                        <div class="gift-image-wrapper">
                            <img v-if="gift.image" :src="`/images/gift_images/${gift.image}`" :alt="gift.name"
                                class="gift-image" />
                        </div>
                        <div class="gift-name">{{ gift.name }}</div>
                        <div class="gift-price">
                            {{ gift.price }}
                            <!-- Coin icon -->
                            <svg class="coin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#FFC107" />
                                <circle cx="12" cy="12" r="7" fill="#FFD54F" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Section -->
            <div class="gift-footer">
                <p class="footer-prompt">Hãy để những món quà xinh đẹp này mang niềm vui bất ngờ đến với kiet nguyen nha
                </p>
                <div class="footer-actions">
                    <input v-model="name" type="text" class="name-input" placeholder="Tên của bạn" />
                    <button class="send-btn" @click="handleSend">Gửi</button>
                </div>
            </div>
        </div>

        <!-- CONFIRMATION MODAL -->
        <Teleport to="body">
            <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="showConfirmModal = false">
                <div class="confirm-modal-card">
                    <!-- Title -->
                    <h5 class="confirm-title">Xác nhận gửi quà</h5>

                    <!-- Banner Header -->
                    <div class="confirm-banner">
                        <div class="banner-avatar">
                            <img :src="selectedAvatarUrl" alt="Avatar" />
                        </div>
                        <div class="banner-info">
                            <span class="banner-name">{{ name }}</span>
                            <span class="banner-action">tặng {{ selectedGiftItem?.name || 'quà' }}</span>
                        </div>
                        <div class="banner-graphic">
                            <span class="paw-icon">🐾</span>
                        </div>
                    </div>

                    <!-- Gift Details Box -->
                    <div class="gift-info-box">
                        <div class="info-gift-name">{{ selectedGiftItem?.name }}</div>
                        <div class="info-gift-price">
                            <span>{{ selectedGiftItem?.price || 0 }}</span>
                            <svg class="coin-icon-lg" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#FFC107" />
                                <circle cx="12" cy="12" r="7" fill="#FFD54F" />
                            </svg>
                        </div>
                        <div class="info-converted-price">
                            ≈ {{ formatCurrency((selectedGiftItem?.price || 0) * 10) }}đ
                        </div>
                    </div>

                    <!-- Sender Input -->
                    <div class="confirm-form-group">
                        <label class="confirm-label">Người gửi</label>
                        <div class="sender-input-wrapper">
                            <input ref="nameInputRef" v-model="name" type="text" class="confirm-input" placeholder="Tên người gửi" />
                            <button type="button" class="btn-edit-name" @click="focusNameInput">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Sửa tên
                            </button>
                        </div>
                    </div>

                    <!-- Message Optional -->
                    <div class="confirm-form-group">
                        <label class="confirm-label">Tin nhắn (tùy chọn)</label>
                        <textarea v-model="giftMessage" class="confirm-textarea" maxlength="100" placeholder="Nhập lời nhắn cho người nhận..."></textarea>
                        <div class="char-counter">{{ giftMessage.length }} / 100</div>
                    </div>

                    <!-- Avatar Selector -->
                    <div class="confirm-form-group">
                        <label class="confirm-label">Ảnh đại diện</label>
                        <div class="avatar-selector-row">
                            <label v-for="(avatar, idx) in presetAvatars" :key="idx" class="avatar-option" :class="{ 'is-selected': selectedAvatarIndex === idx && !customAvatarUrl }">
                                <input type="radio" name="confirm-avatar" :value="idx" v-model="selectedAvatarIndex" @change="customAvatarUrl = null" class="avatar-radio" />
                                <img :src="avatar" alt="Avatar" class="avatar-img" />
                            </label>
                            <div class="avatar-upload-btn" :class="{ 'is-selected': !!customAvatarUrl }" @click="triggerAvatarUpload" title="Tải ảnh lên">
                                <img v-if="customAvatarUrl" :src="customAvatarUrl" class="avatar-img" />
                                <span v-else>+</span>
                            </div>
                            <input ref="avatarInputRef" type="file" accept="image/*" class="d-none" @change="handleAvatarFileChange" />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="confirm-actions">
                        <button type="button" class="btn-cancel" @click="showConfirmModal = false">Huỷ</button>
                        <button type="button" class="btn-submit-payment" @click="handlePaymentSubmit">Thanh toán</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.gift-overlay {
    position: absolute;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
}

.gift-canvas {
    position: absolute;
    top: 22%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 10000;
    pointer-events: none;
}

.gift-card {
    position: relative;
    width: 100%;
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
    animation: giftSlideUp 0.3s ease;
    z-index: 10001;
}

.gift-preview-banner {
    position: absolute;
    bottom: 100%;
    left: -10px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 55px;
    z-index: 10002;
    animation: bannerSlideIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes bannerSlideIn {
    0% {
        transform: translateX(-150%);
        opacity: 0;
    }

    70% {
        transform: translateX(5%);
        opacity: 1;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.preview-bg-wrapper {
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-bg {
    height: 100%;
    object-fit: contain;
    width: 100%;
    opacity: .7;
}

.preview-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: 0 10px 0 20px;
    z-index: 1;
}

.preview-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    margin-right: 8px;
    flex-shrink: 0;
    overflow: hidden;
    border: 1px solid #fff;
}

.preview-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
}

.preview-name {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.2;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}

.preview-message {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    margin-top: 2px;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}

.preview-img {
    position: absolute;
    bottom: 4px;
    right: -10px;
    width: 90px;
    height: 90px;
    object-fit: contain;
    z-index: 2;
}

@keyframes giftSlideUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.96);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.gift-close {
    position: absolute;
    top: 16px;
    right: 18px;
    background: none;
    border: none;
    font-size: 18px;
    color: #ccc;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
    z-index: 10;
}

.gift-close:hover {
    color: #999;
}

.gift-header {
    text-align: center;
    padding: 24px 20px 16px;
}

.gift-title {
    font-weight: 700;
    font-size: 20px;
    color: #f25767;
    margin: 0;
}

.title-underline {
    margin-top: 6px;
    display: flex;
    justify-content: center;
}

.gift-list-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    max-height: 180px;
}

/* Custom scrollbar */
.gift-list-wrapper::-webkit-scrollbar {
    width: 6px;
}

.gift-list-wrapper::-webkit-scrollbar-track {
    background: transparent;
}

.gift-list-wrapper::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 10px;
}

.gift-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px 8px;
    padding-bottom: 24px;
}

.gift-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 8px 4px;
    border-radius: 12px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.gift-item:hover {
    background: #fff5f7;
}

.gift-item.is-selected {
    background: #fff0f4;
    border: 1px solid #ffccda;
}

.gift-item.is-selected .gift-image-wrapper {
    transform: scale(1.05);
}

.gift-image-wrapper {
    width: 60px;
    height: 60px;
    background: #fdf0f3;
    border-radius: 12px;
    margin-bottom: 8px;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.gift-image {
    width: 80%;
    height: 80%;
    object-fit: contain;
}

.gift-name {
    font-size: 12px;
    color: #555;
    text-align: center;
    margin-bottom: 6px;
    line-height: 1.2;
}

.gift-price {
    font-size: 13px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 4px;
}

.coin-icon {
    vertical-align: middle;
}

.gift-footer {
    background: #fff;
    padding: 16px 20px 24px;
    border-top: 1px solid #f5f5f5;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.04);
    z-index: 5;
}

.footer-prompt {
    font-size: 13px;
    color: #888;
    text-align: center;
    margin: 0 0 16px 0;
    line-height: 1.4;
}

.footer-actions {
    display: flex;
    gap: 12px;
}

.name-input {
    flex: 1;
    border: 1px solid #f25767;
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 15px;
    color: #333;
    outline: none;
    background: #fff;
    text-align: center;
    width: 50%;
}

.name-input::placeholder {
    color: #999;
}

.send-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 50px;
    background: #f25767;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    text-align: center;
    width: 50%;
}

.send-btn:hover {
    background: #e04b6b;
}

.send-btn:active {
    transform: translateY(1px);
}

/* Confirm Gift Modal Styles */
.confirm-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10005;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.confirm-modal-card {
    position: relative;
    width: 90%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    animation: confirmPopIn 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    box-sizing: border-box;
}

@keyframes confirmPopIn {
    from {
        opacity: 0;
        transform: scale(0.92) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.confirm-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 16px 0;
    text-align: left;
}

.confirm-banner {
    position: relative;
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #fbcfe8 0%, #f472b6 50%, #ec4899 100%);
    border-radius: 50px;
    padding: 6px 16px 6px 6px;
    margin-bottom: 20px;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(244, 114, 182, 0.35);
}

.banner-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #ffffff;
    flex-shrink: 0;
    margin-right: 10px;
    background: #ffffff;
}

.banner-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.banner-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #ffffff;
    overflow: hidden;
}

.banner-name {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.banner-action {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.95;
    line-height: 1.2;
}

.banner-graphic {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.paw-icon {
    font-size: 22px;
}

.gift-info-box {
    border: 1.5px solid #f3f4f6;
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    margin-bottom: 20px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.info-gift-name {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
}

.info-gift-price {
    font-size: 18px;
    font-weight: 700;
    color: #f43f5e;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 2px;
}

.info-converted-price {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
}

.confirm-form-group {
    margin-bottom: 16px;
}

.confirm-label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    display: block;
    text-align: left;
}

.sender-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.confirm-input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px 90px 10px 14px;
    font-size: 14px;
    color: #1f2937;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.confirm-input:focus {
    border-color: #ff477e;
}

.btn-edit-name {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    font-size: 13px;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
}

.btn-edit-name:hover {
    color: #ff477e;
}

.confirm-textarea {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 14px;
    color: #1f2937;
    outline: none;
    min-height: 70px;
    resize: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.confirm-textarea:focus {
    border-color: #ff477e;
}

.confirm-textarea::placeholder {
    color: #9ca3af;
}

.char-counter {
    text-align: right;
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
}

.avatar-selector-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 4px;
}

.avatar-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    position: relative;
}

.avatar-radio {
    accent-color: #ff477e;
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin: 0;
}

.avatar-img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid transparent;
    transition: all 0.2s;
}

.avatar-option.is-selected .avatar-img {
    border-color: #ff477e;
    box-shadow: 0 0 0 2px rgba(255, 71, 126, 0.25);
}

.avatar-upload-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1.5px dashed #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    background: #f8fafc;
    overflow: hidden;
}

.avatar-upload-btn:hover {
    border-color: #ff477e;
    color: #ff477e;
}

.avatar-upload-btn.is-selected {
    border-color: #ff477e;
    border-style: solid;
}

.confirm-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancel {
    flex: 1;
    padding: 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 50px;
    background: #ffffff;
    color: #475569;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.btn-cancel:hover {
    background: #f8fafc;
    color: #1e293b;
}

.btn-submit-payment {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #ff477e 0%, #ff2a5f 100%);
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(255, 42, 95, 0.35);
    text-align: center;
}

.btn-submit-payment:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255, 42, 95, 0.45);
}

.btn-submit-payment:active {
    transform: translateY(0);
}
</style>