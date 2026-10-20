<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
import SeoAnalyzer from '~/coms/admin/SeoAnalyzer.vue';

definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    title: '',
    category: '',
    status: 'Published',
    content: '',
    short_description: '',
    keyword: '',
    alt: ''
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const articleId = route.params.id

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
        thumbnailPreview.value = `/images/news/IMAGE_NEWS_${articleId}.png`
    }
}

const handleImageError = () => {
    if (!thumbnailBase64.value) {
        thumbnailPreview.value = null;
    }
}

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')
const types = ref<any[]>([])
const { $ckeditorLoaded } = useNuxtApp()
const loading = computed(() => !$ckeditorLoaded.value)

const getTypes = async () => {
    try {
        const { data }: any = await $fetch('/api/v1/admin/article-types')
        types.value = data
    } catch (error) {
        console.error(error)
    }
}

const fetchArticle = async () => {
    if (!articleId) return
    try {
        const data: any = await $fetch(`/api/v1/admin/articles/${articleId}`)
        if (data && data.data) {
            const item = data.data
            formData.title = item.title_vi
            formData.category = item.id_type_news
            formData.status = 'Published' // Placeholder as verified
            formData.content = item.content_vi
            formData.short_description = item.short_description_vi
            formData.keyword = item.keyword || ''
            formData.alt = item.alt || ''
            thumbnailPreview.value = `/images/news/IMAGE_NEWS_${articleId}.png`
        }
    } catch (error) {
        console.error("Failed to fetch article", error)
    }
}

const submitForm = async () => {
    if (!articleId) return
    isLoading.value = true
    try {
        const payload = {
            title_vi: formData.title,
            content_vi: formData.content,
            short_description_vi: formData.short_description,
            type_id: formData.category,
            keyword: formData.keyword,
            alt: formData.alt
            // Add other fields as necessary
        }
        await $fetch(`/api/v1/admin/articles/${articleId}`, {
            method: 'PUT',
            body: payload
        })

        if (thumbnailBase64.value) {
            await $fetch('/api/v1/admin/file/upload-base64', {
                method: 'POST',
                body: {
                    image: thumbnailBase64.value,
                    filename: `IMAGE_NEWS_${articleId}`
                }
            })
            thumbnailBase64.value = null;
            thumbnailPreview.value = `/images/news/IMAGE_NEWS_${articleId}.png`;
        }
        title.value = "Thành công!"
        message.value = "Cập nhật bài viết thành công!"
        type.value = "success"
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Cập nhật bài viết thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    getTypes()
    fetchArticle()
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa bài viết</h5>
            <NuxtLink to="/admin/articles/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <!-- Cột Nội dung chính (Title, Desc, Content) -->
                        <div class="col-lg-8">
                            <div class="row g-4">
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Title</label>
                                    <input type="text" class="form-control" v-model="formData.title"
                                        placeholder="Enter article title">
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Short Description</label>
                                    <textarea class="form-control" v-model="formData.short_description" rows="3"
                                        placeholder="Enter short description"></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Từ khóa SEO</label>
                                    <input type="text" class="form-control" v-model="formData.keyword"
                                        placeholder="Nhập từ khóa (cách nhau bởi dấu phẩy)">
                                </div>
                                <div class="col-12">
                                    <label for="content" class="form-label fw-medium text-secondary">Content</label>
                                    <div class="border rounded p-2" v-if="loading">Loading editor...</div>
                                    <ClientOnly v-else>
                                        <CKEditor v-model="formData.content" :config="{ height: 400 }" />
                                    </ClientOnly>
                                </div>
                            </div>
                        </div>

                        <!-- Cột Sidebar (Cài đặt, SEO) -->
                        <div class="col-lg-4">
                            <div class="row g-4">
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Status</label>
                                    <select class="form-select" v-model="formData.status">
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Type</label>
                                    <select class="form-select" v-model="formData.category">
                                        <option value="" disabled>Select Type</option>
                                        <option v-for="item in types" :key="item.id" :value="item.id">
                                            {{ item.name_vi }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label fw-medium text-secondary">Thumbnail</label>
                                    <input type="file" class="form-control" accept="image/*" @change="handleFileChange">
                                    <div v-if="thumbnailPreview" class="mt-2 text-center border rounded p-2 bg-light">
                                        <img :src="thumbnailPreview" @error="handleImageError" alt="Thumbnail Preview"
                                            class="img-fluid rounded mb-2" style="max-height: 150px; object-fit: contain;">
                                        <input type="text" class="form-control form-control-sm" v-model="formData.alt" placeholder="Nhập thẻ alt cho hình ảnh SEO (tùy chọn)">
                                    </div>
                                </div>
                                
                                <!-- Phân Tích SEO -->
                                <div class="col-12">
                                    <SeoAnalyzer :title="formData.title" :description="formData.short_description" :content="formData.content" :keyword="formData.keyword" :hasThumbnail="!!thumbnailPreview" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/articles/list" class="btn btn-light btn-icon" title="Hủy">
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
