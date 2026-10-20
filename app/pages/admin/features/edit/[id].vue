<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    key_feature: '',
    type: 'packages',
    order: 0,
    branch: 'main'
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const featureId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchFeature = async () => {
    if (!featureId) return
    try {
        const { data }: any = await useFetch(`/api/v1/admin/features/${featureId}`)
        if (data.value && data.value.data) {
            const item = data.value.data
            formData.name = item.name
            formData.key_feature = item.key_feature
            formData.type = item.type
            formData.order = item.order
            formData.branch = item.branch
        }
    } catch (error) {
        console.error("Failed to fetch feature", error)
    }
}

const submitForm = async () => {
    if (!featureId) return
    isLoading.value = true
    try {
        await useFetch(`/api/v1/admin/features/${featureId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật tính năng thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật tính năng thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchFeature()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa tính năng</h5>
            <NuxtLink to="/admin/features/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                            <input type="text" class="form-control" v-model="formData.name"
                                placeholder="Enter feature name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Key Feature</label>
                            <input type="text" class="form-control" v-model="formData.key_feature"
                                placeholder="Unique key">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Type</label>
                            <select class="form-select" v-model="formData.type">
                                <option value="packages">Packages</option>
                                <option value="animations">Animations</option>
                                <option value="blocks">Blocks</option>
                                <option value="others">Others</option>
                                <option value="images">Images</option>
                                <option value="musics">Musics</option>
                                <option value="widgets">Widgets</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Order</label>
                            <input type="number" class="form-control" v-model="formData.order" placeholder="Sort order">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Branch</label>
                            <input type="text" class="form-control" v-model="formData.branch"
                                placeholder="main or secondary">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink :to="{
                            path: '/admin/features/list',
                            query: $route.query
                        }" class="btn btn-light btn-icon" title="Hủy">
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
