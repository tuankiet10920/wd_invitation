<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import ViewModalComponent from '~/coms/admin/dash/childs/modals/ViewModalComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';

definePageMeta({
    layout: 'admin'
})

// Data for Card Templates
const templates = ref<any[]>([])
const loading = ref(false)
const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalEntries: 0,
    showingFrom: 0,
    showingTo: 0
})

const fetchTemplates = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/card-templates', {
            headers: useRequestHeaders(['cookie']),
            query: {
                page: pagination.value.currentPage,
                limit: 10
            }
        })
        if (data && data.data) {
            templates.value = data.data.data
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
        console.error("Failed to fetch templates", error)
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
    await fetchTemplates()
}, { immediate: true })


const isViewModalOpen = ref(false)
const viewModalItems = ref<{ label: string; value: any }[]>([])

const openViewModal = async (tpl: any) => {
    let detail = tpl;
    if (tpl.nodes === undefined) {
        try {
            const data: any = await $fetch(`/api/v1/admin/card-templates/${tpl.id}`);
            if (data && data.data) detail = data.data;
        } catch (e) {
            console.error(e);
        }
    }

    viewModalItems.value = [
        { label: 'Tên', value: detail.name },
        { label: 'Category', value: detail.category?.name || 'Chưa phân loại' },
        { label: 'Template', value: detail.is_template ? 'Yes' : 'No' },
        { label: 'Template User', value: detail.is_template_user ? 'Yes' : 'No' },
        { label: 'Status', value: detail.is_publish ? 'Published' : 'Unpublished' },
        { label: 'Views', value: detail.views },
        { label: 'Public', value: detail.is_public ? 'Yes' : 'No' },
    ]
    isViewModalOpen.value = true
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
        await $fetch(`/api/v1/admin/card-templates/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        // Refresh list
        fetchTemplates()
    } catch (error) {
        console.error("Failed to delete template", error)
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <!-- Header -->
            <div class="card-header bg-white border-0 p-3 p-md-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 class="mb-0 fw-bold text-dark fs-5">Card Templates</h5>
                <ToolTopRightComponent placeholder="Tìm kiếm Template..." link-create="/admin/card-templates/create" />
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
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">TÊN</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">CATEGORY
                                </th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">
                                    TEMPLATE</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">
                                    TEMPLATE USER</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">TRẠNG THÁI</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">
                                    ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loading State -->
                            <tr v-if="loading">
                                <td colspan="7" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-else-if="templates.length === 0">
                                <td colspan="7" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center justify-content-center py-4">
                                        <Icon name="mingcute:empty-box-fill" size="48" class="text-muted mb-2" />
                                        <p class="text-muted mb-0">No templates found.</p>
                                    </div>
                                </td>
                            </tr>

                            <tr v-else v-for="tpl in templates" :key="tpl.id" class="border-top">
                                <td class="ps-4 py-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox">
                                    </div>
                                </td>
                                <td class="py-3">
                                    <span class="fw-bold text-dark">{{ tpl.name }}</span>
                                </td>
                                <td class="py-3 text-dark">{{ tpl.category?.name || 'Chưa phân loại' }}</td>
                                <td class="py-3 text-center">
                                    <BaseIconComponent name="circle" :size="16"
                                        :color="tpl.is_template ? '#3b82f6' : '#9ca3af'" />
                                </td>
                                <td class="py-3 text-center">
                                    <BaseIconComponent name="circle" :size="16"
                                        :color="tpl.is_template_user ? '#3b82f6' : '#9ca3af'" />
                                </td>
                                <td class="py-3">
                                    <span class="badge rounded-pill fw-normal" :class="{
                                        'bg-success-subtle text-success': tpl.is_publish,
                                        'bg-secondary-subtle text-secondary': !tpl.is_publish
                                    }">{{ tpl.is_publish ? 'Published' : 'Unpublished' }}</span>
                                </td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <button class="btn-action btn-view" type="button" title="Xem chi tiết"
                                            @click="openViewModal(tpl)">
                                            <BaseIconComponent name="round-remove-red-eye" type="ic" :size="18"
                                                color="#6366f1" />
                                        </button>
                                        <NuxtLink :to="{
                                            path: `/admin/card-templates/edit/${tpl.id}`,
                                            query: { page: $route.query?.page ?? undefined }
                                        }" class="btn-action btn-edit" title="Chỉnh sửa">
                                            <BaseIconComponent name="edit" :size="18" color="#d97706" />
                                        </NuxtLink>
                                        <button class="btn-action btn-delete" type="button" title="Xóa"
                                            @click="openDeleteModal(tpl)">
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
            <ViewModalComponent v-model="isViewModalOpen" title="Template Details" :items="viewModalItems" />
            <DeleteModalComponent v-model="isDeleteModalOpen" @confirm="handleDeleteConfirm" />
        </div>
    </div>
</template>

<style scoped>
/* Typography */
.fs-7 {
    font-size: 0.875rem;
}

.fs-8 {
    font-size: 0.75rem;
}

/* Table Styles */
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

/* Checkbox */
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

/* Card */
.card {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

/* Action Buttons */
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

.btn-edit {
    background-color: #fef3c7;
    /* Amber-100 */
    color: #d97706;
    /* Amber-600 */
}

.btn-edit:hover {
    background-color: #fde68a;
    /* Amber-200 */
    color: #b45309;
    /* Amber-700 */
}

.btn-delete {
    background-color: #fee2e2;
    /* Red-100 */
    color: #dc2626;
    /* Red-600 */
}

.btn-delete:hover {
    background-color: #fecaca;
    /* Red-200 */
    color: #b91c1c;
    /* Red-700 */
}

.btn-view {
    background-color: #c7d2fe;
    color: #3730a3;
}

@media (max-width: 767.98px) {
    .container-fluid {
        padding: 1rem !important;
    }
    
    .card-header {
        padding: 1.25rem !important;
        padding-bottom: 0 !important;
    }
}
</style>
