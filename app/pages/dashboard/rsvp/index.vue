<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';

definePageMeta({
    layout: 'dashboard'
});

interface CardRsvpItem {
    id: number;
    name: string;
    url: string;
    avatar: string | null;
    is_publish: boolean;
    createdAt: string;
    updatedAt: string;
    responses: number;
    attending: number;
    expectedPeople: number;
    notAttending: number;
    latestResponseAt: string | null;
}

interface OverviewData {
    stats: {
        totalResponses: number;
        totalAttending: number;
        totalExpectedPeople: number;
        cardsWithResponse: number;
        totalCards: number;
    };
    cards: CardRsvpItem[];
}

const overview = ref<OverviewData | null>(null);
const isLoading = ref(true);

const searchQuery = ref('');
const sortBy = ref<'most_responses' | 'least_responses' | 'most_people' | 'newest' | 'name_asc'>('most_responses');
const filterTab = ref<'all' | 'has_response' | 'no_response'>('all');

const fetchOverview = async () => {
    isLoading.value = true;
    try {
        const res = await $fetch<any>('/api/v1/client/accept-invitation/overview');
        if (res?.success && res?.data) {
            overview.value = res.data;
        }
    } catch (error) {
        console.error('Failed to fetch RSVP overview:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchOverview();
});

const formatShortDate = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : new Date();
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const getCardDisplayName = (card: CardRsvpItem) => {
    const rawName = (card.name || '').trim();
    const datePart = formatShortDate(card.createdAt);

    if (!rawName || rawName === 'Thiệp cưới của tôi') {
        return datePart ? `Trang mới - ${datePart}` : 'Trang mới';
    }
    if (rawName === 'Bản sao: Thiệp cưới của tôi') {
        return datePart ? `Bản sao: Trang mới - ${datePart}` : 'Bản sao: Trang mới';
    }
    return rawName;
};

const removeVietnameseTones = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
};

const allCards = computed<CardRsvpItem[]>(() => overview.value?.cards || []);

const totalCardsCount = computed(() => allCards.value.length);
const hasResponseCount = computed(() => allCards.value.filter(c => c.responses > 0).length);
const noResponseCount = computed(() => allCards.value.filter(c => c.responses === 0).length);

const stats = computed(() => ({
    totalResponses: overview.value?.stats.totalResponses ?? 0,
    totalAttending: overview.value?.stats.totalAttending ?? 0,
    totalExpectedPeople: overview.value?.stats.totalExpectedPeople ?? 0,
    cardsWithResponse: overview.value?.stats.cardsWithResponse ?? 0,
    totalCards: overview.value?.stats.totalCards ?? 0
}));

const filteredCards = computed(() => {
    let list = [...allCards.value];

    if (filterTab.value === 'has_response') {
        list = list.filter(c => c.responses > 0);
    } else if (filterTab.value === 'no_response') {
        list = list.filter(c => c.responses === 0);
    }

    if (searchQuery.value.trim()) {
        const keyword = removeVietnameseTones(searchQuery.value.trim());
        list = list.filter(c => {
            const displayNameNorm = removeVietnameseTones(getCardDisplayName(c));
            const rawNameNorm = removeVietnameseTones(c.name || '');
            const urlNorm = removeVietnameseTones(c.url || '');
            return (
                displayNameNorm.includes(keyword) ||
                rawNameNorm.includes(keyword) ||
                urlNorm.includes(keyword)
            );
        });
    }

    list.sort((a, b) => {
        if (sortBy.value === 'most_responses') {
            if (b.responses !== a.responses) return b.responses - a.responses;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy.value === 'least_responses') {
            if (a.responses !== b.responses) return a.responses - b.responses;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy.value === 'most_people') {
            if (b.expectedPeople !== a.expectedPeople) return b.expectedPeople - a.expectedPeople;
            return b.responses - a.responses;
        }
        if (sortBy.value === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy.value === 'name_asc') {
            return getCardDisplayName(a).localeCompare(getCardDisplayName(b), 'vi');
        }
        return 0;
    });

    return list;
});
</script>

<template>
    <div class="dashboard-cover rsvp-overview-page">
        <!-- Page Header -->
        <div class="header-section mb-3">
            <div class="d-flex align-items-center gap-2 mb-2">
                <ButtonReturnMobileComponent />
                <h2 class="page-title mb-0">
                    Phản hồi tham dự<span class="title-dot">.</span>
                </h2>
            </div>
            <p class="page-subtitle mb-0">
                Theo dõi xác nhận của khách và số người dự kiến ở từng thiệp.
            </p>
        </div>

        <!-- Summary Metrics Strip -->
        <div class="summary-strip">
            <div class="row row-cols-2 row-cols-md-4 g-3">
                <div class="col">
                    <div class="metric-item">
                        <div class="metric-label">Phản hồi</div>
                        <div class="metric-value">{{ stats.totalResponses }}</div>
                    </div>
                </div>
                <div class="col">
                    <div class="metric-item">
                        <div class="metric-label">Xác nhận tham dự</div>
                        <div class="metric-value">{{ stats.totalAttending }}</div>
                    </div>
                </div>
                <div class="col">
                    <div class="metric-item">
                        <div class="metric-label">Người dự kiến</div>
                        <div class="metric-value">{{ stats.totalExpectedPeople }}</div>
                    </div>
                </div>
                <div class="col">
                    <div class="metric-item">
                        <div class="metric-label">Thiệp có phản hồi</div>
                        <div class="metric-value">
                            {{ stats.cardsWithResponse }}
                            <span class="metric-sub">/ {{ stats.totalCards }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search, Sort & Filter Box -->
        <div class="filter-card">
            <div class="row g-3">
                <div class="col-12 col-md-8">
                    <label class="filter-label" for="searchCardInput">Tìm thiệp</label>
                    <input
                        id="searchCardInput"
                        v-model="searchQuery"
                        type="text"
                        class="form-control filter-input"
                        placeholder="Nhập tên thiệp, có hoặc không dấu..."
                    />
                </div>
                <div class="col-12 col-md-4">
                    <label class="filter-label" for="sortCardSelect">Sắp xếp</label>
                    <select id="sortCardSelect" v-model="sortBy" class="form-select filter-select">
                        <option value="most_responses">Nhiều phản hồi nhất</option>
                        <option value="least_responses">Ít phản hồi nhất</option>
                        <option value="most_people">Nhiều người dự kiến nhất</option>
                        <option value="newest">Mới tạo gần đây</option>
                        <option value="name_asc">Tên thiệp (A - Z)</option>
                    </select>
                </div>
            </div>

            <!-- Filter Pills -->
            <div class="d-flex flex-wrap gap-2 mt-3">
                <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: filterTab === 'all' }"
                    @click="filterTab = 'all'"
                >
                    Tất cả {{ totalCardsCount }}
                </button>
                <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: filterTab === 'has_response' }"
                    @click="filterTab = 'has_response'"
                >
                    Có phản hồi {{ hasResponseCount }}
                </button>
                <button
                    type="button"
                    class="filter-pill"
                    :class="{ active: filterTab === 'no_response' }"
                    @click="filterTab = 'no_response'"
                >
                    Chưa có phản hồi {{ noResponseCount }}
                </button>
            </div>
        </div>

        <!-- Count & Helper Note -->
        <div class="list-meta mb-3">
            <div class="list-count">{{ filteredCards.length }} thiệp</div>
            <div class="list-hint">
                Số người dự kiến gồm cả người đi cùng. Mở từng thiệp để xem danh sách khách.
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>

        <!-- Cards List -->
        <div v-else-if="filteredCards.length > 0" class="d-flex flex-column gap-3">
            <div
                v-for="card in filteredCards"
                :key="card.id"
                class="card-rsvp-row"
            >
                <!-- Left: Card Badge & Name -->
                <div class="card-info-left">
                    <div class="card-thumb-box">
                        <span>Thiệp</span>
                    </div>
                    <div class="card-title-text">
                        {{ getCardDisplayName(card) }}
                    </div>
                </div>

                <!-- Right: Stats & Action Link -->
                <div class="card-stats-right">
                    <div class="card-stat-col">
                        <div class="card-stat-label">Phản hồi</div>
                        <div class="card-stat-num">{{ card.responses }}</div>
                    </div>
                    <div class="card-stat-col">
                        <div class="card-stat-label">Sẽ tham dự</div>
                        <div class="card-stat-num">{{ card.attending }}</div>
                    </div>
                    <div class="card-stat-col">
                        <div class="card-stat-label">Người dự kiến</div>
                        <div class="card-stat-num">{{ card.expectedPeople }}</div>
                    </div>
                    <div class="card-action-col">
                        <NuxtLink
                            :to="`/dashboard/pages/${card.url}/rsvp`"
                            class="card-action-link"
                        >
                            {{ card.responses > 0 ? 'Xem phản hồi →' : 'Xem chi tiết →' }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-card text-center py-5">
            <p class="text-muted mb-0">Không tìm thấy thiệp nào phù hợp.</p>
        </div>
    </div>
</template>

<style scoped>
.rsvp-overview-page {
    max-width: 980px;
    padding-bottom: 48px;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
}

.title-dot {
    color: #f43f5e;
    margin-left: 1px;
}

.page-subtitle {
    font-size: 14px;
    color: #64748b;
}

/* Summary Strip */
.summary-strip {
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 18px 0;
    margin: 22px 0;
}

.metric-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.metric-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 400;
}

.metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
}

.metric-sub {
    font-size: 14px;
    font-weight: 400;
    color: #64748b;
    margin-left: 2px;
}

/* Filter Card */
.filter-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px 20px;
    margin-bottom: 18px;
}

.filter-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 6px;
}

.filter-input,
.filter-select {
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    padding: 9px 14px;
    font-size: 14px;
    color: #0f172a;
    background-color: #ffffff;
    box-shadow: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.filter-input::placeholder {
    color: #94a3b8;
}

.filter-input:focus,
.filter-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Filter Pills */
.filter-pill {
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 13px;
    font-weight: 600;
    background-color: #ffffff;
    border: 1px solid #cbd5e1;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.15s ease;
}

.filter-pill:hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
}

.filter-pill.active {
    background-color: #eff6ff;
    border-color: #60a5fa;
    color: #2563eb;
}

/* List Meta */
.list-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.list-count {
    font-size: 13px;
    color: #334155;
    font-weight: 500;
}

.list-hint {
    font-size: 13px;
    color: #64748b;
}

/* Card Row */
.card-rsvp-row {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card-rsvp-row:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.card-info-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
}

.card-thumb-box {
    width: 72px;
    height: 48px;
    border-radius: 10px;
    background-color: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.card-title-text {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-stats-right {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-shrink: 0;
}

.card-stat-col {
    min-width: 72px;
}

.card-stat-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 2px;
}

.card-stat-num {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
}

.card-action-col {
    min-width: 110px;
    text-align: right;
}

.card-action-link {
    font-size: 13px;
    font-weight: 600;
    color: #2563eb;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.15s ease;
}

.card-action-link:hover {
    color: #1d4ed8;
    text-decoration: underline;
}

.empty-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
}

@media (max-width: 767.98px) {
    .rsvp-overview-page {
        padding: 16px 8px 40px 8px;
    }

    .page-title {
        font-size: 22px;
    }

    .card-rsvp-row {
        flex-direction: column;
        align-items: stretch;
        padding: 16px;
        gap: 14px;
    }

    .card-title-text {
        white-space: normal;
    }

    .card-stats-right {
        justify-content: space-between;
        gap: 12px;
        padding-top: 12px;
        border-top: 1px solid #f1f5f9;
        flex-wrap: wrap;
    }

    .card-stat-col {
        min-width: auto;
    }

    .card-action-col {
        min-width: auto;
        margin-left: auto;
    }
}
</style>

