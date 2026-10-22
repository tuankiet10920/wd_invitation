<script setup lang="ts">
import { useEditorStore } from "~~/stores/editor";
import Moveable from "vue3-moveable";

const editor = useEditorStore();
const moveableRef = ref<InstanceType<typeof Moveable> | null>(null);
const isCornerDrag = ref(false);

const isLocked = computed(() => {
    return editor.selectedNode?.props?.locked || false;
});

const isTextNode = computed(() => {
    return editor.selectedNode?.type === 'Text';
});

const moveableConfig = computed(() => ({
    draggable: !isLocked.value,
    resizable: !isLocked.value,
    rotatable: !isLocked.value,
    snappable: true,
    snapCenter: true,
    snapVertical: true,
    snapHorizontal: true,
    snapElement: true,
    snapGap: true,
    isDisplaySnapDigit: true,
    snapThreshold: 5,
    keepRatio: isTextNode.value && isCornerDrag.value,
    scrollable: true,
    scrollContainer: ".draw-canvas",
    zoom: editor.zoom,
}));

// Căn chỉnh guidelines dưa trên paperPageRef lấy từ Store
const elementGuidelines = computed(() => {
    const guides: (HTMLElement | SVGElement)[] = [];
    if (import.meta.client) {
        if (editor.paperPageRef) guides.push(editor.paperPageRef);
        const nodes = Array.from(document.querySelectorAll('.editable')) as (HTMLElement | SVGElement)[];
        guides.push(...nodes);
    }
    return guides;
});

const syncRect = async () => {
    await nextTick();
    if (moveableRef.value) {
        moveableRef.value.updateRect();
    }
};

watch(() => editor.currentTarget, (val) => {
    if (val) {
        syncRect();
    }
}, { immediate: true });

onMounted(() => {
    const canvasElement = document.querySelector('.draw-canvas');
    if (canvasElement) {
        canvasElement.addEventListener('scroll', syncRect, { passive: true });
    }
});

onUnmounted(() => {
    const scrollContainer = document.querySelector('.draw-canvas');
    if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', syncRect);
    }
});

type MoveableTarget = HTMLElement | SVGElement;

let dragStartLeft = 0;
let dragStartTop = 0;

const onDragStart = (e: any) => {
    const target = e.target as MoveableTarget;
    if (target.style.left.includes('%')) {
        const parentWidth = target.parentElement?.offsetWidth || 500;
        const leftPx = (parseFloat(target.style.left) / 100) * parentWidth;
        target.style.left = `${leftPx}px`;
    }
    if (target.style.top.includes('%')) {
        const parentHeight = target.parentElement?.offsetHeight || 800;
        const topPx = (parseFloat(target.style.top) / 100) * parentHeight;
        target.style.top = `${topPx}px`;
    }
    dragStartLeft = parseFloat(target.style.left) || 0;
    dragStartTop = parseFloat(target.style.top) || 0;
};

const onDrag = (e: any) => {
    const target = e.target as MoveableTarget;
    
    if (e.beforeTranslate) {
        target.style.left = `${dragStartLeft + e.beforeTranslate[0]}px`;
        target.style.top = `${dragStartTop + e.beforeTranslate[1]}px`;
    } else {
        const left = parseFloat(target.style.left) || 0;
        const top = parseFloat(target.style.top) || 0;
        target.style.left = `${left + e.beforeDelta[0]}px`;
        target.style.top = `${top + e.beforeDelta[1]}px`;
    }

    // Giữ styles trong node store đồng bộ trong lúc kéo để chống giật nếu có component re-render
    const id = target.getAttribute('data-id');
    if (id) {
        const node = editor.createdNodes.find(n => n.id === Number(id));
        if (node && node.styles) {
            node.styles.left = target.style.left;
            node.styles.top = target.style.top;
        }
    }
};

let initialFontSize = 16;
let initialWidth = 100;

const onResizeStart = (e: any) => {
    const target = e.target as MoveableTarget;
    if (target.getAttribute('data-type') === 'Text') {
        const styleFontSize = window.getComputedStyle(target).fontSize;
        initialFontSize = parseFloat(styleFontSize) || 16;
        initialWidth = target.offsetWidth || 100;

        // Chỉ thay đổi kích thước chữ khi kéo từ góc
        if (e.direction && e.direction[0] !== 0 && e.direction[1] !== 0) {
            isCornerDrag.value = true;
        } else {
            isCornerDrag.value = false;
        }
    } else {
        isCornerDrag.value = false;
    }
};

const onResize = (e: any) => {
    const target = e.target as MoveableTarget;
    target.style.width = `${e.width}px`;
    target.style.height = `${e.height}px`; // Cố định chiều cao trong lúc kéo để tránh giật lag

    if (target.getAttribute('data-type') === 'Text' && isCornerDrag.value) {
        const ratio = e.width / initialWidth;
        const newFontSize = Math.max(8, Math.round(initialFontSize * ratio));
        target.style.fontSize = `${newFontSize}px`;
    }

    // Xử lý chuyển đổi phần trăm sang pixel cho Resize
    if (target.style.left.includes('%')) {
        const parentWidth = target.parentElement?.offsetWidth || 500;
        const leftPx = (parseFloat(target.style.left) / 100) * parentWidth;
        target.style.left = `${leftPx}px`;
    }
    if (target.style.top.includes('%')) {
        const parentHeight = target.parentElement?.offsetHeight || 800;
        const topPx = (parseFloat(target.style.top) / 100) * parentHeight;
        target.style.top = `${topPx}px`;
    }

    const left = parseFloat(target.style.left) || 0;
    const top = parseFloat(target.style.top) || 0;
    target.style.left = `${left + e.drag.beforeDelta[0]}px`;
    target.style.top = `${top + e.drag.beforeDelta[1]}px`;
};

const onRotate = (e: any) => {
    (e.target as MoveableTarget).style.transform = e.transform;
};

const updateStoreStyle = (target: MoveableTarget) => {
    const id = target.getAttribute('data-id');
    if (id) {
        const styles: Record<string, any> = {
            left: target.style.left,
            top: target.style.top,
            width: target.style.width,
            transform: target.style.transform,
            position: 'absolute'
        };
        
        if (target.getAttribute('data-type') === 'Text') {
            styles.fontSize = target.style.fontSize;
            target.style.height = 'auto'; // Reset lại chiều cao tự nhiên sau khi kéo xong
            styles.height = 'auto';
        } else {
            styles.height = target.style.height;
        }

        editor.updateNodeStyle(Number(id), styles);
    }
}

const onDragEnd = (e: any) => {
    updateStoreStyle(e.target as MoveableTarget);
}

const onResizeEnd = (e: any) => {
    isCornerDrag.value = false;
    updateStoreStyle(e.target as MoveableTarget);
}

const onRotateEnd = (e: any) => {
    updateStoreStyle(e.target as MoveableTarget);
}

const onDragGroup = (e: any) => {
    e.events.forEach((ev: any) => {
        const target = ev.target as MoveableTarget;

        if (target.style.left.includes('%')) {
            const parentWidth = target.parentElement?.offsetWidth || 500;
            const leftPx = (parseFloat(target.style.left) / 100) * parentWidth;
            target.style.left = `${leftPx}px`;
        }
        if (target.style.top.includes('%')) {
            const parentHeight = target.parentElement?.offsetHeight || 800;
            const topPx = (parseFloat(target.style.top) / 100) * parentHeight;
            target.style.top = `${topPx}px`;
        }

        const left = parseFloat(target.style.left) || 0;
        const top = parseFloat(target.style.top) || 0;
        target.style.left = `${left + ev.beforeDelta[0]}px`;
        target.style.top = `${top + ev.beforeDelta[1]}px`;

        const id = target.getAttribute('data-id');
        if (id) {
            const node = editor.createdNodes.find(n => n.id === Number(id));
            if (node && node.styles) {
                node.styles.left = target.style.left;
                node.styles.top = target.style.top;
            }
        }
    });
};

const onResizeGroup = (e: any) => {
    e.events.forEach((ev: any) => {
        const target = ev.target as MoveableTarget;
        target.style.width = `${ev.width}px`;
        if (target.getAttribute('data-type') !== 'Text') {
            target.style.height = `${ev.height}px`;
        }
        const left = parseFloat(target.style.left) || 0;
        const top = parseFloat(target.style.top) || 0;
        target.style.left = `${left + ev.drag.beforeDelta[0]}px`;
        if (target.getAttribute('data-type') !== 'Text') {
            target.style.top = `${top + ev.drag.beforeDelta[1]}px`;
        }
    });
};

const onRotateGroup = (e: any) => {
    e.events.forEach((ev: any) => {
        (ev.target as MoveableTarget).style.transform = ev.transform;
    });
};

const onDragGroupEnd = (e: any) => {
    e.targets.forEach((target: MoveableTarget) => updateStoreStyle(target));
};

const onResizeGroupEnd = (e: any) => {
    e.targets.forEach((target: MoveableTarget) => updateStoreStyle(target));
};

const onRotateGroupEnd = (e: any) => {
    e.targets.forEach((target: MoveableTarget) => updateStoreStyle(target));
};

let lastClickTime = 0;
const onMoveableClick = (e: any) => {
    const now = Date.now();
    const isFastClick = (now - lastClickTime) < 350;
    lastClickTime = now;

    if ((e.isDouble || e.inputEvent?.detail === 2 || isFastClick) && isTextNode.value && editor.currentTarget) {
        const targetEl = (Array.isArray(editor.currentTarget) ? editor.currentTarget[0] : editor.currentTarget) as HTMLElement;
        if (targetEl) {
            editor.startEditingText(targetEl);
        }
    }
};
</script>

<template>
    <ClientOnly>
        <Moveable v-if="editor.currentTarget && !editor.isEditing" ref="moveableRef" :target="editor.currentTarget"
            v-bind="moveableConfig" :element-guidelines="elementGuidelines" @click="onMoveableClick" @drag-start="onDragStart" @drag="onDrag" @resize-start="onResizeStart" @resize="onResize"
            @rotate="onRotate" @drag-end="onDragEnd" @resize-end="onResizeEnd" @rotate-end="onRotateEnd"
            @drag-group="onDragGroup" @resize-group="onResizeGroup" @rotate-group="onRotateGroup"
            @drag-group-end="onDragGroupEnd" @resize-group-end="onResizeGroupEnd" @rotate-group-end="onRotateGroupEnd" />
    </ClientOnly>
</template>

<style scoped></style>