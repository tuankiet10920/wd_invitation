<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
    phone: '',
    introduction: '',
    avatar: null
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const userId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchUser = async () => {
    if (!userId) return
    try {
        const data: any = await $fetch(`/api/v1/admin/users/${userId}`)
        if (data && data.data) {
            const user = data.data
            formData.name = user.name
            formData.email = user.email
            formData.role = user.role
            formData.status = user.is_active ? 'Active' : 'Inactive'
            formData.phone = user.phone || ''
            formData.introduction = user.introduction || ''
            formData.avatar = user.avatar
        }
    } catch (error) {
        console.error("Failed to fetch user", error)
    }
}

const submitForm = async () => {
    if (!userId) return
    isLoading.value = true
    try {
        const payload = {
            ...formData,
            is_active: formData.status === 'Active'
        }
        await $fetch(`/api/v1/admin/users/${userId}`, {
            method: 'PUT',
            body: payload
        })
        title.value = "Thành công!"
        message.value = "Cập nhật người dùng thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật người dùng thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchUser()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa người dùng</h5>
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
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Phone</label>
                            <input type="text" class="form-control" v-model="formData.phone"
                                placeholder="Enter phone number">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Introduction</label>
                            <textarea class="form-control" v-model="formData.introduction" rows="3"
                                placeholder="Enter introduction"></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Avatar</label>
                            <div class="d-flex align-items-center gap-4">
                                <NuxtImg src="/images/avatars/avatar-1.jpg" width="80" height="80"
                                    class="rounded-circle object-fit-cover shadow-sm" />
                                <div class="flex-grow-1">
                                    <input type="file" class="form-control">
                                    <div class="form-text text-muted mt-1">Allowed JPG, GIF or PNG. Max size of 800K
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/users/list" class="btn btn-light btn-icon" title="Hủy">
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
