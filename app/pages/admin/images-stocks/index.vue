<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({ layout: 'admin' })

const logs = ref<{ message: string; success: boolean; id: string; time: string }[]>([])
const isLoading = ref(false)
const isSyncing = ref(false)
const progress = ref({ total: 0, current: 0 })

const fetchAndSync = async () => {
    isLoading.value = true
    logs.value = []
    
    try {
        // 1. Fetch Danh sách hình ảnh từ External API
        logs.value.push({ message: "Fetching list from cinelove.me...", success: true, id: 'sys', time: new Date().toLocaleTimeString() })
        const res: any = await $fetch('/api/v1/admin/images-stocks/list')
        
        if (!res.success || !res.data?.items) {
            logs.value.push({ message: "Failed to fetch list. Is the source API working?", success: false, id: 'sys', time: new Date().toLocaleTimeString() })
            return
        }

        const items = res.data.items
        logs.value.push({ message: `Found ${items.length} items to sync!`, success: true, id: 'sys', time: new Date().toLocaleTimeString() })
        
        // Cập nhật State
        progress.value.total = items.length
        progress.value.current = 0
        isSyncing.value = true

        // 2. Tải lần lượt từng hình ảnh và thumbnail
        for (const item of items) {
            progress.value.current++
            
            try {
                const dlRes: any = await $fetch('/api/v1/admin/images-stocks/download', {
                    method: 'POST',
                    body: {
                        id: item.id,
                        fileKey: item.fileKey
                    }
                })

                if (dlRes.success) {
                    logs.value.unshift({ message: `Đã tải thành công ảnh ID: ${item.id}`, success: true, id: item.id, time: new Date().toLocaleTimeString() })
                } else {
                    logs.value.unshift({ message: `Lỗi tải ảnh ID ${item.id}: ${dlRes.message}`, success: false, id: item.id, time: new Date().toLocaleTimeString() })
                }
            } catch (err: any) {
                logs.value.unshift({ message: `Lỗi kết nối khi tải ảnh ID ${item.id}: ${err.message}`, success: false, id: item.id, time: new Date().toLocaleTimeString() })
            }
        }

        logs.value.unshift({ message: "Hoàn tất bộ đồng bộ hình ảnh!", success: true, id: 'sys', time: new Date().toLocaleTimeString() })
    } catch (error: any) {
        logs.value.push({ message: "Lỗi hệ thống: " + error.message, success: false, id: 'sys', time: new Date().toLocaleTimeString() })
    } finally {
        isLoading.value = false
        isSyncing.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Chạy đồng bộ Backgrounds</h5>
        </div>

        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-4 text-center">
                <div class="mb-4">
                    <p class="text-muted">
                        Chức năng này sẽ quét toàn bộ danh sách background từ API gốc.<br/>
                        Quá trình tải về ảnh tĩnh (list) và hình ảnh xem trước (thumbnails) sẽ được thực thi tuần tự tốn vài phút. Hãy bấm bắt đầu để tiến hành.
                    </p>
                </div>
                
                <button 
                    class="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" 
                    @click="fetchAndSync" 
                    :disabled="isLoading || isSyncing">
                    <BaseIconComponent name="cloud-sync" :size="20" color="white" />
                    <span>{{ isSyncing ? 'Đang đồng bộ...' : 'Bắt đầu đồng bộ' }}</span>
                </button>
            </div>
        </div>

        <!-- Bảng Progress / Log -->
        <div class="card border-0 shadow-sm rounded-3" v-if="progress.total > 0 || logs.length > 0">
            <div class="card-header bg-white border-0 p-4 pb-0">
                <h6 class="fw-bold text-dark mb-1">Tiến trình đồng bộ</h6>
                <div class="progress mt-3" style="height: 10px;" v-if="progress.total > 0">
                    <div 
                        class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        :style="`width: ${(progress.current / progress.total) * 100}%`">
                    </div>
                </div>
                <div class="text-muted mt-2 small" v-if="progress.total > 0">
                    Đã tải: {{ progress.current }} / {{ progress.total }} bộ.
                </div>
            </div>

            <div class="card-body p-4">
                <div class="log-container rounded bg-light p-3 mt-2 border">
                    <div 
                        v-for="(log, idx) in logs" 
                        :key="idx" 
                        :class="['log-line mb-1', log.success ? 'text-success' : 'text-danger']">
                        <span class="fw-bold me-2">{{ log.time }}</span>
                        <span>{{ log.message }}</span>
                    </div>
                    <div v-if="logs.length === 0" class="text-muted text-center py-3">
                        Hệ thống sẵn sàng xuất log...
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-primary { background-color: #7B61FF; border-color: #7B61FF; }
.btn-primary:hover { background-color: #6c52ed; border-color: #6c52ed; }
.btn:disabled { opacity: 0.7; cursor: not-allowed; }
.log-container {
    max-height: 400px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 0.85rem;
    color: #333;
}
.log-line {
    padding: 2px 0;
    border-bottom: 1px dashed #e2e8f0;
}
.log-line:last-child {
    border-bottom: none;
}
</style>