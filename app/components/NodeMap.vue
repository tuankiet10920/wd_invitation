<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

// Lazy load BaseIconComponent to prevent potential circular/missing import errors here if not properly globally registered
const BaseIconComponent = defineAsyncComponent(() => import('~/coms/icons/BaseIconComponent.vue'));

defineProps<{
    src?: string
}>()

const route = useRoute();
const isEditor = computed(() => route.path.includes('/editor'));
const isInteract = ref(false);

const toggleInteract = () => {
    isInteract.value = !isInteract.value;
};
</script>

<template>
    <div class="node-map position-relative">
        <!-- Always disable pointer events on iframe in editor mode if NOT interacting -->
        <iframe
            :src="src || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096814183571!2d105.85002731540236!3d21.02881188599836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSGFub2ksIEhvYW4gS2llbSwgSGFub2ksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1683883883883!5m2!1sen!2s'"
            width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :style="{'pointer-events': (isEditor && !isInteract) ? 'none' : 'auto'}">
        </iframe>
        
        <!-- Overlay to ensure drag events are captured by the editor when not interacting -->
        <div v-if="isEditor && !isInteract" class="overlay w-100 h-100 position-absolute top-0 start-0"></div>

        <!-- Toggle interaction button (only in editor visible) -->
        <button v-if="isEditor" class="interact-btn position-absolute d-flex align-items-center justify-content-center bg-white border border-2 rounded shadow-sm"
            @click.stop="toggleInteract" 
            :title="isInteract ? 'Khóa tương tác (Click để di chuyển)' : 'Mở tương tác (Click để kéo bản đồ)'">
            <BaseIconComponent v-if="!isInteract" name="gesture-tap" type="mdi" :size="20" color="#333" />
            <BaseIconComponent v-else name="cursor-move" type="mdi" :size="20" color="#333" />
        </button>
    </div>
</template>

<style scoped>
.node-map {
    min-width: 200px;
    min-height: 150px;
    overflow: hidden;
}

.interact-btn {
    top: 8px;
    right: 8px;
    width: 38px;
    height: 30px;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
    border-color: #bbdefb !important;
}

.interact-btn:hover {
    background-color: #f0f8ff !important;
}
</style>