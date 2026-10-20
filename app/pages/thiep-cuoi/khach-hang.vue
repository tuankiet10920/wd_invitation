<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import InvitationImageBoxComponent from '~/coms/invitation/InvitationImageBoxComponent.vue';
definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('thiep-da-tao')
useAppSeo(seoData)

const limit = ref(24);
const { data: response } = await useFetch<any>('/api/v1/client/card-template', {
    query: {
        is_template_user: true,
        is_publish: true,
        limit
    }
});

const items = computed(() => response.value?.data?.data || []);
const totalCount = computed(() => response.value?.data?.totalCount || 0);

const handleLoadMore = () => {
    limit.value += 24;
};
</script>
<template>
    <div class="container mt-3 mb-5 px-3 px-md-0">
        <h1 class="text-center fw-bold page-header">Thiệp cưới online của khách hàng</h1>
        <p class="text-center desc">Khám phá bộ sưu tập thiệp cưới online của khách hàng tại Cinelove. <br>
            Những chiếc thiệp lãng mạn, tinh tế và hiện đại đã được các cặp đôi sử dụng để lưu giữ khoảnh khắc, chia sẻ
            với bạn bè và người thân trong dịp đám cưới của họ.</p>

        <div class="icons d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
            <div class="d-flex align-items-center">
                <BaseIconComponent :name="`favorite`" :color="`#f17eb8`" :size="20" />
                <p class="mb-0 ms-2 card-text">{{ totalCount }} thiệp cưới tiêu biểu</p>
            </div>
            <div class="d-flex flex-jc-ac align-items-center" style="width: fit-content;">
                <BaseIconComponent :name="`check-circle`" :variant="`rounded`" :color="`#3f83f8`" :size="20" />
                <p class="mb-0 ms-2 card-text">Đã được kiểm duyệt</p>
            </div>
        </div>

        <div class="nav-breadcumb w-100 mt-4 d-flex justify-content-between align-items-center">
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
                            <span>Thiệp cưới online của khách hàng</span>
                        </button>
                    </li>
                </ol>
            </nav>
        </div>

        <div class="templates mt-4" v-if="items.length > 0">
            <InvitationImageBoxComponent v-for="item in items" :key="item.id" :item="item" />
        </div>
        <div class="w-100 text-center py-5 no-data" v-else>
            <p class="text-secondary" style="font-size: 16px;">Đang cập nhật...</p>
        </div>

        <div v-if="items.length < totalCount" class="d-flex flex-column align-items-center mt-5 mb-5">
            <button type="button" @click="handleLoadMore"
                class="button-view d-flex align-items-center justify-content-center px-4 py-2 rounded-5 border-0">
                <p class="mb-0 view-text fw-bold me-2">Xem thêm</p>
                <BaseIconComponent class="view-icon" :name="`arrow-right-alt`" :variant="`rounded`"
                    :color="`#FFFFFF`" />
            </button>
            <p class="mt-3 card-text">Hiển thị {{ items.length }} / {{ totalCount }} thiệp cưới</p>
        </div>

        <div class="note w-100 px-4 py-5 p-md-5">
            <h4 class="text-center fw-bold">Tạo thiệp cưới online đẹp như vậy?</h4>
            <p class="text-center card-text mt-3 mb-4 mx-auto" style="max-width: 600px;">Bạn cũng có thể tạo ra những
                thiệp cưới điện tử đẹp tương tự hoàn
                toàn miễn phí. Hàng trăm mẫu thiệp đang chờ bạn khám phá!</p>
            <div class="note-btns d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                <button type="button"
                    class="border-0 d-flex align-items-center justify-content-center px-4 py-2 rounded-5 button-note-create w-md-auto">
                    <BaseIconComponent :name="`add`" :size="20" :color="`#FFFFFF`" />
                    <p class="mb-0 ms-1 view-text">Tạo thiệp cưới miễn phí</p>
                </button>
                <button type="button"
                    class="border-0 d-flex align-items-center justify-content-center px-4 py-2 rounded-5 button-note-view w-md-auto">
                    <BaseIconComponent :type="`hugeicons`" :name="`dashboard-square-01`" :color="`#FFFFFF`"
                        :size="18" />
                    <p class="mb-0 ms-2 view-text">Xem tất cả mẫu thiệp</p>
                </button>
            </div>
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

@media (max-width: 768px) {
    .icons {
        width: fit-content;
        margin: 0 auto;
    }
}

.view-icon {
    position: relative;
    z-index: 2;
    transform: rotate(90deg);
}

.button-view {
    background-color: rgba(255, 107, 133, .7);
    transition: all .3s ease;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.button-view:hover {
    background-color: rgba(255, 107, 133, 1);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.button-note-create {
    transition: all .3s ease;
    background-color: rgba(255, 107, 133, .8);
}

.button-note-view {
    background-color: rgb(63, 131, 248, .8);
    transition: all .3s ease;
}

.button-note-view:hover {
    background-color: rgb(63, 131, 248, 1);
}

.button-note-create:hover {
    background-color: rgba(255, 107, 133, 1);
}

.view-text {
    font-size: 14px;
    color: #ffffff;
}

.card-text {
    color: #4b5563;
    font-size: 14px;
}

.desc {
    color: #4b5563;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 30px;
    margin-top: 15px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.templates {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

@media (min-width: 768px) {
    .templates {
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
    }
}

@media (min-width: 1024px) {
    .templates {
        grid-template-columns: repeat(6, 1fr);
    }
}

@media (max-width: 576px) {
    h1 {
        font-size: 38px !important;
    }

    h4 {
        font-size: 25px !important;
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

a {
    text-decoration: none;
}

.note {
    border-radius: 16px;
    background: linear-gradient(to right, rgb(253, 242, 248), rgb(246, 245, 255));
    margin-top: 40px;
}

hr {
    width: 80%;
    margin: 0 auto;
    margin-top: 95px;
}
</style>