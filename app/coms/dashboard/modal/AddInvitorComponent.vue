<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import ModalZoomCenterComponent from '~/coms/modal/ModalZoomCenterComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

interface InvitationType {
    id: number | string
    content: string
    key: string
    slug?: string
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['update:modelValue', 'add'])

const isOpen = ref(props.modelValue)
const invitationTypesList = ref<InvitationType[] | null>(null)
const invitationType = ref('Thân mời')
const guestName = ref('')
const customInvitation = ref('')
const customValue = ref('')

const isCustomInvitation = computed(() => {
    if (!invitationTypesList.value) return false;
    const selected = invitationTypesList.value.find(item => item.content === invitationType.value);
    return selected?.slug === 'tuy-chinh';
})

const previewContent = computed(() => {
    if (!isCustomInvitation.value) {
        return `${invitationType.value} ${guestName.value}`.trim();
    }

    if (!customInvitation.value && !customValue.value) return '';
    if (!customInvitation.value) return customValue.value;

    const parts = customInvitation.value.split('...');
    if (parts.length === 1) {
        return `${customInvitation.value} ${customValue.value}`.trim();
    }

    const values = customValue.value ? customValue.value.split(',').map(v => v.trim()) : [];

    let result = '';
    for (let i = 0; i < parts.length; i++) {
        result += parts[i];
        if (i < parts.length - 1) {
            result += (values[i] !== undefined && values[i] !== '') ? values[i] : '...';
        }
    }
    return result;
})

const fetchInvitationTypes = async () => {
    try {
        const res: any = await $fetch('/api/v1/client/news/by-key', {
            query: { key: 'type_invitator_content' }
        })
        if (res.success && Array.isArray(res.data) && res.data.length > 0) invitationTypesList.value = [...res.data]
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    fetchInvitationTypes()
})

watch(() => props.modelValue, (val) => {
    isOpen.value = val
})

watch(isOpen, (val) => {
    emits('update:modelValue', val)
    if (!val) {
        setTimeout(() => {
            invitationType.value = 'Thân mời'
            guestName.value = ''
            customInvitation.value = ''
            customValue.value = ''
        }, 300)
    }
})

const { $toast } = useNuxtApp();
const isLoading = ref(false)

const route = useRoute();

const handleAdd = async () => {
    const payloadStr: any = {
        invitation: '',
        value: '',
        isCustom: false,
        slug: route.params.slug
    };

    if (isCustomInvitation.value) {
        const trimmedCustomInvitation = customInvitation.value.trim()
        const trimmedCustomValue = customValue.value.trim()
        if (!trimmedCustomInvitation || !trimmedCustomValue) return;
        payloadStr.invitation = trimmedCustomInvitation;
        payloadStr.value = trimmedCustomValue;
        payloadStr.isCustom = true;
    } else {
        const trimmedName = guestName.value.trim()
        if (!trimmedName) return;
        payloadStr.invitation = invitationType.value;
        payloadStr.value = trimmedName;
        // isCustom stays false
    }

    try {
        isLoading.value = true;
        const res: any = await $fetch('/api/v1/client/invitors', {
            method: 'POST',
            body: payloadStr
        })

        if (res.success) {
            emits('add', {
                type: payloadStr.invitation,
                name: payloadStr.value,
                data: res.data
            })
            isOpen.value = false;
        } else {
            console.log('else');
        }
    } catch (e: any) {
        console.error(e)
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <ModalZoomCenterComponent v-model="isOpen">
            <div class="add-invitor-modal-container">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="fw-bold mb-0 text-dark">Thêm khách mời</h5>
                    <button class="btn-close-modal" @click="isOpen = false">
                        <BaseIconComponent name="close" type="mdi" :size="24" class="text-secondary" />
                    </button>
                </div>

                <!-- Field 1: Lời mời -->
                <div class="mb-4">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Lời mời</div>
                    <div class="custom-select-container">
                        <select class="custom-select" v-model="invitationType">
                            <option v-for="item in invitationTypesList" :key="item.id" :value="item.content">{{
                                item.content }}</option>
                        </select>
                        <BaseIconComponent class="select-icon" name="chevron-down" type="mdi" :size="20"
                            color="#6b7280" />
                    </div>
                </div>

                <!-- Field 2: Tên khách mời -->
                <div class="mb-4" v-if="!isCustomInvitation">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Tên khách mời</div>
                    <div class="custom-input-group">
                        <span class="prefix-icon">
                            <BaseIconComponent name="account-outline" type="mdi" :size="20" color="#374151" />
                        </span>
                        <input type="text" class="custom-input" placeholder="VD: Anh Nguyễn Văn A và gia đình"
                            v-model="guestName" />
                    </div>
                </div>

                <!-- Lời mời tùy chỉnh -->
                <div class="mb-4" v-if="isCustomInvitation">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Lời mời tùy chỉnh</div>
                    <div class="custom-input-group">
                        <span class="prefix-icon">
                            <BaseIconComponent name="pencil-outline" type="mdi" :size="20" color="#374151" />
                        </span>
                        <input type="text" class="custom-input"
                            placeholder="VD: Kính mời ... tham dự đám cưới của ... vào ngày ..."
                            v-model="customInvitation" />
                    </div>
                </div>

                <!-- Giá trị -->
                <div class="mb-4" v-if="isCustomInvitation">
                    <div class="label-text mb-2"><span class="text-danger">*</span> Giá trị</div>
                    <div class="custom-input-group">
                        <span class="prefix-icon">
                            <BaseIconComponent name="account-outline" type="mdi" :size="20" color="#374151" />
                        </span>
                        <input type="text" class="custom-input" placeholder="VD: Anh Nguyễn Văn A,Nguyễn Văn B,21/2"
                            v-model="customValue" />
                    </div>
                </div>

                <!-- Field 3: Xem trước -->
                <div class="preview-box mb-4">
                    <div class="preview-label">Xem trước:</div>
                    <div class="preview-content">
                        {{ previewContent }}
                    </div>
                </div>

                <!-- Footer -->
                <div class="d-flex justify-content-end mt-4 pt-2">
                    <button class="btn-add d-flex align-items-center gap-2" @click="handleAdd" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        Thêm khách
                    </button>
                </div>
            </div>
        </ModalZoomCenterComponent>
    </Teleport>
</template>

<style scoped>
.add-invitor-modal-container {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 480px;
    max-width: 95vw;
}

.btn-close-modal {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.label-text {
    color: #4b5563;
    font-weight: 500;
    font-size: 15px;
}

.text-danger {
    color: #ef4444;
}

.custom-select-container {
    position: relative;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    height: 40px;
    background: #fff;
    transition: border-color 0.2s;
}

.custom-select-container:focus-within {
    border-color: #3b82f6;
}

.custom-select {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 36px 0 12px;
    font-size: 15px;
    appearance: none;
    background: transparent;
    color: #374151;
    cursor: pointer;
}

.select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.custom-input-group {
    display: flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    height: 40px;
    background: #fff;
    overflow: hidden;
    transition: border-color 0.2s;
}

.custom-input-group:focus-within {
    border-color: #3b82f6;
}

.prefix-icon {
    padding: 0 8px 0 12px;
    display: flex;
    align-items: center;
}

.custom-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0 12px 0 0;
    font-size: 15px;
    height: 100%;
    background: transparent;
    color: #374151;
}

.custom-input::placeholder {
    color: #9ca3af;
}

.btn-add {
    background-color: #3b82f6;
    border: 1px solid #3b82f6;
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
    min-width: 100px;
}

.btn-add:hover {
    background-color: #2563eb;
}

.preview-box {
    background-color: #f0f8ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    padding: 12px 16px;
}

.preview-label {
    color: #9ca3af;
    font-size: 14px;
    margin-bottom: 4px;
}

.preview-content {
    color: #1f2937;
    font-size: 15px;
    font-weight: 500;
}
</style>