<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BaseIconComponent from '../../../icons/BaseIconComponent.vue';
import ButtonCustomCompomnent from '../../../button/ButtonCustomCompomnent.vue';
import { useEditorStore } from '~~/stores/editor';

const editor = useEditorStore();

const isPremium = ref(false);
const currentPlanName = ref('FREE');
const isUploading = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const currentPlayingIndex = ref<number | null>(null);
const audioPlayer = ref<HTMLAudioElement | null>(null);

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formattedUploadedMusics = computed(() => {
    return editor.rawPersonalMusics.map(m => ({
        id: m.id,
        title: m.name,
        time: formatTime(m.duration || 0),
        path: `/personal_musics/${m.url}`
    }));
});

const fetchPersonalMusics = async () => {
    await editor.fetchPersonalMusics();
};

const handleFileDrop = (e: DragEvent) => {
    if (isUploading.value) return;
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0] as File;
        handleUpload(file);
    }
};

const handleFileSelect = (e: Event) => {
    if (isUploading.value) return;
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0] as File;
        handleUpload(file);
        // Reset input
        target.value = '';
    }
};

const handleUpload = async (file: File) => {
    if (!file || isUploading.value) return;

    if (editor.rawPersonalMusics.length >= 5) {
        alert("Đã đạt giới hạn tối đa 5 file.");
        return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert("File quá lớn. Kích thước tối đa là 10MB.");
        return;
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4', 'audio/aac'];
    // Fallback if browser doesn't strictly inject MIME type
    if (file.type && !allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|aac)$/i)) {
        alert("Chỉ hỗ trợ file MP3, WAV, M4A.");
        return;
    }

    try {
        isUploading.value = true;
        
        const audioUrl = URL.createObjectURL(file);
        const autoDetector = new Audio(audioUrl);
        autoDetector.onloadedmetadata = async () => {
            const duration = autoDetector.duration;
            URL.revokeObjectURL(audioUrl); // cleanup

            const formData = new FormData();
            formData.append("file", file);
            formData.append("duration", duration.toString());

            try {
                const res: any = await $fetch('/api/v1/client/file/upload-personal-music', {
                    method: 'POST',
                    body: formData,
                });

                if (res && res.data) {
                    editor.rawPersonalMusics = []; // Force refetch
                    await fetchPersonalMusics(); // Refresh
                } else {
                    alert(res?.message || "Upload không thành công!");
                }
            } catch (err) {
                console.error(err);
                alert("Upload không thành công do lỗi hệ thống.");
            } finally {
                isUploading.value = false;
            }
        };
        autoDetector.onerror = () => {
            alert("Không thể đọc định dạng file audio này.");
            URL.revokeObjectURL(audioUrl);
            isUploading.value = false;
        };
    } catch (e) {
        console.error(e);
        alert("Lỗi đọc file");
        isUploading.value = false;
    }
};

const selectedMusic = computed(() => {
    return formattedUploadedMusics.value.find(m => m.path === editor.music.path);
});

const handleUseMusic = (music: any) => {
    editor.music = {
        ...editor.music,
        path: music.path
    };
};

const toggleMusic = (index: number) => {
    if (currentPlayingIndex.value === index) {
        if (audioPlayer.value) {
            if (audioPlayer.value.paused) {
                audioPlayer.value.play();
            } else {
                audioPlayer.value.pause();
                currentPlayingIndex.value = null;
            }
        }
    } else {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
        }
        audioPlayer.value = new Audio(formattedUploadedMusics.value[index]?.path);
        audioPlayer.value.play();
        currentPlayingIndex.value = index;

        audioPlayer.value.onended = () => {
            currentPlayingIndex.value = null;
        };
    }
};

onMounted(async () => {
    try {
        const res: any = await $fetch('/api/v1/client/my-plan');
        if (res && res.data) {
            currentPlanName.value = res.data.name || 'FREE';
            if (res.data.name?.toLowerCase() === 'premium') {
                isPremium.value = true;
                await fetchPersonalMusics();
            }
        }
    } catch (e) {
        console.error("Failed to fetch plan", e);
    }
});

onUnmounted(() => {
    if (audioPlayer.value) {
        audioPlayer.value.pause();
        audioPlayer.value = null;
    }
});
</script>

<template>
    <div class="h-100 p-3">
        <!-- UI CHƯA PREMIUM -->
        <div v-if="!isPremium" class="premium-card d-flex flex-column align-items-center text-center p-4">
            <div class="icon-music mb-3">
                <BaseIconComponent name="music" type="mdi" :size="48" color="#6366f1" />
            </div>

            <h5 class="fw-bold text-primary mb-3">
                Tính năng dành cho gói<br>Premium
            </h5>

            <p class="text-muted mb-4">
                Upload nhạc riêng của bạn để tạo<br>nên những website độc đáo và cá<br>nhân hóa hơn.
            </p>

            <div class="features-list text-start mb-4">
                <div class="d-flex align-items-center mb-2">
                    <span class="me-2">✨</span>
                    <span class="text-muted">Upload file nhạc MP3, WAV, M4A</span>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <span class="me-2">🎨</span>
                    <span class="text-muted">Tùy chỉnh hoàn toàn âm thanh</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-2">💾</span>
                    <span class="text-muted">Lưu trữ danh sách nhạc cá nhân</span>
                </div>
            </div>

            <ButtonCustomCompomnent class="w-100 mb-2 btn-upgrade text-white fw-medium" :background="`#3b82f6`">
                Nâng cấp lên Premium
            </ButtonCustomCompomnent>

            <p class="text-muted mb-0" style="font-size: 12px;">Gói hiện tại: {{ currentPlanName }}</p>
        </div>

        <!-- UI PREMIUM (UPLOAD ZONE) -->
        <div v-else class="premium-upload-area">
            <input type="file" class="d-none" ref="fileInput"
                accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,audio/aac" @change="handleFileSelect">
            <div class="upload-box d-flex flex-column align-items-center justify-content-center text-center p-4 mb-4"
                :class="{ 'is-uploading': isUploading }"
                @click="!isUploading && fileInput?.click()" @dragover.prevent @drop.prevent="handleFileDrop">
                
                <template v-if="!isUploading">
                    <p class="mb-2 fw-medium upload-title">Kéo thả file nhạc vào đây hoặc<br>click để chọn file</p>
                    <p class="mb-0 text-muted upload-desc">Hỗ trợ MP3, WAV, M4A (Tối đa 10MB)<br>• {{ editor.rawPersonalMusics.length
                        }}/5 files</p>
                </template>

                <template v-else>
                    <BaseIconComponent name="loader" type="lucide" class="spin-icon mb-2" :size="32" color="#3b82f6" />
                    <p class="mb-0 fw-medium" style="color: #3b82f6; font-size: 15px;">Đang tải lên...</p>
                </template>
            </div>

            <div class="divider d-flex align-items-center mx-auto mb-4 w-100">
                <div class="flex-grow-1 border-bottom" style="border-color: #f1f5f9 !important;"></div>
                <span class="px-3 text-center" style="font-size: 12px; color: #475569;">Danh sách nhạc đã tải lên ({{
                    editor.rawPersonalMusics.length }}/5)</span>
                <div class="flex-grow-1 border-bottom" style="border-color: #f1f5f9 !important;"></div>
            </div>

            <div v-if="editor.rawPersonalMusics.length === 0" class="text-center text-muted empty-state">
                Chưa có file nhạc nào
            </div>
            <div v-else class="uploaded-list">
                <div v-for="(music, idx) in formattedUploadedMusics" :key="idx"
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
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.premium-card {
    background-color: #e0e7ff;
    border-radius: 12px;
    justify-content: center;
}

.icon-music {
    opacity: 0.8;
}

.features-list {
    font-size: 13px;
}

.btn-upgrade {
    padding: 10px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
}

/* --- UPLOAD UI STYLES --- */
.upload-box {
    border: 1.5px dashed #cbd5e1;
    border-radius: 12px;
    background-color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    min-height: 120px;
}

.upload-box.is-uploading {
    border-color: #3b82f6;
    background-color: #ffffff;
    cursor: wait;
}

.upload-box:not(.is-uploading):hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
}

.spin-icon {
    animation: spin-anim 1.2s linear infinite;
}

@keyframes spin-anim {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.upload-title {
    color: #334155;
    font-size: 14.5px;
}

.upload-desc {
    color: #94a3b8;
    font-size: 12px;
    line-height: 1.5;
}

.empty-state {
    font-size: 14px;
    margin-top: 2rem;
    color: #94a3b8 !important;
}

/* MUSIC ROW STYLES */
.music-row {
    padding: 10px 8px !important;
    cursor: pointer;
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