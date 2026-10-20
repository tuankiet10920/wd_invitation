<script setup lang="ts">
const props = defineProps({
    background: {
        type: String,
        required: false,
        default: 'linear-gradient(135deg, rgb(250, 127, 152) 0%, rgb(230, 111, 135) 100%)'
    },
    color: {
        type: String,
        required: false,
        default: '#FFFFFF'
    },
    style: {
        type: Object,
        required: false,
        default: () => { return {} }
    }
})
</script>
<template>
    <button type="button" :style="{ ...props.style, color: props.color, background: props.background }">
        <slot>
            Xem mẫu
        </slot>
    </button>
</template>
<style scoped></style>