<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const id = route.params.id

const formData = reactive({
    name: '',
    slug: '',
})

const isLoading = ref(false)
const isFetching = ref(true)

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')



const fetchDetail = async () => {
    try {
        const data: any = await $fetch(`/api/v1/admin/stock-types/${id}`)
        if (data && data.data) {
            formData.name = data.data.name || ''
            formData.slug = data.data.slug || ''
        }
    } catch (error) {
        console.error("Failed to fetch stock type detail", error)
        alert("Failed to load stock type detail")
        router.push('/admin/stock-types/list')
    } finally {
        isFetching.value = false
    }
}

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch(`/api/v1/admin/stock-types/${id}`, {
            method: 'PUT',
            body: formData
        })

        title.value = "Thành công!"
        message.value = "Cập nhật stock type thành công!"
        type.value = "success"
    } catch (error) {
        title.value = "Thất bại!"
        message.value = "Cập nhật stock type thất bại!"
        type.value = "error"
        console.error(error)
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchDetail()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa thể loại Stock</h5>
            <NuxtLink to="/admin/stock-types/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4" v-if="!isFetching">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Tên</label>
                            <input type="text" class="form-control" v-model="formData.name"
                                placeholder="Enter stock type name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Đường dẫn / Slug</label>
                            <input type="text" class="form-control" v-model="formData.slug"
                                placeholder="Leave empty to auto generate">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/stock-types/list" class="btn btn-light btn-icon" title="Hủy">
                            <BaseIconComponent name="keyboard-return" type="mdi" :size="20" />
                        </NuxtLink>
                        <button type="submit" class="btn btn-primary btn-icon" title="Cập nhật" :disabled="isLoading">
                            <BaseIconComponent name="save" :size="20" color="white" />
                        </button>
                    </div>
                </form>
            </div>
            <div v-else class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
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
