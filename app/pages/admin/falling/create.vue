<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import SelectTypeComponent from '~/coms/admin/icons/SelectTypeComponent.vue';
import SelectIconComponent from '~/coms/admin/icons/SelectIconComponent.vue';
import type { IconType } from '~~/interfaces';
definePageMeta({
    layout: 'admin'
})

interface FallingElement {
    name: string;
    type: IconType;
    color: string;
}

const formData = reactive({
    name: '',
    slug: '',
    icon: '',
    icon_type: 'mdi' as IconType,
    icons: [] as FallingElement[],
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

const addElement = () => {
    formData.icons.push({
        name: 'star',
        type: 'mdi',
        color: '#eab308'
    })
}

const removeElement = (index: number) => {
    formData.icons.splice(index, 1)
}

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/v1/admin/falling/create', {
            method: 'POST',
            body: formData
        })
        router.push('/admin/falling/list')
    } catch (error) {
        alert('Failed to create falling effect')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm Falling Effect</h5>
            <NuxtLink to="/admin/falling/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                                placeholder="Enter falling effect name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Đường dẫn / Slug (Không bắt buộc)</label>
                            <input type="text" class="form-control" v-model="formData.slug"
                                placeholder="Leave empty to auto-generate">
                        </div>

                        <h6 class="fw-bold mt-5 mb-2 border-bottom pb-2">Main Button Icon</h6>
                        <div class="col-md-6 mt-3">
                            <label class="form-label fw-medium text-secondary">Loại biểu tượng</label>
                            <SelectTypeComponent v-model="formData.icon_type" />
                        </div>
                        <div class="col-md-6 mt-3">
                            <label class="form-label fw-medium text-secondary">Chọn biểu tượng</label>
                            <SelectIconComponent v-model="formData.icon" :type="formData.icon_type" placeholder="Browse for icon..." />
                        </div>

                        <h6
                            class="fw-bold mt-5 mb-2 border-bottom pb-2 d-flex justify-content-between align-items-center">
                            <span>Falling Elements</span>
                            <button type="button" class="btn btn-sm btn-outline-primary fw-medium" @click="addElement">
                                <BaseIconComponent name="plus" :size="16" /> Add Element
                            </button>
                        </h6>

                        <div v-if="formData.icons.length === 0"
                            class="col-12 mt-3 text-center py-4 bg-light rounded text-muted">
                            No elements added. Users will see nothing falling. Click "Add Element".
                        </div>

                        <div v-for="(elem, index) in formData.icons" :key="index" class="col-12 mt-3">
                            <div class="p-3 border rounded border-light bg-light position-relative">
                                <button type="button" class="btn-close position-absolute top-0 end-0 m-2"
                                    aria-label="Close" @click="removeElement(index)"></button>
                                <div class="row g-3 pe-4">
                                    <div class="col-md-4">
                                        <label class="form-label fw-medium text-secondary">Loại biểu tượng</label>
                                        <SelectTypeComponent v-model="elem.type" />
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-medium text-secondary">Chọn biểu tượng</label>
                                        <SelectIconComponent v-model="elem.name" :type="elem.type" placeholder="Select..." />
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fs-7 fw-medium text-secondary">Color</label>
                                        <div class="d-flex align-items-center gap-2">
                                            <input type="color"
                                                class="form-control form-control-sm form-control-color w-100"
                                                v-model="elem.color" style="max-width: 60px;">
                                            <span class="small text-muted">{{ elem.color }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h6 class="fw-bold mt-5 mb-2 border-bottom pb-2">Settings</h6>
                        <div class="col-md-6 mt-3">
                            <label class="form-label fw-medium text-secondary">Package tối thiểu</label>
                            <select class="form-select form-control" v-model="formData.id_min_package">
                                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">{{ pkg.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/falling/list" class="btn btn-light btn-icon" title="Hủy">
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

.fs-7 {
    font-size: 0.825rem;
}

.form-control,
.form-select {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}

.form-control-sm,
.form-select-sm {
    padding: 6px 12px;
    font-size: 0.875rem;
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
