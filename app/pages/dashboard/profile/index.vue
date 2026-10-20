<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useUserStore } from '../../../../stores/user';

definePageMeta({
    layout: 'dashboard'
})

const userStore = useUserStore()
const isEditing = ref(false)

const formData = reactive({
    image: null as string | null,
    name: '',
    birthday: '',
    phone: '',
    bio: ''
})

console.log('userStore.image: ', userStore.image);


const fileInput = ref<HTMLInputElement | null>(null)
const uploadedImagePath = ref<string | null>(null)
const isUploadingImage = ref(false)

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
        const file = input.files[0]

        // Show local preview immediately
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                formData.image = e.target.result as string
            }
        }
        reader.readAsDataURL(file)

        // Upload to server
        isUploadingImage.value = true
        try {
            const base64Reader = new FileReader()
            base64Reader.onload = async (e) => {
                if (e.target?.result) {
                    const base64 = e.target.result as string
                    const res: any = await $fetch('/api/v1/client/file/upload-base64', {
                        method: 'POST',
                        body: {
                            image: base64,
                            filename: `profile_avatar_${Date.now()}`
                        }
                    })
                    if (res.success && res.path) {
                        uploadedImagePath.value = res.path
                    }
                    isUploadingImage.value = false
                }
            }
            base64Reader.readAsDataURL(file)
        } catch (error) {
            console.error('Failed to upload image:', error)
            isUploadingImage.value = false
        }
    }
}


const startEdit = () => {
    formData.image = userStore.image
    formData.name = userStore.name || ''
    formData.birthday = userStore.birthday || ''
    formData.phone = userStore.phone || ''
    formData.bio = userStore.bio || ''
    uploadedImagePath.value = null
    isEditing.value = true
}

const cancelEdit = () => {
    uploadedImagePath.value = null
    isEditing.value = false
}

const isSaving = ref(false)
const isLoadingProfile = ref(false)

const fetchProfile = async () => {
    isLoadingProfile.value = true
    try {
        const res: any = await $fetch('/api/v1/client/profile')
        if (res.success && res.data) {
            userStore.name = res.data.name || userStore.name
            userStore.image = res.data.avatar || userStore.image
            userStore.birthday = res.data.birthday || null
            userStore.phone = res.data.phone || null
            userStore.bio = res.data.introduction || null
            userStore.social = res.data.social || "normal"
        }
    } catch (error: any) {
        console.error('Failed to fetch profile:', error)
    } finally {
        isLoadingProfile.value = false
    }
}

const saveEdit = async () => {
    if (isSaving.value || isUploadingImage.value) return
    isSaving.value = true
    try {
        const bodyData: any = {
            name: formData.name,
            birthday: formData.birthday,
            phone: formData.phone,
            bio: formData.bio,
        }

        // Only send image if a new one was uploaded to the server
        if (uploadedImagePath.value) {
            bodyData.image = uploadedImagePath.value
        }

        const res: any = await $fetch('/api/v1/client/profile/update', {
            method: 'PUT',
            body: bodyData
        })

        if (res.success) {
            // Update store with new values
            userStore.name = formData.name
            userStore.birthday = formData.birthday
            userStore.phone = formData.phone
            userStore.bio = formData.bio
            if (uploadedImagePath.value) userStore.image = uploadedImagePath.value
            isEditing.value = false
            console.log('Cập nhật thông tin thành công!')
        } else {
            console.log(res.message || 'Cập nhật thất bại!')
        }
    } catch (error: any) {
        console.error('Failed to update profile:', error)
        console.log('Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
        isSaving.value = false
    }
}

onMounted(() => {
    fetchProfile()
})

</script>

<template>
    <div class="profile-page-content dashboard-cover">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0 d-flex align-items-center">
                <BaseIconComponent name="account-circle" :size="20" color="#007bff" class="me-2" />
                Thông tin cá nhân
            </h5>
            <button v-if="!isEditing" @click="startEdit"
                class="btn btn-light btn-sm border rounded-pill px-3 fw-bold shadow-sm">
                <BaseIconComponent name="edit-3" type="lucide" :size="14" class="me-1" /> <span class="edit-text">Chỉnh
                    sửa</span>
            </button>
        </div>

        <div class="card shadow-sm border-0 rounded-4 p-4 mb-4">
            <div class="d-flex mb-4">
                <div class="position-relative">
                    <div class="avatar-large shadow-sm overflow-hidden">
                        <nuxt-img v-if="isEditing && formData.image" :src="formData.image"
                            class="w-100 h-100 object-fit-cover a" />
                        <nuxt-img v-else-if="!isEditing && userStore.image" :src="userStore.image"
                            class="w-100 h-100 object-fit-cover b" />
                        <nuxt-img v-else-if="isEditing && userStore.image && !formData.image" :src="userStore.image"
                            class="w-100 h-100 object-fit-cover c" />
                        <span v-else>{{ userStore.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                    </div>
                    <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleImageUpload">
                    <button v-if="isEditing" @click="triggerFileInput"
                        class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center"
                        style="width: 32px; height: 32px; border: 2px solid white;">
                        <BaseIconComponent name="camera" type="lucide" :size="16" color="#fff" />
                    </button>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">Họ tên</label>
                    <input v-if="isEditing" type="text" class="form-control form-control-sm bg-light border-0 py-2"
                        v-model="formData.name" placeholder="Nhập họ tên">
                    <input v-else type="text" class="form-control form-control-sm bg-light border-0 py-2"
                        :value="userStore.name || ''" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">Ngày sinh</label>
                    <input v-if="isEditing" type="date" class="form-control form-control-sm bg-light border-0 py-2"
                        v-model="formData.birthday">
                    <input v-else type="date" class="form-control form-control-sm bg-light border-0 py-2"
                        :value="userStore.birthday || ''" disabled>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">Email</label>
                    <input type="email" class="form-control form-control-sm bg-light border-0 py-2"
                        :value="userStore.email" disabled>
                    <div class="form-text text-muted" style="font-size: 11px;">Email đã được xác thực và không thể thay
                        đổi</div>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">Số điện thoại</label>
                    <input v-if="isEditing" type="text" class="form-control form-control-sm bg-light border-0 py-2"
                        placeholder="Nhập số điện thoại" v-model="formData.phone">
                    <input v-else type="text" class="form-control form-control-sm bg-light border-0 py-2"
                        :value="userStore.phone || 'Chưa cập nhật'" disabled>
                </div>
                <div class="col-12">
                    <label class="form-label small fw-bold text-secondary">Giới thiệu</label>
                    <textarea v-if="isEditing" class="form-control bg-light border-0" rows="3"
                        placeholder="Viết đôi điều về bạn..." v-model="formData.bio"></textarea>
                    <textarea v-else class="form-control bg-light border-0" rows="3"
                        :value="userStore.bio || 'Chưa cập nhật'" disabled></textarea>
                </div>
                <div v-if="isEditing" class="col-12 d-flex justify-content-end mt-4 gap-2">
                    <button @click="cancelEdit" class="btn btn-light btn-sm border rounded px-3 fw-bold">
                        Hủy
                    </button>
                    <!-- BUTTON SAVE -->
                    <button @click="saveEdit" class="btn btn-primary btn-sm rounded px-3 fw-bold text-white"
                        :disabled="isSaving || isUploadingImage">
                        <span v-if="isSaving || isUploadingImage" class="spinner-border spinner-border-sm me-1"
                            role="status" aria-hidden="true"></span>
                        {{ isUploadingImage ? 'Đang tải ảnh...' : isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="card shadow-sm border-0 rounded-4 p-4 mb-4">
            <h6 class="fw-bold mb-3">Tài khoản Cinelove</h6>
            <div class="d-flex align-items-center p-2">
                <BaseIconComponent name="google" type="simple-icons" :size="18" color="#adb5bd" class="me-3" />
                <span class="small text-muted">Tài khoản đăng ký bằng Google</span>
            </div>
        </div>

        <div class="card shadow-sm border-0 rounded-4 p-4">
            <h6 class="fw-bold mb-3">Gói dịch vụ của bạn</h6>
            <div class="p-3 rounded-4 info-card d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3"
                style="background-color: #f0f4ff;">
                <div class="d-flex align-items-center">
                    <div class="package-icon-box me-3">
                        <BaseIconComponent name="user" type="lucide" :size="18" color="#6c757d" />
                    </div>
                    <div>
                        <div class="fw-bold small">Gói Free</div>
                        <div class="text-muted" style="font-size: 11px;">Gói miễn phí cơ bản</div>
                    </div>
                </div>
                <button
                    class="btn btn-primary btn-update-package btn-sm px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center align-self-end align-self-md-auto">
                    <BaseIconComponent name="zap" type="lucide" :size="14" class="me-1" color="#fff" /> Nâng cấp
                </button>
            </div>
        </div>

        <!-- NÚT ĐĂNG XUẤT -->
        <div class="mt-3 btn-logout-container">
            <button @click="userStore.logout()"
                class="btn btn-outline-danger w-100 py-3 fw-bold rounded-4 btn-logout shadow-sm bg-white">
                Đăng xuất
            </button>
        </div>
    </div>
</template>

<style scoped>
.btn-logout {
    border-color: #ffcad1 !important;
    color: #f43f5e !important;
    transition: all 0.3s;
}

.btn-logout-container {
    margin-bottom: 140px;
}

.btn-logout:hover {
    background-color: #fff1f2 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 63, 94, 0.15) !important;
}

.profile-page-content {
    background-color: #f4f7fa;
    padding: 7px;
}

.avatar-large {
    width: 100px;
    height: 100px;
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    text-transform: uppercase;
}

.card {
    border: none;
    transition: transform 0.2s;
}

.rounded-4 {
    border-radius: 1rem !important;
}

.form-control:focus {
    box-shadow: none;
    background-color: #fff !important;
    border: 1px solid #007bff !important;
}

.package-icon-box {
    width: 40px;
    height: 40px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-primary {
    background: linear-gradient(45deg, #6c5ce7, #a29bfe);
    border: none;
}

.btn-primary:hover {
    filter: brightness(1.1);
}

@media (max-width: 768px) {
    .edit-text {
        display: none;
    }

    .package-icon-box {
        margin-right: 3px !important;
    }

    .btn-update-package {
        padding-left: 15px !important;
        padding-right: 15px !important;
    }

    .info-card {
        flex-direction: row !important;
    }

    .card {
        padding: 15px !important;
    }
}
</style>