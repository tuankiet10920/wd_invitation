<script setup lang="ts">
import { computed, onMounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const editor = useEditorStore();

onMounted(async () => {
    // Only call fetchPublicMusics and personal musics to ensure we have all data
    editor.fetchPublicMusics();
    
    // Attempt to fetch personal musics. We wrap in try-catch in case user is not logged in
    try {
        await editor.fetchPersonalMusics();
    } catch {}
});

const icons = [
    'music-note',
    'music-note-eighth',
    'music-note-quarter',
    'music-clef-treble',
    'music-note-bluetooth',
    'album' // Thay disc sang album theo MDI chuẩn nếu cần
];

const selectIcon = (icon: string) => {
    editor.music.icon = icon;
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const musicList = computed(() => {
    return editor.rawMusics.map(m => ({
        id: m.id,
        title: m.name,
        time: formatTime(m.duration || 0),
        path: `/musics/${m.url}`
    }));
});

const selectedMusic = computed(() => {
    const fromPublic = musicList.value.find(m => m.path === editor.music.path);
    if (fromPublic) return fromPublic;
    
    if (editor.music.path) {
        // Lấy thông tin từ danh sách nhạc cá nhân
        const fromPersonal = editor.rawPersonalMusics.find(m => `/personal_musics/${m.url}` === editor.music.path);
        if (fromPersonal) {
            return {
                title: fromPersonal.name,
                time: formatTime(fromPersonal.duration || 0),
                path: editor.music.path
            };
        }

        let filename = editor.music.path.split('/').pop() || 'Bài hát cá nhân';
        return {
            title: filename,
            time: '--:--',
            path: editor.music.path
        };
    }
    return null;
});


</script>

<template>
    <div class="tool-music p-3">
        <h6 class="fw-bold mb-4">Nhạc nền</h6>

        <div class="text-center text-muted mb-4 py-2" v-if="!selectedMusic">
            Chưa chọn bài hát nào
        </div>
        <div class="mb-4 py-2 px-3 rounded-3 d-flex align-items-center justify-content-between" style="background-color: #f8f9fa;" v-else>
            <div class="d-flex align-items-center gap-3" style="min-width: 0;">
                <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 40px; height: 40px; background-color: #eff6ff;">
                    <div class="d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 6px;">
                        <BaseIconComponent name="play" type="mdi" :size="16" color="#ffffff" />
                    </div>
                </div>
                <div class="text-start" style="min-width: 0;">
                    <div class="fw-medium text-truncate" style="color: #334155; font-size: 14.5px;">{{ selectedMusic.title }}</div>
                    <div class="small" style="color: #94a3b8;">{{ selectedMusic.time }}</div>
                </div>
            </div>
            <div class="cursor-pointer flex-shrink-0 ms-2 d-flex align-items-center justify-content-center text-muted" @click="editor.music.path = ''" style="padding: 4px; transition: color 0.2s;" onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color=''">
                <BaseIconComponent name="delete" type="lucide" :size="22" />
            </div>
        </div>

        <div class="mb-4">
            <label class="form-label fs-7 text-muted fw-medium mb-2">Chọn biểu tượng</label>
            <div class="d-flex gap-2 flex-wrap">
                <div v-for="icon in icons" :key="icon"
                    class="icon-option d-flex align-items-center justify-content-center cursor-pointer"
                    :class="{ 'active': editor.music.icon === icon }" @click="selectIcon(icon)">
                    <BaseIconComponent :name="icon" type="mdi" :size="20"
                        :color="editor.music.icon === icon ? '#3b82f6' : '#9ca3af'" />
                </div>
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label fs-7 text-muted fw-medium mb-2">Màu biểu tượng</label>
            <div class="d-flex">
                <div class="color-wrapper position-relative">
                    <input type="color" class="color-input opacity-0 position-absolute w-100 h-100"
                        style="z-index: 10; cursor: pointer;" v-model="editor.music.color">
                    <div class="color-preview cursor-pointer shadow-sm"
                        :style="{ backgroundColor: editor.music.color }">
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.icon-option {
    width: 40px;
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    transition: all 0.2s;
}

.icon-option:hover {
    background-color: #f9fafb;
}

.icon-option.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
}

.color-wrapper {
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
}

.color-preview {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

.cursor-pointer {
    cursor: pointer;
}

.fs-7 {
    font-size: 0.875rem;
}
</style>