<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps<{
    modelValue: number; // currentPage
    itemsPerPage: number;
    totalItems: number;
}>();

const emit = defineEmits(['update:modelValue', 'update:itemsPerPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage) || 1);

const startRange = computed(() => props.totalItems === 0 ? 0 : (props.modelValue - 1) * props.itemsPerPage + 1);
const endRange = computed(() => Math.min(props.modelValue * props.itemsPerPage, props.totalItems));

const updatePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        emit('update:modelValue', page);
    }
};

const updateItemsPerPage = (event: Event) => {
    const value = parseInt((event.target as HTMLSelectElement).value);
    emit('update:itemsPerPage', value);
    emit('update:modelValue', 1); // Reset to first page
};
</script>

<template>
    <div class="pagination-footer">
        <div class="d-flex align-items-center gap-3">
            <span class="pagination-text">
                {{ startRange }}-{{ endRange }} của {{ totalItems }}
            </span>
            <div class="d-flex align-items-center gap-2">
                <button class="btn-page p-0" :class="{ disable: modelValue === 1 }" @click="updatePage(modelValue - 1)">
                    <BaseIconComponent name="chevron-left" type="lucide" :size="16" />
                </button>
                <button class="btn-page active">{{ modelValue }}</button>
                <button class="btn-page p-0" :class="{ disable: modelValue === totalPages }"
                    @click="updatePage(modelValue + 1)">
                    <BaseIconComponent name="chevron-right" type="lucide" :size="16" />
                </button>
            </div>
            <select class="form-select custom-select w-auto py-1" :value="itemsPerPage" @change="updateItemsPerPage">
                <option :value="20">20 / page</option>
                <option :value="30">30 / page</option>
                <option :value="50">50 / page</option>
                <option :value="100">100 / page</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
.pagination-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;
    background-color: #ffffff;
    border-top: 1px solid #f3f4f6;
}

.pagination-text {
    font-size: 0.85rem;
    color: #4b5563;
}

.btn-page {
    background: transparent;
    border: 1px solid transparent;
    color: #4b5563;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    cursor: pointer;
}

.btn-page.active {
    color: #3b82f6;
    border-color: #bfdbfe;
    font-weight: 500;
}

.btn-page:hover:not(.active):not(.disable) {
    background-color: #f3f4f6;
}

.btn-page.disable {
    color: #d1d5db;
    cursor: not-allowed;
}

.custom-select {
    font-size: 0.85rem;
    padding: 0.4rem 2rem 0.4rem 0.75rem;
    border-color: #d1d5db;
    border-radius: 4px;
    color: #374151;
    box-shadow: none;
}

.custom-select:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

@media (max-width: 768px) {
    .pagination-text {
        font-size: 12px !important;
    }

    .pagination-footer {
        padding-left: 5px !important;
        padding-right: 5px !important;
        justify-content: center;
    }
}
</style>