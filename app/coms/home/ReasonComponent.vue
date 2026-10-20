<script setup lang="ts">

const reasons = [
    {
        title: 'Thiết kế kéo thả dễ dàng',
        desc: 'Tùy biến thiệp cưới không giới hạn với công cụ kéo thả trực quan. Thay đổi bất kỳ thành phần nào theo ý muốn, không bị ràng buộc bởi mẫu có sẵn.',
        icon: '🎨'
    },
    {
        title: 'Tương tác với khách mời',
        desc: 'Khách mời có thể gửi lời chúc, bình luận và tặng quà trực tiếp trên thiệp. Tạo không gian giao lưu ấm áp cho ngày trọng đại của bạn.',
        icon: '💬'
    },
    {
        title: 'Thống kê chi tiết',
        desc: 'Theo dõi lượt xem, lượt yêu thích thiệp và hoạt động của khách mời. Hiểu rõ mức độ quan tâm và tương tác với thiệp cưới của bạn.',
        icon: '📊'
    },
    {
        title: 'Nhạc nền lãng mạn',
        desc: 'Thêm nhạc nền cho thiệp cưới để tạo không khí lãng mạn và cảm súc. Lựa chọn từ thư viện nhạc có sẵn hoặc tải lên bản nhạc yêu thích.',
        icon: '🎵'
    }
]
</script>
<template>
    <section class="reason w-100">
        <div class="reason-container container">
            <h2 class="text-center text-white fw-bold mb-5">Thêm lý do để chọn Cinelove</h2>
            <div class="boxes row gx-2 gy-2">
                <div class="col-6 col-lg-3" v-for="(item, index) in reasons" :key="index">
                    <div class="box h-100 d-flex flex-column justify-content-between p-3">
                        <div>
                            <h5 class="text-white fw-bold mb-3" style="font-size: 1.1rem; line-height: 1.4;">{{
                                item.title }}</h5>
                            <p class="reason-desc mb-4" style="font-size: 0.9rem; line-height: 1.6;">{{ item.desc }}</p>
                        </div>
                        <div class="d-flex justify-content-end align-items-center"
                            style="font-size: 1.8rem; line-height: 1;">
                            {{ item.icon }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.reason-container {
    width: 85%;
    margin: 0 auto;
}

@media (max-width: 576px) {
    .reason-container {
        width: 95%;
    }

    .reason-container h2 {
        font-size: 1.6rem !important;
        line-height: 38px;
    }
}

.boxes {
    margin-top: 65px;
}

.reason-icon {
    display: flex;
    justify-self: end;
}

.box {
    padding: 20px 15px;
    border-radius: 10px;
    background: #1f2937;
    transition: all .3s ease;
}

.box:hover {
    background: rgba(69, 84, 110, 0.5)
}

.reason-desc {
    color: #d1d5db;
}
</style>