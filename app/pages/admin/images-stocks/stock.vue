<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({ layout: 'admin' })

const logs = ref<{ message: string; success: boolean; id: string; time: string }[]>([])
const isLoading = ref(false)
const isSyncing = ref(false)
const progress = ref({ total: 0, current: 0 })
const categoryProgress = ref({ name: '', total: 0, current: 0 })

const addLog = (msg: string, success: boolean, id: string = 'sys') => {
    logs.value.unshift({ message: msg, success, id, time: new Date().toLocaleTimeString() })
}

const fetchAndSync = async () => {
    isLoading.value = true
    logs.value = []
    
    try {
        addLog("Fetching Categories list...", true)
        const resCat: any = await $fetch('/api/v1/admin/images-stocks/stock-categories')
        
        if (!resCat.success || !resCat.categories) {
            addLog("Failed to fetch Categories list.", false)
            return
        }

        const categories = resCat.categories
        addLog(`Found ${categories.length} Categories!`, true)
        
        isSyncing.value = true
        progress.value.total = categories.length
        progress.value.current = 0

        for (const cat of categories) {
            progress.value.current++
            addLog(`Đang xử lý thư mục: ${cat.name} (${cat.slug})`, true, cat.id)
            categoryProgress.value.name = cat.name
            
            try {
                // Fetch items in category
                const catItemsRes: any = await $fetch(`/api/v1/admin/images-stocks/stock-category-items?id=${cat.id}`)
                if (!catItemsRes.success || !catItemsRes.items) {
                    addLog(`Không có hình ảnh trong thư mục ${cat.name}`, false, cat.id)
                    continue;
                }

                const items = catItemsRes.items
                categoryProgress.value.total = items.length
                categoryProgress.value.current = 0

                let index = 1;
                for (const item of items) {
                    categoryProgress.value.current = index
                    
                    try {
                        const dlRes: any = await $fetch('/api/v1/admin/images-stocks/stock-download', {
                            method: 'POST',
                            body: {
                                id: item.id,
                                fileKey: item.fileKey,
                                categorySlug: cat.slug,
                                categoryType: cat.type,
                                index: index
                            }
                        })

                        if (dlRes.success) {
                            addLog(`Đã tải: ${cat.slug}${index} (${item.id})`, true, item.id)
                        } else {
                            addLog(`Lỗi tải file: ${dlRes.message}`, false, item.id)
                        }
                    } catch (dlErr: any) {
                        addLog(`Lỗi xử lý file vòng lặp: ${dlErr.message}`, false, item.id)
                    }

                    index++
                }

            } catch (catErr: any) {
                addLog(`Lỗi danh mục ${cat.name}: ${catErr.message}`, false, cat.id)
            }
        }

        addLog("Hoàn tất bộ đồng bộ toàn bộ thư mục Image Stocks!", true)
        addLog("==== MỤC DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT VÀO JSON, HÃY CHẠY DB:SEED ====", true)
    } catch (error: any) {
        addLog("Lỗi hệ thống: " + error.message, false)
    } finally {
        isLoading.value = false
        isSyncing.value = false
    }
}
</script>

<template>
    <div class="container-fluid p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold text-dark fs-4 mb-0">Đồng bộ Nhân Vật & Stock (Mở Rộng)</h5>
        </div>

        <div class="card border-0 shadow-sm rounded-3 mb-4">
            <div class="card-body p-4 text-center">
                <div class="mb-4">
                    <p class="text-muted">
                        Chức năng này sẽ quét các danh mục Categories từ API gốc.<br/>
                        Sau đó lưu ảnh vào /images/stocks/lists và /images/stocks/thumbnails theo định dạng &lt;slug&gt;&lt;index&gt;.<br/>
                        File seeder tự động nhận diện thông qua thư mục khi chạy lại Seeder.
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

        <div class="card border-0 shadow-sm rounded-3" v-if="progress.total > 0 || logs.length > 0">
            <div class="card-header bg-white border-0 p-4 pb-0">
                <h6 class="fw-bold text-dark mb-1">Tiến trình Categories (Folder)</h6>
                <div class="progress mt-3" style="height: 10px;" v-if="progress.total > 0">
                    <div 
                        class="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        :style="`width: ${(progress.current / progress.total) * 100}%`">
                    </div>
                </div>
                <div class="text-muted mt-2 small" v-if="progress.total > 0">
                    Đã quét: {{ progress.current }} / {{ progress.total }} danh mục.
                </div>

                <div v-if="categoryProgress.total > 0" class="mt-4">
                    <h6 class="fw-bold text-dark mb-1">Tiến trình từng Ảnh trong {{ categoryProgress.name }}</h6>
                    <div class="progress mt-2" style="height: 10px;">
                        <div 
                            class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                            role="progressbar" 
                            :style="`width: ${(categoryProgress.current / categoryProgress.total) * 100}%`">
                        </div>
                    </div>
                    <div class="text-muted mt-2 small">
                        Đang xử lý: Ảnh {{ categoryProgress.current }} / {{ categoryProgress.total }}
                    </div>
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