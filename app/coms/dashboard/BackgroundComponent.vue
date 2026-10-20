<script setup lang="ts">
import TabColor from './childs/backround/TabColor.vue';
import TabBackground from './childs/backround/TabBackground.vue';

// Active tab state
const activeTab = ref<'color' | 'background'>('color');
</script>
<template>
    <div class="d-flex flex-column h-100">
        <div class="py-2 px-3 bg-white sticky-top border-bottom">
            <div class="d-flex gap-4">
                <button class="btn text-decoration-none p-0"
                    :class="activeTab === 'color' ? 'text-primary' : 'text-muted'" style="font-size: 13px;"
                    @click="activeTab = 'color'">
                    Màu nền
                </button>
                <button class="btn text-decoration-none p-0"
                    :class="activeTab === 'background' ? 'text-primary' : 'text-muted'" style="font-size: 13px;"
                    @click="activeTab = 'background'">
                    Hình nền
                </button>
            </div>
        </div>

        <!-- Tab Content -->
        <TabColor v-if="activeTab === 'color'" />
        <TabBackground v-if="activeTab === 'background'" />
    </div>
</template>
<style scoped>
button {
    cursor: pointer;
    transition: color 0.2s ease;
    border: none;
}

button:hover {
    color: #3b82f6 !important;
}
</style>