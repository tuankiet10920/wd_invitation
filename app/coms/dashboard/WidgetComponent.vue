<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import type { IconType } from "~~/interfaces"
import { useEditorStore } from "~~/stores/editor";

const editor = useEditorStore();

interface Widget {
    id_min_package: number
    key: string
    title: string
    icon: string
    color: string
    isPremium: boolean
    type: IconType
}

const widgets = ref<Widget[]>([]);
const myPlanData = ref<any>(null);

const fetchData = async () => {
    try {
        const [planRes, widgetsRes] = await Promise.all([
            $fetch<any>('/api/v1/client/my-plan', { credentials: 'include' }),
            $fetch<any>('/api/v1/client/widgets', { credentials: 'include' })
        ]);

        if (planRes?.success) {
            myPlanData.value = planRes.data;
        }

        const currentPackageId = myPlanData.value?.id || 1;

        if (widgetsRes?.success && widgetsRes.data) {
            widgets.value = widgetsRes.data.map((w: any) => {
                const isPrem = editor.role !== 'admin' && w.id_min_package > currentPackageId;
                return {
                    id_min_package: w.id_min_package,
                    key: w.key,
                    title: w.name,
                    icon: w.icon || 'star',
                    color: w.color || '#95a5a6',
                    isPremium: isPrem,
                    type: w.icon_type as IconType || 'mdi'
                };
            });
        }
    } catch (e) {
        console.error("Failed to load widgets data", e);
    }
};

onMounted(() => {
    fetchData();
});

const handleWidgetClick = (widget: Widget) => {
    const currentPackageId = myPlanData.value?.id || 1;
    if (editor.role !== 'admin' && widget.id_min_package > currentPackageId) {
        editor.showNotification("Gói hiện tại của bạn không hỗ trợ tính năng này. Vui lòng nâng cấp gói để sử dụng.", "warning");
        return;
    }

    switch (widget.key) {
        case 'Calendar':
            editor.addNode('Calendar', {
                styles: { width: '350px', height: '350px', zIndex: 10 }
            });
            break;
        case 'Call':
            editor.addNode('CallNow', {
                styles: { zIndex: 10 },
                props: { text: 'Gọi ngay', backgroundColor: '#ff4757', textColor: '#ffffff', icon: 'phone-outline' }
            });
            break;
        case 'Countdown':
            editor.addNode('CountDown', {
                styles: { zIndex: 10 },
                props: { backgroundColor: '#000000', textColor: '#ffffff' }
            });
            break;
        case 'Map':
            editor.addNode('Map', {
                styles: { width: '300px', height: '250px', zIndex: 10 },
                props: {}
            });
            break;
        case 'Attend':
            editor.addNode('AcceptInvitation', {
                styles: { width: '400px', height: '420px', zIndex: 10 }
            });
            break;
        case 'GuestName':
            editor.addNode('GuestName', {
                styles: { zIndex: 10, fontSize: '24px', fontWeight: 'bold' }
            });
            break;
        case 'QrBox':
            editor.addNode('QrBox', {
                styles: { zIndex: 10 }
            });
            break;
        case 'Youtube':
            editor.addNode('Youtube', {
                styles: { width: '320px', height: '180px', zIndex: 10 }
            });
            break;
        case 'PhotoAlbum':
            editor.addNode('PhotoAlbum', {
                styles: { width: '320px', height: '310px', zIndex: 10 }
            });
            break;
        case 'Envelope':
            editor.addNode('Envelope', {
                styles: { width: '320px', height: '220px', zIndex: 10 }
            });
            break;
        default:
            editor.addNode(widget.key, {
                styles: { zIndex: 10 }
            });
            break;
    }
}
</script>

<template>
    <div class="h-100 p-3 overflow-auto">
        <div class="row g-2">
            <div v-for="(widget, index) in widgets" :key="index" class="col-6">
                <div class="widget-item d-flex flex-column align-items-center justify-content-center text-center p-3"
                    @click="handleWidgetClick(widget)">
                    <div class="widget-icon mb-2">
                        <BaseIconComponent :name="widget.icon" :type="widget.type" :size="32" :color="widget.color" />
                    </div>
                    <span class="widget-title">{{ widget.title }}</span>

                    <!-- PREMIUM BADGE -->
                    <div v-if="widget.isPremium" class="premium-badge">
                        <BaseIconComponent name="crown-rounded" :size="12" color="#fff" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.widget-item {
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    height: auto;
    min-height: 110px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.widget-item:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
}

.widget-title {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.4;
    font-weight: 500;
    white-space: normal;
    overflow-wrap: break-word;
    max-width: 100%;
}

.premium-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: #4f46e5;
    /* Indigo color for premium */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>