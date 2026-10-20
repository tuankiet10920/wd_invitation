<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

defineProps({
    placeholder: {
        type: String,
        default: 'Tìm kiếm...'
    },
    linkCreate: {
        type: String,
        required: true
    }
})

const route = useRoute()
const isAppear = ref(true)

const excepts = [
    '/admin/users/list'
]

watch(() => route.path, (newValue) => {
    if (excepts.includes(newValue)) isAppear.value = false
}, { immediate: true })
</script>

<template>
    <div class="d-flex gap-2 align-items-center">
        <div class="search-box">
            <input type="text" class="form-control" :placeholder="placeholder">
        </div>
        <NuxtLink v-if="isAppear" :to="linkCreate"
            class="btn btn-primary d-flex align-items-center justify-content-center p-2"
            style="width: 41px; height: 41px;">
            <BaseIconComponent name="plus" type="lucide" :size="20" color="#ffffff" />
        </NuxtLink>
    </div>
</template>

<style scoped>
/* Search Box */
.search-box input {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 0.95rem;
    width: 100%;
    min-width: 250px;
}

@media (max-width: 767.98px) {
    .search-box {
        flex: 1;
    }
    
    .search-box input {
        min-width: 0;
    }
}

.search-box input::placeholder {
    color: #94a3b8;
}

.search-box input:focus {
    box-shadow: none;
    border-color: #cbd5e1;
}
</style>