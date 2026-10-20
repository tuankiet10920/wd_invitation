<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    slug: '',
    title: '',
    description: '',
    priority: 0.5,
    change_freq: 'monthly',
    image: ''
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
        thumbnailPreview.value = null
    }
}

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const itemId = route.params.id

const fetchItem = async () => {
    if (!itemId) return
    try {
        const res: any = await $fetch(`/api/v1/admin/seo-pages/${itemId}`)
        if (res && res.data) {
            Object.assign(formData, res.data)
            if (formData.image) {
                thumbnailPreview.value = formData.image
            }
        }
    } catch (error) {
        console.error("Failed to fetch SEO page", error)
    }
}

onMounted(fetchItem)

const submitForm = async () => {
    isLoading.value = true
    try {
        let imagePath = formData.image

        if (thumbnailBase64.value) {
            const filename = `seo_${formData.slug.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`
            const uploadRes: any = await $fetch('/api/v1/admin/file/upload-base64', {
                method: 'POST',
                body: {
                    image: thumbnailBase64.value,
                    filename: filename,
                    folder: 'seo'
                }
            })
            if (uploadRes.success) {
                imagePath = uploadRes.path
            }
        }

        const payload = {
            ...formData,
            image: imagePath
        }

        await $fetch(`/api/v1/admin/seo-pages/${itemId}`, {
            method: 'PUT',
            body: payload
        })
        router.push('/admin/seo-pages/list')
    } catch (error) {
        alert('Failed to update SEO page')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa SEO Configuration</h5>
            <NuxtLink to="/admin/seo-pages/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Page Name</label>
                            <input type="text" class="form-control" v-model="formData.name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Route / Slug</label>
                            <input type="text" class="form-control" v-model="formData.slug" required>
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-medium text-secondary">SEO Title</label>
                            <input type="text" class="form-control" v-model="formData.title">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-medium text-secondary">Meta Description</label>
                            <textarea class="form-control" v-model="formData.description" rows="3"></textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Priority (0.0 - 1.0)</label>
                            <input type="number" step="0.1" min="0" max="1" class="form-control"
                                v-model="formData.priority">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Change Frequency</label>
                            <select class="form-select" v-model="formData.change_freq">
                                <option value="always">Always</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="never">Never</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Sharing Image</label>
                            <input type="file" class="form-control" accept="image/*" @change="handleFileChange">
                            <div v-if="thumbnailPreview" class="mt-2 text-center border rounded p-2 bg-light">
                                <img :src="thumbnailPreview" alt="Sharing Image Preview" class="img-fluid rounded"
                                    style="max-height: 150px; object-fit: contain;">
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/seo-pages/list" class="btn btn-light px-4">Cancel</NuxtLink>
                        <button type="submit" class="btn btn-primary px-4 fw-bold" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
