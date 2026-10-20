<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    totalPages: {
        type: Number,
        default: 1
    },
    totalEntries: {
        type: Number,
        default: 0
    },
    showingFrom: {
        type: Number,
        default: 0
    },
    showingTo: {
        type: Number,
        default: 0
    }
})

// Define emits
const emit = defineEmits(['page-change'])

const route = useRoute()

// Computed property to generate page numbers to display
const visiblePages = computed(() => {
    const total = props.totalPages
    const current = props.currentPage
    const delta = 2 // Number of pages to show before and after current page
    const range = []
    const rangeWithDots: any[] = []
    let l

    range.push(1)

    // Calculate range
    for (let i = current - delta; i <= current + delta; i++) {
        if (i < total && i > 1) {
            range.push(i)
        }
    }

    if (total > 1) {
        range.push(total)
    }

    // Add dots
    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
})

const handlePageChange = (page: number) => {
    if (page === props.currentPage) return
    emit('page-change', page)
}
</script>

<template>
    <div class="card-footer bg-white border-0 p-4" v-if="totalPages > 0">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div class="text-muted mb-3 mb-md-0 fs-7">
                Hiển thị từ {{ showingFrom }} đến {{ showingTo }} trong tổng số {{ totalEntries }} bản ghi
            </div>

            <nav aria-label="Page navigation">
                <ul class="pagination mb-0 gap-2">
                    <!-- First Page -->
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <NuxtLink :to="{ query: { ...route.query, page: 1 } }"
                            class="page-link border-0 rounded-2 bg-light text-muted d-flex align-items-center justify-content-center"
                            aria-label="First" @click="handlePageChange(1)">
                            <BaseIconComponent name="chevrons-left" type="lucide" :size="14" />
                        </NuxtLink>
                    </li>

                    <!-- Previous Page -->
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <NuxtLink :to="{ query: { ...route.query, page: Math.max(1, currentPage - 1) } }"
                            class="page-link border-0 rounded-2 bg-light text-muted d-flex align-items-center justify-content-center"
                            aria-label="Previous" @click="handlePageChange(Math.max(1, currentPage - 1))">
                            <BaseIconComponent name="chevron-left" type="lucide" :size="14" />
                        </NuxtLink>
                    </li>

                    <!-- Page Numbers -->
                    <li v-for="(page, index) in visiblePages" :key="index" class="page-item"
                        :class="{ active: page === currentPage }">
                        <span v-if="page === '...'"
                            class="page-link border-0 rounded-2 text-muted d-flex align-items-center justify-content-center bg-transparent">...</span>

                        <NuxtLink v-else :to="{ query: { ...route.query, page: page } }"
                            class="page-link border-0 rounded-2 d-flex align-items-center justify-content-center"
                            :class="page === currentPage ? '' : 'bg-light text-muted'"
                            @click="handlePageChange(Number(page))">
                            {{ page }}
                        </NuxtLink>
                    </li>

                    <!-- Next Page -->
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <NuxtLink :to="{ query: { ...route.query, page: Math.min(totalPages, currentPage + 1) } }"
                            class="page-link border-0 rounded-2 bg-light text-muted d-flex align-items-center justify-content-center"
                            aria-label="Next" @click="handlePageChange(Math.min(totalPages, currentPage + 1))">
                            <BaseIconComponent name="chevron-right" type="lucide" :size="14" />
                        </NuxtLink>
                    </li>

                    <!-- Last Page -->
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <NuxtLink :to="{ query: { ...route.query, page: totalPages } }"
                            class="page-link border-0 rounded-2 bg-light text-muted d-flex align-items-center justify-content-center"
                            aria-label="Last" @click="handlePageChange(totalPages)">
                            <BaseIconComponent name="chevrons-right" type="lucide" :size="14" />
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
/* Typography */
.fs-7 {
    font-size: 0.875rem;
}

.fs-8 {
    font-size: 0.75rem;
}

/* Pagination */
.page-link {
    width: 36px;
    height: 36px;
    color: #64748b;
    font-weight: 500;
    transition: all 0.2s;
    text-decoration: none;
    cursor: pointer;
}

.page-item.active .page-link {
    background-color: #7B61FF;
    /* Specific Purple */
    color: white;
}

.page-item:not(.active) .page-link:hover {
    background-color: #e2e8f0;
    color: #0f172a;
}

.page-item.disabled .page-link {
    opacity: 0.5;
    pointer-events: none;
}

.bg-light {
    background-color: #f1f5f9 !important;
}
</style>