<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BaseIconComponent from '../../../icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editor = useEditorStore();

// --- DỮ LIỆU ÂM NHẠC ---
const searchKeyword = ref('');
const activeFilter = ref<number | null>(null);
const isPremium = ref(false);
const currentPlanName = ref('FREE');

onMounted(async () => {
    editor.fetchPublicMusics();
    try {
        const res: any = await $fetch('/api/v1/client/my-plan');
        if (res && res.data) {
            currentPlanName.value = res.data.name || 'FREE';
            if (res.data.name?.toLowerCase() === 'premium') {
                isPremium.value = true;
            }
        }
    } catch (e) {
        console.error("Failed to fetch plan in LibraryComponent", e);
    }
});

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const musicFilters = computed(() => {
    const list = [{ id: null as number | null, name: 'Tất cả' }];
    editor.rawMusicTypes.forEach((t: any) => {
        if (t.key === 'general') list.push({ id: t.id, name: t.name });
    });
    return list;
});

const musicList = computed(() => {
    let filtered = editor.rawMusics;
    
    // Lọc theo keyword
    if (searchKeyword.value) {
        const lowerKeyword = searchKeyword.value.toLowerCase();
        filtered = filtered.filter(m => m.name?.toLowerCase().includes(lowerKeyword));
    }
    
    // Lọc theo thể loại
    if (activeFilter.value !== null) {
        filtered = filtered.filter(m => m.id_music_type === activeFilter.value);
    }
    
    return filtered.map(m => ({
        id: m.id,
        title: m.name,
        time: formatTime(m.duration || 0),
        path: `/musics/${m.url}`,
        id_min_package: m.id_min_package
    }));
});

const currentPlayingIndex = ref<number | null>(null);
const audio = ref<HTMLAudioElement | null>(null);

const selectedMusic = computed(() => {
    return musicList.value.find(m => m.path === editor.music.path);
});

const handleUseMusic = (music: any) => {
    if (!isPremium.value && editor.role !== 'admin') {
        editor.showNotification("Chỉ tài khoản gói Premium mới có thể sử dụng nhạc nền!", "warning");
        return;
    }
    editor.music = {
        ...editor.music,
        path: music.path
    };
};

const toggleMusic = (index: number) => {
    if (currentPlayingIndex.value === index) {
        // Toggle pause/play for current song
        if (audio.value) {
            if (audio.value.paused) {
                audio.value.play();
            } else {
                audio.value.pause();
                currentPlayingIndex.value = null; // Reset icon to play
            }
        }
    } else {
        // Play new song
        if (audio.value) {
            audio.value.pause();
        }
        audio.value = new Audio(musicList.value[index]?.path); // Use actual path
        audio.value.play();
        currentPlayingIndex.value = index;

        // Reset when ended
        audio.value.onended = () => {
            currentPlayingIndex.value = null;
        };
    }
};

onUnmounted(() => {
    if (audio.value) {
        audio.value.pause();
        audio.value = null;
    }
});
</script>
<template>
    <div class="h-100 d-flex flex-column">
        <div class="p-3 border-bottom music-header bg-white">
            <div class="input-group input-group-sm mb-3 search-music">
                <span class="input-group-text bg-white border-end-0">
                    <BaseIconComponent name="search" type="lucide" :size="16" color="#999" />
                </span>
                <input type="text" class="form-control border-start-0 ps-0 shadow-none" placeholder="Tìm kiếm bài hát" v-model="searchKeyword">
            </div>

            <div class="d-flex flex-wrap gap-2">
                <button v-for="filter in musicFilters" :key="filter.id || 'all'"
                    :class="['btn btn-filter btn-sm', { 'btn-primary': activeFilter === filter.id, 'btn-light border': activeFilter !== filter.id }]"
                    @click="activeFilter = filter.id">
                    {{ filter.name }}
                </button>
            </div>
        </div>

        <div class="flex-grow-1 overflow-auto p-2 music-scroll">
            <div class="music-info-text px-2 py-2 mb-2 border-bottom">
                <p class="text-muted mb-1">Nhạc hiện tại</p>
                <div v-if="selectedMusic" class="d-flex align-items-center gap-3 py-2">
                    <div class="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                        style="width: 35px; height: 35px;">
                        <BaseIconComponent name="music-note" type="mdi" :size="20" :color="`#FFFFFF`" />
                    </div>
                    <div>
                        <p class="mb-0 fw-bold text-dark">{{ selectedMusic.title }}</p>
                        <p class="mb-0 small text-muted">{{ selectedMusic.time }}</p>
                    </div>
                </div>
                <p v-else class="text-muted text-center py-4">Chưa chọn bài hát nào</p>
            </div>

            <div v-for="(music, idx) in musicList" :key="idx"
                class="music-row d-flex align-items-center justify-content-between p-2 rounded"
                @click="toggleMusic(idx)">
                <div class="d-flex align-items-center gap-3 flex-grow-1" style="min-width: 0;">
                    <button class="btn-play-music d-flex align-items-center justify-content-center">
                        <BaseIconComponent :name="currentPlayingIndex === idx ? 'pause' : 'play-circle'"
                            :type="currentPlayingIndex === idx ? 'mdi' : 'lucide'" :size="20" :color="`#FFFFFF`" />
                    </button>
                    <div class="music-title-box position-relative song-title-tooltip" :data-tooltip="music.title">
                        <div class="title-wrapper">
                            <p class="mb-0 text-truncate fw-medium" style="color: #333;">{{ music.title }}</p>
                        </div>
                        <span class="text-muted">{{ music.time }}</span>
                    </div>
                </div>
                <button class="btn btn-sm position-relative"
                    :class="selectedMusic?.path === music.path ? 'btn-primary' : 'btn-use-music'"
                    @click.stop="handleUseMusic(music)">
                    {{ selectedMusic?.path === music.path ? 'Đang dùng' : 'Sử dụng' }}
                    <span class="pro-crown-badge" v-if="selectedMusic?.path !== music.path">
                        <BaseIconComponent name="crown-rounded" :size="13" color="#fff" />
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* --- MUSIC UI STYLES --- */
.search-music .input-group-text {
    border-right: none;
    padding: 8px 12px;
}

.search-music .form-control {
    padding: 8px 12px;
    font-size: 14px !important;
}

.btn-filter {
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    white-space: nowrap;
}

.music-row {
    padding: 10px 8px !important;
}

.music-row:hover {
    background-color: #f8f9fa;
}

.btn-play-music {
    width: 32px;
    height: 32px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 4px;
    flex-shrink: 0;
}

.music-title-box p {
    font-size: 14px !important;
}

.music-title-box span {
    font-size: 12px !important;
}

.btn-use-music {
    border: 1px solid #dee2e6;
    font-size: 13px;
    padding: 6px 14px;
    border-radius: 6px;
    color: #666;
    background: #fff;
}

.btn-use-music:hover {
    background-color: #f1f3f5;
}

.pro-crown-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 25px;
    height: 25px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
}

.music-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 28px;
    height: 28px;
    background: #000;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.music-info-text p {
    font-size: 13px !important;
}

/* Tooltip styles */
.music-title-box {
    min-width: 0;
    flex: 1;
}

.title-wrapper {
    overflow: hidden;
}

.song-title-tooltip {
    cursor: pointer;
}

.song-title-tooltip:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    background: #1f2937;
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: none;
}

.song-title-tooltip:hover::after {
    content: '';
    position: absolute;
    bottom: calc(100% - 4px);
    left: 16px;
    border: 6px solid transparent;
    border-top-color: #1f2937;
    z-index: 1000;
    pointer-events: none;
}
</style>