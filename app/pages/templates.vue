<script setup lang="ts">
import InvitationImageScrollBoxCompomnent from '~/coms/invitation/InvitationImageScrollBoxCompomnent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { ref, onMounted } from 'vue';
definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('mau-thiep')
useAppSeo(seoData)

const response = ref<any>(null);
const currentType = ref<number | null>(null);
const currentPackage = ref<number | null>(null);

const { data: categoryResponse } = useFetch('/api/v1/client/category-wedding-cards');
const categories = computed(() => (categoryResponse.value as any)?.data || []);

const { data: packageResponse } = useFetch('/api/v1/client/packages');
const packages = computed(() => (packageResponse.value as any)?.data?.data || []);

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

const fetchTemplates = async () => {
    try {
        const queryParams: any = {
            is_template: true,
            limit: 50
        };

        if (currentType.value !== null) {
            queryParams.id_category_wedding_card = currentType.value;
        }

        if (currentPackage.value !== null) {
            queryParams.id_package = currentPackage.value;
        }

        response.value = await $fetch('/api/v1/client/card-template', {
            query: queryParams
        });
    } catch (error) {
        console.error("Failed to fetch templates:", error);
    }
}

onMounted(() => {
    fetchTemplates();
});

watch(currentType, () => {
    fetchTemplates();
});

watch(currentPackage, () => {
    fetchTemplates();
});
</script>
<template>
    <div class="container mt-3 mb-5 px-3 px-md-0">
        <h1 class="text-center fw-bold page-header">Mẫu thiệp online đẹp</h1>
        <p class="text-center desc mx-auto">Khám phá bộ sưu tập mẫu thiệp điện tử đa dạng: cưới, sinh nhật, sự kiện, kỷ
            niệm từ Cinelove</p>

        <!-- TEMPLATE CARD TYPES (Wrapped on mobile) -->
        <div class="boxes-wrapper w-100 mt-4">
            <div class="boxes d-flex align-items-center py-2">
                <button type="button" class="btn-box" :class="{ active: currentType === null }"
                    @click="currentType = null">Tất cả</button>
                <button type="button" class="btn-box" :class="{ active: currentType === category.id }"
                    v-for="category in categories" :key="category.id" @click="currentType = category.id">
                    {{ category.name }}
                </button>
            </div>
        </div>

        <div class="nav-breadcumb w-100 d-flex justify-content-between align-items-center mt-4">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <NuxtLink to="/">
                            <button class="d-flex align-items-center">
                                <BaseIconComponent class="me-1" :name="`house`" :color="`#00000073`" />
                                <span class="text">Trang chủ</span>
                            </button>
                        </NuxtLink>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        <button>
                            <span>Mẫu thiệp</span>
                        </button>
                    </li>
                </ol>
            </nav>
            <div class="filter-select">
                <select class="form-select" v-model="currentPackage" aria-label="Default select example">
                    <option :value="null">Tất cả gói</option>
                    <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                        {{ pkg.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="template mt-4" v-if="templates.length > 0">
            <InvitationImageScrollBoxCompomnent class="template-box mb-2" v-for="template in templates"
                :key="template.id" :fit-width="false" :image="template.image" :type="template.type" :card="template" />
        </div>
        <div class="w-100 text-center py-5 no-data" v-else>
            <p class="text-secondary" style="font-size: 16px;">Đang cập nhật...</p>
        </div>
        <hr class="mt-5 mb-5 opacity-25">
    </div>
</template>

<style scoped>
.page-header {
    font-size: 28px;
    margin-top: 20px;
}

@media (min-width: 768px) {
    .page-header {
        font-size: 34px;
    }
}

.boxes-wrapper {
    width: 100%;
}

.boxes {
    gap: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.template {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 50px;
}

@media (min-width: 576px) {
    .template {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 576px) {
    h1 {
        font-size: 38px !important;
    }

    .desc {
        font-size: 13px !important;
    }
}

@media (min-width: 768px) {
    .template {
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
    }


}

@media (min-width: 1024px) {
    .template {
        grid-template-columns: repeat(6, 1fr);
        margin-bottom: 220px;
    }
}

.template-box {
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    width: 100%;
}

.desc {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 30px;
    margin-top: 15px;
    max-width: 600px;
}

.btn-box {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border-radius: 9999px;
    background-color: #f3f4f6;
    transition: all .3s ease;
    border: none;
    white-space: nowrap;
}

.btn-box.active {
    background-color: #ff8fa3;
    color: #ffffff;
}

.btn-box:not(.active):hover {
    background-color: #e7e9ec;
}

.filter-select {
    width: auto;
    max-width: 140px;
}

.filter-select select {
    font-size: 13px;
    padding: 6px 33px 6px 12px;
}

@media (min-width: 768px) {
    .filter-select {
        max-width: 160px;
    }

    .filter-select select {
        font-size: 14px;
        padding: 8px 36px 8px 16px;
    }


}

.breadcrumb-item::before {
    color: #00000073 !important;
}

.breadcrumb-item button {
    background: none;
    border: none;
    padding: 2px 4px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 15px;
    transition: all .3s ease;
}

.breadcrumb-item button:hover {
    color: #000;
    background: #e7e9ec;
}

.nav-breadcumb {
    margin-top: 25px;
}

.no-data {
    margin-top: 45px;
    margin-bottom: 100px;
}

@media (min-width: 1024px) {
    .no-data {
        margin-bottom: 220px;
    }
}

hr {
    width: 80%;
    margin: 0 auto;
}

a {
    text-decoration: none;
}
</style>