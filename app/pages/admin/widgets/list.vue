<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import ViewModalComponent from '~/coms/admin/dash/childs/modals/ViewModalComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';

definePageMeta({
    layout: 'admin'
})

const widgets = ref<any[]>([])
const loading = ref(false)
const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalEntries: 0,
    showingFrom: 0,
    showingTo: 0
})

const fetchWidgets = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/widgets', {
            headers: useRequestHeaders(['cookie']),
            query: {
                page: pagination.value.currentPage,
                limit: 10
            }
        })
        if (data && data.data) {
            widgets.value = data.data.data
            pagination.value = {
                currentPage: data.data.currentPage,
                totalPages: data.data.totalPages,
                totalCount: data.data.totalCount,
                totalEntries: data.data.totalCount,
                showingFrom: data.data.totalCount === 0 ? 0 : (data.data.currentPage - 1) * 10 + 1,
                showingTo: Math.min(data.data.currentPage * 10, data.data.totalCount)
            }
        }
    } catch (error) {
        console.error("Failed to fetch widgets", error)
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
    await fetchWidgets()
}, { immediate: true })

const isViewModalOpen = ref(false)
const viewModalItems = ref<{ label: string; value: any }[]>([])

const openViewModal = (widget: any) => {
    viewModalItems.value = [
        { label: 'Tên', value: widget.name },
        { label: 'Đường dẫn / Slug', value: widget.slug },
        { label: 'Key', value: widget.key },
        { label: 'Biểu tượng', value: widget.icon },
        { label: 'Loại biểu tượng', value: widget.icon_type },
        { label: 'Color', value: widget.color },
        { label: 'Gói tối thiểu', value: widget.id_min_package },
    ]
    isViewModalOpen.value = true;
};

const isDeleteModalOpen = ref(false);
const itemToDelete = ref<any>(null);

const openDeleteModal = (item: any) => {
    itemToDelete.value = item;
    isDeleteModalOpen.value = true;
};

const handleDeleteConfirm = async () => {
    if (!itemToDelete.value) return
    try {
        await $fetch(`/api/v1/admin/widgets/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        fetchWidgets()
    } catch (error) {
        console.error("Failed to delete widget", error)
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-dark fs-5">Widgets List</h5>
                <ToolTopRightComponent placeholder="Tìm kiếm tiện ích..." link-create="/admin/widgets/create" />
            </div>

            <div class="card-body p-0 mt-3">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-white">
                            <tr>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">TÊN</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">KEY</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">BIỂU TƯỢNG</th>
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
                            <tr v-else-if="widgets.length === 0">
                                <td colspan="4" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center justify-content-center py-4">
                                        <Icon name="mingcute:empty-box-fill" size="48" class="text-muted mb-2" />
                                        <p class="text-muted mb-0">Không tìm thấy tiện ích nào.</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else v-for="widget in widgets" :key="widget.id" class="border-top">
                                <td class="ps-4 py-3 fw-medium text-dark">{{ widget.name }}</td>
                                <td class="py-3">
                                    <code class="text-primary fw-medium">{{ widget.key }}</code>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <BaseIconComponent v-if="widget.icon" :name="widget.icon" :type="widget.icon_type || 'mdi'" :size="20" :color="widget.color" />
                                        <span class="text-muted">{{ widget.icon }}</span>
                                    </div>
                                </td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <button class="btn-action btn-view" type="button" title="Xem chi tiết" @click="openViewModal(widget)">
                                            <BaseIconComponent name="round-remove-red-eye" type="ic" :size="18" color="#6366f1" />
                                        </button>
                                        <NuxtLink :to="{ path: `/admin/widgets/edit/${widget.id}`, query: { page: $route.query?.page ?? undefined } }" class="btn-action btn-edit" title="Chỉnh sửa">
                                            <BaseIconComponent name="edit" :size="18" color="#d97706" />
                                        </NuxtLink>
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
            <ViewModalComponent v-model="isViewModalOpen" title="Widget Details" :items="viewModalItems" />
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
.card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important; }
.btn-action { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: none; transition: all 0.2s ease; }
.btn-edit { background-color: #fef3c7; color: #d97706; }
.btn-edit:hover { background-color: #fde68a; color: #b45309; }
.btn-delete { background-color: #fee2e2; color: #dc2626; }
.btn-delete:hover { background-color: #fecaca; color: #b91c1c; }
.btn-view { background-color: #e0e7ff; color: #4338ca; }
.btn-view:hover { background-color: #c7d2fe; color: #3730a3; }
</style>
