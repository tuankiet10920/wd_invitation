<script setup lang="ts">
import BaseIconComponent from '../icons/BaseIconComponent.vue';
import ButtonPinkComponent from '../button/ButtonPinkComponent.vue';

const data = ref([
    {
        id: 1,
        name: 'Cinelove là gì?',
        desc: 'Cinelove là nền tảng tạo thiệp cưới online miễn phí hàng đầu Việt Nam. Bạn có thể tạo thiệp cưới điện tử đẹp mắt, hiện đại chỉ trong vài phút với hàng trăm mẫu thiết kế đa dạng và công cụ tùy chỉnh dễ sử dụng.',
        isChoose: false
    },
    {
        id: 2,
        name: 'Tôi phải trả bao nhiêu tiền để tạo thiệp cưới?',
        desc: 'Cinelove có gói miễn phí với đầy đủ tính năng để tạo thiệp cưới đẹp và chuyên nghiệp. Bạn có thể tạo, tùy chỉnh và chia sẻ thiệp cưới hoàn toàn miễn phí. Ngoài ra, chúng tôi cũng có các gói trả phí với những tính năng nâng cao để đáp ứng nhu cầu đa dạng của người dùng.',
        isChoose: false
    },
    {
        id: 3,
        name: 'Làm thế nào để tùy chỉnh thiệp?',
        desc: 'Rất đơn giản! Chọn mẫu thiệp yêu thích, sau đó thay đổi văn bản, hình ảnh, màu sắc, font chữ theo ý muốn. Bạn có thể thêm thông tin cặp đôi, thời gian địa điểm đám cưới, lời mời cá nhân hóa và nhiều yếu tố khác chỉ bằng vài cú nhấp chuột.',
        isChoose: false
    },
    {
        id: 4,
        name: 'Tôi có thể chia sẽ thiệp như thế nào?',
        desc: 'Sau khi hoàn thành thiệp, bạn sẽ nhận được link chia sẻ. Bạn có thể gửi link này qua Messenger, Zalo, hoặc tin nhắn SMS... hoặc chia sẻ trực tiếp lên Facebook, Instagram, TikTok... Khách mời chỉ cần nhấp vào link để xem thiệp ngay trên điện thoại hoặc máy tính của họ.',
        isChoose: false
    },
    {
        id: 5,
        name: 'Thiệp có hoạt động trên mọi thiết bị không?',
        desc: 'Có! Thiệp cưới của Cinelove được thiết kế responsive, tự động tối ưu hiển thị trên mọi kích thước màn hình từ điện thoại đến máy tính. Khách mời của bạn có thể xem thiệp mượt mà trên bất kỳ thiết bị nào.',
        isChoose: false
    },
    {
        id: 6,
        name: 'Khách mời có thể tặng quà trực tiếp trên thiệp không?',
        desc: `Có! Cinelove có 2 cách tặng quà độc đáo:
                • Quét mã QR để chuyển khoản trực tiếp cho chủ thiệp
                • Tặng các món quà đáng yêu với hiệu ứng animation đẹp mắt hiển thị ngay trên thiệp

                Các món quà ảo này có thể được quy đổi thành tiền thật và rút về tài khoản ngân hàng theo chính sách quà tặng của Cinelove. Bạn có thể theo dõi được tất cả quà tặng, lời chúc và có thể quản lý thu nhập một cách minh bạch.
            `,
        isChoose: false
    },
])

const click = (id: number | string) => {
    const index = data.value.findIndex(item => item.id == id)
    if (data.value[index]) data.value[index].isChoose = !data.value[index].isChoose
}
</script>
<template>
    <div class="question w-100">
        <div class="question-container container">
            <h2 class="text-center text-white mb-5 fw-bold">Câu hỏi thường gặp</h2>
            <div class="box rounded-3 mb-2" v-for="(item, index) in data" :key="index">
                <div class="top d-flex justify-content-between align-items-center p-4" data-bs-toggle="collapse"
                    :data-bs-target="`#collapseExample${index + 1}`" aria-expanded="false"
                    :aria-controls="`collapseExample${index + 1}`" @click="click(item.id)">
                    <p class="mb-0 box-title text-white me-2">{{ item.name }}</p>
                    <BaseIconComponent :name="item.isChoose ? `minus` : `add`"
                        :type="item.isChoose ? `iconoir` : `material-symbols`" class="reason-icon flex-shrink-0"
                        :color="`#FFFFFF`" :size="30" />
                </div>
                <div class="bottom collapse" :id="`collapseExample${index + 1}`">
                    <p class="mb-0 p-4">{{ item.desc }}</p>
                </div>
            </div>
            <p class="mt-5 text-center contact-us">Bạn cần hỗ trợ thêm? Hãy liên hệ với chúng tôi!</p>
            <div class="d-flex justify-content-center w-100">
                <ButtonPinkComponent @click="navigateTo('/contact')">
                    <span class="contact">Liên hệ hỗ trợ</span>
                </ButtonPinkComponent>
            </div>
        </div>
    </div>
</template>
<style scoped>
.question-container {
    width: 50%;
    margin: 0 auto;
}

.top {
    cursor: pointer;
}

@media (max-width: 991px) {
    .question-container {
        width: 85%;
    }
}

@media (max-width: 768px) {
    .question-container {
        width: 95%;
    }

    h2 {
        font-size: 2rem !important;
    }

    .box-title {
        font-size: 18px !important;
    }
}

.box {
    background: rgba(31, 41, 55, 1);
    border: 1px solid rgba(55, 65, 81, 0.3);
    transition: all .2s ease;
}

.box:hover {
    background: rgb(66, 82, 107);
}

.box p {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
}

.contact {
    font-weight: 500;
    color: #FFFFFF;
}

.bottom {
    color: rgb(209, 213, 219);
    font-size: 18px;
    line-height: 28px;
    border-top: 1px solid rgba(55, 65, 81, 0.3);
}

.contact-us {
    color: #9ca3af;
    font-size: 20px;
    line-height: 28px;
}
</style>