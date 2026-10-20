<script setup lang="ts">
import { useEditorStore } from "~~/stores/editor"

const stockFilters = ref<string[]>(['Tất cả']);
const stockCategories = ref<any[]>([]);
const activeFilter = ref('Tất cả');
const isMoreOpen = ref(false);

const visibleFilters = computed(() => stockFilters.value.slice(0, 6));
const hiddenFilters = computed(() => stockFilters.value.slice(6));

const selectFilter = (filter: string) => {
    activeFilter.value = filter;
    isMoreOpen.value = false;
};

const fetchStocks = async () => {
    try {
        const { data }: any = await $fetch('/api/v1/client/stocks');
        if (data) {
            stockFilters.value = ['Tất cả', ...data.map((c: any) => c.name)];
            stockCategories.value = data.map((c: any) => {
                return {
                    title: c.name,
                    items: c.images.map((img: any) => {
                        let thumb = '';
                        let original = '';

                        if (img.type === 'svg') {
                            thumb = `/images/stocks/lists/${img.url}`;
                            original = `/images/stocks/lists/${img.url}`;
                        } else {
                            const filenameWebp = img.url.replace(/\.[^/.]+$/, '.webp');
                            thumb = `/images/stocks/thumbnails/${filenameWebp}`;
                            original = `/images/stocks/lists/${img.url}`;
                        }

                        return { thumb, original, type: img.type || 'img' };
                    })
                };
            });
        }
    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    fetchStocks();
});

const editor = useEditorStore()

const selectImage = (url: string, { width = 50, height = 50, type = 'img' } = {}) => {
    if (editor.isReplacingImage && editor.selectedNodeId) {
        editor.updateNodeProps(editor.selectedNodeId, { url, imageType: type })
        editor.isReplacingImage = false
        editor.activeMenu = null
    } else {
        editor.addNode('Image', {
            props: {
                url,
                width,
                height,
                imageType: type
            },
            styles: {
                width: `${width}px`,
                height: `${height}px`,
            }
        })
    }
}

</script>
<template>
    <div class="d-flex flex-column h-100">
        <div class="p-3 border-bottom sticky-top bg-white" style="z-index: 1000">
            <div v-if="editor.isReplacingImage" class="alert alert-primary py-2 px-3 mb-3" style="font-size: 13px; background-color: #eff6ff; border-color: #bfdbfe; color: #1e40af; border-radius: 8px;">
                Hãy chọn ảnh bạn muốn thay thế
            </div>
            <h6 class="fw-bold mb-3">Kho ảnh mẫu</h6>
            <div class="d-flex flex-wrap gap-2 position-relative" style="z-index: 1030">
                <button v-for="(filter, index) in visibleFilters" :key="index" @click="selectFilter(filter)"
                    :class="['btn btn-filter btn-sm', { 'btn-primary-soft': activeFilter === filter, 'btn-light border': activeFilter !== filter }]">
                    {{ filter }}
                </button>

                <!-- Dropdown box cho các danh mục còn lại -->
                <button v-if="hiddenFilters.length > 0" class="btn btn-filter btn-sm btn-light border dropdown-toggle"
                    @click="isMoreOpen = !isMoreOpen">
                    Xem thêm
                </button>

                <!-- Khung Dropdown được đưa ra ngang hàng để dễ dàng canh giữa toàn bộ khung thả -->
                <div v-if="isMoreOpen" class="position-absolute bg-white border shadow-sm rounded-3 p-3 mt-2"
                    style="width: 100%; z-index: 1050; left: 50%; transform: translateX(-50%); top: 100%;">
                    <div class="d-flex flex-wrap gap-2 justify-content-center">
                        <button v-for="(filter, index) in hiddenFilters" :key="'h-' + index"
                            @click="selectFilter(filter)"
                            :class="['btn btn-filter btn-sm', { 'btn-primary-soft': activeFilter === filter, 'btn-light border': activeFilter !== filter }]">
                            {{ filter }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Phông nền đóng Dropdown -->
            <div v-if="isMoreOpen" class="position-fixed w-100 h-100 top-0 start-0" style="z-index: 1020"
                @click="isMoreOpen = false"></div>
        </div>
        <div class="p-3">
            <template v-if="activeFilter === 'Tất cả'">
                <div v-for="(cat, idx) in stockCategories" :key="idx" class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-bold mb-0" style="font-size: 14px;">{{ cat.title }}</h6>
                        <span v-if="cat.items.length > 6" class="text-primary small cursor-pointer fw-medium"
                            style="font-size: 12px; cursor: pointer;" @click="activeFilter = cat.title">Xem thêm</span>
                    </div>
                    <div class="stock-grid">
                        <div v-for="(item, index) in cat.items.slice(0, 6)" :key="index"
                            class="stock-item border rounded-2 bg-light shadow-sm overflow-hidden"
                            @click="selectImage(item.original, { width: 300, height: 300, type: item.type })">
                            <NuxtImg :src="item.thumb" class="w-100 h-100 object-fit-cover" loading="lazy" />
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div v-for="(cat, idx) in stockCategories.filter(c => c.title === activeFilter)" :key="idx"
                    class="stock-grid mb-4">
                    <div v-for="(item, index) in cat.items" :key="index"
                        class="stock-item border rounded-2 bg-light shadow-sm overflow-hidden"
                        @click="selectImage(item.original, { width: 300, height: 300, type: item.type })">
                        <NuxtImg :src="item.thumb" class="w-100 h-100 object-fit-cover" loading="lazy" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<style scoped>
/* STOCK UI */
.btn-filter {
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    border: 1px solid transparent;
    white-space: nowrap;
    cursor: pointer !important;
}

.btn-primary-soft {
    background-color: #e0f2fe;
    color: #3b82f6;
}

.stock-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.stock-item {
    aspect-ratio: 1;
    transition: 0.2s;
    cursor: pointer;
    width: 100%;
    height: 85px;
}

.stock-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.stock-item:hover {
    border-color: #3b82f6 !important;
    transform: scale(1.02);
}
</style>