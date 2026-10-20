<script setup lang="ts">
const props = defineProps<{
    item?: {
        id: number | string;
        name: string;
        avatar?: string;
        url?: string;
        createdAt?: string;
    }
}>();

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
</script>
<template>
    <NuxtLink :to="props.item?.url ? `/s/${props.item.url}` : '#'" target="_blank" class="box ts-3">
        <NuxtImg :src="props.item?.id ? `/images/wcards/IMAGE_WEDDING_CARD_${props.item.id}.png` : `/others/real-invitation-customer.webp`" width="210" height="375" alt="Thiệp cưới" />
        <div class="overlay flex-jc-ac">
            <button type="button">Xem thiệp</button>
        </div>
        <div class="content">
            <p class="name mb-1">{{ props.item?.name || 'Hoàng Hồng Quân' }}</p>
            <p class="datetime mb-0">{{ props.item?.createdAt ? formatDate(props.item.createdAt) : '16/12/2025' }}</p>
        </div>
    </NuxtLink>
</template>
<style scoped>
.box {
    display: block;
    text-decoration: none;
    cursor: pointer;
    max-width: 210px;
    width: 100%;
    height: auto;
    max-height: 375px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 1px 0 #e5e7eb;
}

.box:hover {
    transform: translateY(-5px);
}

.box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all .3s ease-in-out;
}

.box:hover img {
    scale: 1.1;
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 2;
    transition: all .3s ease-in-out;
}

.box:hover .overlay {
    background-color: rgba(0, 0, 0, .5);
}

.box button {
    transition: all .3s ease-in-out;
    visibility: hidden;
    opacity: 0;
}

.box:hover button {
    visibility: visible;
    opacity: 1;
}

.overlay button {
    background-color: #fff;
    color: #111827;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    padding: 4px 16px;
    border-radius: 9999px;
    border: none;
}

.content {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 15px;
    background-color: rgba(0, 0, 0, .3);
    z-index: 3;
}

.name {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
}

.datetime {
    color: #fff;
    font-size: 12px;
    line-height: 16px;
}
</style>