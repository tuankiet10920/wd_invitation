<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import AddInvitorComponent from '~/coms/dashboard/modal/AddInvitorComponent.vue';
import DeleteInvitorComponent from '~/coms/dashboard/modal/DeleteInvitorComponent.vue';
import DetailInvitorComponent from '~/coms/dashboard/modal/DetailInvitorComponent.vue';
import AddBatchInvitorComponent from '~/coms/dashboard/modal/AddBatchInvitorComponent.vue';
import EditInvitorComponent from '~/coms/dashboard/modal/EditInvitorComponent.vue';
import ImportFileInvitorComponent from '~/coms/dashboard/modal/ImportFileInvitorComponent.vue';
import PaginationTableComponent from '~/coms/dashboard/childs/paginates/PaginationTableComponent.vue';
import { useRuntimeConfig } from '#app';


definePageMeta({
    layout: 'dashboard'
})

const { $toast } = useNuxtApp() as unknown as { $toast: any };
const currentTab = ref('actions');
const isAddModalOpen = ref(false);
const isAddBatchModalOpen = ref(false);
const isImportModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedInvitorToDelete = ref<any>(null);
const selectedInvitorToDetail = ref<any>(null);
const selectedInvitorToEdit = ref<any>(null);
const invitorsList = ref<any[]>([]);
const isLoading = ref(true);
const configs = useRuntimeConfig()
const isCopied = ref(false)

const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const filterConfirm = ref('all');
const filterSend = ref('all');
const filterView = ref('all');

// Computed list based on filters
const filteredInvitorsList = computed(() => {
    return invitorsList.value.filter(invitor => {
        // Search Filter
        const name = (invitor.contentData?.value || '').toLowerCase();
        let matchSearch = true;
        if (searchQuery.value) {
            matchSearch = name.includes(searchQuery.value.trim().toLowerCase());
        }

        // Confirm Filter
        let matchConfirm = true;
        if (filterConfirm.value !== 'all') {
            if (filterConfirm.value === 'confirmed') matchConfirm = invitor.is_confirm === 'confirmed';
            else if (filterConfirm.value === 'refuse') matchConfirm = invitor.is_confirm === 'refuse';
            else if (filterConfirm.value === 'not_yet') matchConfirm = !invitor.is_confirm || invitor.is_confirm === 'not_yet' || invitor.is_confirm === false;
        }

        // Send Filter
        let matchSend = true;
        if (filterSend.value !== 'all') {
            const isSent = Boolean(invitor.is_send);
            matchSend = filterSend.value === 'sent' ? isSent : !isSent;
        }

        // View Filter
        let matchView = true;
        if (filterView.value !== 'all') {
            const isViewed = (invitor.views || 0) > 0;
            matchView = filterView.value === 'viewed' ? isViewed : !isViewed;
        }

        return matchSearch && matchConfirm && matchSend && matchView;
    });
});

const totalInvitors = computed(() => invitorsList.value.length);
const confirmedInvitors = computed(() => invitorsList.value.filter(inv => inv.is_confirm === 'confirmed').length);
const refusedInvitors = computed(() => invitorsList.value.filter(inv => inv.is_confirm === 'refuse').length);
const notYetInvitors = computed(() => invitorsList.value.filter(inv => !inv.is_confirm || inv.is_confirm === 'not_yet').length);
const totalViews = computed(() => invitorsList.value.reduce((sum, inv) => sum + (inv.views || 0), 0));

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(30);

const paginatedInvitorsList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredInvitorsList.value.slice(start, end);
});

watch([searchQuery, filterConfirm, filterSend, filterView, itemsPerPage], () => {
    currentPage.value = 1; // Reset to first page when filters or page size change
});

const getStatusConfirmText = (status: string) => {
    if (status === 'confirmed') return 'Đã xác nhận';
    if (status === 'refuse') return 'Từ chối';
    return 'Chưa xác nhận';
};

const getStatusBadgeClass = (status: string) => {
    if (status === 'confirmed') return 'badge-confirmed';
    if (status === 'refuse') return 'badge-refused';
    return 'badge-unconfirmed';
};

const getStatusIcon = (status: string) => {
    if (status === 'confirmed') return 'check-circle';
    if (status === 'refuse') return 'x-circle';
    return 'clock';
};

const fetchInvitors = async () => {
    try {
        isLoading.value = true;
        const slug = route.params.slug;
        const res: any = await $fetch(`/api/v1/client/invitors?slug=${slug}`)
        if (res.success) {
            // Parse content from string to object
            invitorsList.value = res.data.map((inv: any) => {
                try {
                    inv.contentData = JSON.parse(inv.content)
                } catch {
                    inv.contentData = { value: 'N/A' }
                }
                return inv
            })
        }
    } catch (e: any) {
        console.error(e)
        console.log('Lỗi khi tải danh sách khách mời');
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    fetchInvitors()
})

const handleAddGuest = (payload: any) => {
    fetchInvitors()
};

const handleImportFile = async (file: File) => {
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length < 2) {
            $toast.error('File không có dữ liệu hoặc sai định dạng');
            return;
        }

        // Check header (Tên khách,Lời mời or Lời mời,Giá trị depending on CSV)
        const header = lines[0]?.split(',').map(h => h.trim().toLowerCase());

        // Let's be flexible and support "Lời mời,Giá trị" based on user's screenshot

        if (!header) return console.log('header is empty!');

        const isTheFirstInvitation = header[0]?.includes('lời mời') ?? false;

        const guestsToImport = [];

        for (let i = 1; i < lines.length; i++) {
            // A simple split by comma, ignoring complex CSV quotes for now
            // Can be enhanced if the values themselves contain commas
            const parts = lines[i]?.split(',');
            if (!parts || parts.length < 2) continue; // Skip malformed lines

            let invitation = '';
            let value = '';

            if (isTheFirstInvitation) {
                invitation = parts[0]?.trim() || '';
                value = parts.slice(1).join(',').trim(); // Join rest in case name has comma
            } else {
                value = parts[0]?.trim() || '';
                invitation = parts.slice(1).join(',').trim();
            }

            if (!invitation || !value) continue;

            guestsToImport.push({
                invitation,
                value,
                isCustom: true, // We will just treat all imported ones as custom to avoid matching issues, or let backend handle it
                slug: route.params.slug
            });
        }

        if (guestsToImport.length === 0) {
            console.log('Không tìm thấy dữ liệu hợp lệ trong file');
            return;
        }

        isLoading.value = true;

        // Fetch valid invitation types once before posting to backend
        let validTypes: any[] = [];
        try {
            const resTypes: any = await $fetch('/api/v1/client/news/by-key', { query: { key: 'type_invitator_content' } });
            if (resTypes?.success && Array.isArray(resTypes.data)) {
                validTypes = resTypes.data;
            }
        } catch (e) {
            console.log('error: ', e);
        }

        let successCount = 0;
        let failCount = 0;

        for (const guest of guestsToImport) {
            try {
                // Check against valid types to unset isCustom if it matches a standard one
                const matchedType = validTypes.find((t: any) => t.content === guest.invitation);
                if (matchedType && matchedType.slug !== 'tuy-chinh') {
                    guest.isCustom = false;
                }

                const res: any = await $fetch('/api/v1/client/invitors', {
                    method: 'POST',
                    body: guest
                });

                if (res.success && res.data) {
                    successCount++;
                    // push to top of list
                    const newInvitor = res.data;
                    try {
                        newInvitor.contentData = JSON.parse(newInvitor.content);
                    } catch {
                        newInvitor.contentData = { value: 'N/A' };
                    }
                    invitorsList.value.unshift(newInvitor);
                } else {
                    failCount++;
                }
            } catch (err) {
                failCount++;
            }
        }

        // Close modal and show notification after processing all
        isImportModalOpen.value = false;

        if (successCount > 0 && failCount === 0) {
            console.log(`Đã thêm thành công ${successCount} khách mời!`);
        } else if (successCount > 0 && failCount > 0) {
            console.log(`Thêm ${successCount} thành công. ${failCount} lỗi hoặc trùng lặp`);
        } else if (successCount === 0) {
            console.log('Không có khách mời nào được thêm (trùng lặp hoặc lỗi)!');
        }

    } catch (e) {
        console.error("Error reading file", e);
        console.log('Có lỗi xảy ra khi đọc file CSV');
    } finally {
        isLoading.value = false;
    }
}

const handleDownloadSample = () => {
    downloadExcel()
}

const handleAddBatchGuest = async (payload: { list: string, invitation: string }) => {
    try {
        isLoading.value = true;

        // Ensure invitation is provided, fallback to default if somehow empty
        const invitationText = payload.invitation.trim() || 'Thân mời';

        // Split list by newlines and filter out empty lines
        const guests = payload.list.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (guests.length === 0) {
            $toast.warning('Danh sách trống');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const guest of guests) {
            const payloadStr = {
                invitation: invitationText,
                value: guest,
                isCustom: false,
                slug: route.params.slug
            };

            const res: any = await $fetch('/api/v1/client/invitors', {
                method: 'POST',
                body: payloadStr
            });

            if (res.success) {
                successCount++;
            } else {
                failCount++;
            }
        }

        if (failCount === 0) {
            $toast.success(`Đã thêm thành công ${successCount} khách mời`);
        } else {
            $toast.warning(`Thêm ${successCount} thành công, ${failCount} thất bại`);
        }

    } catch (e: any) {
        console.error(e);
        $toast.error('Có lỗi xảy ra khi thêm hàng loạt');
    } finally {
        isAddBatchModalOpen.value = false;
        fetchInvitors();
    }
}

const openEditModal = (invitor: any) => {
    selectedInvitorToEdit.value = invitor;
    isEditModalOpen.value = true;
};

const handleEditGuest = (payload: any) => {
    // You could manually update the specific row if needed,
    // but fetching again is the safest way to ensure data consistency
    fetchInvitors();
};

const openDeleteModal = (invitor: any) => {
    selectedInvitorToDelete.value = invitor;
    isDeleteModalOpen.value = true;
};

const openDetailModal = (invitor: any) => {
    selectedInvitorToDetail.value = {
        name: invitor.contentData?.value || 'N/A',
        greeting: invitor.contentData?.invitation || 'Thân mời',
        statusConfirm: getStatusConfirmText(invitor.is_confirm),
        views: invitor.views || 0,
        statusSend: invitor.is_send ? 'Đã gửi' : 'Chưa gửi',
        url: `${configs.public.env == "production" ? configs.public.siteUrl : configs.public.urlLocalHost}/invite/${invitor.token}`,
        createdAt: invitor.createdAt,
        rawInvitor: invitor
    };
    isDetailModalOpen.value = true;
};

const handleEditFromDetail = () => {
    isDetailModalOpen.value = false;
    if (selectedInvitorToDetail.value && selectedInvitorToDetail.value.rawInvitor) {
        openEditModal(selectedInvitorToDetail.value.rawInvitor);
    }
};

const handleDeleteConfirm = async () => {
    if (!selectedInvitorToDelete.value) return;

    try {
        const id = selectedInvitorToDelete.value.id;
        const res: any = await $fetch(`/api/v1/client/invitors/${id}`, {
            method: 'DELETE' as any
        });

        if (res.success || res) {
            console.log('Xóa khách mời thành công');
            // Remove the deleted invitor row from the frontend record set
            invitorsList.value = invitorsList.value.filter(inv => inv.id !== id);
        } else {
            console.log('Xóa khách mời thất bại');
        }
    } catch (e: any) {
        console.error(e);
        console.log('Lỗi khi xóa khách mời');
    } finally {
        isDeleteModalOpen.value = false;
        selectedInvitorToDelete.value = null;
    }
};

const toggleIsSend = async (invitor: any) => {
    try {
        const res: any = await $fetch(`/api/v1/client/invitors/issend/${invitor.id}`, {
            method: 'PUT'
        });

        if (res.success) {
            // Update UI directly with reliable data typed correctly from API
            invitor.is_send = res.data.is_send;
            $toast.success('Cập nhật trạng thái thành công');
        } else {
            $toast.error('Cập nhật trạng thái thất bại');
        }
    } catch (e: any) {
        console.error(e);
        $toast.error('Lỗi khi cập nhật trạng thái');
    }
};

const copyUrl = (token: string) => {
    if (!token) {
        return;
    }
    const url = `${configs.public.env == "production" ? configs.public.siteUrl : configs.public.urlLocalHost}/invite/${token}`;
    navigator.clipboard.writeText(url).then(() => {
        isCopied.value = true
        setTimeout(() => { isCopied.value = false }, 2000)
    }).catch((err) => {
        console.error('Failed to copy: ', err);
    });
};

const downloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/others/mau-excel-khach-moi-thiep-cuoi.csv';
    link.setAttribute('download', 'mau-excel-khach-moi-thiep-cuoi.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
};
</script>
<template>
    <div class="guests-container d-flex flex-column gap-3 p-2 dashboard-cover">
        <!-- Header -->
        <div class="d-flex align-items-center gap-3 mb-2 mt-2">
            <button class="btn btn-light bg-light rounded-2 p-2 d-flex align-items-center justify-content-center"
                style="width: 38px; height: 38px; border: none;" @click="router.back()">
                <BaseIconComponent name="chevron-left" type="lucide" :size="20" color="#374151" />
            </button>
            <div class="d-flex align-items-center gap-2">
                <BaseIconComponent name="users" type="lucide" :size="24" color="#1f2937" />
                <h5 class="fw-bold mb-0 text-dark header-title">Quản Lý Khách Mời</h5>
            </div>
        </div>

        <!-- Import / Xuất CSV section -->
        <div class="mt-2">
            <div class="d-flex align-items-center gap-2 mb-2">
                <NuxtImg src="/images/icons/chart-icon.png" style="width: 20px; height: 20px;" v-if="false" />
                <!-- Placeholder for the icon in image -->
                <BaseIconComponent name="bar-chart-2" type="lucide" :size="16" color="#6366f1" />
                <span class="text-secondary small fw-medium">Import / Xuất CSV</span>
            </div>
            <div class="d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-secondary bg-white text-dark btn-sm px-3 rounded-2 shadow-none border"
                    @click="downloadExcel">
                    <BaseIconComponent name="file-text" type="lucide" :size="14" class="me-1" />
                    Tải mẫu
                </button>
                <button class="btn btn-outline-secondary bg-white text-dark btn-sm px-3 rounded-2 shadow-none border"
                    @click="isImportModalOpen = true">
                    <BaseIconComponent name="upload" type="lucide" :size="14" class="me-1" />
                    Import CSV
                </button>
                <button class="btn btn-primary btn-sm px-3 rounded-2 shadow-none border-0"
                    style="background-color: #3b82f6;">
                    <BaseIconComponent name="download" type="lucide" :size="14" class="me-1" color="white" />
                    Xuất CSV
                </button>
            </div>
        </div>

        <!-- Stats Cards Grid (2x2 on mobile) -->
        <div class="row g-2 mt-2">
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="users" type="lucide" :size="14" />
                        <span>Tổng khách</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-success">{{ totalInvitors }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="check-circle" type="lucide" :size="14" />
                        <span>Đã xác nhận</span>
                    </div>
                    <div class="h4 fw-bold mb-0" style="color: #65a30d;">{{ confirmedInvitors }}</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="user" type="lucide" :size="14" />
                        <span>Tổng người</span>
                    </div>
                    <div class="h4 fw-bold mb-0 text-primary">0</div>
                </div>
            </div>
            <div class="col-6">
                <div class="card border-0 rounded-3 p-3 shadow-sm h-100 bg-white">
                    <div class="d-flex align-items-center gap-1 text-muted mb-2" style="font-size: 13px;">
                        <BaseIconComponent name="eye" type="lucide" :size="14" />
                        <span>Đã xem</span>
                    </div>
                    <div class="h4 fw-bold mb-0" style="color: #9333ea;">{{ totalViews }}</div>
                </div>
            </div>
        </div>

        <!-- Main Content (Tabs + Action Buttons) -->
        <div class="card border-0 rounded-4 shadow-sm bg-white mt-3">
            <!-- Tabs -->
            <div class="d-flex border-bottom overflow-x-auto no-scrollbar">
                <div class="flex-fill text-center py-3 cursor-pointer position-relative"
                    :class="{ 'text-primary fw-bold': currentTab === 'actions', 'text-muted': currentTab !== 'actions' }"
                    @click="currentTab = 'actions'">
                    Thao tác
                    <div v-if="currentTab === 'actions'" class="position-absolute bottom-0 start-0 w-100 bg-primary"
                        style="height: 3px;"></div>
                </div>
                <div class="flex-fill text-center py-3 cursor-pointer position-relative"
                    :class="{ 'text-primary fw-bold': currentTab === 'filters', 'text-muted': currentTab !== 'filters' }"
                    @click="currentTab = 'filters'">
                    Bộ lọc
                    <div v-if="currentTab === 'filters'" class="position-absolute bottom-0 start-0 w-100 bg-primary"
                        style="height: 3px;"></div>
                </div>
                <div class="flex-fill text-center py-3 cursor-pointer position-relative d-flex align-items-center justify-content-center gap-1"
                    :class="{ 'text-primary fw-bold': currentTab === 'stats', 'text-muted': currentTab !== 'stats' }"
                    @click="currentTab = 'stats'">
                    <BaseIconComponent name="bar-chart-2" type="lucide" :size="16"
                        :color="currentTab === 'stats' ? '#3b82f6' : '#6b7280'" />
                    Thống kê
                    <div v-if="currentTab === 'stats'" class="position-absolute bottom-0 start-0 w-100 bg-primary"
                        style="height: 3px;"></div>
                </div>
            </div>

            <div class="p-3 p-md-4">
                <!-- Tab Content (Actions) -->
                <div v-show="currentTab === 'actions'">
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-3 flex-fill justify-content-center shadow-none border-0"
                            style="background-color: #3b82f6;" @click="isAddModalOpen = true">
                            <BaseIconComponent name="plus" type="lucide" :size="18" color="white" />
                            <span class="fw-medium">Thêm khách</span>
                        </button>
                        <button
                            class="btn btn-outline-secondary bg-white text-dark d-flex align-items-center gap-2 px-3 py-2 rounded-3 flex-fill justify-content-center shadow-none border"
                            @click="isAddBatchModalOpen = true">
                            <BaseIconComponent name="upload" type="lucide" :size="18" />
                            <span class="fw-medium">Thêm hàng loạt</span>
                        </button>
                    </div>
                </div>

                <!-- Tab Content (Filters) -->
                <div v-show="currentTab === 'filters'" class="filters-panel mt-2">
                    <div class="row g-3">
                        <div class="col-12 col-md-3">
                            <label class="form-label small fw-bold text-dark mb-1">Tìm kiếm:</label>
                            <input type="text" v-model="searchQuery" class="form-control form-control-sm rounded-2"
                                placeholder="Tên khách...">
                        </div>
                        <div class="col-6 col-md-3">
                            <label class="form-label small fw-bold text-dark mb-1">Xác nhận:</label>
                            <select class="form-select form-select-sm rounded-2" v-model="filterConfirm">
                                <option value="all">Tất cả</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="refuse">Từ chối</option>
                                <option value="not_yet">Chưa xác nhận</option>
                            </select>
                        </div>
                        <div class="col-6 col-md-3">
                            <label class="form-label small fw-bold text-dark mb-1">Đã gửi:</label>
                            <select class="form-select form-select-sm rounded-2" v-model="filterSend">
                                <option value="all">Tất cả</option>
                                <option value="sent">Đã gửi</option>
                                <option value="unsent">Chưa gửi</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tab Content (Stats) -->
                <div v-show="currentTab === 'stats'" class="stats-panel mt-2">
                    <div class="rsvp-stats-box border-0 bg-light bg-opacity-50 p-3 rounded-3">
                        <div class="rsvp-stats-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-secondary small">Đã xác nhận:</span>
                                <span class="fw-bold text-success">{{ confirmedInvitors }} khách</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-secondary small">Từ chối:</span>
                                <span class="fw-bold text-danger">{{ refusedInvitors }} khách</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-secondary small">Chưa xác nhận:</span>
                                <span class="fw-bold text-dark">{{ notYetInvitors }} khách</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Table Card -->
        <div v-if="isLoading || paginatedInvitorsList.length > 0">
            <!-- Desktop Table View -->
            <div class="main-card d-none d-md-block">
                <div class="table-responsive p-0">
                    <table class="table custom-table mb-0">
                        <thead>
                            <tr class="table-header">
                                <th style="width: 48px;" class="text-center checkbox-cell">
                                    <div class="form-check d-flex justify-content-center m-0">
                                        <input class="form-check-input custom-checkbox" type="checkbox" value=""
                                            id="selectAll">
                                    </div>
                                </th>
                                <th class="text-start">Tên khách</th>
                                <th>Xác nhận</th>
                                <th>Đã gửi</th>
                                <th>Đã xem</th>
                                <th>URL</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoading">
                                <td colspan="7" class="text-center py-5">
                                    <div class="spinner-border text-primary" role="status"></div>
                                </td>
                            </tr>
                            <template v-else>
                                <tr v-for="invitor in paginatedInvitorsList" :key="invitor.id" class="table-row">
                                    <td class="text-center checkbox-cell">
                                        <div class="form-check d-flex justify-content-center m-0">
                                            <input class="form-check-input custom-checkbox" type="checkbox"
                                                :value="invitor.id">
                                        </div>
                                    </td>
                                    <td class="text-start">
                                        <div class="d-flex align-items-center gap-2">
                                            <BaseIconComponent name="user" type="lucide" :size="16" color="#6b7280" />
                                            <div class="d-flex flex-column">
                                                <span class="guest-name">{{ invitor.contentData?.value || 'N/A'
                                                    }}</span>
                                                <span class="guest-type">{{ invitor.contentData?.invitation || `Thân
                                                    mời` }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="status-badge" :class="getStatusBadgeClass(invitor.is_confirm)">
                                            <BaseIconComponent :name="getStatusIcon(invitor.is_confirm)" type="lucide"
                                                :size="12" />
                                            <span>{{ getStatusConfirmText(invitor.is_confirm) }}</span>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="status-btn" :class="invitor.is_send ? 'btn-sent' : 'btn-unsent'"
                                            @click="toggleIsSend(invitor)" style="cursor: pointer;">
                                            <span v-if="invitor.is_send">✓ Đã gửi</span>
                                            <span v-else>Chưa gửi</span>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="view-status">
                                            <div class="view-icon-wrapper" :class="{ 'active': invitor.views > 0 }">
                                                <BaseIconComponent name="eye" type="lucide" :size="14" />
                                                <span class="view-badge">{{ invitor.views }}</span>
                                            </div>
                                            <span class="view-text">{{ invitor.views > 0 ? 'Đã xem' : 'Chưa xem'
                                                }}</span>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="url-cell d-flex justify-content-center align-items-center gap-1">
                                            <div class="url-text">{{ invitor.token || 'N/A' }}</div>
                                            <button class="btn-copy" @click="copyUrl(invitor.token)">
                                                <BaseIconComponent name="copy" type="lucide" :size="14" />
                                            </button>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div class="action-buttons d-flex justify-content-center gap-1">
                                            <button class="btn-icon" @click="openDetailModal(invitor)">
                                                <BaseIconComponent name="eye" type="lucide" :size="12" />
                                            </button>
                                            <button class="btn-icon" @click="openEditModal(invitor)">
                                                <BaseIconComponent name="edit-2" type="lucide" :size="12" />
                                            </button>
                                            <button class="btn-icon btn-delete" @click="openDeleteModal(invitor)">
                                                <BaseIconComponent name="trash-2" type="lucide" :size="12" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div class="d-flex flex-column gap-2 d-md-none">
                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
                <template v-else>
                    <div v-for="invitor in paginatedInvitorsList" :key="invitor.id"
                        class="card border-0 shadow-sm rounded-3 bg-white p-3">
                        <div class="d-flex align-items-start gap-3 mb-3">
                            <div class="form-check mt-1">
                                <input class="form-check-input custom-checkbox" type="checkbox" :value="invitor.id">
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-bold text-dark mb-0" style="font-size: 1.05rem;">{{
                                    invitor.contentData?.value || 'N/A' }}</span>
                                <span class="text-secondary small">{{ invitor.contentData?.invitation || 'Thân mời'
                                    }}</span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex gap-2 align-items-center overflow-x-auto no-scrollbar">
                                <div class="badge px-2 py-1 bg-light text-secondary border fw-normal"
                                    style="font-size: 9px; white-space: nowrap;">
                                    {{ getStatusConfirmText(invitor.is_confirm) }}
                                </div>
                                <div class="d-flex align-items-center gap-1 text-secondary px-2 py-1 bg-light border rounded"
                                    style="font-size: 9px; white-space: nowrap;" @click="toggleIsSend(invitor)"
                                    :style="{ cursor: 'pointer' }">
                                    <div class="rounded-circle" style="width: 6px; height: 6px;"
                                        :class="invitor.is_send ? 'bg-success' : 'bg-secondary'"></div>
                                    <span>{{ invitor.is_send ? 'Đã gửi' : 'Chưa gửi' }}</span>
                                </div>
                                <div class="d-flex align-items-center gap-1 text-secondary px-1 py-1 bg-light border rounded"
                                    style="font-size: 9px;">
                                    <BaseIconComponent name="eye" type="lucide" :size="12" />
                                    <span>{{ invitor.views || 0 }}</span>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2 ms-2">
                                <button class="btn btn-link p-1 text-dark opacity-75" @click="openDetailModal(invitor)">
                                    <BaseIconComponent name="eye" type="lucide" :size="13" />
                                </button>
                                <button class="btn btn-link p-1 text-dark opacity-75" @click="openEditModal(invitor)">
                                    <BaseIconComponent name="edit-2" type="lucide" :size="13" />
                                </button>
                                <button class="btn btn-link p-1 text-dark opacity-75" @click="copyUrl(invitor.token)">
                                    <BaseIconComponent name="copy" type="lucide" :size="13" />
                                </button>
                                <button class="btn btn-link p-1 text-danger opacity-75"
                                    @click="openDeleteModal(invitor)">
                                    <BaseIconComponent name="trash-2" type="lucide" :size="13" />
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Pagination -->
            <div class="mt-3">
                <PaginationTableComponent v-model="currentPage" v-model:items-per-page="itemsPerPage"
                    :total-items="filteredInvitorsList.length" />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="card border-0 rounded-4 shadow-sm bg-white p-5 text-center mt-3">
            <p class="text-muted mb-0" style="font-size: 1.1rem;">Không có khách mời nào</p>
        </div>

        <AddInvitorComponent v-model="isAddModalOpen" @add="handleAddGuest" />
        <AddBatchInvitorComponent v-model="isAddBatchModalOpen" @add-batch="handleAddBatchGuest" />
        <EditInvitorComponent v-model="isEditModalOpen" :invitor-data="selectedInvitorToEdit" @edit="handleEditGuest" />
        <DeleteInvitorComponent v-model="isDeleteModalOpen" title="Xóa khách mời"
            description="Bạn có chắc chắn muốn xóa khách mời này? Hành động này không thể hoàn tác." confirm-text="Xóa"
            cancel-text="Hủy" @confirm="handleDeleteConfirm" />
        <DetailInvitorComponent v-model="isDetailModalOpen" :data="selectedInvitorToDetail"
            @edit="handleEditFromDetail" />
        <ImportFileInvitorComponent v-model="isImportModalOpen" @import-file="handleImportFile"
            @download-sample="handleDownloadSample" />
    </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.guests-container {
    max-width: 100%;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: #f8fafc;
}

.header-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
}

.stat-card {
    background-color: white;
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid #e5e7eb;
}

.guest-name {
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
}

.guest-type {
    font-size: 0.85rem;
    color: #6b7280;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge-unconfirmed {
    background-color: #f3f4f6;
    color: #4b5563;
}

.badge-confirmed {
    background-color: #f0fdf4;
    color: #16a34a;
}

.badge-refused {
    background-color: #fef2f2;
    color: #dc2626;
}

.status-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
}

.btn-sent {
    background-color: #eff6ff;
    color: #2563eb;
    border: 1px solid #dbeafe;
}

.btn-unsent {
    background-color: #f9fafb;
    color: #4b5563;
    border: 1px solid #e5e7eb;
}

.view-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background-color: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    font-size: 0.75rem;
    color: #4b5563;
}

.btn-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #4b5563;
    transition: all 0.2s;
}

.btn-icon:hover {
    background-color: #f3f4f6;
    color: #111827;
}

.btn-delete:hover {
    background-color: #fef2f2;
    color: #ef4444;
}

.tab-item {
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    position: relative;
    padding: 1rem 0;
}

.tab-item.active {
    color: #3b82f6;
}

.custom-table thead th {
    background-color: #f9fafb;
    font-size: 0.75rem;
    font-weight: 600;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.custom-table tbody td {
    padding: 1rem;
    vertical-align: middle;
}

.main-card {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
}

.form-control,
.form-select {
    font-size: 0.875rem;
    border-color: #e5e7eb;
    border-radius: 8px;
}

.form-control:focus,
.form-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-footer-text {
    font-size: 0.8rem;
    color: #9ca3af;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
}


.custom-input:focus,
.custom-select:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

.custom-input::placeholder {
    color: #9ca3af;
}

.filter-footer-text {
    font-size: 0.8rem;
    color: #9ca3af;
    padding-top: 1rem;
    border-top: 1px solid #f3f4f6;
}
</style>