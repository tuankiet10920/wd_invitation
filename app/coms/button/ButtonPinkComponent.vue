<script setup lang="ts">
import IconComponent from '../icons/IconComponent.vue';

const props = defineProps({
    iconName: {
        type: String,
        required: false,
        default: 'east'
    },
    isIcon: {
        type: Boolean,
        required: false,
        default: true
    },
    name: {
        type: String,
        required: false,
        default: 'icon'
    },
})
</script>
<template>
    <button type="button" class="flex-js-ac">
        <slot>
            <span class="text">{{ props.name }}</span>
            <IconComponent v-if="props.isIcon" class="icon ts-3" :name="props.iconName" :color="`#FFFFFF`" />
        </slot>
    </button>
</template>
<style scoped>
button {
    border: none;
    background: linear-gradient(135deg, #fa7f98, #e66f87);
    border-radius: 40px;
    padding: 10px 24px;
    box-shadow: #f68fa34d 0px 4px 12px 0px;
    transition: all .3s ease-in-out;
}

button:hover {
    box-shadow: rgb(255, 139, 162) 0px 4px 14px 0px;
    transform: translateY(-2px);
}

button:hover .icon {
    position: relative;
    transform: translateX(3px);
}

.text {
    color: #fff;
    font-family: Inter;
    font-size: 18px;
    font-weight: 600;
}

.icon {
    margin-left: 10px;
}
</style>