<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '~~/stores/editor';
import BoxToolComponent from '../BoxToolComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import AddAccountBankComponent from '~/coms/dashboard/modal/AddAccountBankComponent.vue';
import { ref, onMounted, watch } from 'vue';

const editor = useEditorStore();
const qrBanks = ref<any[]>([]);
const isShowAddAccount = ref(false);

const fetchQrBoxes = async () => {
    if (!editor.currentCardId || typeof editor.currentCardId === 'string') return;
    try {
        const res: any = await $fetch('/api/v1/client/qr-boxes', {
            query: { id_wedding_card: editor.currentCardId }
        });
        if (res.success) {
            qrBanks.value = res.data;
        }
    } catch (e) {
        console.error('Failed to fetch QR boxes', e);
    }
};

onMounted(() => {
    fetchQrBoxes();
});

watch(() => editor.currentCardId, () => {
    fetchQrBoxes();
});

const handleAddAccount = (data: any) => {
    qrBanks.value.push(data);
};

const removeBank = async (id: number, index: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    try {
        // We'll need a DELETE API, but for now let's just update UI or I should create it
        const res: any = await $fetch(`/api/v1/client/qr-boxes/${id}`, {
            method: 'DELETE'
        });
        if (res.success) {
            qrBanks.value.splice(index, 1);
        }
    } catch (e) {
        console.error(e);
        alert('Xóa thất bại');
    }
}

const useProp = (prop: string, defaultValue: any = '') => computed({
    get: () => {
        if (editor.selectedNode && editor.selectedNode.props) {
            return editor.selectedNode.props[prop] ?? defaultValue;
        }
        return defaultValue;
    },
    set: (val) => {
        if (editor.selectedNode) {
            if (!editor.selectedNode.props) editor.selectedNode.props = {};
            editor.selectedNode.props[prop] = val;
        }
    }
});

const title = useProp('title', 'Hộp Quà Yêu Thương');


</script>
<template>
    <BoxToolComponent>
        <template #header>
            <div class="fw-bold fs-14 d-flex align-items-center gap-2 text-dark">
                <BaseIconComponent name="chevron-down" type="mdi" :size="20" />
                <span>Thông tin mã QR</span>
            </div>
        </template>
        <template #body>
            <div class="p-3 d-flex flex-column gap-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-1">
                        <span class="fw-bold text-dark" style="font-size: 14.5px;">QR Bank</span>
                        <BaseIconComponent name="crown-outline" type="mdi" :size="16" color="#3b82f6" />
                    </div>
                    <!-- ADD ACCOUNT BANK -->
                    <button class="btn btn-sm text-white d-flex align-items-center gap-1 py-1 px-3 border-0"
                        style="font-size: 13.5px; background-color: #3b82f6; border-radius: 6px;"
                        @click="isShowAddAccount = true" :disabled="qrBanks.length >= 2">
                        <BaseIconComponent name="plus-circle-outline" type="mdi" :size="14" color="#fff" />
                        <span>Thêm tài khoản</span>
                    </button>
                </div>

                <p class="text-secondary mb-1" style="font-size: 13.5px; line-height: 1.5;">
                    Thêm thông tin tài khoản ngân hàng để khách mời có thể chuyển tiền mừng (tối đa 2 tài khoản)
                </p>

                <div v-if="!qrBanks || qrBanks.length === 0" class="border rounded p-3 text-center text-muted"
                    style="border-style: dashed !important; border-color: #cbd5e1 !important;">
                    <span style="font-size: 14px;">Chưa có thông tin tài khoản</span>
                </div>

                <div v-else class="d-flex flex-column gap-2">
                    <div v-for="(bank, index) in qrBanks" :key="index" class="border rounded p-2 d-flex align-items-center justify-content-between position-relative pe-4 bg-light">
                        <div class="d-flex flex-column gap-1">
                            <span class="fw-bold text-dark" style="font-size: 13.5px;">{{ bank.name }} - {{ bank.name_bank }}</span>
                            <span class="text-secondary" style="font-size: 12.5px;">{{ bank.number_bank }} - {{ bank.name_reveive }}</span>
                        </div>
                        <img v-if="bank.image" :src="`/images/qr_codes/${bank.image}`" width="40" height="40" class="object-fit-cover rounded border" />
                        <button class="btn btn-sm text-danger border-0 p-0 position-absolute" style="top: 8px; right: 8px;" @click="removeBank(bank.id, index)">
                            <BaseIconComponent name="close-circle-outline" type="mdi" :size="16" />
                        </button>
                    </div>
                </div>

                <div class="mt-2">
                    <label class="form-label fw-medium mb-2 text-dark" style="font-size: 14px;">Tiêu đề khi hiển
                        thị</label>
                    <input type="text" class="form-control border py-2 text-dark" v-model="title"
                        placeholder="Hộp Quà Yêu Thương">
                </div>
            </div>
            
            <AddAccountBankComponent v-model="isShowAddAccount" @add="handleAddAccount" />
        </template>
    </BoxToolComponent>
</template>
<style scoped>
.fs-14 {
    font-size: 14.5px;
}

.form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
    border-color: #3b82f6;
}
</style>
