<script setup lang="ts">
import type { IconType } from '~~/interfaces';

const props = defineProps<{
    modelValue: IconType | string;
    id?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: IconType | string): void;
    (e: 'change', value: IconType | string): void;
}>();

const options = [
    { value: 'mdi', label: 'Material Design Icons (MDI)' },
    { value: 'lucide', label: 'Lucide Icons' },
    { value: 'ic', label: 'Google Material Icons (IC)' },
    { value: 'ph', label: 'Phosphor Icons' },
    { value: 'solar', label: 'Solar Icons' },
    { value: 'tabler', label: 'Tabler Icons' }
];

const selectedType = computed({
    get: () => props.modelValue,
    set: (val) => {
        emit('update:modelValue', val);
        emit('change', val);
    }
});
</script>

<template>
    <select class="form-select" :id="id" v-model="selectedType">
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
        </option>
    </select>
</template>

<style scoped>
.form-select {
    border-color: #e2e8f0;
    padding: 10px 16px;
    font-size: 0.95rem;
}
.form-select:focus {
    border-color: #cbd5e1;
    box-shadow: none;
}
</style>