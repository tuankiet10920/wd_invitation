<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    clientId: '8a9d...2b1',
    clientSecret: 'hidden',
    refreshToken: 'ref_token_123',
    email: 'tk1@example.com'
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const tokenId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchToken = async () => {
    if (!tokenId) return
    try {
        const { data }: any = await useFetch(`/api/v1/admin/imgur-tokens/${tokenId}`)
        if (data.value && data.value.data) {
            const item = data.value.data
            formData.clientId = item.clientId
            formData.clientSecret = item.clientSecret
            formData.refreshToken = item.refreshToken
            formData.email = item.email
        }
    } catch (error) {
        console.error("Failed to fetch token", error)
    }
}

const submitForm = async () => {
    if (!tokenId) return
    isLoading.value = true
    try {
        await useFetch(`/api/v1/admin/imgur-tokens/${tokenId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật token thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật token thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchToken()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa token Imgur</h5>
            <NuxtLink to="/admin/imgur-tokens/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Client ID</label>
                            <input type="text" class="form-control" v-model="formData.clientId"
                                placeholder="Enter Client ID">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Associated Email</label>
                            <input type="email" class="form-control" v-model="formData.email" placeholder="Enter Email">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Client Secret</label>
                            <input type="password" class="form-control" v-model="formData.clientSecret"
                                placeholder="Enter Client Secret">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Refresh Token</label>
                            <input type="text" class="form-control" v-model="formData.refreshToken"
                                placeholder="Enter Refresh Token">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/imgur-tokens/list" class="btn btn-light btn-icon" title="Hủy">
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
