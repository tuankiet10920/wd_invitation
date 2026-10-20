<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    key: 'site_name',
    value: 'NTK Services',
    description: 'The name of the website'
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const settingId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchSetting = async () => {
    if (!settingId) return
    try {
        const data: any = await $fetch(`/api/v1/admin/settings/${settingId}`)
        if (data && data.data) {
            const setting = data.data
            formData.key = setting.key
            formData.value = setting.value
            formData.description = setting.description
        }
    } catch (error) {
        console.error("Failed to fetch setting", error)
    }
}

const submitForm = async () => {
    if (!settingId) return
    isLoading.value = true
    try {
        await $fetch(`/api/v1/admin/settings/${settingId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật cài đặt thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật cài đặt thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchSetting()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa cấu hình hệ thống</h5>
            <NuxtLink to="/admin/settings/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Key</label>
                            <input type="text" class="form-control" v-model="formData.key" disabled>
                            <div class="form-text">Key cannot be changed once created.</div>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Value</label>
                            <textarea class="form-control" v-model="formData.value" rows="3"
                                placeholder="Enter configuration value"></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Description</label>
                            <input type="text" class="form-control" v-model="formData.description"
                                placeholder="Enter description">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/settings/list" class="btn btn-light btn-icon" title="Hủy">
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
        <NotificationModalComponent v-model="openModal" :message="message" :title="title" :type="type" />
    </div>
</template>

<style scoped>
.form-label {
    font-size: 0.875rem;
    color: #64748b;
}

.form-control {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}

.form-control:focus {
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
