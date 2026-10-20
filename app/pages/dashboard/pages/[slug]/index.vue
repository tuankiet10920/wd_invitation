<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import EditUrlComponent from '~/coms/dashboard/modal/EditUrlComponent.vue';
import QRCodeCompomnent from '~/coms/dashboard/modal/QRCodeCompomnent.vue';
import CloneWeddingCardComponent from '~/coms/dashboard/modal/CloneWeddingCardComponent.vue';
import DeleteWeddingCardComponent from '~/coms/dashboard/modal/DeleteWeddingCardComponent.vue';
import { useRuntimeConfig } from '#app';

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const configs = useRuntimeConfig()

const baseUrl = configs.public.env == 'production' ? configs.public.siteUrl : configs.public.urlLocalHost

const card = ref<any>(null);
const isLoading = ref(true);
const isEditUrlOpen = ref(false);
const isQRCodeOpen = ref(false);
const isCloneModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const isEditingName = ref(false);
const tempName = ref('');
const isSavingName = ref(false);
const nameInputRef = ref<HTMLInputElement | null>(null);

const editName = () => {
    tempName.value = card.value?.name || '';
    isEditingName.value = true;
    nextTick(() => {
        nameInputRef.value?.focus();
    });
};

const cancelEditName = () => {
    isEditingName.value = false;
};

const saveNameCard = async () => {
    if (!card.value || tempName.value.length > 100 || isSavingName.value) return;

    if (tempName.value.trim() === '') {
        alert('Tên thiệp không được để trống');
        return;
    }

    if (tempName.value === card.value.name) {
        isEditingName.value = false;
        return;
    }

    isSavingName.value = true;
    try {
        await $fetch(`/api/v1/client/card-template/${card.value.id}`, {
            method: 'PUT',
            body: {
                name: tempName.value,
                is_custom_url: true
            }
        });

        card.value.name = tempName.value;
        card.value.is_custom_url = true;
        isEditingName.value = false;
    } catch (error) {
        console.error("Failed to update name", error);
        alert("Có lỗi xảy ra khi cập nhật tên thiệp. Vui lòng thử lại sau.");
    } finally {
        isSavingName.value = false;
    }
};

const isEditingMetaDesc = ref(false);
const tempMetaDesc = ref('');
const isSavingMetaDesc = ref(false);
const metaDescInputRef = ref<HTMLTextAreaElement | null>(null);

const editMetaDesc = () => {
    tempMetaDesc.value = card.value?.meta_desc || `${card.value?.name || 'Thiệp chưa đặt tên'} - Thiệp cưới online trên CineLove`;
    isEditingMetaDesc.value = true;
    nextTick(() => {
        metaDescInputRef.value?.focus();
    });
};

const cancelEditMetaDesc = () => {
    isEditingMetaDesc.value = false;
};

const saveMetaDesc = async () => {
    if (!card.value || tempMetaDesc.value.length > 200 || isSavingMetaDesc.value) return;

    if (tempMetaDesc.value === card.value.meta_desc) {
        isEditingMetaDesc.value = false;
        return;
    }

    isSavingMetaDesc.value = true;
    try {
        await $fetch(`/api/v1/client/card-template/${card.value.id}`, {
            method: 'PUT',
            body: {
                meta_desc: tempMetaDesc.value
            }
        });

        card.value.meta_desc = tempMetaDesc.value;
        isEditingMetaDesc.value = false;
    } catch (error) {
        console.error("Failed to update meta_desc", error);
        alert("Có lỗi xảy ra khi cập nhật mô tả. Vui lòng thử lại sau.");
    } finally {
        isSavingMetaDesc.value = false;
    }
};

const confirmClone = async () => {
    if (!card.value) return;

    try {
        const body = {
            ...card.value,
            name: `Bản sao: ${card.value.name}`,
            url: `${card.value.url}-nhan-ban`,
            is_template: false,
            is_template_user: false,
            views: 0,
            likes: 0
        };
        // Remove IDs to avoid conflict
        delete body.id;
        delete body.createdAt;
        delete body.updatedAt;

        const response: any = await $fetch('/api/v1/client/card-template', {
            method: 'POST',
            body
        });

        if (response.success) {
            router.push('/dashboard/pages');
        } else {
            alert('Nhân bản thất bại. Có thể URL đã tồn tại.');
        }
    } catch (e) {
        console.error(e);
        alert('Có lỗi xảy ra khi nhân bản.');
    } finally {
        isCloneModalOpen.value = false;
    }
};

const fetchCard = async () => {
    isLoading.value = true;
    try {
        const { data }: any = await $fetch(`/api/v1/client/card-template/${slug}`);
        if (data) {
            card.value = data;
        }
    } catch (error) {
        console.error("Failed to fetch card details", error);
        // Navigate back to dashboard if not found or error
        // router.push('/dashboard/pages'); 
    } finally {
        isLoading.value = false;
    }
}

const edit = () => {
    if (card.value) {
        const isMobile = window.innerWidth < 992;
        const prefix = isMobile ? '/editor/m' : '/editor';

        navigateTo(`${prefix}/${card.value.url}`, {
            external: true,
            open: {
                target: '_blank'
            }
        });
    }
}

const viewPage = () => {
    if (card.value) {
        // Public link: /s/:slug
        navigateTo(`/s/${card.value.url}`, { open: { target: '_blank' } });
    }
}

const deleteCard = () => {
    isDeleteModalOpen.value = true;
}

const confirmDelete = async () => {
    if (!card.value) return;

    try {
        await $fetch(`/api/v1/client/card-template/${card.value.id}`, {
            method: 'DELETE'
        });
        router.push('/dashboard/pages');
    } catch (error) {
        console.error("Failed to delete card", error);
        alert('Có lỗi xảy ra khi xóa thiệp.');
    } finally {
        isDeleteModalOpen.value = false;
    }
}


const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(date);
}

const handleUpdateUrl = async (newUrl: string) => {
    if (!newUrl || !card.value) return;

    try {
        await $fetch(`/api/v1/client/card-template/${card.value.id}`, {
            method: 'PUT',
            body: {
                url: newUrl,
                is_custom_url: true
            }
        });

        card.value.url = newUrl;
        card.value.is_custom_url = true;

        // Cập nhật lại URL trên thanh địa chỉ để không bị lỗi khi tải lại trang
        if (slug !== newUrl) {
            router.replace(`/dashboard/pages/${newUrl}`);
        }
    } catch (error) {
        console.error("Failed to update url", error);
        alert("Có lỗi xảy ra khi cập nhật URL. Vui lòng thử lại sau hoặc chọn URL khác.");
    }
}

const expirationInfo = computed(() => {
    if (!card.value || !card.value.createdAt || !card.value.user?.package?.time_save_card) {
        return { text: 'Không xác định', isExpired: false };
    }

    // time_save_card is in months based on typical package logic, so calculate expiration date
    const createdAt = new Date(card.value.createdAt);
    const monthsToAdd = card.value.user.package.time_save_card;
    const expirationDate = new Date(createdAt);
    expirationDate.setMonth(expirationDate.getMonth() + monthsToAdd);

    const now = new Date();
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Đã hết hạn ${Math.abs(diffDays)} ngày trước`, isExpired: true };
    } else {
        return { text: `Còn ${diffDays} ngày`, isExpired: false, expirationDate: expirationDate };
    }
})

const invitorsList = ref<any[]>([]);
const isCopied = ref(false);

const copyCardLink = async () => {
    if (!card.value?.url) return;
    const link = `${baseUrl}/s/${card.value.url}`;
    try {
        await navigator.clipboard.writeText(link);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 3000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
};

const rsvpStats = ref({
    total: 0,
    attending: 0,
    totalPeople: 0,
    notAttending: 0
});
const isLoadingRsvp = ref(true);

const fetchRsvpStats = async () => {
    try {
        isLoadingRsvp.value = true;
        const response: any = await $fetch(`/api/v1/client/accept-invitation/stats?slug=${slug}`);
        if (response.success && response.data) {
            rsvpStats.value = response.data;
        }
    } catch (e) {
        console.error("Failed to fetch RSVP stats", e);
    } finally {
        isLoadingRsvp.value = false;
    }
}

const fetchInvitors = async () => {
    try {
        const res: any = await $fetch(`/api/v1/client/invitors?slug=${slug}`);
        if (res.success && res.data) {
            // Sort by latest created first (assuming descending ID or Date) to show newest links
            // Optionally handled by backend if ordered
            invitorsList.value = res.data.map((inv: any) => {
                try {
                    inv.contentData = JSON.parse(inv.content);
                } catch {
                    inv.contentData = { value: 'N/A' };
                }
                return inv;
            });
        }
    } catch (e: any) {
        console.error(e);
        console.log('Lỗi khi tải danh sách khách mời tự động');
    }
}

const copyLink = async (token: string) => {
    const link = `${baseUrl}/invite/${token}`;
    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(link);
            console.log('Đã copy link khách mời!');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            console.log('Đã copy link khách mời!');
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        console.log('Không thể copy link');
    }
}

const viewLink = (token: string) => {
    window.open(`${baseUrl}/invite/${token}`, '_blank');
}

onMounted(() => {
    fetchCard();
    fetchInvitors();
    fetchRsvpStats();
})
</script>
<template>
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else-if="card" class="d-flex flex-column gap-3 dashboard-cover">
        <!-- Breadcrumbs -->
        <div class="d-none d-md-flex align-items-center gap-2 text-muted mb-2" style="font-size: 0.9rem;">
            <div class="d-flex align-items-center gap-1">
                <BaseIconComponent name="home" type="lucide" :size="14" color="#6c757d" />
                <span>Dashboard</span>
            </div>
            <span>/</span>
            <div class="d-flex align-items-center gap-1">
                <BaseIconComponent name="file-text" type="lucide" :size="14" color="#6c757d" />
                <span>Quản lý trang</span>
            </div>
            <span>/</span>
            <span class="text-dark">Chi tiết trang</span>
        </div>

        <!-- Title -->
        <h4 class="fw-bold mb-0">{{ card.name || 'Thiệp chưa đặt tên' }}</h4>

        <!-- Action Buttons -->
        <div class="d-flex flex-wrap gap-2 mb-2">
            <button class="btn btn-primary d-flex align-items-center gap-2 btn-sm px-3 py-2" @click="viewPage">
                <BaseIconComponent name="eye" type="lucide" :size="16" color="white" />
                <span>Xem trang</span>
            </button>
            <button class="btn btn-primary d-flex align-items-center gap-2 btn-sm px-3 py-2" @click="edit">
                <BaseIconComponent name="edit" type="lucide" :size="16" color="white" />
                <span>Chỉnh sửa</span>
            </button>
            <button class="btn btn-primary d-flex align-items-center gap-2 btn-sm px-3 py-2"
                @click="isCloneModalOpen = true">
                <BaseIconComponent name="copy" type="lucide" :size="16" color="white" />
                <span>Nhân bản</span>
            </button>
            <button class="btn btn-outline-danger d-flex align-items-center gap-2 btn-sm px-3 py-2 btn-delete-custom"
                @click="deleteCard">
                <BaseIconComponent name="trash" type="lucide" :size="16" color="currentColor" />
                <span>Xóa</span>
            </button>
        </div>

        <!-- DETAILS -->
        <div class="bg-white rounded-4 p-3 p-md-4 shadow-sm">
            <div class="row g-4 g-lg-5">
                <!-- Left Column -->
                <div class="col-12 col-lg-4 d-flex flex-column gap-3">
                    <!-- Card 1: Page Info -->
                    <!-- Page Info -->
                    <div>
                        <div>
                            <div v-if="!isEditingName" class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="fw-bold mb-0 text-truncate">{{ card.name || 'Thiệp chưa đặt tên' }}</h5>
                                <!-- BUTTON EDIT NAME CARD -->
                                <BaseIconComponent name="pencil" type="lucide" :size="16" color="#6c757d"
                                    class="cursor-pointer" @click="editName" />
                            </div>
                            <div v-else class="d-flex align-items-center gap-2 mb-2">
                                <div class="position-relative flex-grow-1">
                                    <input ref="nameInputRef" type="text" v-model="tempName"
                                        class="form-control border-primary" maxlength="100"
                                        style="padding-right: 65px; box-shadow: none;" @keyup.enter="saveNameCard"
                                        @keyup.esc="cancelEditName" :disabled="isSavingName" />
                                    <span class="position-absolute text-secondary"
                                        style="right: 10px; top: 50%; transform: translateY(-50%); font-size: 0.85rem;">
                                        {{ tempName.length }} / 100
                                    </span>
                                </div>
                                <button
                                    class="btn btn-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                    style="width: 38px; height: 38px; padding: 0;" @click="saveNameCard"
                                    :disabled="isSavingName">
                                    <span v-if="isSavingName" class="spinner-border spinner-border-sm" role="status"
                                        aria-hidden="true"></span>
                                    <BaseIconComponent v-else name="check" type="lucide" :size="18" color="white" />
                                </button>
                                <button
                                    class="btn btn-outline-secondary bg-white d-flex align-items-center justify-content-center flex-shrink-0"
                                    style="width: 38px; height: 38px; padding: 0; border-color: #dee2e6;"
                                    @click="cancelEditName" :disabled="isSavingName">
                                    <BaseIconComponent name="x" type="lucide" :size="18" color="#4b5563" />
                                </button>
                            </div>
                            <div class="badge px-2 py-1 fw-normal"
                                :class="card.is_publish ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'"
                                style="font-size: 0.8rem;">
                                {{ card.is_publish ? 'Đã xuất bản' : 'Bản nháp' }}
                            </div>
                            <p class="text-secondary small mb-3">
                                Thumbnail sẽ hiển thị khi bạn chia sẻ trang này qua tin nhắn hoặc mạng xã hội.
                            </p>

                            <div class="position-relative mb-3 rounded-3 overflow-hidden"
                                style="background-color: #000; height: 180px;">
                                <NuxtImg :src="card.avatar" class="w-100 h-100 object-fit-cover" />
                                <!-- <button
                                    class="position-absolute btn btn-light btn-sm d-flex align-items-center gap-1 shadow-sm"
                                    style="top: 10px; right: 10px; font-size: 0.8rem;">
                                    <BaseIconComponent name="image" type="lucide" :size="14" />
                                    <span>Thay ảnh</span>
                                </button> -->
                            </div>

                            <!-- DESC META -->
                            <div v-if="!isEditingMetaDesc" class="d-flex justify-content-between align-items-center">
                                <span class="text-secondary small text-truncate">{{ card.meta_desc || `${card.name ||
                                    'Thiệp chưa đặt tên'} - Thiệp cưới online trên CineLove` }}</span>
                                <BaseIconComponent name="pencil" type="lucide" :size="14" color="#6c757d"
                                    class="cursor-pointer" @click="editMetaDesc" />
                            </div>
                            <div v-else class="mt-2 text-start">
                                <div class="position-relative mb-2">
                                    <textarea ref="metaDescInputRef" v-model="tempMetaDesc"
                                        class="form-control border-primary" rows="3" maxlength="200"
                                        style="resize: none; padding-bottom: 25px; box-shadow: none; font-size: 0.85rem;"
                                        @keyup.esc="cancelEditMetaDesc" :disabled="isSavingMetaDesc"></textarea>
                                    <span class="position-absolute text-secondary"
                                        style="right: 10px; bottom: 8px; font-size: 0.8rem;">
                                        {{ tempMetaDesc.length }} / 200
                                    </span>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <button
                                        class="btn btn-primary d-flex align-items-center justify-content-center gap-1 px-3 py-1 bg-primary text-white border-primary rounded"
                                        @click="saveMetaDesc" :disabled="isSavingMetaDesc" style="font-size: 0.85rem;">
                                        <span v-if="isSavingMetaDesc" class="spinner-border spinner-border-sm"
                                            role="status" aria-hidden="true"></span>
                                        <BaseIconComponent v-else name="check" type="lucide" :size="14" color="white" />
                                        <span>Lưu</span>
                                    </button>
                                    <button
                                        class="btn btn-white border bg-white text-dark d-flex align-items-center justify-content-center gap-1 px-3 py-1 rounded"
                                        @click="cancelEditMetaDesc" :disabled="isSavingMetaDesc"
                                        style="font-size: 0.85rem; border-color: #dee2e6;">
                                        <BaseIconComponent name="x" type="lucide" :size="14" color="#4b5563" />
                                        <span>Hủy</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: QR Code -->
                    <div class="border rounded-4 cursor-pointer hover-card p-3" @click="isQRCodeOpen = true">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-3 p-2 text-secondary d-flex align-items-center justify-content-center"
                                style="background-color: #f3f4f6; width: 48px; height: 48px;">
                                <BaseIconComponent name="qr-code" type="lucide" :size="24" color="#4b5563" />
                            </div>
                            <div class="flex-grow-1">
                                <div class="fw-semibold mb-1" style="font-size: 0.95rem;">QR Code cho thiệp</div>
                                <div class="text-secondary" style="font-size: 0.8rem;">Tải QR để in vào thiệp giấy, ảnh
                                    cưới...</div>
                            </div>
                            <BaseIconComponent name="chevron-right" type="lucide" :size="18" color="#ced4da" />
                        </div>
                    </div>

                    <!-- Card 3: Share Suggestion -->
                    <div class="border rounded-4 cursor-pointer hover-card p-3"
                        style="background-color: #fff0f6; border-color: #ffdeeb !important;">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-3 p-2 text-white d-flex align-items-center justify-content-center"
                                style="background: linear-gradient(135deg, #d65db1 0%, #845ef7 100%); width: 48px; height: 48px;">
                                <BaseIconComponent name="share-2" type="lucide" :size="22" />
                            </div>
                            <div class="flex-grow-1">
                                <div class="fw-semibold mb-1" style="font-size: 0.95rem;">Gợi ý chia sẻ thiệp cưới</div>
                                <div class="text-secondary" style="font-size: 0.8rem;">Mẫu caption và tin nhắn đẹp để
                                    chia sẻ niềm
                                    vui</div>
                            </div>
                            <BaseIconComponent name="chevron-right" type="lucide" :size="18" color="#ced4da" />
                        </div>
                    </div>
                </div>

                <!-- Right Column (70%) -->
                <div class="col-12 col-lg-8">
                    <div class="border rounded-4 overflow-hidden">
                        <div class="p-3 border-bottom bg-light bg-opacity-10">
                            <h6 class="fw-bold mb-0 text-secondary">Thông tin chi tiết</h6>
                        </div>
                        <div class="p-3 p-md-4 d-flex flex-column gap-3 gap-md-4">

                            <!-- URL Website -->
                            <div class="border-bottom pb-3 pb-md-4">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-secondary fw-bold">URL Website</small>
                                    <button
                                        class="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                                        :class="isCopied ? 'text-success' : 'text-secondary'"
                                        style="font-size: 0.85rem;" @click="copyCardLink">
                                        <BaseIconComponent :name="isCopied ? 'check' : 'copy'" type="lucide"
                                            :size="14" />
                                        <span>{{ isCopied ? 'Đã copy' : 'Copy' }}</span>
                                    </button>
                                </div>
                                <div class="text-primary mb-1 text-break">
                                    {{ baseUrl }}/s/{{ card.url }}</div>
                                <small v-if="!card.is_custom_url" class="text-secondary d-block mb-3">Đang sử dụng ID
                                    mặc định, bạn có thể tùy
                                    chỉnh để
                                    cá nhân hoá và dễ nhớ hơn</small>
                                <!-- Tùy chỉnh URL -->
                                <div v-if="card.is_custom_url"
                                    class="d-flex align-items-center gap-2 text-success fw-medium mt-2 mb-2"
                                    style="font-size: 0.9rem;">
                                    <BaseIconComponent name="check-circle-2" type="lucide" color="#198754" :size="18" />
                                    <span>Đã tùy chỉnh URL</span>
                                </div>
                                <button v-else class="btn btn-primary d-flex align-items-center gap-2 btn-sm px-3"
                                    @click="isEditUrlOpen = true">
                                    <BaseIconComponent name="pen-line" type="lucide" :size="14" color="white" />
                                    <span>Tùy chỉnh URL</span>
                                </button>
                            </div>

                            <!-- Time -->
                            <!-- Time Created -->
                            <div class="border-bottom pb-3 pb-md-4">
                                <small class="text-secondary fw-bold d-block mb-1">Thời gian tạo</small>
                                <span class="text-secondary small">{{ formatDate(card.createdAt) }}</span>
                            </div>

                            <!-- Last Updated -->
                            <div class="border-bottom pb-3 pb-md-4">
                                <small class="text-secondary fw-bold d-block mb-1">Cập nhật lần cuối</small>
                                <span class="text-secondary small">{{ formatDate(card.updatedAt) }}</span>
                            </div>

                            <!-- Status -->
                            <div class="border-bottom pb-3 pb-md-4">
                                <small class="text-secondary fw-bold d-block mb-2">Trạng thái</small>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" id="statusSwitch"
                                            :checked="card.is_publish">
                                    </div>
                                    <span class="small fw-semibold"
                                        :class="card.is_publish ? 'text-success' : 'text-warning'">
                                        • {{ card.is_publish ? 'Đã xuất bản' : 'Bản nháp' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Limits -->
                            <div class="border-bottom pb-3 pb-md-4">
                                <small class="text-secondary fw-bold d-block mb-3">Giới hạn</small>

                                <!-- Views -->
                                <div class="mb-3">
                                    <div class="d-flex align-items-center gap-2 mb-1">
                                        <BaseIconComponent name="eye" type="lucide" :size="16" color="#0d6efd" />
                                        <small class="fw-semibold">Lượt xem</small>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-end mb-1">
                                        <small class="text-primary fw-bold">• Còn {{ (card.user?.package?.maximum_views
                                            || 0) -
                                            (card.views || 0) }} lượt xem</small>
                                        <small class="text-secondary">
                                            {{ Math.round(((card.views || 0) / (card.user?.package?.maximum_views || 1))
                                                * 100) }}%
                                        </small>
                                    </div>
                                    <div class="progress" style="height: 6px;">
                                        <div class="progress-bar bg-warning opacity-25" role="progressbar"
                                            :style="{ width: Math.round(((card.views || 0) / (card.user?.package?.maximum_views || 1)) * 100) + '%' }"
                                            :aria-valuenow="Math.round(((card.views || 0) / (card.user?.package?.maximum_views || 1)) * 100)"
                                            aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-between mt-1">
                                        <small class="text-secondary" style="font-size: 0.75rem;">
                                            <BaseIconComponent name="info" type="lucide" :size="12"
                                                class="d-inline me-1" />
                                            Lượt xem trang này: {{ card.views || 0 }}
                                        </small>
                                        <small class="text-secondary" style="font-size: 0.75rem;">Giới hạn: {{
                                            card.user?.package?.maximum_views || 0 }}</small>
                                    </div>
                                </div>

                                <!-- Time Limit -->
                                <div>
                                    <div class="d-flex align-items-center gap-2 mb-1">
                                        <BaseIconComponent name="clock" type="lucide" :size="16" color="#198754" />
                                        <small class="fw-semibold">Thời hạn trang</small>
                                    </div>
                                    <div class="d-flex justify-content-between align-items-end mb-1">
                                        <small class="fw-bold"
                                            :class="expirationInfo.isExpired ? 'text-danger' : 'text-warning'">
                                            • {{ expirationInfo.text }}
                                        </small>
                                    </div>
                                    <div class="d-flex justify-content-between mt-1 border-bottom pb-3">
                                        <small class="text-secondary" style="font-size: 0.75rem;">Ngày hết hạn: {{
                                            expirationInfo.expirationDate ?
                                                formatDate(expirationInfo.expirationDate.toISOString()) : 'Không xác định'
                                        }}</small>
                                    </div>
                                </div>
                            </div>

                            <!-- Upgrade Alert -->
                            <!-- <div class="alert alert-primary border-0 d-flex flex-column gap-2 mb-0"
                                style="background-color: #e7f1ff;">
                                <div class="d-flex gap-2">
                                    <BaseIconComponent name="bell" type="lucide" :size="18" color="#0d6efd" />
                                    <small class="text-secondary" style="font-size: 0.9rem;">Bạn có thể nâng cấp gói
                                        hoặc
                                        mua thêm add-on để tăng giới hạn và thời hạn sử dụng.</small>
                                </div>
                                <div class="d-flex gap-2 flex-wrap ms-4">
                                    <button class="btn btn-primary btn-sm border-0 fw-semibold"
                                        style="font-size: 0.85rem;">Nâng cấp gói</button>
                                    <button class="btn btn-outline-secondary btn-sm border bg-white text-secondary"
                                        style="font-size: 0.85rem;">Gia hạn thời gian</button>
                                    <button class="btn btn-outline-secondary btn-sm border bg-white text-secondary"
                                        style="font-size: 0.85rem;">Tăng giới hạn lượt xem</button>
                                </div>
                            </div> -->

                        </div>
                        <!-- Footer -->
                        <div
                            class="d-flex justify-content-between align-items-center p-3 border-top bg-light bg-opacity-10">
                            <div class="d-flex align-items-center gap-2">
                                <small class="text-secondary">Gói hiện tại</small>
                                <span class="badge bg-warning text-dark rounded-1 fw-normal text-uppercase">{{
                                    card.user?.package?.name || 'FREE' }}</span>
                            </div>
                            <!-- <button
                                class="btn btn-link text-primary text-decoration-none p-0 d-flex align-items-center gap-1"
                                style="font-size: 0.8rem;">
                                <BaseIconComponent name="arrow-up-circle" type="lucide" :size="14" />
                                <span class="fw-semibold">Nâng cấp</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- AUTOMATIC URL -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-0">
                <h6 class="fw-bold mb-0">URL với tên khách mời</h6>
            </div>
            <div class="card-body p-3 p-md-4 pt-3">
                <div class="d-flex flex-column gap-3 mb-4">
                    <div>
                        <h6 class="fw-bold mb-1">Cá nhân hóa thiệp cho từng khách mời</h6>
                        <p class="text-muted small mb-3">Tạo link riêng cho từng khách mời với tên tự động hiển thị trên
                            thiệp</p>
                    </div>
                    <!-- BUTTON AUTOMATIC URL -->
                    <button
                        class="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 w-100 w-md-auto justify-content-center rounded-3 shadow-none"
                        @click="router.push(`/dashboard/pages/${slug}/guests-v2`)">
                        <BaseIconComponent name="link" type="lucide" :size="18" color="white" />
                        <span class="fw-medium">Tạo link</span>
                    </button>
                </div>

                <!-- Empty State -->
                <div v-if="invitorsList.length === 0" class="text-center py-5">
                    <div class="mb-3">
                        <BaseIconComponent name="link" type="lucide" :size="40" color="#000" class="opacity-75" />
                    </div>
                    <p class="text-muted small mb-0">Chưa có link nào được tạo</p>
                </div>

                <!-- List of Links -->
                <div v-else class="d-flex flex-column gap-2 mb-3">
                    <div v-for="(invitor, index) in invitorsList.slice(0, 3)" :key="invitor.id"
                        class="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light bg-opacity-50 hover-bg-light transition-all">
                        <div class="d-flex align-items-center gap-3 w-100">
                            <BaseIconComponent name="user" type="lucide" :size="18" color="#6c757d" />
                            <div class="flex-grow-1 overflow-hidden">
                                <div class="fw-medium text-dark text-truncate mb-1" style="font-size: 0.9rem;">
                                    {{ invitor.contentData?.invitation || 'Thân mời' }} {{ invitor.contentData?.value ||
                                        'N/A' }}
                                </div>
                                <div class="text-secondary text-truncate" style="font-size: 0.8rem;">
                                    {{ baseUrl }}/invite/{{ invitor.token }}
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <button
                                    class="btn btn-outline-secondary btn-sm bg-white d-flex align-items-center gap-1"
                                    @click="copyLink(invitor.token)">
                                    <BaseIconComponent name="copy" type="lucide" :size="14" />
                                    <span>Copy</span>
                                </button>
                                <button
                                    class="btn btn-outline-secondary btn-sm bg-white d-flex align-items-center gap-1"
                                    @click="viewLink(invitor.token)">
                                    <BaseIconComponent name="eye" type="lucide" :size="14" />
                                    <span>Xem</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- View All Link -->
                <div v-if="invitorsList.length > 0" class="text-center mt-4">
                    <NuxtLink :to="`/dashboard/pages/${slug}/guests-v2`" class="text-primary text-decoration-none">
                        Xem tất cả ({{ invitorsList.length }} link)
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- INTERACTION STATISTICS -->
        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-header bg-white border-bottom-0 pt-3 pb-0">
                <h6 class="fw-bold mb-0">Thống kê tương tác</h6>
            </div>
            <div class="card-body p-3 p-md-4">
                <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
                    <!-- Views -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Lượt xem</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="eye" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">{{ card.views || 0 }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Likes -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Lượt thích</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="heart" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">0</span>
                            </div>
                        </div>
                    </div>
                    <!-- Wishes -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Lời chúc</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="message-circle" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">0</span>
                            </div>
                        </div>
                    </div>
                    <!-- Gifts -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Quà đã nhận</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="gift" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">0</span>
                            </div>
                        </div>
                    </div>
                    <!-- Total Value -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Tổng giá trị quà</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="gift" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">0</span>
                                <BaseIconComponent name="coins" type="lucide" :size="16" color="#ffc107" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- CONFIRM INVITATION -->
        <div class="card border-0 shadow-sm rounded-3">
            <div
                class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Xác nhận tham dự</h6>
                <!-- BUTTON CONFIRM INVITATION -->
                <button class="btn btn-primary btn-sm px-3 py-1 rounded-2 shadow-none border-0 fw-medium"
                    @click="router.push(`/dashboard/pages/${slug}/rsvp`)"
                    style="background-color: #3b82f6; font-size: 0.85rem;">
                    Xem chi tiết
                </button>
            </div>
            <div class="card-body p-3 p-md-4">
                <div v-if="isLoadingRsvp" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else class="row row-cols-2 row-cols-md-4 g-3">
                    <!-- Total Confirmed -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Tổng lượt xác nhận</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="user" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">{{ rsvpStats.total }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Attending -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Sẽ tham dự</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="check-circle-2" type="lucide" :size="20" color="#198754" />
                                <span class="fw-bold fs-5 text-success">{{ rsvpStats.attending }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Total People -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Tổng số người</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="users" type="lucide" :size="20" color="#0d6efd" />
                                <span class="fw-bold fs-5">{{ rsvpStats.totalPeople }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Not Attending -->
                    <div class="col">
                        <div
                            class="bg-light rounded-3 p-3 text-center h-100 d-flex flex-column justify-content-center align-items-center gap-2">
                            <small class="text-secondary" style="font-size: 0.8rem;">Không tham dự</small>
                            <div class="d-flex align-items-center gap-1">
                                <BaseIconComponent name="x-circle" type="lucide" :size="20" color="#dc3545" />
                                <span class="fw-bold fs-5 text-danger">{{ rsvpStats.notAttending }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Edit URL Modal -->
        <EditUrlComponent v-if="card" v-model="isEditUrlOpen" :current-url="`${baseUrl}/invite/${card.url}`"
            :domain-url="`${baseUrl}/invite/`" @update-url="handleUpdateUrl" />

        <!-- QR Code Modal -->
        <QRCodeCompomnent v-if="card" v-model="isQRCodeOpen" :qr-url="`${baseUrl}/s/${card.url}`" />

        <!-- Clone Modal -->
        <CloneWeddingCardComponent v-model="isCloneModalOpen" :card-name="card?.name" @confirm="confirmClone" />

        <!-- Delete Modal -->
        <DeleteWeddingCardComponent v-model="isDeleteModalOpen" @confirm="confirmDelete" />
    </div>
    <div v-else class="text-center p-5">
        <h4 class="text-secondary">Không tìm thấy thông tin thiệp</h4>
        <button class="btn btn-primary mt-3" @click="router.push('/dashboard/pages')">
            <BaseIconComponent name="arrow-left" type="lucide" :size="16" class="me-1" />
            Quay lại danh sách
        </button>
    </div>

</template>
<style scoped>
.btn-delete-custom {
    background-color: white;
    transition: all 0.2s;
}

.btn-delete-custom:hover {
    background-color: #dc3545;
    color: white;
}
</style>