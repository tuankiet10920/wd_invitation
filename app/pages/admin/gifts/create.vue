<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';

definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    name: '',
    price: 500,
    image: '',
    background: '',
    file: ''
})

const router = useRouter()
const isLoading = ref(false)
const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const handleFileChange = async (event: Event, field: 'image' | 'background' | 'file', folder: string) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("folder", folder);

    isLoading.value = true;
    try {
        const res: any = await $fetch('/api/v1/admin/file/upload-raw', {
            method: 'POST',
            body: formDataFile
        });
        if (res && res.path) {
            formData[field] = res.path;
            if (field === 'image' && !formData.background) {
                formData.background = res.path;
            }
        }
    } catch (error) {
        console.error(`Failed to upload ${field}`, error);
    } finally {
        isLoading.value = false;
        if (target) target.value = '';
    }
};

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/v1/admin/gifts/create', {
            method: 'POST',
            body: {
                name: formData.name,
                price: Number(formData.price) || 0,
                image: formData.image,
                background: formData.background || formData.image,
                file: formData.file
            }
        })
        router.push('/admin/gifts/list')
    } catch (error) {
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Không thể tạo quà tặng mới!"
        type.value = "error"
        openModal.value = true
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Thêm quà tặng mới</h5>
            <NuxtLink to="/admin/gifts/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Tên quà tặng <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" v-model="formData.name"
                                placeholder="Nhập tên quà tặng (VD: Bắn tim)" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Giá (Xu) <span class="text-danger">*</span></label>
                            <input type="number" min="0" class="form-control" v-model="formData.price"
                                placeholder="Nhập số xu (VD: 520)" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Hình ảnh quà tặng</label>
                            <input type="file" accept="image/*" class="form-control mb-2"
                                @change="e => handleFileChange(e, 'image', 'gift_images')">
                            <input type="text" class="form-control" v-model="formData.image"
                                placeholder="Tên file ảnh (VD: biubiu.png)">
                            <img v-if="formData.image"
                                :src="formData.image.startsWith('/') ? formData.image : `/images/gift_images/${formData.image}`"
                                alt="Gift Image" class="img-fluid mt-2 border rounded p-1 bg-light"
                                style="max-height: 100px; object-fit: contain;">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Hình nền quà tặng</label>
                            <input type="file" accept="image/*" class="form-control mb-2"
                                @change="e => handleFileChange(e, 'background', 'gift_bg')">
                            <input type="text" class="form-control" v-model="formData.background"
                                placeholder="Tên file nền (VD: biubiu.png)">
                            <img v-if="formData.background"
                                :src="formData.background.startsWith('/') ? formData.background : `/images/gift_bg/${formData.background}`"
                                alt="Gift Background" class="img-fluid mt-2 border rounded p-1 bg-light"
                                style="max-height: 100px; object-fit: contain;">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-medium text-secondary">Tệp hiệu ứng (.bin)</label>
                            <input type="file" class="form-control mb-2"
                                @change="e => handleFileChange(e, 'file', 'gifts')">
                            <input type="text" class="form-control" v-model="formData.file"
                                placeholder="Tên file hiệu ứng (VD: biubiu.bin)">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/gifts/list" class="btn btn-light btn-icon" title="Hủy">
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
    <NotificationModalComponent v-model="openModal" :message="message" :title="title" :type="type" />
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

