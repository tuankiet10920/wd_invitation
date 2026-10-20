<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import DeleteAcceptInvitationComponent from '~/coms/dashboard/modal/DeleteAcceptInvitationComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const card = ref<any>(null);
const isLoadingCard = ref(true);

const currentTab = ref('list'); // 'list', 'filter', 'stats'
const rsvpList = ref<any[]>([]);
const isLoadingList = ref(false);

const isDeleteModalOpen = ref(false);
const selectedRsvpId = ref<number | null>(null);

const searchQuery = ref('');
const filterStatus = ref('all');
const filterTransport = ref('all'); // Placeholder for now
const filterSide = ref('all'); // Placeholder for now

const fetchCard = async () => {
    try {
        isLoadingCard.value = true;
        const { data }: any = await $fetch(`/api/v1/client/card-template/${slug}`);
        if (data) {
            card.value = data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        isLoadingCard.value = false;
    }
}

const fetchRsvpList = async () => {
    try {
        isLoadingList.value = true;
        const response: any = await $fetch(`/api/v1/client/accept-invitation?slug=${slug}`);
        if (response.success && response.data) {
            rsvpList.value = response.data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        isLoadingList.value = false;
    }
}

const openDeleteModal = (id: number) => {
    selectedRsvpId.value = id;
    isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
    if (!selectedRsvpId.value) return;

    try {
        const response: any = await $fetch(`/api/v1/client/accept-invitation/${selectedRsvpId.value}`, {
            method: 'DELETE'
        });

        if (response.success) {
            fetchRsvpList();
        } else {
            alert('Có lỗi xảy ra khi xóa');
        }
    } catch (e) {
        console.error(e);
        alert('Có lỗi xảy ra khi xóa');
    } finally {
        isDeleteModalOpen.value = false;
        selectedRsvpId.value = null;
    }
};

onMounted(() => {
    fetchCard();
    fetchRsvpList();
});

const goBack = () => {
    router.push(`/dashboard/pages/${slug}`);
};

const formatDate = (dateString?: string) => {
    const d = dateString ? new Date(dateString) : new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${formatDate(dateString)}`;
};

// Computed stats based on real data
const totalRsvp = computed(() => rsvpList.value.length);
const attendingCount = computed(() => rsvpList.value.filter(i => !!i.is_accept).length);
const totalPeopleCount = computed(() => totalRsvp.value);
const notAttendingCount = computed(() => rsvpList.value.filter(i => !i.is_accept).length);

const filteredList = computed(() => {
    return rsvpList.value.filter(item => {
        const name = item.content?.name || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const isAccept = !!item.is_accept;
        const matchesStatus = filterStatus.value === 'all' || 
                             (filterStatus.value === 'attending' && isAccept) || 
                             (filterStatus.value === 'not_attending' && !isAccept);
        return matchesSearch && matchesStatus;
    });
});

</script>

<template>
    <div class="rsvp-container d-flex flex-column gap-3 p-3 dashboard-cover">
        <!-- Header -->
        <div class="d-flex align-items-center gap-3 mb-1">
            <button class="btn btn-light bg-light rounded-2 p-2 d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; border: none;" @click="goBack">
                <BaseIconComponent name="chevron-left" type="lucide" :size="20" color="#374151" />
            </button>
            <div class="d-flex align-items-center gap-2">
                <BaseIconComponent name="calendar-check" type="lucide" :size="22" color="#057a55" />
                <h5 class="fw-bold mb-0 text-dark header-title">Xác nhận tham dự</h5>
            </div>
        </div>
        <div class="text-secondary small mb-3">Bản sao: {{ card?.name || 'Trang mới' }} - {{ formatDate() }}</div>

        <!-- Stats Grid (2x2) -->
        <div class="row g-2 mb-2">
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="users" type="lucide" :size="14" />
                        <span>Tổng lượt</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-dark">{{ totalRsvp }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="check-circle" type="lucide" :size="14" />
                        <span>Sẽ tham dự</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-success">{{ attendingCount }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="user" type="lucide" :size="14" />
                        <span>Tổng người</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-primary">{{ totalPeopleCount }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="x-circle" type="lucide" :size="14" />
                        <span>Không tham dự</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-danger">{{ notAttendingCount }}</div>
                </div>
            </div>
        </div>

        <!-- Tabs Section -->
        <div class="card border-0 rounded-4 shadow-sm bg-white mt-2">
            <div class="d-flex border-bottom">
                <div class="flex-fill text-center py-3 px-1 cursor-pointer position-relative" 
                    :class="{ 'text-primary fw-bold': currentTab === 'list', 'text-muted': currentTab !== 'list' }"
                    @click="currentTab = 'list'">
                    Danh sách
                    <div v-if="currentTab === 'list'" class="position-absolute bottom-0 start-0 w-100 bg-primary" style="height: 3px;"></div>
                </div>
                <div class="flex-fill text-center py-3 px-1 cursor-pointer position-relative" 
                    :class="{ 'text-primary fw-bold': currentTab === 'filter', 'text-muted': currentTab !== 'filter' }"
                    @click="currentTab = 'filter'">
                    Bộ lọc
                    <div v-if="currentTab === 'filter'" class="position-absolute bottom-0 start-0 w-100 bg-primary" style="height: 3px;"></div>
                </div>
                <div class="flex-fill text-center py-3 px-1 cursor-pointer position-relative d-flex align-items-center justify-content-center gap-1" 
                    :class="{ 'text-primary fw-bold': currentTab === 'stats', 'text-muted': currentTab !== 'stats' }"
                    @click="currentTab = 'stats'">
                    <BaseIconComponent name="bar-chart-2" type="lucide" :size="16" :color="currentTab === 'stats' ? '#3b82f6' : '#6b7280'" />
                    Thống kê
                    <div v-if="currentTab === 'stats'" class="position-absolute bottom-0 start-0 w-100 bg-primary" style="height: 3px;"></div>
                </div>
            </div>
            <div v-if="currentTab === 'list' || currentTab === 'filter'" class="p-3 border-bottom bg-light bg-opacity-10">
                <div class="text-secondary small">Hiển thị {{ filteredList.length }} / {{ totalRsvp }} RSVP</div>
            </div>

            <!-- Tab Panels -->
            <div class="p-3">
                <!-- Filter Panel -->
                <div v-if="currentTab === 'filter'" class="filters-panel">
                    <div class="row g-3">
                        <div class="col-12 col-md-3">
                            <label class="form-label small fw-bold text-dark mb-1">Tìm kiếm:</label>
                            <input type="text" v-model="searchQuery" class="form-control form-control-sm rounded-2" placeholder="Tên người...">
                        </div>
                        <div class="col-12 col-md-3">
                            <label class="form-label small fw-bold text-dark mb-1">Trạng thái:</label>
                            <select class="form-select form-select-sm rounded-2" v-model="filterStatus">
                                <option value="all">Tất cả</option>
                                <option value="attending">Sẽ tham dự</option>
                                <option value="not_attending">Không tham dự</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Stats Panel -->
                <div v-if="currentTab === 'stats'" class="stats-panel">
                    <div class="rsvp-stats-box border-0 bg-light bg-opacity-50 p-3 rounded-3">
                        <div class="rsvp-stats-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-secondary small">Sẽ tham dự:</span>
                                <span class="fw-bold text-success">{{ attendingCount }} khách</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-secondary small">Không tham dự:</span>
                                <span class="fw-bold text-danger">{{ notAttendingCount }} khách</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-secondary small">Tổng lượt:</span>
                                <span class="fw-bold text-dark">{{ totalRsvp }} RSVP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RSVP List Heading -->
        <div class="mt-4 mb-2">
            <h6 class="fw-bold text-dark">Danh sách người tham dự ({{ totalRsvp }})</h6>
        </div>

        <!-- RSVP Content Section -->
        <div v-if="isLoadingList || filteredList.length > 0">
            <!-- Desktop Table View -->
            <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden d-none d-md-block">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-light border-bottom">
                            <tr>
                                <th class="ps-3 py-3 small fw-bold text-muted text-uppercase">Tên</th>
                                <th class="py-3 small fw-bold text-muted text-uppercase">Trạng thái</th>
                                <th class="pe-3 py-3 small fw-bold text-muted text-uppercase text-center">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoadingList">
                                <td colspan="3" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status"></div>
                                </td>
                            </tr>
                            <tr v-else v-for="item in filteredList" :key="item.id" class="border-bottom">
                                <td class="ps-3 py-3">
                                    <div class="fw-bold text-dark">{{ item.content?.name || '---' }}</div>
                                    <div class="text-secondary" style="font-size: 11px;">{{ formatTime(item.createdAt) }}</div>
                                </td>
                                <td class="py-3">
                                    <span class="badge rounded-pill px-2 py-1" 
                                        :class="item.is_accept ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'" 
                                        style="font-size: 11px;">
                                        {{ item.is_accept ? 'Sẽ tham dự' : 'Không tham dự' }}
                                    </span>
                                </td>
                                <td class="pe-3 py-3 text-center">
                                    <button class="btn btn-link text-danger p-0 border-0" @click="openDeleteModal(item.id)">
                                        <BaseIconComponent name="trash-2" type="lucide" :size="16" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="d-flex flex-column gap-2 d-md-none">
                <div v-if="isLoadingList" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
                <template v-else>
                    <div v-for="item in filteredList" :key="item.id" class="card border-0 shadow-sm rounded-3 bg-white p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div class="d-flex flex-column">
                                <span class="fw-bold text-dark mb-0" style="font-size: 1.05rem;">{{ item.content?.name || '---' }}</span>
                                <span class="text-secondary small">{{ formatTime(item.createdAt) }}</span>
                            </div>
                            <button class="btn btn-link p-1 text-danger opacity-75" @click="openDeleteModal(item.id)">
                                <BaseIconComponent name="trash-2" type="lucide" :size="18" />
                            </button>
                        </div>
                        <div class="mt-2">
                            <span class="badge rounded-pill px-3 py-2 fw-normal" 
                                :class="item.is_accept ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'" 
                                style="font-size: 11px;">
                                {{ item.is_accept ? 'Sẽ tham dự' : 'Không tham dự' }}
                            </span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="card border-0 rounded-4 shadow-sm bg-white p-5 text-center">
            <p class="text-muted mb-0" style="font-size: 1.1rem;">Chưa có người xác nhận</p>
        </div>

        <!-- Delete Modal -->
        <DeleteAcceptInvitationComponent v-model="isDeleteModalOpen" @confirm="confirmDelete" />
    </div>
</template>

<style scoped>
.rsvp-container {
    max-width: 100%;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
}

.breadcrumbs {
    font-size: 0.85rem;
}

.hover-underline:hover {
    text-decoration: underline !important;
}

.btn-back {
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
}

.btn-back:hover {
    background-color: #f3f4f6 !important;
}

.stat-card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 1.25rem;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.stat-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
}

.stat-value .unit {
    font-size: 0.9rem;
    font-weight: 400;
    color: #64748b;
    margin-left: 2px;
}

.main-card {
    background-color: #ffffff;
    border: 1px solid #f1f5f9;
}

.tab-item {
    font-size: 0.85rem;
    font-weight: 500;
    color: #64748b;
    position: relative;
    transition: all 0.2s;
}

.tab-item:hover {
    color: #1e293b;
}

.tab-item.active {
    color: #3b82f6;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #3b82f6;
}

.form-label {
    font-size: 0.75rem;
}

.form-control,
.form-select {
    font-size: 0.85rem;
    border-color: #e2e8f0;
    padding: 0.5rem 0.75rem;
}

.form-control:focus,
.form-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table thead th {
    background-color: #f8fafc;
    border-top: none;
    font-size: 0.75rem;
    letter-spacing: 0.02em;
}

.empty-icon-box {
    color: #94a3b8;
}

.stats-panel span {
    font-size: 0.9rem;
}
</style>