<script setup lang="ts">
defineProps<{
    content?: string
}>()
</script>
<template>
    <p data-type="Text" class="mb-0">{{ content || 'Double click to edit' }}</p>
</template>
<style scoped>
p {
    /* overflow-wrap là tên gọi hiện đại của word-wrap */
    overflow-wrap: break-word;
    word-wrap: break-word;
    /* Hỗ trợ các trình duyệt cũ */

    /* Nếu bạn muốn ngắt từ ở bất cứ đâu (kể cả giữa từ) */
    word-break: break-word;
    
    /* Giữ lại lệnh xuống hàng và khoảng trắng */
    white-space: pre-wrap;
}

p[contenteditable="true"] {
    outline: none;
    cursor: text;
    user-select: text;
    -webkit-user-select: text;
    min-width: 20px;
    min-height: 1em;
}
</style>