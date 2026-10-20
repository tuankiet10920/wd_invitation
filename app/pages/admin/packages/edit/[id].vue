<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NotificationModalComponent from '~/coms/admin/dash/childs/modals/NotificationModalComponent.vue';
import { services } from '~~/composables/FuncServices';
definePageMeta({
    layout: 'admin'
})

interface Feature {
    id: string | number
    id_feature: string | number
    status: boolean
    name: string
}

const formData = reactive({
    name: '',
    original_price: 0,
    sale_price: 0,
    time_save_card: 0,
    is_best: 'Standard',
    short_description: '',
    image_limits: 0,
    feature_list: [] as Feature[]
})

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const packageId = route.params.id

const openModal = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'success' | 'error'>('success')

const fetchPackage = async () => {
    if (!packageId) return
    try {
        const data: any = await $fetch(`/api/v1/admin/packages/${packageId}`)
        if (data && data.data) {
            const pkg = data.data
            formData.name = pkg.name
            formData.original_price = pkg.original_price
            formData.sale_price = pkg.sale_price
            formData.time_save_card = pkg.time_save_card
            formData.is_best = pkg.is_best ? 'Best Seller' : 'Standard'
            formData.short_description = pkg.short_description
            formData.image_limits = pkg.image_limits
            formData.feature_list = pkg.feature_list.map((item: Feature) => {
                item.status = !!item.status
                return item
            })
        }
    } catch (error) {
        console.error("Failed to fetch package", error)
    }
}

// TODO - CHỈNH SỦA GÓI
const submitForm = async () => {
    if (!packageId) return
    isLoading.value = true
    try {
        const payload = {
            ...formData,
            is_best: formData.is_best === 'Best Seller'
        }
        await $fetch(`/api/v1/admin/packages/${packageId}`, {
            method: 'PUT',
            body: payload
        })
        title.value = "Thành công!"
        message.value = "Chỉnh sửa gói thành công!"
        type.value = "success"
    } catch (error) {
        alert('Failed to update package')
        console.error(error)
        title.value = "Thất bại!"
        message.value = "Chỉnh sửa gói thất bại!"
        type.value = "error"
    } finally {
        openModal.value = true
        isLoading.value = false
    }
}

onMounted(() => {
    fetchPackage()
})

// ! WARNING - CHỈ DÙNG ĐỂ SHOW, KHÔNG DÙNG ĐỂ LƯU TRỮ
const salePrice = computed(() => {
    return formData.sale_price > 0 ? services.formatMoney(formData.sale_price) : ''
})

// ! WARNING - CHỈ DÙNG ĐỂ SHOW, KHÔNG DÙNG ĐỂ LƯU TRỮ
const originalPrice = computed(() => {
    return formData.original_price > 0 ? services.formatMoney(formData.original_price) : ''
})
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chỉnh sửa gói dịch vụ</h5>
            <NuxtLink to="/admin/packages/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Package Name</label>
                            <input type="text" class="form-control" v-model="formData.name"
                                placeholder="Enter package name">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Original Price</label>
                            <div class="position-relative">
                                <input type="number" class="form-control text-white" v-model="formData.original_price"
                                    placeholder="Enter original price">
                                <span
                                    style="position: absolute; z-index: 2; top: 50%; left: 17px; transform: translateY(-50%);">{{
                                        originalPrice }}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Sale Price</label>
                            <div class="position-relative">
                                <input type="number" class="form-control text-white" v-model="formData.sale_price"
                                    placeholder="Enter sale price">
                                <span
                                    style="position: absolute; z-index: 2; top: 50%; left: 17px; transform: translateY(-50%);">{{
                                        salePrice }}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Duration (Days)</label>
                            <input type="number" class="form-control" v-model="formData.time_save_card"
                                placeholder="Enter duration in days">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Image Limits</label>
                            <input type="number" class="form-control" v-model="formData.image_limits"
                                placeholder="Enter image limits">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-medium text-secondary">Status</label>
                            <select class="form-select" v-model="formData.is_best">
                                <option value="Standard">Standard</option>
                                <option value="Best Seller">Best Seller</option>
                            </select>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Description</label>
                            <textarea class="form-control" v-model="formData.short_description" rows="4"
                                placeholder="Enter package description"></textarea>
                        </div>
                        <!-- LIST FEATURE FROM PACKAGE-FEATURES -->
                        <div v-if="formData.feature_list && Array.isArray(formData.feature_list) && formData.feature_list.length > 0"
                            class="col-md-12 ">
                            <div class="form-label fw-medium text-secondary">Features</div>
                            <div class="list-group">
                                <label v-for="(item, index) in formData.feature_list" :for="`statusSwitch${index}`"
                                    :key="item.id"
                                    class="flex-jb-ac cursor-pointer list-group-item list-group-item-action d-flex">
                                    <div>{{ item.name }}</div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" v-model="item.status"
                                            role="switch" :id="`statusSwitch${index}`" checked>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink
                            :to="$route.query && $route.query.page ? `/admin/packages/list?page=${$route.query.page}` : `/admin/packages/list`"
                            class="btn btn-light btn-icon" title="Hủy">
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
