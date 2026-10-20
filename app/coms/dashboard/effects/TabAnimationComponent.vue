<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonCustomCompomnent from '~/coms/button/ButtonCustomCompomnent.vue';
import EffectViewerComponent from '../modal/EffectViewerComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    effects: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});

const editor = useEditorStore();
const selectedEffect = ref(editor.effect?.dynamic || 'none');
const showViewer = ref(false);

const handleEffectSelect = (slug: string) => {
    selectedEffect.value = slug;
};

const handleDeselectEffect = (e: Event) => {
    e.stopPropagation();
    selectedEffect.value = 'none';
};

const handleApplyEffect = () => {
    if (editor.effect) {
        editor.effect.dynamic = selectedEffect.value;
    }
    alert('Áp dụng hiệu ứng thành công!');
};
</script>

<template>
    <div>
        <div class="effect-panel p-3 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="d-flex align-items-center gap-2">
                    <BaseIconComponent name="palette" type="mdi" :size="18" color="#f472b6" />
                    <span class="fw-bold text-dark">Hiệu ứng dựng sẵn</span>
                </div>
                <BaseIconComponent name="crown-circle" type="mdi" :size="18" color="#3b82f6" />
            </div>

            <p class="text-muted small mb-3 text-wrap text-justify">
                Chọn 1 mẫu hiệu ứng để áp dụng cho toàn bộ trang
            </p>

            <div class="row g-2">
                <div v-for="effect in effects" :key="effect.id" class="col-6">
                    <div class="effect-item d-flex flex-column align-items-center justify-content-center p-3 position-relative"
                        :class="{ 'active': selectedEffect === effect.slug }" @click="handleEffectSelect(effect.slug)">
                        
                        <div v-if="selectedEffect === effect.slug && effect.slug !== 'none'" 
                            class="deselect-btn d-flex align-items-center justify-content-center cursor-pointer"
                            @click="handleDeselectEffect">
                            <BaseIconComponent name="close" type="mdi" :size="14" color="#fff" />
                        </div>

                        <div class="effect-icon mb-2">
                            <BaseIconComponent :name="effect.icon" :type="effect.icon_type || 'mdi'" :size="24"
                                :color="effect.slug === 'none' ? '#6b7280' : '#3b82f6'" />
                        </div>
                        <span class="text-secondary small text-center fw-medium">{{ effect.name }}</span>
                    </div>
                </div>
                <div v-if="effects.length === 0" class="col-12 text-center text-muted small py-3">
                    Đang xây dựng dữ liệu cho loại này...
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center gap-3">
            <!-- VIEW EFFECT -->
            <ButtonCustomCompomnent class="btn-preview fw-bold shadow-sm" :background="`#64748b`" style="color: white;"
                @click="showViewer = true">
                <BaseIconComponent name="movie-open" type="mdi" :size="18" color="#fff" class="me-2" />
                Xem trước
            </ButtonCustomCompomnent>

            <!-- APPLY EFFECT -->
            <ButtonCustomCompomnent class="btn-preview fw-bold shadow-sm" :background="`#ff8a9a`" style="color: white;"
                @click="handleApplyEffect">
                <BaseIconComponent name="auto-awesome" type="ic" :size="18" color="#fcd34d" class="me-2" />
                Áp dụng
            </ButtonCustomCompomnent>
        </div>

        <EffectViewerComponent v-model="showViewer" :effect-type="selectedEffect" />
    </div>
</template>

<style scoped>
.effect-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
}

.effect-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    height: 80px;
}

.effect-item:hover {
    border-color: #3b82f6;
    background-color: #f0f9ff;
}

.effect-item.active {
    border-color: #3b82f6;
    background-color: #eff6ff;
    border-width: 2px;
}

.deselect-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4b5563;
    z-index: 10;
}
.deselect-btn:hover {
    background-color: #374151;
}

.btn-preview {
    padding: 10px 24px;
    border-radius: 6px;
    border: none;
    font-size: 15px;
}
.cursor-pointer {
    cursor: pointer;
}
</style>