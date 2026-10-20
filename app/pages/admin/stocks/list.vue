<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';

definePageMeta({ layout: 'admin' })

const items = ref<any[]>([])
const loading = ref(false)
const pagination = ref({
    currentPage: 1, totalPages: 1, totalCount: 0,
    totalEntries: 0, showingFrom: 0, showingTo: 0
})

const fetchItems = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/stocks', {
            headers: useRequestHeaders(['cookie']),
            query: { page: pagination.value.currentPage, limit: 10 }
        })
        if (data && data.data) {
            items.value = data.data
            pagination.value = {
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalCount: data.totalCount,
                totalEntries: data.totalCount,
                showingFrom: data.totalCount === 0 ? 0 : (data.currentPage - 1) * 10 + 1,
                showingTo: Math.min(data.currentPage * 10, data.totalCount)
            }
        }
    } catch (error) {
        console.error("Failed to fetch stocks", error)
    } finally {
        loading.value = false
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

const isDeleteModalOpen = ref(false);
const itemToDelete = ref<any>(null);

const openDeleteModal = (item: any) => {
    itemToDelete.value = item;
    isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
    if (!itemToDelete.value) return
    try {
        await $fetch(`/api/v1/admin/stocks/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        fetchItems()
    } catch (error) {
        console.error("Failed to delete stock", error)
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-dark fs-5">Quản lý kho Stock</h5>
                <ToolTopRightComponent placeholder="Tìm kiếm kho Stock..." link-create="/admin/stocks/create" />
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
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">IMAGE PREVIEW</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">DANH MỤC</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">FORMAT</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="4" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="items.length === 0">
                                <td colspan="4" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center justify-content-center py-4">
                                        <Icon name="mingcute:empty-box-fill" size="48" class="text-muted mb-2" />
                                        <p class="text-muted mb-0">Không tìm thấy stock nào.</p>
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
                                    <img :src="item.type === 'svg' ? `/images/stocks/lists/${item.url}` : `/images/stocks/thumbnails/${item.url.replace(/\.[^/.]+$/, '.webp')}`" alt="stock" class="rounded object-fit-cover shadow-sm bg-light" style="width: 80px; height: 80px;" />
                                </td>
                                <td class="py-3 text-center">
                                    <span class="badge bg-primary-subtle text-primary">{{ item.imageType?.name || 'N/A' }}</span>
                                </td>
                                <td class="py-3 text-center">
                                    <span class="badge bg-secondary-subtle text-secondary text-uppercase">{{ item.type || 'img' }}</span>
                                </td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <NuxtLink :to="{
                                            path: `/admin/stocks/edit/${item.id}`,
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
            <DeleteModalComponent v-model="isDeleteModalOpen" @confirm="handleDeleteConfirm" />
        </div>
    </div>
</template>

<style scoped>
.fs-7 { font-size: 0.875rem; }
.fs-8 { font-size: 0.75rem; }
.table th { font-weight: 600; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
.table td { vertical-align: middle; color: #475569; }
.table tr.border-top { border-top: 1px solid #f1f5f9 !important; }
.form-check-input { width: 1.25em; height: 1.25em; border-color: #cbd5e1; border-radius: 4px; cursor: pointer; }
.form-check-input:checked { background-color: #7B61FF; border-color: #7B61FF; }
.card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important; }
.btn-action { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: none; transition: all 0.2s ease; }
.btn-edit { background-color: #fef3c7; color: #d97706; }
.btn-edit:hover { background-color: #fde68a; color: #b45309; }
.btn-delete { background-color: #fee2e2; color: #dc2626; }
.btn-delete:hover { background-color: #fecaca; color: #b91c1c; }
</style>
