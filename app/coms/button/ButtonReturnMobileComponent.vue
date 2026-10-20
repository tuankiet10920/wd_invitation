<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
</script>
<template>
    <div class="d-md-none me-2">
        <button @click="useRouter().back()"
            class="btn button-previous btn-light btn-sm rounded-1 p-1 d-flex align-items-center justify-content-center border-0 bg-white"
            style="width: 32px; height: 32px;">
            <BaseIconComponent name="chevron-left" type="lucide" :size="20" color="#444" />
        </button>
    </div>
</template>
<style scoped>
@media (max-width: 768px) {
    .button-previous {
        background-color: #f3f4f6 !important;
    }
}
</style>