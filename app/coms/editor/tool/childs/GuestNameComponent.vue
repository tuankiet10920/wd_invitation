<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const editor = useEditorStore();

const useProp = (prop: string, defaultValue: any = '') => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.props) {
            return editor.selectedNode.props[prop] ?? defaultValue;
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNode) {
            if (!editor.selectedNode.props) editor.selectedNode.props = {};
            editor.selectedNode.props[prop] = val;
        }
    }
});

const defaultText = useProp('defaultText', 'Ví dụ: Bạn và người thương,...');

</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="chevron-down" type="mdi" :size="20" />
                <span>Dynamic Text Settings</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                
                <div class="bg-primary-light p-3 rounded border border-primary-light">
                    <div class="fw-medium mb-2 text-primary-dark">Tên khách mời tự động</div>
                    <div class="fs-13 text-primary-dark mb-2">
                        Tên khách mời sẽ được lấy tự động từ mỗi<br>link được tạo
                    </div>
                    <div class="fs-13 text-primary-dark">
                        Tạo link tên khách mời tự động <a href="#" class="text-primary fw-medium text-decoration-underline">tại đây</a>
                    </div>
                </div>

                <div>
                    <label class="form-label fw-medium mb-2 w-100" style="font-size: 13px; color: #333;">Text mặc định</label>
                    <input type="text" class="form-control form-control-sm border py-2 text-muted" v-model="defaultText" placeholder="Ví dụ: Bạn và người thương,...">
                    <div class="form-text mt-2 lh-sm" style="font-size: 12px; color: #666;">
                        Text này sẽ hiển thị khi không có tên khách mời cụ<br>
                        thể trong đường dẫn.<br>
                        Có thể để trống nếu không muốn hiển thị gì.
                    </div>
                </div>
            </div>
        </template>
    </BoxToolComponent>
</template>
<style scoped>
.fs-13 { font-size: 13px; }
.fs-14 { font-size: 14.5px; }

.bg-primary-light {
    background-color: #f0f7ff;
}
.border-primary-light {
    border-color: #cce5ff !important;
}
.text-primary-dark {
    color: #1a56db;
}
</style>