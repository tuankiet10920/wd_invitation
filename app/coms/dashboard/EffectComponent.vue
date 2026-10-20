<script setup lang="ts">
import ButtonCustomCompomnent from '../button/ButtonCustomCompomnent.vue';
import TabAnimationComponent from './effects/TabAnimationComponent.vue';
import TabOpeningComponent from './effects/TabOpeningComponent.vue';
import TabFallComponent from './effects/TabFallComponent.vue';

const activeTab = ref<number | null>(null); 
const effectTypes = ref<any[]>([]);
const allEffects = ref<any[]>([]);
const isLoading = ref(false);

const fetchEffects = async () => {
    isLoading.value = true;
    try {
        const res: any = await $fetch('/api/v1/client/effects');
        if (res && res.data) {
            effectTypes.value = res.data.types || [];
            allEffects.value = res.data.effects || [];
            if (effectTypes.value.length > 0) {
                const defaultType = effectTypes.value.find((t: any) => t.slug === 'dynamic') || effectTypes.value[0];
                activeTab.value = defaultType.id;
            }
        }
    } catch (error) {
        console.error("Failed to fetch effects from backend", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchEffects();
});

const currentEffects = computed(() => {
    if (!activeTab.value) return [];
    return allEffects.value.filter(e => e.id_type_effect === activeTab.value);
});

const activeTabObj = computed(() => {
    return effectTypes.value.find(t => t.id === activeTab.value) || null;
});

</script>

<template>
    <div class="h-100 d-flex flex-column">
        <!-- Tabs -->
        <div class="p-3 pb-0">
            <div class="d-flex flex-wrap gap-2 mb-3">
                <ButtonCustomCompomnent class="btn-tab flex-grow-1"
                    v-for="tab in effectTypes" :key="tab.id"
                    :background="activeTab === tab.id ? '#3b82f6' : '#f3f4f6'"
                    :class="{ 'text-white': activeTab === tab.id, 'text-dark': activeTab !== tab.id }"
                    @click="activeTab = tab.id">
                    {{ tab.name }}
                </ButtonCustomCompomnent>
            </div>
        </div>

        <!-- Content -->
        <div class="flex-grow-1 overflow-auto p-3 pt-0">
            <div v-if="isLoading" class="d-flex justify-content-center py-5">
                 <div class="spinner-border text-primary" role="status"></div>
            </div>
            <template v-else-if="activeTabObj">
                <TabAnimationComponent v-if="activeTabObj.slug === 'dynamic'" :effects="currentEffects" />
                <TabOpeningComponent v-else-if="activeTabObj.slug === 'opening'" :effects="currentEffects" />
                <TabFallComponent v-else-if="activeTabObj.slug === 'falling'" :effects="currentEffects" />
                <div v-else class="text-center text-muted py-3">Loại hiệu ứng không được hỗ trợ</div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.btn-tab {
    font-size: 13px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    transition: all 0.2s;
}
</style>