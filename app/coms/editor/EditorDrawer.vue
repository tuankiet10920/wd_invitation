<script setup lang="ts">
import BackgroundComponent from '../dashboard/BackgroundComponent.vue';
import EffectComponent from '../dashboard/EffectComponent.vue';
import ImageComponent from '../dashboard/ImageComponent.vue';
import MusicComponent from '../dashboard/MusicComponent.vue';
import StockComponent from '../dashboard/StockComponent.vue';
import TemplateComponent from '../dashboard/TemplateComponent.vue';
import WidgetComponent from '../dashboard/WidgetComponent.vue';
import { useEditorStore } from '~~/stores/editor'

const editor = useEditorStore()

interface NodeInterface {
    id: number
    type: string,
    styles: object
    props?: object
}

const createdNodes = ref<NodeInterface[]>([])

const addNode = (type: string, { props = {}, styles = {} } = {}) => {

    createdNodes.value.push({
        id: Date.now(),
        type,
        styles,
        props
    })
}
</script>
<template>
    <aside
        :class="['sub-drawer position-relative', { 'is-open': editor.activeMenu !== null && editor.activeMenu !== 'text' }]">
        <div class="drawer-inner border-end h-100">

            <div class="drawer-scroll-content h-100 overflow-auto">

                <ImageComponent v-if="editor.activeMenu === 'image'" class="p-3" />

                <StockComponent v-if="editor.activeMenu === 'stock'" />

                <BackgroundComponent v-if="editor.activeMenu === 'bg'" />

                <MusicComponent v-if="editor.activeMenu === 'music'" />

                <WidgetComponent v-if="editor.activeMenu === 'tool'" />

                <TemplateComponent v-if="editor.activeMenu === 'template'" />

                <EffectComponent v-if="editor.activeMenu === 'effect'" />
            </div>
        </div>
    </aside>
</template>
<style scoped>
/* DRAWER */
.sub-drawer {
    width: 0;
    overflow: hidden;
    transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    flex-shrink: 0;
    z-index: 1100;
}

@media (max-width: 768px) {
    .sub-drawer {
        z-index: 9999;
    }
}

.sub-drawer.is-open {
    width: 340px;
}

.drawer-inner {
    width: 94%;
    background-color: #fff;
}
</style>