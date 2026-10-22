<script setup lang="ts">
import { useEditorStore } from "~~/stores/editor"
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import NodeImage from '~/components/NodeImage.vue';
import NodeText from '~/components/NodeText.vue';
import NodeCalendar from '~/components/NodeCalendar.vue';
import NodeCallNow from '~/components/NodeCallNow.vue';
import NodeCountDown from '~/components/NodeCountDown.vue';
import NodeMap from '~/components/NodeMap.vue';
import { useElementStore } from "~~/stores/element";
import ActionComponent from './tool/childs/ActionComponent.vue';
import BadgeComponent from '../dashboard/childs/badge/BadgeComponent.vue';
import NodeGuestName from '~/components/NodeGuestName.vue';
import NodeQrBox from '~/components/NodeQrBox.vue';
import NodeAcceptInvitation from '~/components/NodeAcceptInvitation.vue';
import NodeYoutube from '~/components/NodeYoutube.vue';
import NodePhotoAlbum from '~/components/NodePhotoAlbum.vue';
import NodeEnvelope from '~/components/NodeEnvelope.vue';
import VueSelecto from "vue3-selecto";

const editor = useEditorStore()
const element = useElementStore()
const paperPage = ref<HTMLElement | null>(null)


const fetchFonts = async () => {
    try {
        if (document.getElementById('editor-font-loader')) return;
        
        const res: any = await $fetch('/api/v1/resources/fonts');
        if (res.success) {
            injectFonts(res.data);
        }
    } catch (e) {
        console.error("Failed to fetch fonts", e);
    }
};

const injectFonts = (categories: any[]) => {
    let css = '';
    categories.forEach((cat: any) => {
        cat.fonts?.forEach((f: any) => {
            css += `
            @font-face {
                font-family: '${f.name}';
                src: url('${f.path}') format('woff2');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
            `;
        });
    });

    const styleId = 'editor-font-loader';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
};

const coms: Record<string, any> = {
    Image: NodeImage,
    Text: NodeText,
    Calendar: NodeCalendar,
    CallNow: NodeCallNow,
    CountDown: NodeCountDown,
    GuestName: NodeGuestName,
    QrBox: NodeQrBox,
    Map: NodeMap,
    AcceptInvitation: NodeAcceptInvitation,
    Youtube: NodeYoutube,
    PhotoAlbum: NodePhotoAlbum,
    Envelope: NodeEnvelope
}

// Hàm xử lý Double Click vào phần tử văn bản
const handleDblClick = (e: MouseEvent) => {
    if (editor.isPreviewMode) return;
    const el = e.target as HTMLElement;
    const editableEl = (el.classList?.contains('editable') ? el : el.closest('.editable')) as HTMLElement;

    if (editableEl && editableEl.getAttribute('data-type') === 'Text') {
        editor.startEditingText(editableEl);
    }
};

const handleNodeDblClick = (e: MouseEvent, item: any) => {
    if (editor.isPreviewMode) return;
    if (item.type === 'Text') {
        const el = (e.currentTarget as HTMLElement) || (e.target as HTMLElement).closest('.editable');
        if (el) {
            editor.startEditingText(el as HTMLElement);
        }
    }
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        (e.target as HTMLElement).blur();
    }
};

// Hàm xử lý khi nhấn ra ngoài (Blur)
const handleBlur = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    editor.endEditingText(el);
};

// --- Action Component Logic ---


const actionStyle = computed(() => {
    const node = editor.selectedNode;
    if (!node) return { display: 'none' };

    // Xử lý tọa độ left (hỗ trợ cả % và px)
    let left = 0;
    if (typeof node.styles.left === 'string' && node.styles.left.includes('%')) {
        const paperWidth = paperPage.value?.offsetWidth || 500;
        left = (parseFloat(node.styles.left) / 100) * paperWidth;
    } else {
        left = parseFloat(node.styles.left) || 0;
    }

    // Xử lý tọa độ top (hỗ trợ cả % và px)
    let top = 0;
    if (typeof node.styles.top === 'string' && node.styles.top.includes('%')) {
        const paperHeight = paperPage.value?.offsetHeight || 1000;
        top = (parseFloat(node.styles.top) / 100) * paperHeight;
    } else {
        top = parseFloat(node.styles.top) || 0;
    }

    let width = parseFloat(node.styles.width) || 0;

    // Use actual DOM width if style width is missing/auto (e.g. for text)
    if (!width && editor.currentTarget) {
        width = (editor.currentTarget as HTMLElement).offsetWidth;
    }

    // Position: Top-Center of the element
    return {
        position: 'absolute' as const,
        top: `${top - 90}px`,
        left: `${left + width / 2}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999
    };
});

const handleDuplicate = () => {
    const node = editor.selectedNode;
    if (node) {
        // Clone node with slight offset
        const newNodeProps = JSON.parse(JSON.stringify(node.props || {}));
        const newStyles = JSON.parse(JSON.stringify(node.styles || {}));

        // Offset position
        const left = parseFloat(newStyles.left) || 0;
        const top = parseFloat(newStyles.top) || 0;
        newStyles.left = `${left + 20}px`;
        newStyles.top = `${top + 20}px`;

        editor.addNode(node.type, { props: newNodeProps, styles: newStyles });
    }
};

const handleDelete = () => {
    if (editor.selectedNodeId) {
        const index = editor.createdNodes.findIndex(n => n.id === editor.selectedNodeId);
        if (index !== -1) {
            editor.createdNodes.splice(index, 1);
            editor.selectedNodeId = null;
            editor.currentTarget = null;
        }
    }
};

const handleMore = () => {
    // Deprecated in favor of internal menu logic in ActionComponent
    // But keeping handler empty if needed or remove
};

// --- Z-Order & Lock Logic ---
const moveNodeIndex = (offset: number) => {
    const id = editor.selectedNodeId;
    if (!id) return;
    const index = editor.createdNodes.findIndex(n => n.id === id);
    if (index === -1) return;

    const newIndex = index + offset;
    if (newIndex >= 0 && newIndex < editor.createdNodes.length) {
        const items = editor.createdNodes.splice(index, 1);
        if (items.length > 0) {
            editor.createdNodes.splice(newIndex, 0, items[0]!);
        }
    }
};

const handleBringToFront = () => {
    const id = editor.selectedNodeId;
    if (!id) return;
    const index = editor.createdNodes.findIndex(n => n.id === id);
    if (index !== -1) {
        const items = editor.createdNodes.splice(index, 1);
        if (items.length > 0) {
            editor.createdNodes.push(items[0]!);
        }
    }
};

const handleSendToBack = () => {
    const id = editor.selectedNodeId;
    if (!id) return;
    const index = editor.createdNodes.findIndex(n => n.id === id);
    if (index !== -1) {
        const items = editor.createdNodes.splice(index, 1);
        if (items.length > 0) {
            editor.createdNodes.unshift(items[0]!);
        }
    }
};

const handleBringForward = () => moveNodeIndex(1);
const handleSendBackward = () => moveNodeIndex(-1);

const handleLock = () => {
    if (editor.selectedNode) {
        // Toggle lock state logic here
        // For now, we might just store it in props or separate state
        // If locked, we should probably disable moveable drag
        const isLocked = editor.selectedNode.props?.locked || false;
        editor.updateNodeProps(editor.selectedNode.id, { locked: !isLocked });

        // If locked, clear current target to stop editing/moving?
        // Or finding a way to show it's locked.
        // For this task, just updating the data.
    }
};

const route = useRoute()
const isMobileEditor = computed(() => route.path.startsWith('/editor/m/'))

const updateCanvasScale = () => {
    if (typeof window === 'undefined') return;
    
    // Always use 500px as logical width
    const targetWidth = 500;
    let scale = 1;
    
    if (isMobileEditor.value) {
        // Mobile mode: scale to fit screen width with some padding
        const windowWidth = window.innerWidth;
        if (windowWidth < 520) {
            scale = (windowWidth - 20) / targetWidth;
        }
    }
    
    editor.zoom = scale;
};

onMounted(() => {
    if (paperPage.value) editor.paperPageRef = paperPage.value
    editor.init()
    fetchFonts()
    
    updateCanvasScale();
    window.addEventListener('resize', updateCanvasScale);
})

onUnmounted(() => {
    window.removeEventListener('resize', updateCanvasScale);
})

const paperStyle = computed(() => {
    return {
        background: editor.background,
        height: `${editor.height}px`,
        width: '500px', // Fixed logical width
        transform: `scale(${editor.zoom})`,
        transformOrigin: 'top left'
    }
})

// Add a wrapper style to account for the scaled visual size
const canvasWrapperStyle = computed(() => {
    if (editor.zoom === 1) return {};
    return {
        width: `${500 * editor.zoom}px`,
        height: `${editor.height * editor.zoom}px`,
        margin: '0 auto'
    }
})

// --- Canvas Resize Logic ---
const isResizingCanvas = ref(false);
const resizeStartY = ref(0);
const resizeStartHeight = ref(0);

const startResizeCanvas = (e: MouseEvent) => {
    isResizingCanvas.value = true;
    resizeStartY.value = e.clientY;
    resizeStartHeight.value = editor.height || 1024;
    document.addEventListener('mousemove', onResizeCanvas);
    document.addEventListener('mouseup', stopResizeCanvas);
};

const onResizeCanvas = (e: MouseEvent) => {
    if (!isResizingCanvas.value) return;
    const deltaY = e.clientY - resizeStartY.value;
    editor.height = Math.max(100, resizeStartHeight.value + deltaY);
};

const stopResizeCanvas = () => {
    isResizingCanvas.value = false;
    document.removeEventListener('mousemove', onResizeCanvas);
    document.removeEventListener('mouseup', stopResizeCanvas);
};

const changeCanvasHeight = (amount: number) => {
    editor.height = Math.max(100, (editor.height || 1024) + amount);
};

// --- Multi-Select Logic ---
const onSelect = (e: any) => {
    if (!e.selected || e.selected.length === 0) {
        // Kiểm tra nếu sự kiện click diễn ra trên một node hoặc điều khiển Moveable/Toolbar thì KHÔNG hủy chọn
        const inputTarget = e.inputEvent?.target as HTMLElement | null;
        if (
            inputTarget &&
            (inputTarget.closest('.editable') ||
                inputTarget.closest('.moveable-control') ||
                inputTarget.closest('.moveable-line') ||
                inputTarget.closest('.action-toolbar-container'))
        ) {
            return;
        }

        editor.setSelectedNodeIds([]);
        editor.currentTarget = null;
        return;
    }

    const selectedIds = e.selected.map((el: HTMLElement) => Number(el.getAttribute('data-id'))).filter((id: number) => !isNaN(id));
    editor.setSelectedNodeIds(selectedIds);

    // If only one selected, set currentTarget for single moveable
    if (e.selected.length === 1) {
        editor.currentTarget = e.selected[0];
        const primaryId = selectedIds[0];
        const node = editor.createdNodes.find(n => n.id === primaryId);
        if (node) element.type = node.type;
    } else if (e.selected.length > 1) {
        // For multiple targets, handle in Moveable
        editor.currentTarget = e.selected;
    }
};

const handleNodeMouseDown = (e: MouseEvent, item: any) => {
    if (editor.isPreviewMode) return;

    const el = (e.currentTarget as HTMLElement) || (e.target as HTMLElement).closest('.editable');

    // Nếu đang trong chế độ edit text
    if (editor.isEditing) {
        // Nếu click vào đúng node text đang edit thì cho phép gõ/chọn text bình thường
        if (el && el.getAttribute('contenteditable') === 'true') {
            return;
        }
        // Nếu click sang node khác thì kết thúc edit node cũ
        editor.endEditingText();
    }

    if (el) {
        editor.currentTarget = el as HTMLElement;
        editor.selectedNodeId = item.id;
        editor.selectedNodeIds = [item.id];
        element.type = item.type;
    }
};

const onDragStart = (e: any) => {
    const target = e.inputEvent.target;

    // Nếu nhấn vào Node thì dừng Selecto để nhường cho Moveable kéo thả
    if (
        target.closest(".editable") ||
        target.closest(".moveable-control") ||
        target.closest(".moveable-line")
    ) {
        e.stop();
        return;
    }

    // Nếu nhấn vào nền thì bỏ chọn
    if (target.classList.contains('paper-page')) {
        onSelect({ selected: [] });
    }
}

const handleContainerClick = (e: MouseEvent) => {
    if (editor.isPreviewMode) return;
    const target = e.target as HTMLElement;
    if (
        target.classList.contains('paper-container') ||
        target.classList.contains('canvas-wrapper') ||
        target.classList.contains('canvas-inner-wrapper')
    ) {
        if (editor.isEditing) {
            editor.endEditingText();
        }
        element.type = 'Setup';
        editor.selectedNodeId = null;
        editor.selectedNodeIds = [];
        editor.currentTarget = null;
    }
};
</script>
<template>
    <div class="paper-container" :class="{ 'is-mobile-canvas': isMobileEditor }" @click="handleContainerClick">
        <div class="canvas-wrapper">
            <div class="canvas-inner-wrapper" :style="canvasWrapperStyle">
                <div class="paper-page shadow-lg position-relative" ref="paperPage" 
                    @mousedown="editor.isPreviewMode ? null : editor.selectElement"
                    @dblclick="editor.isPreviewMode ? null : handleDblClick"
                    :style="paperStyle">
                    <BadgeComponent :icon="editor.music?.icon || 'music-circle-outline'"
                        :color="editor.music?.color as string" :path="editor.music?.path || ''" />
                    <component v-for="item in editor.createdNodes" class="editable" :key="item.id"
                        :is="coms[item.type]" v-bind="item.props" :style="{
                            position: 'absolute',
                            ...item.styles
                        }" :data-id="item.id" :data-type="item.type" @blur="handleBlur"
                        @keydown="handleKeyDown"
                        @dblclick.stop="handleNodeDblClick($event, item)"
                        @mousedown="handleNodeMouseDown($event, item)"
                        @click="editor.isPreviewMode ? null : (element.type = item.type)">
                    </component>

                    <!-- Action Toolbar Overlay -->
                    <ActionComponent v-if="editor.selectedNode && !editor.isPreviewMode" :style="actionStyle"
                        :is-locked="editor.selectedNode.props?.locked" @duplicate="handleDuplicate" @delete="handleDelete"
                        @bring-to-front="handleBringToFront" @send-to-back="handleSendToBack"
                        @bring-forward="handleBringForward" @send-backward="handleSendBackward" @lock="handleLock" />

                    <!-- Multi-select Lasso -->
                    <ClientOnly v-if="!editor.isPreviewMode">
                        <VueSelecto ref="selecto" dragContainer=".paper-page" :selectableTargets="['.paper-page .editable']"
                            :hitRate="0" :selectByClick="true" :selectFromInside="false" :toggleContinueSelect="['shift']"
                            :ratio="0" @dragStart="onDragStart" @select="onSelect" />
                    </ClientOnly>
                </div>
            </div>

            <!-- Resize handle at the bottom edge -->
            <div v-if="!editor.isPreviewMode" class="canvas-resize-handle exclude-export" @mousedown.prevent.stop="startResizeCanvas">
                <div class="handle-bar"></div>
            </div>

            <!-- Height controls below -->
            <div v-if="!editor.isPreviewMode" class="canvas-height-control exclude-export">
                <button class="control-btn" @click="changeCanvasHeight(-10)">
                    <BaseIconComponent type="ic" name="baseline-minus" :size="18" />
                </button>
                <div class="control-input">
                    <input type="number" v-model.number.lazy="editor.height"
                        @keyup.enter="($event.target as HTMLInputElement)?.blur()" />
                    <span>px</span>
                </div>
                <button class="control-btn" @click="changeCanvasHeight(10)">
                    <BaseIconComponent type="material-symbols" name="add-2-rounded" :size="18" />
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.canvas-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.canvas-resize-handle {
    width: 100%;
    height: 20px;
    cursor: ns-resize;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: -10px;
    position: relative;
    z-index: 50;
}

.handle-bar {
    width: 60px;
    height: 6px;
    background-color: #e4e4e7;
    border-radius: 4px;
    margin-top: 7px;
    transition: background-color 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.canvas-resize-handle:hover .handle-bar {
    background-color: #a1a1aa;
}

.canvas-height-control {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20px;
    padding: 6px 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    margin-top: 15px;
    gap: 12px;
}

.control-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #f4f4f5;
    color: #3f3f46;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.2s;
    padding: 0;
}

.control-btn:hover {
    background: #e4e4e7;
}

.control-input {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #52525b;
}

.control-input input {
    width: 45px;
    border: none;
    outline: none;
    text-align: center;
    font-size: 14px;
    color: #18181b;
    background: transparent;
    -moz-appearance: textfield;
    appearance: textfield;
}

.control-input input::-webkit-outer-spin-button,
.control-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

.paper-container {
    position: relative;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px;
}

.paper-container.is-mobile-canvas {
    padding: 20px 10px;
}

.paper-page {
    width: 500px;
    height: 1024px;
    border-radius: 4px;
}

:deep(.selecto-selection) {
    background: rgba(66, 133, 244, 0.1) !important;
    border: 1px solid #4285f4 !important;
    z-index: 10000;
}
</style>