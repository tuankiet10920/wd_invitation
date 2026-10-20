<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: 'Default 1',
    type: 'Background',
    status: 'Active',
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const designId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchDesign = async () => {
    if (!designId) return
    try {
        const { data }: any = await useFetch(`/api/v1/admin/design-templates/${designId}`)
        if (data.value && data.value.data) {
            const item = data.value.data
            formData.name = item.name
            formData.type = item.type
            formData.status = item.status
        }
    } catch (error) {
        console.error("Failed to fetch design", error)
    }
}

const submitForm = async () => {
    if (!designId) return
    isLoading.value = true
    try {
        await useFetch(`/api/v1/admin/design-templates/${designId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật mẫu thiết kế thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật mẫu thiết kế thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDesign()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa thiết kế</h5>
            <NuxtLink to="/admin/design-templates/list"
                class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Tên</label>
                            <input type="text" class="form-control" v-model="formData.name" placeholder="Enter name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Type</label>
                            <input type="text" class="form-control" v-model="formData.type"
                                placeholder="Enter type (e.g. Background)">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">File/Image</label>
                            <input type="file" class="form-control">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/design-templates/list" class="btn btn-light btn-icon" title="Hủy">
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
