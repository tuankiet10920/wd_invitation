<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const id = route.params.id

const formData = reactive({
    category: '',
    url: '',
    type: 'img'
})

const thumbnailBase64 = ref<string | null>(null)
const thumbnailPreview = ref<string | null>(null)

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            thumbnailBase64.value = e.target?.result as string
            thumbnailPreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
    } else {
        thumbnailBase64.value = null
        thumbnailPreview.value = formData.url ? `/images/stocks/${formData.url}` : null
    }
}

const isLoading = ref(false)
const isFetching = ref(true)
const types = ref<any[]>([])

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const getTypes = async () => {
    try {
        const { data }: any = await $fetch('/api/v1/admin/stock-types', {
            query: { limit: 100 }
        })
        types.value = data || []
    } catch (error) {
        console.error(error)
    }
}

const fetchDetail = async () => {
    try {
        const data: any = await $fetch(`/api/v1/admin/stocks/${id}`)
        if (data && data.data) {
            formData.category = data.data.id_image_type || ''
            formData.url = data.data.url || ''
            formData.type = data.data.type || 'img'
            
            const originalPath = data.data.type === 'svg' ? 'lists' : 'thumbnails'
            const originalExtUrl = data.data.type === 'svg' ? data.data.url : data.data.url.replace(/\.[^/.]+$/, '.webp')
            thumbnailPreview.value = data.data.url ? `/images/stocks/${originalPath}/${originalExtUrl}` : null
        }
    } catch (error) {
        console.error("Failed to fetch stock detail", error)
        alert("Failed to load stock detail")
        router.push('/admin/stocks/list')
    } finally {
        isFetching.value = false
    }
}

onMounted(() => {
    getTypes()
    fetchDetail()
})

const submitForm = async () => {
    if (!formData.category) {
        alert('Please select a category')
        return
    }

    isLoading.value = true
    try {
        let finalUrl = formData.url;
        
        // If user uploaded a new image, thumbnailBase64 will not be null
        if (thumbnailBase64.value) {
            const timestamp = Date.now()
            const filename = `IMAGE_STOCK_${timestamp}`
            const res: any = await $fetch('/api/v1/admin/file/upload-advanced', {
                method: 'POST',
                body: {
                    image: thumbnailBase64.value,
                    filename: filename,
                    folder: 'stocks',
                    type: formData.type
                }
            })
            finalUrl = res.url
        }

        const payload = {
            id_image_type: formData.category,
            url: finalUrl,
            type: formData.type
        }

        await $fetch(`/api/v1/admin/stocks/${id}`, {
            method: 'PUT',
            body: payload
        })

        title.value = "Thành công!"
        message.value = "Cập nhật stock thành công!"
        type.value = "success"
    } catch (error) {
        title.value = "Thất bại!"
        message.value = "Cập nhật stock thất bại!"
        type.value = "error"
        console.error(error)
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa kho Stock</h5>
            <NuxtLink to="/admin/stocks/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4" v-if="!isFetching">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Category (Stock Types)</label>
                            <select class="form-select" v-model="formData.category" required>
                                <option value="" disabled>Select Type</option>
                                <option v-for="item in types" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Format Type</label>
                            <select class="form-select" v-model="formData.type" required>
                                <option value="img">Image (PNG/JPG)</option>
                                <option value="svg">Vector (SVG)</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Image (Leave empty to keep current)</label>
                            <input type="file" class="form-control" accept="image/*" @change="handleFileChange">
                            <div v-if="thumbnailPreview" class="mt-2 text-center border rounded p-2 bg-light">
                                <img :src="thumbnailPreview" alt="Thumbnail Preview" class="img-fluid rounded"
                                    style="max-height: 150px; object-fit: contain;">
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/stocks/list" class="btn btn-light btn-icon" title="Hủy">
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
.form-label { font-size: 0.875rem; color: #64748b; }
.form-control, .form-select { border-color: #e2e8f0; padding: 10px 16px; font-size: 0.95rem; }
.form-control:focus, .form-select:focus { border-color: #cbd5e1; box-shadow: none; }
.btn-primary { background-color: #7B61FF; border-color: #7B61FF; }
.btn-primary:hover { background-color: #6c52ed; border-color: #6c52ed; }
.btn-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; padding: 0; border-radius: 8px; }
</style>
