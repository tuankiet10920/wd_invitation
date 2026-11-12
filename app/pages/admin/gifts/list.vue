<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import ViewModalComponent from '~/coms/admin/dash/childs/modals/ViewModalComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';
import FancyBoxComponent from '~/coms/admin/dash/childs/modals/FancyBoxComponent.vue';

definePageMeta({
    layout: 'admin'
})

const items = ref<any[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalEntries: 0,
    showingFrom: 0,
    showingTo: 0
})

const resolveGiftImageUrl = (filename: string) => {
    if (!filename) return '/others/cinelove-default-thumbnail.jpg'
    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/')) {
        return filename
    }
    return `/images/gift_images/${filename}`
}

const fetchItems = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/gifts', {
            headers: useRequestHeaders(['cookie']),
            query: {
                page: pagination.value.currentPage,
                limit: 10,
                search: searchKeyword.value
            }
        })
        if (data && data.data) {
            items.value = data.data.data || []
            const totalCount = data.data.totalCount || 0
            const currentPage = data.data.currentPage || 1
            pagination.value = {
                currentPage,
                totalPages: data.data.totalPages || 1,
                totalCount,
                totalEntries: totalCount,
                showingFrom: totalCount === 0 ? 0 : (currentPage - 1) * 10 + 1,
                showingTo: Math.min(currentPage * 10, totalCount)
            }
        }
    } catch (error) {
        console.error("Failed to fetch gifts", error)
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    pagination.value.currentPage = 1
    fetchItems()
}

const isViewModalOpen = ref(false)
const viewModalItems = ref<{ label: string; value: any }[]>([])

const openViewModal = (item: any) => {
    viewModalItems.value = [
        { label: 'ID', value: `#${item.id}` },
        { label: 'Tên quà tặng', value: item.name },
        { label: 'Giá (Xu)', value: `${(Number(item.price) || 0).toLocaleString('vi-VN')} Xu` },
        { label: 'Hình ảnh', value: item.image || '-' },
        { label: 'Hình nền', value: item.background || '-' },
        { label: 'Tệp hiệu ứng (.bin)', value: item.file || '-' },
    ]
    isViewModalOpen.value = true
}

const isDeleteModalOpen = ref(false)
const itemToDelete = ref<any>(null)

const openDeleteModal = (item: any) => {
    itemToDelete.value = item
    isDeleteModalOpen.value = true
}

const handleDeleteConfirm = async () => {
    if (!itemToDelete.value) return
    try {
        await $fetch(`/api/v1/admin/gifts/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        fetchItems()
    } catch (error) {
        console.error("Failed to delete gift", error)
    }
}

const route = useRoute()

watch(() => route.query, async (query) => {
    let currentPage: number = 1
    if (query && Object.keys(query).length > 0) {
        if (Object.prototype.hasOwnProperty.call(query, 'page')) {
            currentPage = Number(query.page)
        }
    }
    pagination.value.currentPage = currentPage
    await fetchItems()
}, { immediate: true })
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <!-- Header -->
            <div class="card-header bg-white border-0 p-3 p-md-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 class="mb-0 fw-bold text-dark fs-5">Quản lý quà tặng</h5>
                <ToolTopRightComponent v-model="searchKeyword" placeholder="Tìm kiếm quà tặng..."
                    link-create="/admin/gifts/create" @search="handleSearch" />
            </div>

            <div class="card-body p-0 mt-3">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-white">
                            <tr>
                                <th scope="col" class="ps-4 py-3" style="width: 50px;">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="checkAll">
                                    </div>
                                </th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">QUÀ TẶNG</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">GIÁ (XU)</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">FILE HIỆU ỨNG</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loading State -->
                            <tr v-if="loading">
                                <td colspan="5" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-else-if="items.length === 0">
                                <td colspan="5" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center justify-content-center py-4">
                                        <Icon name="mingcute:empty-box-fill" size="48" class="text-muted mb-2" />
                                        <p class="text-muted mb-0">Không tìm thấy quà tặng nào.</p>
                                    </div>
                                </td>
                            </tr>

                            <tr v-else v-for="item in items" :key="item.id" class="border-top">
                                <td class="ps-4 py-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox">
                                    </div>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <FancyBoxComponent class="flex-jc-ac rounded-3 overflow-hidden border bg-light"
                                            :data-fancybox="`gift-gallery`" :height="44" :width="44"
                                            :url="resolveGiftImageUrl(item.image)"
                                            :key="`gift-${item.id}`" />
                                        <div class="d-flex flex-column">
                                            <span class="fw-bold text-dark">{{ item.name }}</span>
                                            <span class="text-muted small">{{ item.image }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3">
                                    <span class="badge rounded-pill bg-warning-subtle text-warning-emphasis fw-bold"
                                        style="font-size: 0.85rem; padding: 6px 12px;">
                                        {{ (Number(item.price) || 0).toLocaleString('vi-VN') }} Xu
                                    </span>
                                </td>
                                <td class="py-3">
                                    <span class="text-muted small font-monospace">{{ item.file || '-' }}</span>
                                </td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <button class="btn-action btn-view" type="button" title="Xem chi tiết"
                                            @click="openViewModal(item)">
                                            <BaseIconComponent name="round-remove-red-eye" type="ic" :size="18"
                                                color="#6366f1" />
                                        </button>
                                        <NuxtLink :to="{
                                            path: `/admin/gifts/edit/${item.id}`,
                                            query: { page: $route.query?.page ?? undefined }
                                        }" class="btn-action btn-edit" title="Chỉnh sửa">
                                            <BaseIconComponent name="edit" :size="18" color="#d97706" />
                                        </NuxtLink>
                                        <button class="btn-action btn-delete" type="button" title="Xóa"
                                            @click="openDeleteModal(item)">
                                            <BaseIconComponent name="delete-sharp" :size="18" color="#dc2626" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <PaginationComponent v-if="pagination.totalPages > 1" :current-page="pagination.currentPage"
                :total-pages="pagination.totalPages" :total-entries="pagination.totalEntries"
                :showing-from="pagination.showingFrom" :showing-to="pagination.showingTo" />
            <ViewModalComponent v-model="isViewModalOpen" title="Chi tiết quà tặng" :items="viewModalItems" />
            <DeleteModalComponent v-model="isDeleteModalOpen" @confirm="handleDeleteConfirm" />
        </div>
    </div>
</template>

<style scoped>
.fs-7 {
    font-size: 0.875rem;
}

.fs-8 {
    font-size: 0.75rem;
}

.table th {
    font-weight: 600;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #f1f5f9;
}

.table td {
    vertical-align: middle;
    color: #475569;
}

.table tr.border-top {
    border-top: 1px solid #f1f5f9 !important;
}

.form-check-input {
    width: 1.25em;
    height: 1.25em;
    border-color: #cbd5e1;
    border-radius: 4px;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #7B61FF;
    border-color: #7B61FF;
}

.card {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

.btn-action {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: none;
    transition: all 0.2s ease;
}

.btn-view {
    background-color: #e0e7ff;
    color: #4f46e5;
}

.btn-view:hover {
    background-color: #c7d2fe;
}

.btn-edit {
    background-color: #fef3c7;
    color: #d97706;
}

.btn-edit:hover {
    background-color: #fde68a;
}

.btn-delete {
    background-color: #fee2e2;
    color: #dc2626;
}

.btn-delete:hover {
    background-color: #fecaca;
}
</style>

