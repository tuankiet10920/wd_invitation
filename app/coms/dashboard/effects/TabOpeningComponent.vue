<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonCustomCompomnent from '~/coms/button/ButtonCustomCompomnent.vue';
import ConfigEffectAnimatedComponent from '~/coms/dashboard/modal/ConfigEffectAnimatedComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    effects: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});

const editor = useEditorStore();
const selectedEffect = ref(editor.effect?.opening?.slug || 'none');
const showConfigModal = ref(false);

const handleEffectSelect = (effect: any) => {
    selectedEffect.value = effect.slug;
    // Auto apply
    if (editor.effect) {
        editor.effect.opening.slug = effect.slug;
        editor.effect.opening.isCustom = effect.is_custom ? true : false;
        
        // Cập nhật giá trị thời gian (time) default từ db (duration này từ effect nếu có)
        // tạm thời không can thiệp sâu
    }
    
    if (effect.is_custom) {
        showConfigModal.value = true;
    }
};

const handleClearEffect = () => {
    selectedEffect.value = 'none';
    if (editor.effect) {
        editor.effect.opening.slug = 'none';
        editor.effect.opening.isCustom = false;
        editor.effect.opening.custom = {
            title: "",
            subtitle: "",
            time: 0,
            image: ""
        };
    }
};

const rewindFlags = new Map<number, boolean>();

const rewindVideo = (video: HTMLVideoElement, id: number) => {
    if (!rewindFlags.get(id)) return;
    
    // Nếu video đã tiến về gần điểm 0, đưa thẳng về 0 và dừng
    if (video.currentTime <= 0.05) {
        video.currentTime = 0;
        rewindFlags.set(id, false);
        return;
    }
    
    // Tua ngược đi 1 khoảng = ~3x tốc độ (0.05s/frame tại 60fps)
    video.currentTime -= 0.05;
    requestAnimationFrame(() => rewindVideo(video, id));
};

const onMouseEnter = (id: number) => {
    rewindFlags.set(id, false); // Dừng tua ngược nếu user hover lại
    const video = document.getElementById(`video-${id}`) as HTMLVideoElement;
    if (video) {
        video.play().catch(e => console.warn(e));
    }
};

const onMouseLeave = (id: number) => {
    const video = document.getElementById(`video-${id}`) as HTMLVideoElement;
    if (video) {
        video.pause();
        // Bắt đầu quá trình tua ngược từ mốc currentTime hiện tại
        rewindFlags.set(id, true);
        requestAnimationFrame(() => rewindVideo(video, id));
    }
};

const handleConfigConfirm = (data: any) => {
    // Xử lý dữ liệu cấu hình tại đây
    console.log("Cấu hình custom effect:", data);
    if (editor.effect) {
        editor.effect.opening.custom = {
            title: data.title || '',
            subtitle: data.subtitle || '',
            time: typeof data.duration === 'number' ? data.duration : parseInt(data.duration) || 4,
            image: data.image || ''
        };
    }
};
</script>

<template>
    <div class="px-2 mb-4">
        <h6 class="fw-bold mb-1 text-dark d-flex align-items-center gap-1">
            Hiệu ứng mở màn
            <BaseIconComponent name="crown-circle" type="mdi" :size="18" color="#3b82f6" />
        </h6>
        <p class="text-muted small mb-3 text-wrap" style="max-width: 90%;">Tạo ấn tượng đầu tiên đặc biệt với hiệu ứng mở màn khi trang web của bạn được mở.</p>

        <div class="mb-4" v-if="selectedEffect !== 'none'">
            <button class="btn-clear fw-medium text-danger bg-transparent"
                @click="handleClearEffect">
                Xóa hiệu ứng
            </button>
        </div>

        <div class="row g-3">
            <div v-for="effect in effects" :key="effect.id" class="col-6">
                <!-- Wrapper to properly clip contents but let absolute badges hang out -->
                <div class="position-relative h-100">
                    <!-- Badges -->
                    <div class="crown-badge position-absolute rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                         style="top: -6px; left: -6px; width: 20px; height: 20px; z-index: 10;">
                        <BaseIconComponent name="crown" type="mdi" :size="12" color="#fff" />
                    </div>
                
                    <div v-if="selectedEffect === effect.slug" 
                        class="check-indicator position-absolute d-flex align-items-center justify-content-center bg-primary text-white rounded-circle"
                        style="top: -6px; right: -6px; width: 22px; height: 22px; z-index: 10;">
                        <BaseIconComponent name="check" type="mdi" :size="14" color="#fff" />
                    </div>

                    <!-- Main Card -->
                    <div class="opening-card d-flex flex-column h-100"
                         :class="{ 'active': selectedEffect === effect.slug }"
                         @click="handleEffectSelect(effect)"
                         @mouseenter="onMouseEnter(effect.id)"
                         @mouseleave="onMouseLeave(effect.id)">
                         
                        <div class="visual-box position-relative overflow-hidden w-100 bg-light">
                            <video :id="`video-${effect.id}`" 
                                   v-if="effect.video"
                                   :src="`/images/effects/opening_videos/${effect.video}`"
                                   muted playsinline preload="auto" loop
                                   class="w-100 h-100 object-fit-cover position-absolute top-0 start-0"></video>
                        </div>

                        <div class="card-info p-2 bg-white flex-grow-1">
                            <div class="fw-bold text-dark mb-1" style="font-size: 13px;">{{ effect.name }}</div>
                            <div class="text-muted" style="font-size: 11px;">4s</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="effects.length === 0" class="col-12 text-center text-muted small py-3">
                Đang xây dựng dữ liệu cho loại này...
            </div>
        </div>

        <ConfigEffectAnimatedComponent 
            v-model="showConfigModal" 
            @confirm="handleConfigConfirm" />
    </div>
</template>

<style scoped>
.btn-clear {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid #fca5a5;
    transition: all 0.2s ease;
}
.btn-clear:hover {
    background-color: #fef2f2 !important;
    border-color: #ef4444;
}

.opening-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    background: #fff;
    transition: all 0.2s;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.opening-card:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.opening-card.active {
    border-color: #3b82f6;
    border-width: 2px;
}

.visual-box {
    aspect-ratio: 9 / 16;
}
</style>