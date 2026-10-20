<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import ViewModalComponent from '~/coms/admin/dash/childs/modals/ViewModalComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';

definePageMeta({
    layout: 'admin'
})

const items = ref<any[]>([])
const loading = ref(false)
const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalEntries: 0,
    showingFrom: 0,
    showingTo: 0
})

const fetchItems = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/seo-pages', {
            headers: useRequestHeaders(['cookie']),
            query: {
                page: pagination.value.currentPage,
                limit: 10
            }
        })
        if (data && data.data) {
            items.value = data.data.data
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
        console.error("Failed to fetch SEO pages", error)
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

const isViewModalOpen = ref(false)
const viewModalItems = ref<{ label: string; value: any }[]>([])

const openViewModal = (item: any) => {
    viewModalItems.value = [
        { label: 'Tên', value: item.name },
        { label: 'Đường dẫn / Slug', value: item.slug },
        { label: 'Title', value: item.title },
        { label: 'Priority', value: item.priority },
        { label: 'Change Freq', value: item.change_freq },
        { label: 'Description', value: item.description || 'N/A' },
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
        await $fetch(`/api/v1/admin/seo-pages/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        fetchItems()
    } catch (error) {
        console.error("Failed to delete SEO page", error)
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold text-dark fs-5">SEO Pages Configuration</h5>
                <ToolTopRightComponent placeholder="Tìm kiếm Page..." link-create="/admin/seo-pages/create" />
            </div>

            <div class="card-body p-0 mt-3">
                <div class="table-responsive">
                    <table class="table mb-0 align-middle">
                        <thead class="bg-white">
                            <tr>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">TÊN</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">ĐƯỜNG DẪN / SLUG</th>
                                <th scope="col" class="py-3">PRIORITY</th>
                                <th scope="col" class="py-3">FREQ</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="5" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="items.length === 0">
                                <td colspan="5" class="text-center py-5">
                                    <p class="text-muted mb-0">Không tìm thấy trang SEO nào.</p>
                                </td>
                            </tr>
                            <tr v-else v-for="item in items" :key="item.id" class="border-top">
                                <td class="ps-4 py-3">
                                    <span class="fw-bold text-dark">{{ item.name }}</span>
                                </td>
                                <td class="py-3 text-muted">{{ item.slug }}</td>
                                <td class="py-3">
                                    <span class="badge bg-info-subtle text-info rounded-pill px-2">{{ item.priority }}</span>
                                </td>
                                <td class="py-3 text-muted">{{ item.change_freq }}</td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <button class="btn-action btn-view" type="button" @click="openViewModal(item)">
                                            <BaseIconComponent name="round-remove-red-eye" type="ic" :size="18" color="#6366f1" />
                                        </button>
                                        <NuxtLink :to="`/admin/seo-pages/edit/${item.id}`" class="btn-action btn-edit">
                                            <BaseIconComponent name="edit" :size="18" color="#d97706" />
                                        </NuxtLink>
                                        <button class="btn-action btn-delete" type="button" @click="openDeleteModal(item)">
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
            <ViewModalComponent v-model="isViewModalOpen" title="SEO Page Details" :items="viewModalItems" />
            <DeleteModalComponent v-model="isDeleteModalOpen" @confirm="handleDeleteConfirm" />
        </div>
    </div>
</template>

<style scoped>
.table th {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    border-bottom: 1px solid #f1f5f9;
}
.btn-action {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: none;
    transition: all 0.2s;
}
.btn-view { background-color: #e0e7ff; }
.btn-edit { background-color: #fef3c7; }
.btn-delete { background-color: #fee2e2; }
</style>
