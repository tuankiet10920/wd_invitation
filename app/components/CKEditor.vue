<template>
    <div>
        <textarea ref="editorElement" :value="modelValue"></textarea>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
const { $ckeditorLoaded } = useNuxtApp();

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    config: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(["update:modelValue"]);

const editorElement = ref(null);
const isReady = ref(false);
let editorInstance = null;

const initEditor = () => {
    if (window.CKEDITOR && editorElement.value) {
        editorInstance = window.CKEDITOR.replace(editorElement.value, {
            ...props.config,
        });

        editorInstance.on('instanceReady', () => {
            isReady.value = true;
            // Set initial data once editor is ready
            if (props.modelValue) {
                editorInstance.setData(props.modelValue);
            }
        });

        editorInstance.on("change", () => {
            const data = editorInstance.getData();
            if (data !== props.modelValue) {
                emit("update:modelValue", data);
            }
        });
    }
};

onMounted(() => {
    if ($ckeditorLoaded.value) {
        initEditor();
    } else {
        watch($ckeditorLoaded, (newVal) => {
            if (newVal) {
                initEditor();
            }
        });
    }
});

// Watch for external model changes
watch(
    () => props.modelValue,
    (newValue) => {
        if (editorInstance && isReady.value && newValue !== editorInstance.getData()) {
            editorInstance.setData(newValue);
        }
    }
);

onBeforeUnmount(() => {
    if (editorInstance) {
        editorInstance.destroy();
        editorInstance = null;
    }
});
</script>
