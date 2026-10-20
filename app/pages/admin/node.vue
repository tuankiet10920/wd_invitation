<script setup lang="ts">
import NodeButton from '~/components/NodeButton.vue'
import NodeImage from '~/components/NodeImage.vue'
import NodeText from '~/components/NodeText.vue'

const componentMap: Record<string, any> = {
    Text: NodeText,
    Image: NodeImage,
    Button: NodeButton,
}

interface NodeInterface {
    id: number
    type: string,
    style: object
}
const nodes = [
    {
        id: 1,
        type: 'Text'
    },
    {
        id: 2,
        type: 'Image'
    },
    {
        id: 3,
        type: 'Button'
    },
]

const createdNodes = ref<NodeInterface[]>([])

const chooseNode = (id: number) => {
    const cur = nodes.find(item => item.id == id)
    if (!cur) return console.log('Node is not exist!');
    createdNodes.value.push({
        id: Date.now(),
        type: cur.type,
        style: {}
    })
    console.log('createdNodes: ', createdNodes.value);
}

definePageMeta({
    layout: 'admin'
})
useHead({
    meta: [
        { name: 'robots', content: 'noindex, nofollow' }
    ]
})
</script>
<template>
    <div>
        <div class="flex-js-ac">
            <button type="button" class="me-2" v-for="item in nodes" :key="item.id" @click="chooseNode(item.id)">{{
                item.type }}</button>
        </div>
        <div class="selected-components flex-js-ac">
            <div class="component me-2" v-for="item in createdNodes" :key="item.id">
                <component :is="componentMap[item.type]"></component>
            </div>
        </div>
    </div>
</template>
<style scoped></style>