<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'Active',
    avatar: null
})

const router = useRouter()
const isLoading = ref(false)

const submitForm = async () => {
    isLoading.value = true
    try {
        await useFetch('/api/v1/admin/users', {
            method: 'POST',
            body: formData
        })
        // Assuming success returns 200
        router.push('/admin/users/list')
    } catch (error) {
        alert('Failed to create user')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Create New User</h5>
            <NuxtLink to="/admin/users/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Full Name</label>
                            <input type="text" class="form-control" v-model="formData.name"
                                placeholder="Enter full name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Email Address</label>
                            <input type="email" class="form-control" v-model="formData.email" placeholder="Enter email">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Password</label>
                            <input type="password" class="form-control" v-model="formData.password"
                                placeholder="Enter password">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Role</label>
                            <select class="form-select" v-model="formData.role">
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                                <option value="Guest">Guest</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Avatar</label>
                            <input type="file" class="form-control">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/users/list" class="btn btn-light btn-icon" title="Hủy">
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
