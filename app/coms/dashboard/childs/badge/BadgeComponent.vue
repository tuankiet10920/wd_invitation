<script setup lang="ts">
import BaseIconComponent from '../../../icons/BaseIconComponent.vue';

const props = defineProps<{
    icon: string;
    color: string;
    path: string;
}>();

// --- Music Playback Logic ---
const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const toggleMusic = () => {
    if (!props.path) return;

    if (!audio.value) {
        audio.value = new Audio(props.path);
        audio.value.loop = true;
    } else if (audio.value.src !== new URL(props.path, window.location.href).href && !audio.value.src.endsWith(props.path)) {
        // Update path if changed (though watch handles this mostly, safe check)
        audio.value.pause();
        audio.value = new Audio(props.path);
        audio.value.loop = true;
    }

    if (isPlaying.value) {
        audio.value.pause();
        isPlaying.value = false;
    } else {
        audio.value.play().then(() => {
            isPlaying.value = true;
        }).catch(e => {
            console.error("Playback failed", e);
            isPlaying.value = false;
        });
    }
};

let interactHandler: (() => void) | null = null;

watch(() => props.path, (newPath) => {
    if (!import.meta.client) return; // Prevent SSR errors

    // Reset state when song changes
    if (audio.value) {
        audio.value.pause();
        audio.value = null;
    }
    isPlaying.value = false;

    if (interactHandler) {
        document.removeEventListener("click", interactHandler);
        document.removeEventListener("touchstart", interactHandler);
        interactHandler = null;
    }

    if (newPath) {
        audio.value = new Audio(newPath);
        audio.value.loop = true;

        // Bắt đầu phát tự động
        const playPromise = audio.value.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying.value = true;
            }).catch(error => {
                console.warn("Trình duyệt chặn autoplay! Chờ tương tác người dùng để phát tiếp.", error);
                isPlaying.value = false;

                // Nếu bị chặn, đợi các thao tác cử chỉ bất kỳ trên trang để lách luật phát nhạc (mousemove, scroll, touchstart)
                const interactionEvents = ["click", "touchstart", "scroll", "mousemove", "keydown", "wheel"];

                interactHandler = () => {
                    if (audio.value && !isPlaying.value) {
                        const pp = audio.value.play();
                        if (pp !== undefined) {
                            pp.then(() => {
                                isPlaying.value = true;
                                if (interactHandler) {
                                    interactionEvents.forEach(evt => document.removeEventListener(evt, interactHandler as EventListener));
                                }
                            }).catch(e => console.error("Lỗi phát nhạc sau tương tác", e));
                        }
                    }
                };

                interactionEvents.forEach(evt => document.addEventListener(evt, interactHandler as EventListener, { once: true }));
            });
        }
    }
}, { immediate: true });

onUnmounted(() => {
    if (!import.meta.client) return;
    if (audio.value) {
        audio.value.pause();
        audio.value = null;
    }
    if (interactHandler) {
        const interactionEvents = ["click", "touchstart", "scroll", "mousemove", "keydown", "wheel"];
        interactionEvents.forEach(evt => document.removeEventListener(evt, interactHandler as EventListener));
    }
});
</script>

<template>
    <div class="music-badge shadow-sm cursor-pointer" :class="{ 'spin-slow': isPlaying }" :style="{ background: color }"
        @click="toggleMusic">
        <BaseIconComponent :name="icon" :type="`mdi`" :size="22" color="#ffffff" />
    </div>
</template>

<style scoped>
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
    z-index: 10;
}

.spin-slow {
    animation: spin 3s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.cursor-pointer {
    cursor: pointer;
}
</style>