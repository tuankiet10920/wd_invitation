<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

definePageMeta({
    layout: "admin",
});

const sourceFonts = ref<any[]>([]);
const isFetching = ref(false);
const isCloning = ref(false);
const logs = ref<any[]>([]);
const progress = ref({ total: 0, current: 0 });

const fetchSourceFonts = async () => {
    isFetching.value = true;
    try {
        const res: any = await $fetch('https://api.cinelove.me/api/resources/fonts');
        sourceFonts.value = res || [];
    } catch (e) {
        console.error(e);
        alert("Failed to fetch source fonts");
    } finally {
        isFetching.value = false;
    }
};

const handleCloneAll = async () => {
    if (!confirm(`Hệ thống sẽ tải ${sourceFonts.value.length} fonts và hình ảnh, đồng thời cập nhật seeder. Bạn chắc chắn chứ?`)) return;
    
    isCloning.value = true;
    logs.value = [];
    progress.value.total = sourceFonts.value.length;
    progress.value.current = 0;

    logs.value.push({ message: `Bắt đầu quá trình đồng bộ ${sourceFonts.value.length} fonts...`, success: true, time: new Date().toLocaleTimeString() });

    for (const font of sourceFonts.value) {
        progress.value.current++;
        try {
            const res: any = await $fetch('/api/v1/admin/tools/clone-fonts', {
                method: 'POST',
                body: { fonts: [font] }
            });
            
            if (res.success && res.data?.[0]?.success) {
                logs.value.unshift({ 
                    message: `[OK] Đã clone Font: ${font.name} (${font.id}) + Hình ảnh preview + Cập nhật Seeder`, 
                    success: true, 
                    time: new Date().toLocaleTimeString() 
                });
            } else {
                logs.value.unshift({ 
                    message: `[LỖI] Font ${font.name}: ${res.data?.[0]?.error || 'Lỗi không xác định'}`, 
                    success: false, 
                    time: new Date().toLocaleTimeString() 
                });
            }
        } catch (e: any) {
            logs.value.unshift({ 
                message: `[LỖI KẾT NỐI] ${font.name}: ${e.message}`, 
                success: false, 
                time: new Date().toLocaleTimeString() 
            });
        }
    }

    logs.value.unshift({ message: "QUÁ TRÌNH ĐỒNG BỘ HOÀN TẤT! Đã cập nhật database và tệp seeder.", success: true, time: new Date().toLocaleTimeString() });
    isCloning.value = false;
};

const handleCloneSingle = async (font: any) => {
    isCloning.value = true;
    try {
        const res: any = await $fetch('/api/v1/admin/tools/clone-fonts', {
            method: 'POST',
            body: { fonts: [font] }
        });
        if (res.success) {
             const result = res.data[0];
             alert(result.success ? `Đã đồng bộ thành công ${font.name}` : `Thất bại: ${result.error}`);
        }
    } catch (e) {
        console.error(e);
        alert(`Lỗi hệ thống khi đồng bộ ${font.name}`);
    } finally {
        isCloning.value = false;
    }
};

onMounted(() => {
    fetchSourceFonts();
});
</script>

<template>
    <div class="container-fluid p-4">
        <!-- Header Section -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                 <h1 class="h2 mb-1 fw-bold text-dark">Đồng bộ Typography</h1>
                 <p class="text-muted small mb-0">Mirror font assets (.woff2) and thumbnails from external library</p>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 rounded-pill" @click="fetchSourceFonts" :disabled="isFetching">
                   <BaseIconComponent name="solar:refresh-linear" :size="18" />
                   {{ isFetching ? 'Đang tải...' : 'Làm mới nguồn' }}
                </button>
                <button class="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm rounded-pill" @click="handleCloneAll" :disabled="isCloning || sourceFonts.length === 0">
                    <BaseIconComponent name="solar:cloud-download-linear" :size="18" color="white" />
                    {{ isCloning ? 'Đang xử lý...' : `Đồng bộ toàn bộ (${sourceFonts.length})` }}
                </button>
            </div>
        </div>

        <!-- Progress Log Section -->
        <div class="card border-0 shadow-sm rounded-4 mb-4" v-if="isCloning || logs.length > 0">
            <div class="card-header bg-white border-0 p-4 pb-0">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                        <BaseIconComponent name="solar:screencast-2-linear" :size="20" class="text-primary" />
                        Tiến trình thực thi chi tiết
                    </h6>
                    <span v-if="isCloning" class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                        Đang đồng bộ: {{ progress.current }} / {{ progress.total }}
                    </span>
                </div>
                <div class="progress mt-3" style="height: 8px; border-radius: 10px;">
                    <div 
                        class="progress-bar bg-primary progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        :style="`width: ${(progress.current / progress.total) * 100}%`"
                    ></div>
                </div>
            </div>
            <div class="card-body p-4">
                <div class="log-container rounded-3 bg-dark p-3 border border-secondary shadow-inner">
                    <div 
                        v-for="(log, idx) in logs" 
                        :key="idx" 
                        :class="['log-line mb-1', log.success ? 'text-success' : 'text-danger']"
                    >
                        <span class="text-secondary opacity-50 me-2" style="font-size: 0.75rem;">[{{ log.time }}]</span>
                        <span :class="log.success ? 'text-white-50' : 'text-danger'">{{ log.message }}</span>
                    </div>
                    <div v-if="logs.length === 0" class="text-secondary text-center py-4">Hệ thống đang chờ lệnh thực thi...</div>
                </div>
            </div>
        </div>

        <!-- Font Table List -->
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light border-bottom">
                            <tr>
                                <th class="ps-4 py-3" style="width: 150px;">Hình ảnh</th>
                                <th class="py-3">ID Font</th>
                                <th class="py-3">Tên hiển thị</th>
                                <th class="py-3">Loại Font</th>
                                <th class="text-end pe-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="font in sourceFonts" :key="font.id">
                                <td class="ps-4">
                                    <div class="bg-white rounded p-1 d-inline-block border shadow-sm">
                                        <img :src="`https://assets.cinelove.me/${font.thumbnail}`" :alt="font.name" style="max-height: 28px; width: 100px; object-fit: contain;" />
                                    </div>
                                </td>
                                <td><span class="badge bg-light text-secondary border fw-normal">{{ font.id }}</span></td>
                                <td class="fw-bold text-dark">{{ font.name }}</td>
                                <td>
                                    <span class="badge rounded-pill bg-info-subtle text-info border border-info-subtle px-3">
                                        {{ font.category || 'Chưa phân loại' }}
                                    </span>
                                </td>
                                <td class="text-end pe-4">
                                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="handleCloneSingle(font)" :disabled="isCloning">
                                        Mirror Asset
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="sourceFonts.length === 0 && !isFetching">
                                <td colspan="5" class="text-center py-5 text-muted fst-italic">Không tìm thấy tài nguyên font từ nguồn API.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.log-container {
    max-height: 250px;
    overflow-y: auto;
    font-family: 'Fira Code', 'Monaco', 'Courier New', monospace;
    font-size: 0.8rem;
    line-height: 1.6;
}
.log-line {
    padding: 4px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
}
.log-line:last-child { border-bottom: none; }

.btn-primary { 
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border: none;
}
.btn-primary:hover { 
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    transform: translateY(-1px);
}
.shadow-inner {
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}
.progress { background-color: #f1f5f9; }
</style>