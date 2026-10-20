<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Chi tiết'
    },
    items: {
        type: Array as PropType<{ label: string; value: any }[]>,
        default: () => []
    }
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="view-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold m-0 fs-5">{{ title }}</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close-circle-outline" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Body -->
                <div class="modal-body p-0">
                    <div class="table-responsive">
                        <table class="table table-bordered mb-0">
                            <tbody>
                                <tr v-for="(item, index) in items" :key="index">
                                    <th class="bg-light text-dark fw-bold align-middle" width="35%"
                                        style="font-size: 0.9rem;">
                                        {{ item.label }}
                                    </th>
                                    <td class="align-middle text-secondary" style="font-size: 0.9rem;">
                                        {{ item.value }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.view-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 500px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close-modal:hover {
    opacity: 0.7;
}

/* Table Styles Override to match reference clearer */
.table-bordered th,
.table-bordered td {
    border-color: #e5e7eb;
    padding: 12px 16px;
}

.bg-light {
    background-color: #f9fafb !important;
}
</style>