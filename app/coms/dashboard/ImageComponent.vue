<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';
import { useElementStore } from '~~/stores/element';

const editor = useEditorStore()
const element = useElementStore()

const uploadedFilesCount = ref(0);
const maxFiles = ref(10);
const isUploading = ref(false);
const uploadedImages = ref<any[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const { data: imageStats } = await useAsyncData('imageStats', () =>
    $fetch<any>('/api/v1/client/file/image-stats', { credentials: 'include' })
)

if (imageStats.value && imageStats.value.success) {
    uploadedFilesCount.value = imageStats.value.data.uploadedFilesCount
    maxFiles.value = imageStats.value.data.maxFiles
}

// Fetch existing personal images
const { data: personalImages } = await useAsyncData('personalImages', () =>
    $fetch<any>('/api/v1/client/file/personal-images', { credentials: 'include' })
)

if (personalImages.value && personalImages.value.success) {
    uploadedImages.value = personalImages.value.data
}

const triggerFileInput = () => {
    if (editor.role !== 'admin' && uploadedFilesCount.value >= maxFiles.value) {
        alert('Đã đạt giới hạn số lượng ảnh cho gói dịch vụ của bạn.')
        return
    }
    fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    if (!files || files.length === 0) return

    let maxUpload = 15;
    if (editor.role !== 'admin') {
        const remaining = maxFiles.value - uploadedFilesCount.value
        maxUpload = Math.min(files.length, remaining, 15)
    } else {
        maxUpload = Math.min(files.length, 15)
    }

    const formData = new FormData()
    let hasValidFiles = false

    for (let i = 0; i < maxUpload; i++) {
        const file = files[i]
        if (!file) continue
        if (!file.type.startsWith('image/')) continue
        formData.append('images', file)
        hasValidFiles = true
    }

    if (!hasValidFiles) return

    isUploading.value = true
    try {
        const response = await $fetch<any>('/api/v1/client/file/upload-personal', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })

        if (response.success) {
            uploadedImages.value.push(...response.data)
            uploadedFilesCount.value += response.data.length
        } else {
            alert('Lỗi tải ảnh: ' + response.message)
        }
    } catch (e: any) {
        const errorMsg = e?.response?._data?.message || e?.message || 'Unknown error'
        alert(`Không thể tải ảnh lên lúc này. (Chi tiết: ${errorMsg})`)
        console.error(e)
    } finally {
        isUploading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) return url;
    return `/images/personal_image/${url}`;
}

const deleteImage = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này không?')) return

    try {
        const response = await $fetch<any>(`/api/v1/client/file/personal-image/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (response.success) {
            uploadedImages.value = uploadedImages.value.filter(img => img.id !== id)
            uploadedFilesCount.value--
        } else {
            alert('Lỗi khi xóa ảnh: ' + response.message)
        }
    } catch (e: any) {
        alert('Không thể xóa ảnh lúc này.')
        console.error(e)
    }
}

// Add image to canvas
const addImageToCanvas = (url: string) => {
    if (editor.isReplacingImage && editor.selectedNodeId) {
        editor.updateNodeProps(editor.selectedNodeId, { url: getImageUrl(url) })
        editor.isReplacingImage = false
        editor.activeMenu = null
    } else {
        // Add to canvas with the resolved URL
        editor.addNode('Image', {
            props: { url: getImageUrl(url), width: 200, height: 200 },
            styles: {
                width: '200px',
                height: '200px'
            }
        })
        element.type = 'Image'
    }
}
</script>
<template>
    <div>
        <div v-if="editor.isReplacingImage" class="alert alert-primary py-2 px-3 mb-3"
            style="font-size: 13px; background-color: #eff6ff; border-color: #bfdbfe; color: #1e40af; border-radius: 8px;">
            Hãy chọn ảnh bạn muốn thay thế
        </div>
        <h6 class="fw-bold mb-3" style="font-size: 15px;">Hình ảnh</h6>

        <input type="file" ref="fileInput" accept="image/*" multiple @change="handleFileChange" class="d-none" />

        <div class="upload-area mb-4" @click="triggerFileInput">
            <div class="free-badge shadow-sm" v-if="editor.role !== 'admin'">{{ uploadedFilesCount >= maxFiles ? 'Limit'
                : 'Free' }}</div>
            <div class="upload-dashed-box d-flex flex-column align-items-center justify-content-center p-4">
                <BaseIconComponent v-if="!isUploading" name="cloud-upload" type="lucide" :size="32" color="#3b82f6" />
                <span v-else class="spinner-border spinner-border-sm text-primary" role="status"
                    aria-hidden="true"></span>
                <p class="text-center mt-2 mb-2 px-2"
                    style="font-size: 11px; line-height: 1.5; color: #666; white-space: normal;">
                    {{ isUploading ? 'Đang tải lên...' : `Kéo thả hoặc nhấn vào đây để tải lên file. Có thể tải lên tối
                    đa 15 ảnh cùng một lúc.` }}
                </p>
                <div class="stats-text small text-primary fw-bold" style="font-size: 11px;">
                    <template v-if="editor.role === 'admin'">
                        Quản trị viên: Không giới hạn
                    </template>
                    <template v-else>
                        Đã tải: {{ uploadedFilesCount }}/{{ maxFiles }} • Còn lại: {{ Math.max(0, maxFiles -
                        uploadedFilesCount) }}
                    </template>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-end mb-2">
            <h6 class="fw-bold mb-0" style="font-size: 14px;">Tệp đã tải lên</h6>
            <span class="text-muted" style="font-size: 11px;">Tổng {{ uploadedImages.length }} tệp</span>
        </div>

        <div v-if="uploadedImages.length === 0"
            class="empty-upload-list border rounded-3 bg-light d-flex align-items-center justify-content-center"
            style="height: 380px;">
            <span class="text-muted small">Chưa có tệp nào</span>
        </div>
        <div v-else class="uploaded-grid">
            <div v-for="img in uploadedImages" :key="img.id"
                class="uploaded-item rounded-3 border overflow-hidden position-relative"
                @click.stop="addImageToCanvas(img.url)">
                <img :src="getImageUrl(img.url)" class="w-100 h-100 object-fit-cover" :alt="'Image ' + img.id"
                    loading="lazy" />
                <div
                    class="hover-overlay position-absolute w-100 h-100 top-0 start-0 d-flex align-items-end justify-content-end p-2">
                    <button
                        class="delete-btn btn btn-white shadow-sm d-flex align-items-center justify-content-center p-0"
                        @click.stop="deleteImage(img.id)">
                        <BaseIconComponent name="trash-2" type="lucide" :size="14" color="#ef4444" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* UPLOAD UI (HÌNH ẢNH) */
.upload-area {
    position: relative;
    padding-top: 10px;
}

.upload-dashed-box {
    border: 1.5px dashed #d1d5db;
    border-radius: 12px;
    background-color: #fafafa;
    transition: 0.2s;
    cursor: pointer;
}

.upload-dashed-box:hover {
    border-color: #3b82f6;
    background-color: #f0f7ff;
}

.free-badge {
    position: absolute;
    top: 0px;
    left: 12px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 10px;
    padding: 2px 10px;
    border-radius: 6px;
    font-weight: bold;
    z-index: 2;
    border: 1px solid #bae6fd;
}

/* STOCK UI */
.btn-filter {
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    border: 1px solid transparent;
    white-space: nowrap;
}

.btn-primary-soft {
    background-color: #e0f2fe;
    color: #3b82f6;
}

.stock-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.stock-item {
    aspect-ratio: 1;
    transition: 0.2s;
    cursor: pointer;
}

.stock-item:hover {
    border-color: #3b82f6 !important;
    transform: scale(1.02);
}

.uploaded-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.uploaded-item {
    aspect-ratio: 1;
    transition: 0.2s;
    cursor: pointer;
}

.hover-overlay {
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: 0.3s;
}

.uploaded-item:hover .hover-overlay {
    opacity: 1;
}

.delete-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: white;
    border: none;
    transition: 0.2s;
}

.delete-btn:hover {
    transform: scale(1.1);
    background: #fffafa;
}

.uploaded-item:hover {
    border-color: #3b82f6 !important;
    transform: scale(1.02);
}
</style>