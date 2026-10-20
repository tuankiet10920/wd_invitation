<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    bankName: '',
    accountNumber: '',
    accountName: '',
    branch: '',
    status: 'Active',
    description: ''
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const bankId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchBank = async () => {
    if (!bankId) return
    try {
        const { data }: any = await useFetch(`/api/v1/admin/banks/${bankId}`)
        if (data.value && data.value.data) {
            const item = data.value.data
            formData.bankName = item.bankName
            formData.accountNumber = item.accountNumber
            formData.accountName = item.accountName
            formData.branch = item.branch
            formData.status = item.status
            formData.description = item.description
        }
    } catch (error) {
        console.error("Failed to fetch bank", error)
    }
}

const submitForm = async () => {
    if (!bankId) return
    isLoading.value = true
    try {
        await useFetch(`/api/v1/admin/banks/${bankId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật ngân hàng thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật ngân hàng thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchBank()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa Bank Account</h5>
            <NuxtLink to="/admin/banks/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Bank Name</label>
                            <input type="text" class="form-control" v-model="formData.bankName"
                                placeholder="Enter bank name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Account Number</label>
                            <input type="text" class="form-control" v-model="formData.accountNumber"
                                placeholder="Enter account number">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Account Name</label>
                            <input type="text" class="form-control" v-model="formData.accountName"
                                placeholder="Enter account holder name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Branch</label>
                            <input type="text" class="form-control" v-model="formData.branch"
                                placeholder="Enter branch">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Description</label>
                            <textarea class="form-control" v-model="formData.description" rows="3"
                                placeholder="Enter additional details..."></textarea>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/banks/list" class="btn btn-light btn-icon" title="Hủy">
                            <BaseIconComponent name="keyboard-return" type="mdi" :size="20" />
                        </NuxtLink>
                        <button type="submit" class="btn btn-primary btn-icon" title="Save Changes"
                            :disabled="isLoading">
                            <BaseIconComponent name="save" :size="20" color="white" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <NotificationModalComponent v-model="openModal" :message="message" :title="title" :type="type" />
</template>

<style scoped>
.form-label {
    font-size: 0.875rem;
    color: #64748b;
}

.form-control,
.form-select {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}

.form-control:focus,
.form-select:focus {
    border-color: #cbd5e1;
    box-shadow: none;
}

.btn-primary {
    background-color: #7B61FF;
    border-color: #7B61FF;
}

.btn-primary:hover {
    background-color: #6c52ed;
    border-color: #6c52ed;
}

.btn-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 8px;
}
</style>
