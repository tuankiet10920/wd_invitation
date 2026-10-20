<script setup lang="ts">
import type { IconInterface } from '~~/interfaces'

const props = withDefaults(defineProps<IconInterface>(), {
    type: 'material-symbols',
    size: 24,
    style: () => { return {} },
    color: '#000000',
    variant: 'default'
})

const name = computed(() => {
    let string = `${props.type}:${props.name}`

    if (props.variant != 'default') string += `-${props.variant}`

    return string
})
</script>
<template>
    <Icon :name="name" :style="{ ...props.style, color: props.color }" :size="props.size" />
</template>
<style scoped></style>