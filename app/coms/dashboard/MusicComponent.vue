<script setup lang="ts">
import LibraryComponent from '../editor/childs/music/LibraryComponent.vue';
import MyMusicComponent from '../editor/childs/music/MyMusicComponent.vue';

const activeTab = ref('library'); // 'library' | 'my-music'
</script>
<template>
    <div class="d-flex flex-column h-100">
        <div class="px-3 pt-3 bg-white">
            <div class="d-flex gap-4">
                <span class="tab-item" :class="{ active: activeTab === 'library' }" @click="activeTab = 'library'">Thư
                    viện nhạc</span>
                <span class="tab-item" :class="{ active: activeTab === 'my-music' }"
                    @click="activeTab = 'my-music'">Nhạc
                    của tôi</span>
            </div>
        </div>

        <div class="flex-grow-1 overflow-hidden">
            <LibraryComponent v-if="activeTab === 'library'" />
            <MyMusicComponent v-else />
        </div>
    </div>
</template>
<style scoped>
.tab-item {
    font-size: 15px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    padding-bottom: 10px;
}

.tab-item.active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
}
</style>