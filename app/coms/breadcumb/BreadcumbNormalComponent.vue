<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import type { PropType } from 'vue';

interface BreadcumbInterface {
    id: number
    text: string
    icon?: string
    path: string
}

const props = defineProps({
    config: {
        type: Array as PropType<BreadcumbInterface[]>,
        required: true
    }
})

</script>
<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
            <li v-for="(item, index) in config" :key="item.id" class="breadcrumb-item"
                :aria-current="index == config.length - 1 ? 'page' : undefined">
                <button v-if="index == config.length - 1" class="flex-js-ac">
                    <BaseIconComponent v-if="item.icon" class="me-1" :name="item.icon" :color="`#00000073`" />
                    <p class="text mb-0">{{ item.text }}</p>
                </button>
                <NuxtLink v-else :to="item.path" class="d-flex align-items-center text-decoration-none">
                    <button class="flex-js-ac">
                        <BaseIconComponent v-if="item.icon" class="me-1" :name="item.icon" :color="`#00000073`" />
                        <p class="text mb-0">{{ item.text }}</p>
                    </button>
                </NuxtLink>
            </li>
        </ol>
    </nav>
</template>
<style scoped>
.breadcrumb-item::before {
    color: #00000073 !important;
}

.breadcrumb-item button {
    background: none;
    border: none;
    padding: 2px 4px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 15px;
    transition: all .3s ease;
    white-space: nowrap;
}

.breadcrumb-item button:hover {
    color: #000;
    background: #e7e9ec;
}

.nav-breadcumb {
    margin-top: 25px;
}
</style>