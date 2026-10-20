<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
definePageMeta({
    layout: 'admin'
})

const formData = reactive({
    key: '',
    value: '',
    description: ''
})

const router = useRouter()
const isLoading = ref(false)

const submitForm = async () => {
    isLoading.value = true
    try {
        await $fetch('/api/v1/admin/settings', {
            method: 'POST',
            body: formData
        })
        router.push('/admin/settings/list')
    } catch (error) {
        alert('Failed to create setting')
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Create New Setting</h5>
            <NuxtLink to="/admin/settings/list" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                <BaseIconComponent name="arrow-left" :size="20" />
                <span>Quay lại danh sách</span>
            </NuxtLink>
        </div>

        <div class="card border-0 shadow-sm rounded-3">
            <div class="card-body p-4">
                <form @submit.prevent="submitForm">
                    <div class="row g-4">
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Key</label>
                            <input type="text" class="form-control" v-model="formData.key"
                                placeholder="Enter configuration key (e.g. site_name)">
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Value</label>
                            <textarea class="form-control" v-model="formData.value" rows="3"
                                placeholder="Enter configuration value"></textarea>
                        </div>
                        <div class="col-md-12">
                            <label class="form-label fw-medium text-secondary">Description</label>
                            <input type="text" class="form-control" v-model="formData.description"
                                placeholder="Enter description">
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4 pt-3 border-top gap-2">
                        <NuxtLink to="/admin/settings/list" class="btn btn-light btn-icon" title="Hủy">
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
