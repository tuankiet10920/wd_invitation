<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    total: {
        type: Number,
        default: 20
    },
    current: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['change'])

const pages = computed(() => {
    const total = props.total
    const current = props.current
    const delta = 2 // Number of pages valid around current
    const left = current - delta
    const right = current + delta + 1
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= total; i++) {
        if (i == 1 || i == total || i >= left && i < right) {
            range.push(i)
        }
    }

    for (let i of range) {
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

const changePage = (page: number | string) => {
    if (typeof page === 'number' && page !== props.current) {
        emit('change', page)
    }
}

const prev = () => {
    if (props.current > 1) {
        emit('change', props.current - 1)
    }
}

const next = () => {
    if (props.current < props.total) {
        emit('change', props.current + 1)
    }
}
</script>

<template>
    <div v-if="total > 0" class="pagination-container d-flex justify-content-center align-items-center gap-2">
        <!-- Previous Button -->
        <button class="btn-icon" :disabled="current === 1" @click="prev">
            <BaseIconComponent name="chevron-left" :size="24" :color="current === 1 ? '#ccc' : '#333'" />
        </button>

        <!-- Pages -->
        <div class="pages d-flex gap-2">
            <template v-for="(page, index) in pages" :key="index">
                <button v-if="page !== '...'" class="btn-page" :class="{ active: page === current }"
                    @click="changePage(page)">
                    {{ page }}
                </button>
                <span v-else class="dots">...</span>
            </template>
        </div>

        <!-- Next Button -->
        <button class="btn-icon" :disabled="current === total" @click="next">
            <BaseIconComponent name="chevron-right" :size="24" :color="current === total ? '#ccc' : '#333'" />
        </button>
    </div>
</template>

<style scoped>
.pagination-container {
    margin-top: 40px;
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.3s;
}

.btn-icon:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.btn-page {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #eee;
    background: white;
    font-weight: 500;
    color: #333;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.btn-page:hover:not(.active) {
    background-color: #f8f9fa;
    border-color: #ddd;
}

.btn-page.active {
    background-color: #ff8fa3;
    color: white;
    border-color: #ff8fa3;
    box-shadow: 0 4px 10px rgba(255, 143, 163, 0.4);
}

.dots {
    display: flex;
    align-items: end;
    padding-bottom: 8px;
    color: #999;
    font-weight: bold;
    letter-spacing: 2px;
}
</style>