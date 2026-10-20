<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';

definePageMeta({
    layout: 'dashboard'
})

// Trạng thái hiển thị Form nhập liệu
const isFormVisible = ref(false)

// Form dữ liệu góp ý
const isSubmitting = ref(false)
const feedbackForm = ref({
    type: '',
    title: '',
    content: '',
    images: [] as string[]
})
const fileInput = ref<HTMLInputElement | null>(null)

const feedbackTypes = ref<any[]>([])
const feedbackList = ref<any[]>([])

// Fetch user feedback history
const fetchFeedbackHistory = async () => {
    try {
        const response = await $fetch<any>('/api/v1/client/news/feedback', { method: 'GET' })
        if (response.success) {
            feedbackList.value = response.data
        }
    } catch (e) {
        console.error("Failed to fetch feedback history", e)
    }
}

// Fetch feedback types directly in setup
const { data: typesResponse } = await useAsyncData('feedbackTypes', () =>
    $fetch<any>('/api/v1/client/news/by-key', { query: { key: 'type_feedback' } })
)

// Fetch history on mount
fetchFeedbackHistory()

if (typesResponse.value && typesResponse.value.success) {
    feedbackTypes.value = typesResponse.value.data
    // Set default selected option
    if (feedbackTypes.value.length > 0) {
        feedbackForm.value.type = feedbackTypes.value[0].id
    }
}

// Handle Image Selection
const triggerFileInput = () => {
    if (feedbackForm.value.images.length >= 3) {
        alert('Chỉ được tải lên tối đa 3 ảnh.')
        return
    }
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
        if (feedbackForm.value.images.length >= 3) break

        const file = files[i]
        if (!file) continue
        if (!file.type.startsWith('image/')) continue

        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result && typeof e.target.result === 'string') {
                feedbackForm.value.images.push(e.target.result)
            }
        }
        reader.readAsDataURL(file)
    }

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const removeImage = (index: number) => {
    feedbackForm.value.images.splice(index, 1)
}

// Submission Logic
const submitFeedback = async () => {
    if (!feedbackForm.value.title || !feedbackForm.value.content) {
        alert('Vui lòng nhập đầy đủ tiêu đề và nội dung.')
        return
    }

    isSubmitting.value = true
    try {
        const response = await $fetch<any>('/api/v1/client/news/feedback', {
            method: 'POST',
            body: feedbackForm.value
        })

        if (response.success) {
            alert('Gửi ý kiến thành công! CineLove cảm ơn những đóng góp của bạn.')
            // Reset form
            feedbackForm.value = {
                ...feedbackForm.value,
                title: '',
                content: '',
                images: []
            }
            if (feedbackTypes.value.length > 0) {
                feedbackForm.value.type = feedbackTypes.value[0].id
            }
            isFormVisible.value = false
            await fetchFeedbackHistory() // Refresh the list
        } else {
            alert('Có lỗi xảy ra: ' + response.message)
        }
    } catch (error) {
        alert('Không thể gửi ý kiến lúc này, vui lòng thử lại sau.')
        console.error(error)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="feedback-page dashboard-cover">
        <div class="mb-4 ">
            <!-- RETURN PAGE PREVIOUS -->
            <div class="fb-title">
                <ButtonReturnMobileComponent />
                <h5 class="fw-bold mb-0 d-flex align-items-center text-primary-cinelove">
                    <BaseIconComponent name="chat-round-dots-filled" type="line-md" color="#3f83f8" :size="25"
                        class="me-2" />
                    <span class="title-text">Góp ý & Phản hồi</span>
                </h5>
            </div>
            <p class="text-muted small mb-3">CineLove luôn lắng nghe mọi ý kiến đóng góp của bạn để cải thiện sản phẩm
                tốt hơn.</p>

            <button v-if="!isFormVisible" @click="isFormVisible = true"
                class="btn btn-primary-cinelove rounded-3 px-3 py-2 fw-bold d-flex align-items-center shadow-sm">
                <BaseIconComponent name="message-square" type="lucide" :size="18" class="me-1" color="#fff" />
                Gửi ý kiến mới
            </button>
        </div>

        <Transition name="fade-slide">
            <div v-if="isFormVisible" class="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden animate-fade-in">
                <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold mb-0">Gửi ý kiến của bạn</h6>
                    <button @click="isFormVisible = false" class="btn-close-custom border-0 bg-transparent p-1">
                        <BaseIconComponent name="x" type="lucide" :size="18" color="#666" />
                    </button>
                </div>

                <div class="card-body p-4">
                    <div class="instruction-box p-3 rounded-3 mb-4 bg-light-gray border">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small fw-bold text-dark d-flex align-items-center">
                                <BaseIconComponent name="chevron-down" type="lucide" :size="14" class="me-2" /> Hướng
                                dẫn gửi ý kiến
                            </span>
                            <BaseIconComponent name="info" type="lucide" :size="14" color="#007bff" />
                        </div>
                        <ul class="small text-muted mb-0 ps-3">
                            <li>Chọn danh mục phù hợp với nội dung bạn muốn gửi</li>
                            <li>Tiêu đề ngắn gọn, súc tích về vấn đề của bạn</li>
                            <li>Mô tả chi tiết để chúng tôi hiểu rõ hơn về ý kiến của bạn</li>
                            <li>Có thể đính kèm ảnh chụp màn hình nếu cần thiết (tối đa 3 ảnh)</li>
                        </ul>
                    </div>

                    <div class="row g-3">
                        <!-- FEEDBACK TYPES -->
                        <div class="col-12">
                            <label class="small fw-bold mb-1 text-dark"><span class="text-danger">*</span> Loại ý
                                kiến</label>

                            <select v-model="feedbackForm.type" class="form-select form-select-sm py-2 rounded-2">
                                <option v-for="item in feedbackTypes" :key="item.id" :value="item.id">
                                    {{ item.content }} - {{ item.desc }}
                                </option>
                            </select>
                        </div>

                        <div class="col-12">
                            <label class="small fw-bold mb-1 text-dark"><span class="text-danger">*</span> Tiêu
                                đề</label>
                            <div class="position-relative">
                                <input v-model="feedbackForm.title" type="text"
                                    class="form-control form-control-sm py-2 rounded-2"
                                    placeholder="Nhập tiêu đề ngắn gọn cho ý kiến của bạn">
                                <span class="char-count text-muted">0 / 100</span>
                            </div>
                        </div>

                        <div class="col-12">
                            <label class="small fw-bold mb-1 text-dark"><span class="text-danger">*</span> Nội dung chi
                                tiết</label>
                            <div class="position-relative">
                                <textarea v-model="feedbackForm.content" class="form-control rounded-2" rows="5"
                                    placeholder="Mô tả chi tiết ý kiến, đề xuất hoặc vấn đề bạn gặp phải..."></textarea>
                                <span class="char-count text-muted">0 / 1000</span>
                            </div>
                        </div>

                        <div class="col-12">
                            <label class="small fw-bold mb-1 text-dark">Ảnh đính kèm
                                <BaseIconComponent name="info" type="lucide" :size="12" class="ms-1" color="#adb5bd" />
                            </label>

                            <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileChange"
                                class="d-none" />

                            <div class="d-flex flex-wrap gap-2">
                                <!-- Uploaded Images -->
                                <div v-for="(img, idx) in feedbackForm.images" :key="idx"
                                    class="position-relative upload-area rounded-3 border">
                                    <img :src="img" class="w-100 h-100 object-fit-cover rounded-3" />
                                    <button @click.prevent="removeImage(idx)"
                                        class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 20px; height: 20px;">
                                        <BaseIconComponent name="x" type="lucide" :size="12" color="#fff" />
                                    </button>
                                </div>

                                <div v-if="feedbackForm.images.length < 3" @click="triggerFileInput"
                                    class="upload-area d-flex flex-column align-items-center justify-content-center rounded-3 border-dashed cursor-pointer">
                                    <BaseIconComponent name="upload" type="lucide" :size="20" color="#adb5bd" />
                                    <span class="small text-muted mt-1">Tải ảnh lên</span>
                                </div>
                            </div>
                            <span class="text-muted mt-1 d-block" style="font-size: 11px;">Tối đa 3 ảnh ({{
                                feedbackForm.images.length }}/3)</span>
                        </div>
                        <!-- BUTTON SEND -->
                        <div class="col-12 mt-4">
                            <button @click.prevent="submitFeedback" :disabled="isSubmitting"
                                class="btn btn-primary-cinelove px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center">
                                <BaseIconComponent v-if="!isSubmitting" name="send" type="lucide" :size="16"
                                    class="me-2" color="#fff" />
                                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                {{ isSubmitting ? 'Đang gửi...' : 'Gửi ý kiến' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- LIST FEEDBACK -->
        <div class="card shadow-sm border-0 rounded-4 p-4 p-md-5 text-center" v-if="feedbackList.length === 0">
            <div class="d-flex align-items-center justify-content-center mb-4 text-primary-cinelove">
                <BaseIconComponent name="chat-round-dots-filled" type="line-md" color="#3f83f8" :size="25"
                    class="me-2" />
                <h6 class="fw-bold mb-0 fs-5">Ý kiến đã gửi</h6>
            </div>
            <div class="empty-icon py-4 opacity-25">
                <BaseIconComponent name="inbox" type="lucide" :size="56" />
            </div>
            <p class="empty-text text-muted small mb-0">Bạn chưa gửi ý kiến nào</p>
        </div>

        <div v-else class="feedback-history">
            <div class="d-flex align-items-center mb-4">
                <BaseIconComponent name="history" type="lucide" :size="20" class="me-2 text-primary-cinelove" />
                <h6 class="fw-bold mb-0 fs-5">Ý kiến đã gửi ({{ feedbackList.length }})</h6>
            </div>

            <div class="row g-4">
                <div v-for="item in feedbackList" :key="item.id" class="col-12">
                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h6 class="fw-bold mb-1 text-dark">{{ item.content }}</h6>
                                    <div class="text-muted small d-flex align-items-center">
                                        <BaseIconComponent name="clock" type="lucide" :size="12" class="me-1" />
                                        {{ new Date(item.createdAt).toLocaleString('vi-VN') }}
                                        <span class="mx-2 text-light-subtle">•</span>
                                        <span class="badge bg-light text-dark border fw-normal">
                                            Phản hồi
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p class="text-dark small mb-3 white-space-pre-line">{{ item.desc }}</p>

                            <!-- Hiển thị hình ảnh nếu có -->
                            <div v-if="item.galleries && item.galleries.length > 0" class="d-flex flex-wrap gap-2 mt-2">
                                <div v-for="gal in item.galleries" :key="gal.id"
                                    class="rounded-3 border overflow-hidden" style="width: 80px; height: 80px;">
                                    <img :src="`/images/user_feedback/USER_FEEDBACK_${gal.id}.png`"
                                        class="w-100 h-100 object-fit-cover" alt="Feedback image" loading="lazy" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.feedback-page {
    background-color: #f4f7fa;
}

/* Colors & Buttons */
.text-primary-cinelove {
    color: #000;
}

.btn-primary-cinelove {
    background-color: #3b82f6;
    border: none;
    color: white;
    transition: all 0.2s;
}

.btn-primary-cinelove:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
}

/* Form Styles */
.bg-light-gray {
    background-color: #f9fafb;
}

.border-dashed {
    border: 2px dashed #e5e7eb;
}

.instruction-box {
    border: 1px solid #e5e7eb;
}

.char-count {
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 11px;
}

.upload-area {
    width: 100px;
    height: 100px;
    background-color: #f9fafb;
    transition: 0.2s;
}

.upload-area:hover {
    border-color: #3b82f6;
    background-color: #f0f7ff;
}

/* Form Controls */
.form-control,
.form-select {
    border-color: #e5e7eb;
    font-size: 13px;
    padding: 10px;
}

.form-control:focus {
    box-shadow: none;
    border-color: #3b82f6;
}

.rounded-4 {
    border-radius: 1rem !important;
}

/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.white-space-pre-line {
    white-space: pre-line;
}

@media (max-width: 768px) {
    .fb-title {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
    }

    .btn-primary-cinelove {
        width: 100%;
        justify-content: center;
        background-color: #3a9bff;
        padding-top: 7px !important;
        padding-bottom: 7px !important;
        font-weight: 500 !important;
    }

    .title-text {
        color: #000;
    }

    .text-primary-cinelove {
        justify-content: start !important;
    }

    .empty-text {
        font-size: 12px !important;
    }

    .empty-icon {
        padding-top: 7px !important;
        padding-bottom: 7px !important;
    }

    .feedback-page {
        padding: 25px 10px;
    }
}
</style>