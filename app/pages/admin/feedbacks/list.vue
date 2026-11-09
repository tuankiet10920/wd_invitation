<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PaginationComponent from '~/coms/admin/dash/childs/paginates/PaginationComponent.vue';
import ToolTopRightComponent from '~/coms/admin/dash/childs/toolbars/ToolTopRightComponent.vue';
import ViewModalComponent from '~/coms/admin/dash/childs/modals/ViewModalComponent.vue';
import DeleteModalComponent from '~/coms/admin/dash/childs/modals/DeleteModalComponent.vue';
import FancyBoxComponent from '~/coms/admin/dash/childs/modals/FancyBoxComponent.vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';

definePageMeta({
    layout: 'admin'
})

// Data for Display
const feedbacks = ref<any[]>([])
const loading = ref(false)
const filterSearch = ref('')

const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    totalEntries: 0,
    showingFrom: 0,
    showingTo: 0
})

const getAvatarUrl = (item: any) => {
    const av = item?.userAvatar
    if (!av || av === 'default.jpg' || av === 'default-avatar.png') {
        return '/images/avatars/default-avatar.png'
    }
    if (av.startsWith('http://') || av.startsWith('https://') || av.startsWith('/')) {
        return av
    }
    return `/images/avatars/${av}`
}

const fetchFeedbacks = async () => {
    loading.value = true
    try {
        const data: any = await $fetch('/api/v1/admin/feedbacks', {
            headers: useRequestHeaders(['cookie']),
            query: {
                page: pagination.value.currentPage,
                limit: 10,
                search: filterSearch.value || undefined
            }
        })
        if (data && data.data) {
            feedbacks.value = data.data.data || []
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
        console.error("Failed to fetch feedbacks", error)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// View Modal
const isViewModalOpen = ref(false)
const viewModalItems = ref<{ label: string; value: any }[]>([])

const openViewModal = (item: any) => {
    viewModalItems.value = [
        { label: 'Người gửi', value: item.userName },
        { label: 'Email', value: item.userEmail },
        { label: 'Số điện thoại', value: item.userPhone || 'N/A' },
        { label: 'Loại ý kiến', value: item.categoryName },
        { label: 'Tiêu đề', value: item.title },
        { label: 'Nội dung góp ý', value: item.content },
        { label: 'Trạng thái', value: item.status === 'resolved' ? 'Đã phản hồi' : 'Chờ xử lý' },
        { label: 'Phản hồi từ Admin', value: item.adminReply || 'Chưa có phản hồi' },
        { label: 'Ngày gửi', value: formatDate(item.createdAt) },
    ]
    isViewModalOpen.value = true
}

// Reply / Edit Modal
const isReplyModalOpen = ref(false)
const selectedFeedback = ref<any>(null)
const replyText = ref('')
const replyStatus = ref<'pending' | 'resolved'>('resolved')
const isSavingReply = ref(false)

const openReplyModal = (item: any) => {
    selectedFeedback.value = item
    replyText.value = item.adminReply || ''
    replyStatus.value = item.status === 'resolved' ? 'resolved' : 'resolved'
    isReplyModalOpen.value = true
}

const handleSaveReply = async () => {
    if (!selectedFeedback.value) return
    isSavingReply.value = true
    try {
        const res: any = await $fetch(`/api/v1/admin/feedbacks/${selectedFeedback.value.id}`, {
            method: 'PUT',
            body: {
                status: replyStatus.value,
                adminReply: replyText.value
            }
        })
        if (res?.success) {
            isReplyModalOpen.value = false
            await fetchFeedbacks()
        }
    } catch (error) {
        console.error("Failed to update feedback", error)
    } finally {
        isSavingReply.value = false
    }
}

// Delete Modal
const isDeleteModalOpen = ref(false)
const itemToDelete = ref<any>(null)

const openDeleteModal = (item: any) => {
    itemToDelete.value = item
    isDeleteModalOpen.value = true
}

const handleDeleteConfirm = async () => {
    if (!itemToDelete.value) return
    try {
        await $fetch(`/api/v1/admin/feedbacks/${itemToDelete.value.id}`, {
            method: 'DELETE'
        })
        isDeleteModalOpen.value = false
        fetchFeedbacks()
    } catch (error) {
        console.error("Failed to delete feedback", error)
    }
}

const handleSearchSubmit = () => {
    pagination.value.currentPage = 1
    fetchFeedbacks()
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null
watch(filterSearch, () => {
    if (searchDebounce) clearTimeout(searchDebounce)
    searchDebounce = setTimeout(() => {
        pagination.value.currentPage = 1
        fetchFeedbacks()
    }, 350)
})

const route = useRoute()

watch(() => route.query, async (query) => {
    let currentPage: number = 1
    if (query && Object.keys(query).length > 0) {
        if (Object.prototype.hasOwnProperty.call(query, 'page')) {
            currentPage = Number(query.page)
        }
    }
    pagination.value.currentPage = currentPage
    await fetchFeedbacks()
}, { immediate: true })
</script>

<template>
    <div class="container-fluid p-4">
        <div class="card border-0 shadow-sm rounded-3">
            <!-- Header -->
            <div class="card-header bg-white border-0 p-3 p-md-4 pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <h5 class="mb-0 fw-bold text-dark fs-5">Ý kiến phản hồi</h5>
                <ToolTopRightComponent v-model="filterSearch" placeholder="Tìm kiếm ý kiến phản hồi..."
                    link-create="/admin/feedbacks/create" @search="handleSearchSubmit" />
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
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">USER</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">LOẠI Ý KIẾN</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">NỘI DUNG PHẢN HỒI</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">HÌNH ẢNH</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">TRẠNG THÁI</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3">NGÀY GỬI</th>
                                <th scope="col" class="text-uppercase text-secondary fs-7 fw-semibold py-3 text-center">
                                    ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Loading State -->
                            <tr v-if="loading">
                                <td colspan="8" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-else-if="feedbacks.length === 0">
                                <td colspan="8" class="text-center py-5">
                                    <div class="d-flex flex-column align-items-center justify-content-center py-4">
                                        <Icon name="mingcute:empty-box-fill" size="48" class="text-muted mb-2" />
                                        <p class="text-muted mb-0">Không tìm thấy ý kiến phản hồi nào.</p>
                                    </div>
                                </td>
                            </tr>

                            <tr v-else v-for="item in feedbacks" :key="item.id" class="border-top">
                                <td class="ps-4 py-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox">
                                    </div>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex align-items-center gap-3">
                                        <FancyBoxComponent class="flex-jc-ac rounded-circle overflow-hidden"
                                            :data-fancybox="`avatar-${item.id}`" :height="40" :width="40"
                                            :url="getAvatarUrl(item)"
                                            :key="`avatar-${item.id}`" />
                                        <div class="d-flex flex-column">
                                            <span class="fw-medium text-dark">{{ item.userName }}</span>
                                            <span class="text-muted small">{{ item.userEmail }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-3 text-dark fw-medium">{{ item.categoryName }}</td>
                                <td class="py-3" style="max-width: 340px;">
                                    <div class="d-flex flex-column">
                                        <span class="fw-medium text-dark">{{ item.title }}</span>
                                        <span class="text-muted small text-truncate" :title="item.content">{{ item.content }}</span>
                                        <span v-if="item.adminReply" class="text-primary small mt-1 text-truncate" :title="item.adminReply">
                                            Phản hồi: {{ item.adminReply }}
                                        </span>
                                    </div>
                                </td>
                                <td class="py-3">
                                    <div v-if="item.galleries && item.galleries.length > 0" class="d-flex align-items-center gap-2">
                                        <FancyBoxComponent v-for="gal in item.galleries" :key="gal.id"
                                            class="flex-jc-ac rounded overflow-hidden border"
                                            :data-fancybox="`feedback-gallery-${item.id}`" :height="40" :width="40"
                                            :url="`/images/user_feedback/USER_FEEDBACK_${gal.id}.png`" />
                                    </div>
                                    <span v-else class="text-muted small">---</span>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="badge rounded-pill fw-normal" :class="{
                                            'bg-success-subtle text-success': item.status === 'resolved',
                                            'bg-secondary-subtle text-secondary': item.status !== 'resolved'
                                        }" style="font-size: 0.8rem; padding: 6px 12px;">
                                            {{ item.status === 'resolved' ? 'Đã phản hồi' : 'Chờ xử lý' }}
                                        </span>
                                    </div>
                                </td>
                                <td class="py-3">
                                    <div class="d-flex align-items-center gap-3" style="width: 160px;">
                                        <span class="text-muted fw-medium fs-7">{{ formatDate(item.createdAt) }}</span>
                                    </div>
                                </td>
                                <td class="py-3 text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <button class="btn-action btn-view" type="button" title="Xem chi tiết"
                                            @click="openViewModal(item)">
                                            <BaseIconComponent name="round-remove-red-eye" type="ic" :size="18"
                                                color="#6366f1" />
                                        </button>
                                        <button class="btn-action btn-edit" type="button" title="Phản hồi người dùng"
                                            @click="openReplyModal(item)">
                                            <BaseIconComponent name="message-circle" type="lucide" :size="17"
                                                color="#d97706" />
                                        </button>
                                        <button class="btn-action btn-delete" type="button" title="Xóa"
                                            @click="openDeleteModal(item)">
                                            <BaseIconComponent name="trash-2" type="lucide" :size="17"
                                                color="#dc2626" />
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
            <ViewModalComponent v-model="isViewModalOpen" title="Chi tiết ý kiến phản hồi" :items="viewModalItems" />
            <DeleteModalComponent v-model="isDeleteModalOpen" @confirm="handleDeleteConfirm" />

            <!-- Modal Phản hồi người dùng -->
            <Teleport to="body">
                <ModalZoomCenterComponent v-model="isReplyModalOpen">
                    <div class="reply-modal-container" v-if="selectedFeedback">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold m-0 fs-5">Phản hồi ý kiến</h5>
                            <button class="btn-close-modal" @click="isReplyModalOpen = false">
                                <BaseIconComponent name="close-circle-outline" type="mdi" :size="24" class="text-secondary" />
                            </button>
                        </div>

                        <div class="mb-3 p-3 rounded-3 bg-light border">
                            <div class="fw-medium text-dark mb-1">{{ selectedFeedback.title }}</div>
                            <div class="text-secondary small" style="white-space: pre-line;">{{ selectedFeedback.content }}</div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-dark">Trạng thái xử lý</label>
                            <select v-model="replyStatus" class="form-select">
                                <option value="resolved">Đã phản hồi</option>
                                <option value="pending">Chờ xử lý</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-dark">Nội dung phản hồi tới người dùng</label>
                            <textarea v-model="replyText" rows="4" class="form-control"
                                placeholder="Nhập nội dung phản hồi..."></textarea>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-light border px-3" @click="isReplyModalOpen = false">Hủy</button>
                            <button class="btn btn-primary px-4" :disabled="isSavingReply" @click="handleSaveReply">
                                {{ isSavingReply ? 'Đang lưu...' : 'Lưu phản hồi' }}
                            </button>
                        </div>
                    </div>
                </ModalZoomCenterComponent>
            </Teleport>
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
    color: #d97706;
}

.btn-edit:hover {
    background-color: #fde68a;
    color: #b45309;
}

.btn-delete {
    background-color: #fee2e2;
    color: #dc2626;
}

.btn-delete:hover {
    background-color: #fecaca;
    color: #b91c1c;
}

.btn-view {
    background-color: #e0e7ff;
    color: #4338ca;
}

.btn-view:hover {
    background-color: #c7d2fe;
    color: #3730a3;
}

.reply-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 500px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close-modal:hover {
    opacity: 0.7;
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
