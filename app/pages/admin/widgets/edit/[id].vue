<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import SelectTypeComponent from '~/coms/admin/icons/SelectTypeComponent.vue';
import SelectIconComponent from '~/coms/admin/icons/SelectIconComponent.vue';
import type { IconType } from '~~/interfaces';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    slug: '',
    key: '',
    icon: '',
    icon_type: 'mdi' as IconType,
    color: '#000000',
    id_min_package: 1 as number | null
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const widgetId = route.params.id
const packages = ref<any[]>([])

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchWidget = async () => {
    if (!widgetId) return
    try {
        const data: any = await $fetch(`/api/v1/admin/widgets/${widgetId}`)
        if (data && data.data) {
            const widget = data.data
            formData.name = widget.name
            formData.slug = widget.slug
            formData.key = widget.key
            formData.icon = widget.icon || ''
            formData.icon_type = widget.icon_type || 'mdi'
            formData.color = widget.color || '#000000'
            formData.id_min_package = widget.id_min_package || null
        }
    } catch (error) {
        console.error("Failed to fetch widget", error)
    }
}

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

const submitForm = async () => {
    if (!widgetId) return
    isLoading.value = true
    try {
        await $fetch(`/api/v1/admin/widgets/${widgetId}`, {
            method: 'PUT',
            body: formData
        })
        title.value = "Thành công!"
        message.value = "Cập nhật widget thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật widget thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchPackages()
    fetchWidget()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa tiện ích</h5>
            <NuxtLink to="/admin/widgets/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                            <input type="text" class="form-control" v-model="formData.name" placeholder="Enter widget name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Đường dẫn / Slug</label>
                            <input type="text" class="form-control" v-model="formData.slug" placeholder="Enter widget slug (e.g. envelope)" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Key <span class="badge bg-secondary ms-1 fw-normal" style="font-size: 0.65rem;">Read-only</span></label>
                            <input type="text" class="form-control bg-light text-muted" :value="formData.key" readonly title="Key is used for frontend logic and cannot be changed after creation">
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
                            <label class="form-label fw-medium text-secondary">Icon Color</label>
                            <input type="color" class="form-control form-control-color w-100" v-model="formData.color" title="Choose your color">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Package tối thiểu</label>
                            <select class="form-select form-control" v-model="formData.id_min_package">
                                <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">{{ pkg.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/widgets/list" class="btn btn-light btn-icon" title="Hủy">
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
.form-label { font-size: 0.875rem; color: #64748b; }
.form-control { border-color: #e2e8f0; padding: 10px 16px; font-size: 0.95rem; }
.form-control:focus { border-color: #cbd5e1; box-shadow: none; }
.btn-primary { background-color: #7B61FF; border-color: #7B61FF; }
.btn-primary:hover { background-color: #6c52ed; border-color: #6c52ed; }
.btn-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; padding: 0; border-radius: 8px; }
.form-control-color { padding: 0.375rem; height: calc(1.5em + 1.25rem + 2px); }
</style>
