<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import WrapperComponent from '~/coms/show/WrapperComponent.vue';
import { useEditorStore } from '~~/stores/editor';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    effectType: {
        type: String,
        default: 'none'
    }
})

const editor = useEditorStore();
const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

const previewKey = ref(0);
watch(() => [isOpen.value, props.effectType], () => {
    if (isOpen.value) {
        previewKey.value++; // re-render when opening modal or changing effect
    }
})

const effectCardData = computed(() => {
    return {
        background: editor.background,
        nodes: editor.createdNodes,
        music: editor.music,
        effect: props.effectType
    };
});
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="effect-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">Xem trước hiệu ứng</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <p v-if="effectType === 'none'" class="text-secondary small fst-italic mb-3 text-center">
                    Chưa có bộ hiệu ứng nào được áp dụng. Hãy chọn 1 mẫu từ danh sách.
                </p>
                <p v-else class="text-secondary small fst-italic mb-3 text-center">
                    Hiển thị Xem trước cho hiệu ứng đang chọn.
                </p>

                <!-- Device Preview -->
                <div class="device-preview-wrapper d-flex justify-content-center">
                    <div class="device-frame border position-relative overflow-hidden bg-white shadow-sm">

                        <div class="device-content d-flex flex-column h-100 overflow-auto position-relative">
                            <ClientOnly>
                                <WrapperComponent :key="previewKey" :cardData="effectCardData" :scale="360 / 500" :preview-effect="effectType" />
                            </ClientOnly>
                        </div>
                    </div>
                </div>

            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.effect-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 600px;
    max-width: 95vw;
}

.device-frame {
    width: 360px;
    height: 560px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
}

.device-content {
    background-color: #f8fafc;
}

.device-content::-webkit-scrollbar {
    width: 6px;
}

.device-content::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.device-content::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}
</style>