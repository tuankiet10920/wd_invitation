<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import SelectTypeComponent from '~/coms/admin/icons/SelectTypeComponent.vue';
import SelectIconComponent from '~/coms/admin/icons/SelectIconComponent.vue';
import type { IconType } from '~~/interfaces';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    slug: '',
    icon: '',
    icon_type: 'mdi' as IconType,
    id_min_package: 1,
})

const router = useRouter()
const isLoading = ref(false)
const packages = ref<any[]>([])

const fetchPackages = async () => {
    try {
        const data: any = await $fetch('/api/v1/admin/packages', {
            query: { limit: 100 }
        })
        if (data && data.data && data.data.data) {
            packages.value = data.data.data
        }
    } catch (error) {
        console.error("Failed to fetch packages", error)
    }
}

onMounted(() => {
    fetchPackages()
})

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/v1/admin/animations/create', {
            method: 'POST',
            body: formData
        })
        router.push('/admin/animations/list')
    } catch (error) {
        alert('Failed to create animation')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm hiệu ứng động</h5>
            <NuxtLink to="/admin/animations/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                                placeholder="Enter animation name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Đường dẫn / Slug (Không bắt buộc)</label>
                            <input type="text" class="form-control" v-model="formData.slug"
                                placeholder="Leave empty to auto-generate">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Loại biểu tượng</label>
                            <SelectTypeComponent v-model="formData.icon_type" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Chọn biểu tượng</label>
                            <SelectIconComponent v-model="formData.icon" :type="formData.icon_type" placeholder="Browse for icon..." />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Package tối thiểu</label>
                            <select class="form-select form-control" v-model="formData.id_min_package">
                                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">{{ pkg.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/animations/list" class="btn btn-light btn-icon" title="Hủy">
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

.form-control, .form-select {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}

.form-control:focus, .form-select:focus {
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
