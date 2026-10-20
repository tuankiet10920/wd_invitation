<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        default: 'add_circle'
    },
    fill: {
        type: Boolean,
        default: false
    },
    size: {
        type: Number,
        default: 18
    },
    color: {
        type: String,
        default: '#000000'
    },
    active: {
        type: Boolean,
        default: false
    },
    colorObject: {
        type: Object,
        require: false,
        default: () => {
            return {}
        }
    }
});
const setStyle = computed(() => {
    let color = props.color
    if (props.colorObject && Object.keys(props.colorObject).length > 0 && props.colorObject.color) color = props.colorObject.color
    return {
        fontSize: props.size + 'px',
        color: color,
    }
})
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=east" />
useHead({
    link: [
        {
            key: `google-icon-${props.name}`,
            rel: 'stylesheet',
            href: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=${props.name}`
        }
    ]
})
</script>
<template>
    <span class="material-symbols-outlined icon-component" :class="{
        'icon-fill': props.fill,
        'no-fill': !props.fill,
        'active': props.active
    }" :style="setStyle">
        {{ props.name }}
    </span>
</template>
<style scoped>
.icon-component {
    font-size: 18px;
    cursor: pointer;
}

.icon-fill {
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

.no-fill {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

.active {
    color: var(--mr-primary) !important;
}
</style>
