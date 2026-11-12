<script setup lang="ts">
import InvitationImageScrollBoxCompomnent from '../invitation/InvitationImageScrollBoxCompomnent.vue';
import { useUserStore } from '~~/stores/user';

const userStore = useUserStore();
const activePkgFilter = ref<string>('all');

onMounted(async () => {
    if (userStore.isLogin) {
        await userStore.fetchPlan();
    }
});

const { data: response } = useFetch('/api/v1/client/card-template', {
    query: {
        is_public: true,
        is_template: true,
        limit: 50
    }
});

const templates = computed(() => {
    const list = (response.value as any)?.data?.data || [];
    const mapped = list.map((item: any) => ({
        ...item,
        id: item.id,
        type: item.package?.name?.toLowerCase() || 'free',
        image: `/images/wcards/IMAGE_WEDDING_CARD_${item.id}.png`,
        name: item.name
    }));
    if (activePkgFilter.value === 'all') return mapped;
    return mapped.filter((t: any) => t.type === activePkgFilter.value);
});
</script>
<template>
    <div class="h-100 p-2 d-flex flex-column text-wrap">
        <div class="p-1">
            <h6 class="fw-bold text-dark mb-1">Chọn mẫu thiết kế</h6>
            <p class="text-justify small text-muted mb-2">
                Chọn một mẫu thiết kế có sẵn phù hợp với gói của bạn ({{ userStore.packageName || 'Free' }})
            </p>
            <div class="d-flex flex-wrap gap-1 mb-2">
                <button v-for="pkg in [
                    { key: 'all', label: 'Tất cả' },
                    { key: 'free', label: 'Free' },
                    { key: 'basic', label: 'Basic' },
                    { key: 'premium', label: 'Premium' }
                ]" :key="pkg.key"
                    class="btn btn-sm rounded-pill px-2 py-1"
                    style="font-size: 11px;"
                    :class="activePkgFilter === pkg.key ? 'btn-primary fw-bold' : 'btn-light border text-secondary'"
                    @click="activePkgFilter = pkg.key">
                    {{ pkg.label }}
                </button>
            </div>
        </div>

        <div class="flex-grow-1 overflow-auto" style="overflow-x: hidden;">
            <div class="row g-2 m-0 w-100">
                <div v-for="template in templates" :key="template.id" class="col-6">
                    <InvitationImageScrollBoxCompomnent :fit-width="false" :type="template.type" :image="template.image"
                        :height="220" :card="template" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Optional: Customize scrollbar if needed */
</style>
