<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name_vi: '',
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

const router = useRouter()
const isLoading = ref(false)

const submitForm = async () => {
    isLoading.value = true
    try {
        const res: any = await $fetch('/api/v1/admin/article-types/create', {
            method: 'POST',
            body: formData
        })
        const newId = res.data?.id
        if (newId && thumbnailBase64.value) {
            await $fetch('/api/v1/admin/file/upload-base64', {
                method: 'POST',
                body: {
                    image: thumbnailBase64.value,
                    filename: `IMAGE_TYPE_NEWS_${newId}`,
                    folder: 'articles_types'
                }
            })
        }
        router.push('/admin/article-types/list')
    } catch (error) {
        alert('Failed to create article type')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm loại bài viết</h5>
            <NuxtLink to="/admin/article-types/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                            <input type="text" class="form-control" v-model="formData.name_vi"
                                placeholder="Enter article type name" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Thumbnail</label>
                            <input type="file" class="form-control" accept="image/*" @change="handleFileChange">
                            <div v-if="thumbnailPreview" class="mt-2 text-center border rounded p-2 bg-light">
                                <img :src="thumbnailPreview" alt="Thumbnail Preview" class="img-fluid rounded"
                                    style="max-height: 150px; object-fit: contain;">
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/article-types/list" class="btn btn-light btn-icon" title="Hủy">
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
