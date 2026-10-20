<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const ID = useId()
</script>
<template>
    <div class="card border">
        <div class="card-header bg-white border-bottom-0 py-2 d-flex align-items-center justify-content-between"
            data-bs-toggle="collapse" :href="`#collapseSymmetry${ID}`" role="button" aria-expanded="true">
            <slot name="header"></slot>
            <BaseIconComponent name="chevron-down" type="lucide" :size="16" />
        </div>
        <div class="collapse show border-top mt-0" :id="`collapseSymmetry${ID}`">
            <slot name="body"></slot>
        </div>
    </div>
</template>
<style scoped></style>