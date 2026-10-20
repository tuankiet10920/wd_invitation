<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationTableComponent from '~/coms/dashboard/childs/paginates/PaginationTableComponent.vue';
import DeleteWishComponent from '~/coms/dashboard/modal/DeleteWishComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

const router = useRouter();

const data = ref<{
    stats: {
        totalWishes: number;
        latestWish: string | null;
        totalCards: number;
    };
    wishes: any[];
} | null>(null)

const formatDate = (dateStr: string) => {
    if (!dateStr) return '---'
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const fetchWishes = async () => {
    try {
        const response = await $fetch<any>('/api/v1/client/wish')
        if (response.success) {
            data.value = response.data
        }
    } catch (error) {
        console.error("Failed to fetch wishes", error)
    }
}

const wishStats = computed(() => [
    {
        label: 'Tổng lời chúc',
        value: data.value?.stats.totalWishes || 0,
        unit: 'lời chúc',
        icon: 'mail',
        color: 'text-primary'
    },
    {
        label: 'Lời chúc mới nhất',
        value: data.value?.stats.latestWish ? formatDate(data.value.stats.latestWish) : 'Chưa có',
        unit: '',
        icon: 'clock',
        color: 'text-success'
    },
    {
        label: 'Trang nhận lời chúc',
        value: data.value?.stats.totalCards || 0,
        unit: 'trang',
        icon: 'heart',
        color: 'text-danger'
    }
])

const tableHeaders = ['Người gửi', 'Lời chúc', 'Ngày nhận', 'Trang', 'Thao tác']

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Delete logic
const isDeleteModalOpen = ref(false)
const selectedWishToDelete = ref<any>(null)

const handleDeleteClick = (wish: any) => {
    selectedWishToDelete.value = wish
    isDeleteModalOpen.value = true
}

const handleConfirmDelete = async () => {
    if (!selectedWishToDelete.value) return

    try {
        const id = selectedWishToDelete.value.id
        const res: any = await $fetch(`/api/v1/client/wish/${id}`, {
            method: 'DELETE'
        })

        if (res.success) {
            // Remove from list
            if (data.value?.wishes) {
                data.value.wishes = data.value.wishes.filter((w: any) => w.id !== id)
            }
            alert('Đã xóa lời chúc thành công!')
        }
    } catch (error) {
        console.error("Failed to delete wish", error)
        alert('Có lỗi xảy ra khi xóa lời chúc.')
    } finally {
        isDeleteModalOpen.value = false
        selectedWishToDelete.value = null
    }
}

const paginatedWishes = computed(() => {
    if (!data.value?.wishes) return []
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return data.value.wishes.slice(start, end)
})

watch(itemsPerPage, () => {
    currentPage.value = 1
})

onMounted(fetchWishes)
</script>

<template>
    <div class="dashboard-cover blessing-box-container">
        <!-- Header -->
        <div class="d-flex align-items-center gap-3 mb-4 mt-2">
            <ButtonReturnMobileComponent />
            <div class="d-flex align-items-center gap-2">
                <BaseIconComponent name="round-favorite" type="ic" :size="24" color="#ef4444" fill="#ef4444" />
                <h5 class="fw-bold mb-0 text-dark header-title">Hộp lời chúc</h5>
            </div>
        </div>

        <!-- Stats Grid (2x2-like on mobile) -->
        <div class="row g-2 mb-4">
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="mail" type="lucide" :size="14" />
                        <span class="si-text">Tổng lời chúc</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-primary">{{ data?.stats.totalWishes || 0 }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="clock" type="lucide" :size="14" />
                        <span class="si-text">Mới nhất</span>
                    </div>
                    <div class="h4 new-text fw-bold mb-0" style="color: #65a30d;">{{ data?.stats.latestWish ?
                        formatDate(data?.stats.latestWish) : 'Chưa có' }}</div>
                </div>
            </div>
            <div class="col-12 mt-2">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="heart" type="lucide" :size="14" />
                        <span class="si-text">Số trang</span>
                    </div>
                    <div class="h4 fw-bold mb-0" style="color: #9333ea;">{{ data?.stats.totalCards || 0 }}</div>
                </div>
            </div>
        </div>

        <div class="mb-2">
            <h6 class="fw-bold text-dark">Danh sách lời chúc ({{ data?.wishes.length || 0 }})</h6>
        </div>

        <!-- Wishes List Content -->
        <div v-if="data && data.wishes.length > 0">
            <!-- Desktop Table View -->
            <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden d-none d-md-block">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-light border-bottom">
                            <tr>
                                <th class="ps-3 py-3 small fw-bold text-muted text-uppercase">Người gửi</th>
                                <th class="py-3 small fw-bold text-muted text-uppercase">Lời chúc</th>
                                <th class="pe-3 py-3 small fw-bold text-muted text-uppercase text-center">Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="wish in paginatedWishes" :key="wish.id" class="border-bottom">
                                <td class="ps-3 py-3">
                                    <div class="fw-bold text-dark">{{ wish.name }}</div>
                                    <div class="text-secondary" style="font-size: 11px;">{{ formatDate(wish.createdAt)
                                    }}</div>
                                </td>
                                <td class="py-3">
                                    <div class="text-secondary small">{{ wish.content }}</div>
                                    <div class="mt-1">
                                        <nuxt-link :to="'/dashboard/pages/' + wish.cardSlug"
                                            class="text-primary text-decoration-none" style="font-size: 11px;">
                                            {{ wish.cardName }}
                                        </nuxt-link>
                                    </div>
                                </td>
                                <td class="pe-3 py-3 text-center">
                                    <button class="btn btn-link text-danger p-0 border-0"
                                        @click="handleDeleteClick(wish)">
                                        <BaseIconComponent name="trash-2" type="lucide" :size="16" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="d-flex flex-column gap-3 d-md-none">
                <div v-for="wish in paginatedWishes" :key="wish.id"
                    class="card border-0 shadow-sm rounded-4 bg-white p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <BaseIconComponent name="user" type="lucide" :size="16" color="#374151" />
                            <span class="fw-bold text-dark">{{ wish.name }}</span>
                        </div>
                        <button class="btn btn-link text-danger p-0 border-0" @click="handleDeleteClick(wish)">
                            <BaseIconComponent name="trash-2" type="lucide" :size="18" />
                        </button>
                    </div>
                    <div class="text-secondary wish-content small mb-3">{{ wish.content }}</div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fw-normal"
                            style="font-size: 11px; border-radius: 6px;">
                            Bản sao: {{ wish.cardName }}
                        </div>
                        <div class="d-flex align-items-center gap-1 text-muted" style="font-size: 11px;">
                            <BaseIconComponent name="calendar" type="lucide" :size="12" />
                            <span>{{ formatDate(wish.createdAt).split(',')[0] }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PAGINATE -->
            <PaginationTableComponent v-model="currentPage" v-model:items-per-page="itemsPerPage"
                :total-items="data?.wishes.length || 0" class="mt-3" />
        </div>

        <!-- Empty State -->
        <div v-else class="card border-0 rounded-4 shadow-sm bg-white p-5 text-center">
            <p class="text-muted mb-0" style="font-size: 1.1rem;">Chưa có lời chúc nào</p>
        </div>

        <!-- Modals -->
        <DeleteWishComponent v-model="isDeleteModalOpen" :wish-id="selectedWishToDelete?.id"
            @confirm="handleConfirmDelete" />
    </div>
</template>

<style scoped>
.wish-box-page {
    background-color: #f8fafc;
}

.card {
    transition: transform 0.2s;
}

.text-primary {
    color: #007bff !important;
}

.text-success {
    color: #28a745 !important;
}

.text-danger {
    color: #dc3545 !important;
}

/* Kiểu dáng cho bảng */
.table thead th {
    font-size: 12px;
    letter-spacing: 0.5px;
}

.letter-spacing-1 {
    letter-spacing: 1px;
}

.bg-light {
    background-color: #f8f9fa !important;
}

/* Tùy chỉnh thanh cuộn cho bảng nếu dữ liệu nhiều */
.table-responsive {
    max-height: 600px;
}

@media (max-width: 768px) {
    .blessing-box-container {
        padding: 20px 8px 40px 8px;
    }

    .si-text {
        font-size: 12px !important;
    }

    .new-text {
        font-size: 14px !important;
    }

    .wish-content {
        margin-bottom: 8px !important;
    }
}
</style>