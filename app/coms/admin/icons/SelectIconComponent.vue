<script setup lang="ts">
import { ref, watch } from 'vue';
import type { IconType } from '~~/interfaces';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps<{
    modelValue: string;
    type: IconType | string;
    id?: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const isModalOpen = ref(false);
const searchQuery = ref('');
const searchTimeout = ref<any>(null);
const isLoading = ref(false);
const iconList = ref<string[]>([]);
const hasError = ref(false);

const openModal = () => {
    isModalOpen.value = true;
    if (iconList.value.length === 0) {
        searchIcons();
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};

const selectIcon = (iconName: string) => {
    emit('update:modelValue', iconName);
    closeModal();
};

const onSearchInput = () => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
        searchIcons();
    }, 500);
};

const searchIcons = async () => {
    isLoading.value = true;
    hasError.value = false;
    
    // If empty query, give a default list of common keywords
    const keyword = searchQuery.value.trim() || 'arrow heart star check circle square image menu edit delete';
    
    try {
        const response: any = await $fetch('https://api.iconify.design/search', {
            query: {
                query: keyword,
                prefix: props.type,
                limit: 100
            }
        });
        
        if (response && response.icons && Array.isArray(response.icons)) {
            // response.icons looks like ["mdi:heart", "mdi:heart-outline"]
            // we need to stip the prefix because BaseIconComponent adds it
            const prefixTarget = `${props.type}:`;
            iconList.value = response.icons.map((i: string) => i.replace(prefixTarget, ''));
        } else {
            iconList.value = [];
        }
    } catch (error) {
        console.error("Failed to fetch icons", error);
        hasError.value = true;
        iconList.value = [];
    } finally {
        isLoading.value = false;
    }
};

// If the type changes, clear the current icon list so it searches fresh again on open
watch(() => props.type, () => {
    iconList.value = [];
    if (isModalOpen.value) {
        searchIcons();
    }
});

// Watch modelValue to sync local display, not actually needed but standard pattern
const selectedValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

</script>

<template>
    <div class="select-icon-wrapper">
        <div class="input-group" @click="openModal">
            <span class="input-group-text bg-white cursor-pointer px-3" v-if="selectedValue">
                <BaseIconComponent :name="selectedValue" :type="(type as any)" :size="20" color="#4f46e5" />
            </span>
            <input 
                type="text" 
                class="form-control cursor-pointer" 
                :id="id" 
                :placeholder="placeholder || 'Click to select an icon...'" 
                readonly
                :value="selectedValue"
            >
            <button class="btn btn-outline-secondary" type="button">
                Browse
            </button>
        </div>

        <div v-if="isModalOpen" class="modal-backdrop fade show" @click="closeModal"></div>
        <div v-if="isModalOpen" class="modal fade show d-block" tabindex="-1" aria-labelledby="iconModalLabel" aria-hidden="true" style="z-index: 1055;">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-light border-bottom-0 pb-0">
                        <div class="w-100">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="modal-title fw-bold" id="iconModalLabel">Choose Icon ({{ String(type).toUpperCase() }})</h5>
                                <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                            </div>
                            <div class="search-box position-relative mb-3">
                                <input 
                                    type="text" 
                                    class="form-control form-control-lg bg-white shadow-sm"
                                    placeholder="Search icons (e.g. heart, check, user)..."
                                    v-model="searchQuery"
                                    @input="onSearchInput"
                                >
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-body p-4 bg-light pt-0">
                        <div v-if="isLoading" class="d-flex justify-content-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div v-else-if="hasError" class="text-center py-5 text-danger">
                            Oops! Failed to load icons. Check your internet connection or the icon type.
                        </div>

                        <div v-else-if="iconList.length === 0" class="text-center py-5 text-muted">
                            No icons found matching your search. Try another keyword.
                        </div>

                        <div v-else class="icon-grid">
                            <button 
                                v-for="iconName in iconList" 
                                :key="iconName" 
                                class="btn btn-icon-item border-0 p-3 shadow-sm rounded-3 d-flex flex-column align-items-center justify-content-center"
                                :class="{'active-icon': selectedValue === iconName}"
                                @click="selectIcon(iconName)"
                                :title="iconName"
                            >
                                <BaseIconComponent :name="iconName" :type="(type as any)" :size="28" :color="selectedValue === iconName ? '#ffffff' : '#4b5563'" class="mb-2" />
                                <span class="text-truncate small w-100 text-center text-muted fs-8">{{ iconName }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer !important;
}

.form-control {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}

.input-group-text {
    border-color: #e2e8f0;
}

.icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
}

.btn-icon-item {
    background-color: white;
    transition: all 0.2s ease;
}

.btn-icon-item:hover {
    background-color: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.active-icon {
    background-color: #4f46e5 !important;
}

.active-icon .text-muted {
    color: #e0e7ff !important;
}

.fs-8 {
    font-size: 0.70rem;
}
</style>