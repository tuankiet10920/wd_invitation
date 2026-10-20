<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
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

const router = useRouter()
const isLoading = ref(false)

const submitForm = async () => {
    isLoading.value = true
    try {
        await useFetch('/api/v1/admin/banks', {
            method: 'POST',
            body: formData
        })
        router.push('/admin/banks/list')
    } catch (error) {
        alert('Failed to create bank')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm Bank Account</h5>
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
                        <button type="submit" class="btn btn-primary btn-icon" title="Tạo mới" :disabled="isLoading">
                            <BaseIconComponent name="save" :size="20" color="white" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
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
