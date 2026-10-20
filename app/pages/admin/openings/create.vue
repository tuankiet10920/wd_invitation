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
    image_left: '',
    image_right: '',
    video: '',
    is_custom: false,
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

const handleFileChange = async (event: Event, field: 'image_left' | 'image_right' | 'video') => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("folder", "openings");

    isLoading.value = true;
    try {
        const res: any = await $fetch('/api/v1/admin/file/upload-raw', {
            method: 'POST',
            body: formDataFile
        });
        if (res && res.path) {
            formData[field] = res.path;
        }
    } catch (error) {
        console.error(`Failed to upload ${field}`, error);
        alert(`Failed to upload file`);
    } finally {
        isLoading.value = false;
    }
};

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/v1/admin/openings/create', {
            method: 'POST',
            body: formData
        })
        router.push('/admin/openings/list')
    } catch (error) {
        alert('Failed to create Opening')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm hiệu ứng mở đầu</h5>
            <NuxtLink to="/admin/openings/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
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
                                placeholder="Enter Opening name" required>
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
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Image Left</label>
                            <input type="file" accept="image/*" class="form-control mb-2" @change="e => handleFileChange(e, 'image_left')">
                            <input type="text" class="form-control" v-model="formData.image_left" placeholder="Auto-filled filename">
                            <img v-if="formData.image_left" :src="`/images/openings/${formData.image_left}`" alt="Left" class="img-fluid mt-2 border rounded" style="max-height: 120px; object-fit: contain;">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Image Right</label>
                            <input type="file" accept="image/*" class="form-control mb-2" @change="e => handleFileChange(e, 'image_right')">
                            <input type="text" class="form-control" v-model="formData.image_right" placeholder="Auto-filled filename">
                            <img v-if="formData.image_right" :src="`/images/openings/${formData.image_right}`" alt="Right" class="img-fluid mt-2 border rounded" style="max-height: 120px; object-fit: contain;">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Video</label>
                            <input type="file" accept="video/*" class="form-control mb-2" @change="e => handleFileChange(e, 'video')">
                            <input type="text" class="form-control" v-model="formData.video" placeholder="Auto-filled filename">
                            <video v-if="formData.video" :src="`/images/openings/${formData.video}`" controls class="mt-2 border rounded w-100 bg-black" style="max-height: 200px;"></video>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                            <div class="form-check form-switch mt-4">
                                <input class="form-check-input" type="checkbox" role="switch" id="is_custom" v-model="formData.is_custom">
                                <label class="form-check-label ms-2 fw-medium text-secondary" for="is_custom">Is Custom Layout?</label>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/openings/list" class="btn btn-light btn-icon" title="Hủy">
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
