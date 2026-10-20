<script setup lang="ts">
import InvitationImageScrollBoxCompomnent from '../invitation/InvitationImageScrollBoxCompomnent.vue';

const { data: response } = useFetch('/api/v1/client/card-template', {
    query: {
        is_public: true,
        is_template: true,
        limit: 50
    }
});

const templates = computed(() => {
    const list = (response.value as any)?.data?.data || [];
    return list.map((item: any) => ({
        ...item,
        id: item.id,
        type: item.package?.name?.toLowerCase() || 'free',
        image: `/images/wcards/IMAGE_WEDDING_CARD_${item.id}.png`,
        name: item.name
    }));
});
</script>
<template>
    <div class="h-100 p-2 d-flex flex-column text-wrap">
        <div class="p-1">
            <h6 class="fw-bold text-dark mb-2">Chọn mẫu thiết kế</h6>
            <p class="text-justify small">
                Chọn một mẫu thiết kế có sẵn để bắt đầu nhanh chóng
            </p>
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