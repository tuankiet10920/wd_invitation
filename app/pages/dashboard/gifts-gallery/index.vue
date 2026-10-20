<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

const gifts = ref<any[]>([]);
const searchQuery = ref('');
const sortBy = ref('name_asc'); // 'name_asc', 'name_desc', 'price_asc', 'price_desc'
const isLoading = ref(true);

const fetchGifts = async () => {
    isLoading.value = true;
    try {
        const response = await $fetch<any>('/api/v1/client/gifts')
        if (response.success && response.data) {
            gifts.value = response.data.data || []
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách quà:', error)
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchGifts()
})

const filteredAndSortedGifts = computed(() => {
    let result = gifts.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(gift => gift.name.toLowerCase().includes(query));
    }

    // Sort
    result = [...result].sort((a, b) => {
        if (sortBy.value === 'name_asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy.value === 'name_desc') {
            return b.name.localeCompare(a.name);
        } else if (sortBy.value === 'price_asc') {
            return a.price - b.price;
        } else if (sortBy.value === 'price_desc') {
            return b.price - a.price;
        }
        return 0;
    });

    return result;
});

// Modal & Preview logic
const showModal = ref(false);
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
            svgaPlayer.set({ loop: 0 }); // infinite loop cho màn preview
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
    if (!gift.file) return;
    showModal.value = true;
    await nextTick(); // Chờ modal render xong để lấy thẻ canvas
    playGiftAnim(gift.file);
};

// Clear animation khi đóng modal
watch(showModal, (newVal) => {
    if (!newVal && svgaPlayer) {
        svgaPlayer.stop();
        svgaPlayer.clear();
        svgaPlayer = null; // Huỷ bỏ object svgaPlayer cũ giữ reference DOM canvas cũ
    }
});
</script>

<template>
    <div class="gifts-gallery-page dashboard-cover">
        <!-- Header -->
        <div class="mb-4">
            <h5 class="fw-bold mb-2 d-flex align-items-center text-dark" style="font-size: 1.25rem;">
                <BaseIconComponent name="gift" type="lucide" :size="20" color="#333" class="me-2" />
                Bộ sưu tập Quà tặng
            </h5>
            <p class="text-muted small">Danh sách quà tặng được cập nhật liên tục</p>
        </div>

        <!-- Filter Bar -->
        <div
            class="filter-bar bg-white rounded-3 p-2 px-3 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div class="d-flex gap-3 w-100 flex-column flex-md-row">
                <!-- Search -->
                <div class="search-box position-relative flex-grow-1" style="max-width: 350px;">
                    <input type="text" v-model="searchQuery"
                        class="form-control form-control-sm border-0 pe-5 shadow-none"
                        placeholder="Tìm kiếm quà tặng...">
                    <button
                        class="btn btn-sm position-absolute top-50 end-0 translate-middle-y text-muted border-0 bg-transparent h-100 d-flex align-items-center justify-content-center border-start rounded-0"
                        style="width: 40px;">
                        <BaseIconComponent name="search" type="lucide" :size="16" />
                    </button>
                </div>

                <!-- Sort -->
                <select v-model="sortBy" class="form-select border-0 shadow-none form-select-sm"
                    style="max-width: 15rem; border-left: 1px solid #f1f5f9 !important;">
                    <option value="name_asc">Tên A-Z</option>
                    <option value="name_desc">Tên Z-A</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                </select>
            </div>

            <!-- Count -->
            <div class="text-muted small text-nowrap d-flex align-items-center gap-2">
                Tổng {{ filteredAndSortedGifts.length }} quà tặng
            </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Grid -->
        <div v-else class="row g-3">
            <!-- Used col-lg-2 exactly like the 6 columns layout in image -->
            <div v-for="gift in filteredAndSortedGifts" :key="gift.id" class="col-6 col-sm-4 col-md-3 col-lg-2"
                @click="openPreview(gift)">
                <div class="gift-card bg-white rounded-4 overflow-hidden">
                    <!-- Image Wrapper -->
                    <div class="gift-image-wrapper d-flex align-items-center justify-content-center position-relative">
                        <!-- BG Wrapper logic: some cards might have background, fallback to gradient -->
                        <div class="bg-overlay"
                            :style="gift.background ? `background-size: cover; background-position: center;opacity: 1;` : ''">
                        </div>
                        <img v-if="gift.image" :src="`/images/gift_images/${gift.image}`" :alt="gift.name"
                            class="gift-img transition-transform" />
                    </div>

                    <!-- Info -->
                    <div class="gift-info p-3 position-relative z-1 d-flex justify-content-between align-items-end"
                        style="border-top: 1px solid #f8fafc;">
                        <div class="w-100 pe-1">
                            <div class="gift-name fw-bold text-dark text-truncate" style="font-size: 12px;"
                                :title="gift.name">{{ gift.name }}</div>
                            <div class="gift-price d-flex align-items-center gap-1 mt-1">
                                <span class="fw-bold fs-6 text-danger" style="font-size: 14px !important;">{{ gift.price
                                    }}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="#FFC107" />
                                    <circle cx="12" cy="12" r="7" fill="#FFD54F" />
                                </svg>
                            </div>
                        </div>

                        <button class="btn btn-sm btn-view rounded-pill fw-bold text-nowrap">Xem</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!isLoading && filteredAndSortedGifts.length === 0" class="text-center py-5 text-muted">
            <BaseIconComponent name="box" type="lucide" :size="48" class="mb-3 opacity-50" />
            <p>Không tìm thấy quà tặng nào</p>
        </div>

        <!-- Preview Modal -->
        <ModalZoomCenterComponent v-model="showModal">
            <div class="preview-modal-content text-center position-relative">
                <button
                    class="btn btn-close-modal bg-white text-muted shadow-sm position-absolute rounded-circle d-flex align-items-center justify-content-center"
                    @click="showModal = false">
                    <BaseIconComponent name="x" type="lucide" :size="18" />
                </button>
                <div class="canvas-wrapper">
                    <canvas ref="giftCanvasRef" class="preview-canvas"></canvas>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </div>
</template>

<style scoped>
.gifts-gallery-page {
    background-color: #f8fafc;
    padding: 24px;
    min-height: 100vh;
}

.gift-card {
    transition: all 0.3s ease;
    border: 1px solid #f1f5f9;
    cursor: pointer;
}

.gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.gift-card:hover .gift-img {
    transform: scale(1.1);
}

.gift-image-wrapper {
    height: 140px;
    padding: 16px;
    border-radius: 12px 12px 0 0;
}

.bg-overlay {
    position: absolute;
    inset: 0;
    /* subtle pink gradient */
    background: linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%);
    opacity: 0.6;
    z-index: 0;
}

.gift-img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gift-name {
    line-height: 1.2;
}

.btn-view {
    background-color: #e0f2fe;
    color: #0284c7;
    font-size: 11px;
    padding: 2px 12px;
    transition: all 0.2s;
    height: 24px;
    display: inline-flex;
    align-items: center;
    border: none;
}

.gift-card:hover .btn-view {
    background-color: #bae6fd;
}

.search-box {
    border-right: 1px solid #f1f5f9;
}

.search-box .form-control {
    background-color: transparent;
}

.preview-modal-content {
    width: 80%;
    height: 80%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: center;
}

.canvas-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview-canvas {
    width: 100%;
    height: 100%;
}

.btn-close-modal {
    top: -40px;
    right: -40px;
    width: 36px;
    height: 36px;
    border: none;
    z-index: 10;
    transition: all 0.2s;
}

.btn-close-modal:hover {
    background-color: #f1f5f9 !important;
    transform: scale(1.05);
}

@media (max-width: 576px) {
    .btn-close-modal {
        top: -40px;
        right: 0px;
    }
}
</style>