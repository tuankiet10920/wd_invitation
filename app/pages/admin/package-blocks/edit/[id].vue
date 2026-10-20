<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    packageId: '2',
    blockName: 'Gallery',
    status: 'Active'
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const blockId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchBlock = async () => {
    if (!blockId) return
    try {
        const { data }: any = await useFetch(`/api/v1/admin/package-blocks/${blockId}`)
        if (data.value && data.value.data) {
            const item = data.value.data
            formData.packageId = item.packageId
            formData.blockName = item.blockName
            formData.status = item.status
        }
    } catch (error) {
        console.error("Failed to fetch block", error)
    }
}

const submitForm = async () => {
    if (!blockId) return
    isLoading.value = true
    try {
        await useFetch(`/api/v1/admin/package-blocks/${blockId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật block thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật block thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchBlock()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa Package Block</h5>
            <NuxtLink to="/admin/package-blocks/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Package</label>
                            <select class="form-select" v-model="formData.packageId">
                                <option value="1">Basic</option>
                                <option value="2">Pro</option>
                                <option value="3">Enterprise</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Block Name</label>
                            <input type="text" class="form-control" v-model="formData.blockName"
                                placeholder="Enter block name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/package-blocks/list" class="btn btn-light btn-icon" title="Hủy">
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
