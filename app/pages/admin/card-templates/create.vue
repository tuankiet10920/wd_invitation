<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    meta_desc: '',
    status: 'Published',
    id_package: 3 as number | null
})

const packages = ref<any[]>([])
const router = useRouter()
const isLoading = ref(false)

const fetchPackages = async () => {
    try {
        const data: any = await $fetch('/api/v1/client/packages')
        if (data && data.data) {
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
        const payload = {
            name: formData.name,
            meta_desc: formData.meta_desc,
            is_publish: formData.status === 'Published',
            id_package: formData.id_package
        }
        const data: any = await $fetch('/api/v1/admin/card-templates', {
            method: 'POST',
            body: payload
        })
        if (data && data.data && data.data.url) {
            router.push(`/admin/editor/${data.data.url}`)
        } else {
            router.push('/admin/card-templates/list')
        }
    } catch (error) {
        alert('Failed to create template')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm thiệp</h5>
            <NuxtLink to="/admin/card-templates/list" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" style="height: 40px;">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Template Name</label>
                            <input type="text" class="form-control" v-model="formData.name" placeholder="Enter name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Package</label>
                            <select class="form-select" v-model="formData.id_package">
                                <option :value="null">Default</option>
                                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                                    {{ pkg.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.status" style="max-width: 200px;">
                                <option value="Published">Published</option>
                                <option value="Unpublished">Unpublished</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Meta Description</label>
                            <textarea class="form-control" v-model="formData.meta_desc" rows="3"
                                placeholder="Enter SEO description"></textarea>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/card-templates/list" class="btn btn-light btn-icon" title="Hủy">
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

@media (max-width: 767.98px) {
    .container-fluid {
        padding: 1rem !important;
    }
    
    .card-body {
        padding: 1.25rem !important;
    }
    
    .fs-4 {
        font-size: 1.25rem !important;
    }
}
</style>
