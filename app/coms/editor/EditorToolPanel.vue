<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import ToolSetup from './tool/ToolSetup.vue';
import ToolImage from './tool/ToolImage.vue';
import ToolText from './tool/ToolText.vue';
import ToolMusic from './tool/ToolMusic.vue';
import ToolCalendar from './tool/ToolCalendar.vue';
import ToolCallNow from './tool/ToolCallNow.vue';
import ToolCountDown from './tool/ToolCountDown.vue';
import ToolMap from './tool/ToolMap.vue';
import ToolGuestName from './tool/ToolGuestName.vue';
import ToolQrBox from './tool/ToolQrBox.vue';
import ToolAcceptInvitation from './tool/ToolAcceptInvitation.vue';
import ToolYoutube from './tool/ToolYoutube.vue';
import ToolPhotoAlbumComponent from './tool/ToolPhotoAlbumComponent.vue';
import ToolEnvelope from './tool/ToolEnvelope.vue';
import { useElementStore } from '~~/stores/element';

const element = useElementStore()

const coms: Record<string, any> = {
    Image: ToolImage,
    Setup: ToolSetup,
    Text: ToolText,
    Music: ToolMusic,
    Calendar: ToolCalendar,
    CallNow: ToolCallNow,
    CountDown: ToolCountDown,
    GuestName: ToolGuestName,
    QrBox: ToolQrBox,
    Map: ToolMap,
    AcceptInvitation: ToolAcceptInvitation,
    Youtube: ToolYoutube,
    PhotoAlbum: ToolPhotoAlbumComponent,
    Envelope: ToolEnvelope
}

const type = ref<string>('Setup')
const showPanel = ref(false)

const currentTool = computed(() => {
    return coms[type.value as string]
})

watch(() => element.type, (newValue) => {
    type.value = newValue
    showPanel.value = true // Auto open on selection
})

const handleCloseSetup = () => {
    element.type = '';
};

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('close-tool-setup', handleCloseSetup);
    }
});

onUnmounted(() => {
    if (import.meta.client) {
        window.removeEventListener('close-tool-setup', handleCloseSetup);
    }
});
</script>

<template>
    <div class="panel-wrapper" :class="{ 'show': showPanel }" v-if="element.type">
        <div class="panel-backdrop d-md-none" v-if="showPanel" @click="showPanel = false"></div>
        <aside class="tool-panel border-start bg-white p-3">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between mb-4">
                <div class="d-flex align-items-center gap-2">
                    <BaseIconComponent name="pen-new-square-linear" type="solar" :size="18" />
                    <h6 class="fw-bold mb-0" style="font-size: 15px;">Tuỳ chỉnh</h6>
                </div>
                <button class="btn btn-sm btn-light border-0 d-md-none" @click="showPanel = false">
                    <BaseIconComponent name="close" type="mdi" :size="18" />
                </button>
            </div>
            <component :is="currentTool" />
        </aside>
    </div>
</template>
<style scoped>
.panel-wrapper {
    height: 100%;
    position: relative;
}

.tool-panel {
    width: 350px;
    flex-shrink: 0;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
    transition: transform 0.3s ease;
}

.form-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
}

.btn-primary:active,
.btn-primary:focus {
    background-color: #2563eb !important;
    border-color: #2563eb !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .panel-wrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10000;
        pointer-events: none;
    }

    .panel-wrapper.show {
        pointer-events: auto;
    }

    .panel-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .tool-panel {
        position: absolute;
        right: 0;
        top: 0;
        width: 85%;
        max-width: 350px;
        transform: translateX(100%);
    }

    .panel-wrapper.show .tool-panel {
        transform: translateX(0);
    }
}
</style>