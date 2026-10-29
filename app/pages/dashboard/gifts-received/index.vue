<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'dashboard'
});

const giftsData = ref<{
    stats: {
        totalGifts: number;
        totalAmount: number;
        cardsCount: number;
    };
    cards: any[];
    gifts: any[];
} | null>(null);

const isLoading = ref(true);
const searchQuery = ref('');
const selectedCardId = ref('all');
const sortBy = ref('date_desc');

const fetchReceivedGifts = async () => {
    isLoading.value = true;
    try {
        const res = await $fetch<any>('/api/v1/client/gifts/received');
        if (res.success && res.data) {
            giftsData.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch received gifts:', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchReceivedGifts();
});

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const filteredGifts = computed(() => {
    let list = giftsData.value?.gifts || [];

    if (selectedCardId.value !== 'all') {
        list = list.filter((g: any) => String(g.weddingCardId) === String(selectedCardId.value));
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter((g: any) => 
            g.senderName?.toLowerCase().includes(q) ||
            g.giftName?.toLowerCase().includes(q) ||
            g.message?.toLowerCase().includes(q)
        );
    }

    return [...list].sort((a: any, b: any) => {
        if (sortBy.value === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy.value === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy.value === 'amount_desc') return b.amount - a.amount;
        if (sortBy.value === 'amount_asc') return a.amount - b.amount;
        return 0;
    });
});

// Modal preview SVGA
const showModal = ref(false);
const activeGift = ref<any>(null);
const giftCanvasRef = ref<HTMLCanvasElement | null>(null);
let svgaDownloader: any = null;
let svgaParser: any = null;
let svgaPlayer: any = null;

const playGiftAnim = async (fileName: string) => {
    try {
        if (typeof window === 'undefined') return;
        if (!svgaDownloader) {
            const svga = await import('svga.lite');
            svgaDownloader = new svga.Downloader();
            svgaParser = new svga.Parser();
        }
        if (!svgaPlayer && giftCanvasRef.value) {
            const svga = await import('svga.lite');
            svgaPlayer = new svga.Player(giftCanvasRef.value);
            svgaPlayer.set({ loop: 0 });
        }
        const fileData = await svgaDownloader.get(`/images/gifts/${fileName}`);
        const svgaData = await svgaParser.do(fileData);
        await svgaPlayer.mount(svgaData);
        svgaPlayer.start();
    } catch (error) {
        console.error('SVGA Play Error:', error);
    }
};

const openPreview = async (gift: any) => {
    activeGift.value = gift;
    showModal.value = true;
    if (gift.giftFile) {
        await nextTick();
        playGiftAnim(gift.giftFile);
    }
};

watch(showModal, (newVal) => {
    if (!newVal && svgaPlayer) {
        svgaPlayer.stop();
        svgaPlayer.clear();
    }
});
</script>

<template>
    <div class="gifts-received-page dashboard-cover">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                    <ButtonReturnMobileComponent />
                    <h4 class="fw-bold mb-0 d-flex align-items-center">
                        <span class="me-2">🎁</span> Quà tặng đã nhận
                    </h4>
                </div>
                <p class="text-muted small mb-0">Quản lý và xem lại quà tặng cùng lời chúc yêu thương từ khách mời</p>
            </div>
            <div class="d-flex gap-2">
                <NuxtLink to="/dashboard/gifts-gallery" class="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-bold text-decoration-none d-flex align-items-center">
                    <BaseIconComponent name="gift" type="lucide" :size="16" class="me-1" />
                    Bộ sưu tập quà tặng
                </NuxtLink>
                <NuxtLink to="/dashboard/wallet" class="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-bold shadow-sm text-decoration-none d-flex align-items-center">
                    <BaseIconComponent name="wallet" type="lucide" :size="16" class="me-1" />
                    Xem số dư ví
                </NuxtLink>
            </div>
        </div>

        <!-- Top stats cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-4 col-sm-6">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-primary-subtle text-primary">
                        <BaseIconComponent name="gift" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Tổng số quà nhận</div>
                        <h4 class="fw-bold mb-0 text-dark">{{ giftsData?.stats.totalGifts || 0 }} <span class="fs-6 fw-normal text-muted">món</span></h4>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-6">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-success-subtle text-success">
                        <BaseIconComponent name="dollar-sign" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Tổng giá trị quy đổi</div>
                        <h4 class="fw-bold mb-0 text-success">{{ formatCurrency(giftsData?.stats.totalAmount || 0) }}</h4>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-sm-12">
                <div class="stat-box bg-white p-4 rounded-4 shadow-sm border-0 d-flex align-items-center">
                    <div class="stat-icon-wrapper me-3 bg-danger-subtle text-danger">
                        <BaseIconComponent name="heart" type="lucide" :size="24" />
                    </div>
                    <div>
                        <div class="text-muted small fw-bold">Thiệp cưới nhận quà</div>
                        <h4 class="fw-bold mb-0 text-dark">{{ giftsData?.stats.cardsCount || 0 }} <span class="fs-6 fw-normal text-muted">trang thiệp</span></h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter bar -->
        <div class="bg-white p-3 rounded-4 shadow-sm mb-4">
            <div class="row g-2 align-items-center">
                <div class="col-md-5">
                    <div class="input-group">
                        <span class="input-group-text bg-transparent border-end-0">
                            <BaseIconComponent name="search" type="lucide" :size="16" class="text-muted" />
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            class="form-control border-start-0 ps-0"
                            placeholder="Tìm kiếm người gửi, tên quà hoặc lời chúc..."
                        />
                    </div>
                </div>
                <div class="col-md-4 col-6">
                    <select v-model="selectedCardId" class="form-select">
                        <option value="all">Tất cả thiệp cưới</option>
                        <option v-for="c in giftsData?.cards" :key="c.id" :value="c.id">
                            {{ c.name }}
                        </option>
                    </select>
                </div>
                <div class="col-md-3 col-6">
                    <select v-model="sortBy" class="form-select">
                        <option value="date_desc">Mới nhất trước</option>
                        <option value="date_asc">Cũ nhất trước</option>
                        <option value="amount_desc">Giá trị cao nhất</option>
                        <option value="amount_asc">Giá trị thấp nhất</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Gifts list -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-2">Đang tải danh sách quà tặng...</p>
        </div>

        <div v-else-if="filteredGifts.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm p-4">
            <div class="fs-1 mb-2">🎁</div>
            <h5 class="fw-bold text-dark">Chưa có quà tặng nào</h5>
            <p class="text-muted small mb-3">Khi khách mời gửi quà tặng qua thiệp cưới online của bạn, quà tặng sẽ xuất hiện tại đây.</p>
            <NuxtLink to="/dashboard/gifts-gallery" class="btn btn-outline-primary btn-sm rounded-pill px-4 py-2">
                Khám phá bộ sưu tập quà tặng
            </NuxtLink>
        </div>

        <div v-else class="row g-3">
            <div class="col-lg-6 col-12" v-for="gift in filteredGifts" :key="gift.id">
                <div class="gift-card-item bg-white p-3 p-md-4 rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between position-relative">
                    <div>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="d-flex align-items-center">
                                <div class="avatar-circle me-3">
                                    {{ gift.senderName ? gift.senderName.charAt(0).toUpperCase() : 'K' }}
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark">{{ gift.senderName }}</h6>
                                    <span class="small text-muted">{{ formatDate(gift.createdAt) }}</span>
                                </div>
                            </div>
                            <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">
                                {{ formatCurrency(gift.amount) }}
                            </span>
                        </div>

                        <!-- Gift preview box -->
                        <div class="gift-detail-box p-3 rounded-3 mb-3 d-flex align-items-center justify-content-between" style="background-color: #f8f9fa;">
                            <div class="d-flex align-items-center">
                                <img :src="gift.giftImage" :alt="gift.giftName" class="gift-mini-img me-3 rounded-3" />
                                <div>
                                    <div class="fw-bold text-dark fs-6">{{ gift.giftName }}</div>
                                    <div class="small text-muted">Thiệp: <span class="fw-semibold text-primary">{{ gift.weddingCardName }}</span></div>
                                </div>
                            </div>
                            <button
                                v-if="gift.giftFile"
                                @click="openPreview(gift)"
                                class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold"
                            >
                                <BaseIconComponent name="play" type="lucide" :size="14" class="me-1" />
                                Xem hiệu ứng
                            </button>
                        </div>

                        <!-- Message -->
                        <div v-if="gift.message" class="message-quote p-3 rounded-3 mb-2">
                            <div class="text-secondary small fst-italic">
                                " {{ gift.message }} "
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <span class="badge bg-light text-secondary border">Thanh toán thành công</span>
                        <NuxtLink v-if="gift.weddingCardUrl" :to="`/editor/${gift.weddingCardUrl}`" class="small text-primary text-decoration-none fw-bold">
                            Chỉnh sửa thiệp →
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preview Modal -->
        <Teleport to="body">
            <ModalZoomCenterComponent v-model="showModal">
                <div class="preview-modal-content text-center p-4">
                    <h5 class="fw-bold mb-2">{{ activeGift?.giftName }}</h5>
                    <p class="text-muted small mb-3">Hiệu ứng chúc mừng từ: <strong class="text-dark">{{ activeGift?.senderName }}</strong></p>
                    <div class="canvas-container mx-auto position-relative rounded-4 overflow-hidden mb-3" style="width: 280px; height: 280px; background-color: #1a1a2e;">
                        <canvas ref="giftCanvasRef" class="w-100 h-100"></canvas>
                    </div>
                    <div class="fw-bold text-success fs-5 mb-3">{{ formatCurrency(activeGift?.amount || 0) }}</div>
                    <button class="btn btn-secondary rounded-pill px-4" @click="showModal = false">Đóng</button>
                </div>
            </ModalZoomCenterComponent>
        </Teleport>
    </div>
</template>

<style scoped>
.stat-box {
    border: 1px solid #edf2f7;
    transition: 0.2s;
}
.stat-box:hover {
    transform: translateY(-2px);
}
.stat-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.avatar-circle {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
}
.gift-card-item {
    border: 1px solid #f1f5f9;
    transition: 0.2s;
}
.gift-card-item:hover {
    box-shadow: 0 8px 24px rgba(149, 157, 165, 0.15) !important;
}
.gift-mini-img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    background-color: #fff;
    padding: 4px;
    border: 1px solid #eee;
}
.message-quote {
    background-color: #fff8f8;
    border-left: 3px solid #ff7675;
}
</style>
