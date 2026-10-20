<script setup lang="ts">
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useUserStore } from '~~/stores/user';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
})

watch(() => userStore.openModal, (val) => {
    if (val && isOpen.value) {
        isOpen.value = false;
    }
})

const items = [
    {
        id: 1,
        title: 'Thiết kế trống',
        desc: 'Bắt đầu với một canvas trắng',
        action: 'Tùy chỉnh',
        icon: {
            name: 'pen-new-square-linear',
            type: 'solar' as const
        },
        bg: '#eff6ff', // Light blue bg for icon container
        color: '#3b82f6',
        path: '/editor/new-blank'
    },
    {
        id: 2,
        title: 'Mẫu có sẵn',
        desc: 'Bắt đầu với các mẫu có sẵn của chúng mình',
        action: 'Tùy chỉnh',
        icon: {
            name: 'gallery-wide-linear',
            type: 'solar' as const
        },
        bg: '#ecfdf5', // Light green/teal
        color: '#10b981',
        path: '/templates'
    },
    {
        id: 3,
        title: 'Web hay ho',
        desc: 'Hãy thử 1 vài trang web đặc biệt khác nhé',
        action: 'Tùy chỉnh',
        icon: {
            name: 'heart-linear',
            type: 'solar' as const
        },
        bg: '#fdf2f8', // Light pink
        color: '#ec4899',
        path: '/custom-websites'
    }
]

const handleSelect = async (item: typeof items[0]) => {
    let targetPath = item.path;
    if (item.id === 1 && import.meta.client && window.innerWidth < 768) {
        targetPath = '/editor/m/new-blank';
    }

    if (targetPath.startsWith('/editor') || targetPath.startsWith('/dashboard')) {
        await userStore.checkLogin();
        if (!userStore.isLogin) {
            isOpen.value = false;
            userStore.openModal = true;
            return;
        }
    }

    isOpen.value = false;
    navigateTo(targetPath, {
        external: true,
        open: {
            target: '_blank',
        },
    });
};
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="new-design-container">
                <!-- Header -->
                <div class="d-flex flex-jb-ac mb-4">
                    <div>
                        <h3 class="fw-bold mb-1">Tạo thiết kế mới</h3>
                        <p class="text-secondary m-0" style="font-size: 14px;">Chọn loại thiết kế bạn muốn tạo</p>
                    </div>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close-circle-outline" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Body -->
                <div class="row g-3 mb-4">
                    <div v-for="item in items" :key="item.id" class="col-md-4">
                        <div class="design-card h-100 d-flex flex-column" @click="handleSelect(item)">
                            <div class="card-icon" :style="{ backgroundColor: item.bg }">
                                <BaseIconComponent :name="item.icon.name" :type="item.icon.type" :size="32"
                                    :color="item.color" />
                            </div>
                            <div class="card-content d-flex flex-column flex-grow-1">
                                <h5 class="fw-bold mb-2">{{ item.title }}</h5>
                                <p class="text-secondary mb-3 flex-grow-1" style="font-size: 13px; line-height: 1.5;">{{
                                    item.desc }}</p>
                                <div class="action-text">{{ item.action }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer-note p-3 text-center">
                    <span class="text-secondary" style="font-size: 13px;">Các loại thiết kế khác sẽ được cập nhật trong
                        tương lai</span>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.new-design-container {
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    width: 900px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
}

.btn-close-modal:hover {
    opacity: 0.7;
}

.design-card {
    border: 1px solid #eee;
    padding: 24px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #fff;
}

.design-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.card-icon {
    width: 100%;
    height: 120px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    transition: all 0.2s ease;
}

.action-text {
    font-size: 13px;
    color: #3b82f6;
    font-weight: 600;
}

.footer-note {
    border: 1px dashed #ddd;
    border-radius: 8px;
    background-color: #fafafa;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
    .new-design-container {
        padding: 20px 15px;
    }

    .design-card {
        padding: 12px;
        flex-direction: row !important;
        align-items: center;
        gap: 15px;
        text-align: left;
    }

    .card-icon {
        width: 60px !important;
        height: 60px !important;
        flex-shrink: 0;
        margin-bottom: 0;
    }

    .card-icon :deep(svg) {
        width: 24px !important;
        height: 24px !important;
    }

    .card-content {
        flex: 1;
        min-width: 0;
    }

    h5 {
        font-size: 15px !important;
        margin-bottom: 2px !important;
    }

    p {
        font-size: 12px !important;
        margin-bottom: 0 !important;
        display: -webkit-box;
        line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .action-text {
        display: none;
        /* Hide on small mobile to save vertical space */
    }

    .footer-note {
        padding: 10px !important;
    }

    .footer-note span {
        font-size: 11px !important;
    }
}
</style>