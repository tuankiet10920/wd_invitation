<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import ButtonReturnMobileComponent from '~/coms/button/ButtonReturnMobileComponent.vue';
import type { IconType } from "~~/interfaces"

definePageMeta({
    layout: 'dashboard'
})

interface GiftPackage {
    name: string
    icon: string
    type: IconType
    benefit: string
    note: string
    color: string
    bgColor: string
    btnText: string
    features: string[]
    isCurrent?: boolean
}

// Dữ liệu so sánh các gói quà tặng
const giftPackages: GiftPackage[] = [
    {
        name: 'Gói Premium',
        icon: 'diamond',
        type: 'lucide',
        benefit: 'Nhận 100% giá trị quà tặng',
        note: 'Không có phí giao dịch.',
        color: '#007bff',
        bgColor: '#e7f1ff',
        btnText: 'Nâng cấp lên Premium',
        features: ['Hiển thị quà tặng trên thiệp', 'Nhận 100% giá trị quà tặng', 'Không mất phí giao dịch', 'Rút tiền về tài khoản ngân hàng']
    },
    {
        name: 'Gói Basic',
        icon: 'star',
        type: 'lucide',
        benefit: 'Nhận 80% giá trị quà tặng',
        note: 'Phí giao dịch & cổng thanh toán 20%.',
        color: '#28a745',
        bgColor: '#e8f5e9',
        btnText: 'Nâng cấp lên Basic',
        features: ['Hiển thị quà tặng trên thiệp', 'Nhận 80% giá trị quà tặng', 'Phí giao dịch & cổng thanh toán 20%', 'Rút tiền về tài khoản ngân hàng']
    },
    {
        name: 'Gói miễn phí',
        icon: 'gift',
        type: 'lucide',
        benefit: 'Giá trị quà tặng sẽ được sử dụng cho cổng thanh toán và duy trì dịch vụ miễn phí.',
        note: '',
        color: '#fd7e14',
        bgColor: '#fff3e0',
        isCurrent: true,
        btnText: 'Nâng cấp gói',
        features: ['Thiệp online hoàn toàn miễn phí', 'Quà tặng vẫn hiển thị trên thiệp', 'Nhận lời chúc từ mọi người', 'Giá trị quà tặng dùng để duy trì hệ thống']
    }
]

// Truy cập nhanh
const quickAccess = [
    { label: 'Quà tặng đã nhận', desc: 'Xem danh sách quà tặng từ thiệp online', icon: 'gift' },
    { label: 'Số dư và giao dịch', desc: 'Quản lý số dư quà tặng và giao dịch', icon: 'wallet' },
    { label: 'Tài khoản ngân hàng', desc: 'Thông tin tài khoản ngân hàng', icon: 'credit-card' },
    { label: 'Lịch sử thanh toán', desc: 'Xem chi tiết các giao dịch thanh toán', icon: 'history' }
]

// Tính năng & Thông tin chương trình
const programFeatures = [
    {
        title: 'Quà tặng & Lời chúc',
        desc: 'Nhận quà tặng ý nghĩa và lời chúc ấm áp từ người thân, bạn bè thông qua thiệp online. Biến mỗi lời chúc thành kỷ niệm đáng nhớ trong ngày trọng đại.',
        icon: '💝'
    },
    {
        title: 'Trải nghiệm độc đáo',
        desc: 'Hệ thống thông minh chỉ hiển thị quà khi thanh toán thành công. Hiệu ứng hoạt hình đẹp mắt và độc đáo, tạo trải nghiệm gửi quà sinh động và ấn tượng.',
        icon: '⭐'
    },
    {
        title: 'Theo dõi chi tiết',
        desc: 'Xem lịch sử giao dịch chi tiết, theo dõi trạng thái quà tặng và rút tiền về tài khoản ngân hàng một cách an toàn và thuận tiện.',
        icon: '📊'
    }
]

// Cách thức hoạt động
const steps = [
    { id: 1, title: 'Tạo thiệp online', desc: 'Tạo thiệp online trực tuyến với thiết kế đẹp mắt' },
    { id: 2, title: 'Chia sẻ thiệp', desc: 'Chia sẻ thiệp lên các mạng xã hội, gửi link thiệp online cho người thân và bạn bè' },
    { id: 3, title: 'Nhận quà tặng', desc: 'Người thân gửi lời chúc và quà tặng qua thiệp online' },
    { id: 4, title: 'Quản lý và rút tiền', desc: 'Xem danh sách quà tặng và rút tiền về tài khoản' }
]
</script>

<template>
    <div class="gift-program-page dashboard-cover">
        <div class="mb-4">
            <div class="go-title">
                <ButtonReturnMobileComponent />
                <h5 class="fw-bold mb-0 d-flex align-items-center">
                    <BaseIconComponent name="gift" type="lucide" :size="20" color="#ed64a6" class="me-2" />
                    Chương trình quà tặng
                </h5>
            </div>
            <p class="go-title-muted text-muted small">Quản lý quà tặng từ thiệp online</p>
        </div>

        <div class="main-intro-card shadow-sm rounded-4 p-5 text-center mb-5 border-0 bg-white">
            <div class="heart-icon-wrapper mb-3">💝</div>
            <h5 class="gom-title fw-bold mb-3 fs-4">Chương trình Quà tặng Thiệp online</h5>
            <p class="text-muted mx-auto mb-5 opacity-75 gom-small" style="max-width: 650px">
                Để thiệp online của bạn thành cầu nối đặc biệt với những lời chúc và quà tặng ý nghĩa từ người thân, bạn
                bè.
                Những món quà với hiệu ứng độc đáo giúp việc chia sẻ niềm vui trở nên lãng mạn và ấm áp hơn.
            </p>

            <div class="package-info-container bg-light p-4 rounded-4 mb-5 border border-white">
                <h6 class="fw-bold small mb-4 text-dark text-uppercase letter-spacing-1">Thông tin gói dịch vụ</h6>
                <div class="row g-4 justify-content-center">
                    <div class="col-md-4" v-for="pkg in giftPackages" :key="pkg.name">
                        <div class="pkg-summary-card p-4 rounded-3 border text-start h-100 position-relative transition-all"
                            :style="{ borderColor: pkg.isCurrent ? pkg.color : '#e2e8f0', backgroundColor: pkg.isCurrent ? pkg.bgColor : '#ffffff' }">
                            <div v-if="pkg.isCurrent" class="current-badge shadow-sm"
                                :style="{ backgroundColor: pkg.color }">
                                Gói hiện tại
                            </div>
                            <div class="d-flex align-items-center mb-3">
                                <BaseIconComponent :name="pkg.icon" :type="pkg.type" :size="18" :color="pkg.color"
                                    class="me-2" />
                                <span class="fw-bold" style="font-size: 15px;">{{ pkg.name }}</span>
                            </div>
                            <div class="text-secondary" style="font-size: 12px; line-height: 1.5;">{{ pkg.benefit }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="packages-buttons d-flex justify-content-center gap-3">
                <!-- BO SUU TAP QUA TANG -->
                <NuxtLink to="/dashboard/gifts-gallery"
                    class="btn btn-primary px-4 py-2 fw-bold rounded-pill shadow-sm text-white text-decoration-none">Bộ
                    sưu tập quà tặng</NuxtLink>
                <button class="btn btn-outline-dark px-4 py-2 fw-bold rounded-pill">Nâng cấp gói</button>
            </div>
        </div>

        <h6 class="fw-bold mb-4">Truy cập nhanh</h6>
        <div class="row g-3 mb-5 quick-access">
            <div class="col-md-3 gom-card" v-for="item in quickAccess" :key="item.label">
                <div
                    class="card gom-card-gift shadow-sm border-0 rounded-4 p-4 text-center h-100 quick-card hover-lift">
                    <div class="icon-circle mx-auto mb-3 bg-light d-flex align-items-center justify-content-center"
                        style="width: 48px; height: 48px;">
                        <BaseIconComponent :name="item.icon" type="lucide" :size="24" color="#2d3748" />
                    </div>
                    <div class="fw-bold small mb-2">{{ item.label }}</div>
                    <div class="text-muted" style="font-size: 11px;">{{ item.desc }}</div>
                </div>
            </div>
        </div>

        <h6 class="fw-bold mb-4 quick-access-title">Tính năng & Thông tin chương trình</h6>
        <div class="row g-4 mb-5 quick-access-boxes">
            <div class="col-md-4 program-features" v-for="feat in programFeatures" :key="feat.title">
                <div class="card shadow-sm border-0 program-box rounded-4 p-4 text-center h-100">
                    <div class="fs-2 mb-3 program-box-icon">{{ feat.icon }}</div>
                    <h6 class="fw-bold mb-3 program-box-h5">{{ feat.title }}</h6>
                    <p class="text-muted mb-0 program-box-desc" style="font-size: 12px; line-height: 1.6;">{{ feat.desc
                    }}</p>
                </div>
            </div>
        </div>



        <h6 class="fw-bold mb-4 gift-package-h6">So sánh gói dịch vụ</h6>
        <div class="row g-4 mb-5 gift-package-row">
            <div class="col-md-4" v-for="pkg in giftPackages" :key="'detail-' + pkg.name">
                <div class="card shadow-sm border-0 rounded-4 h-100 overflow-hidden text-center position-relative transition-all"
                    :style="{ outline: pkg.isCurrent ? `2px solid ${pkg.color}` : 'none' }">
                    <div v-if="pkg.isCurrent" class="pkg-top-badge" :style="{ backgroundColor: pkg.color }">Gói hiện tại
                    </div>
                    <div class="p-5 gp-box">
                        <BaseIconComponent :name="pkg.icon" :type="pkg.type" :size="40" :color="pkg.color"
                            class="mb-4 gp-box-icon" />
                        <h6 class="fw-bold text-dark fs-5 mb-2 gp-box-name">{{ pkg.name }}</h6>
                        <h3 class="fw-bold my-4 display-6 gp-box-percent" :style="{ color: pkg.color }">
                            <span v-if="pkg.name.includes('Miễn phí')" class="gp-box-p">0%</span>
                            <span v-else class="gp-box-p">{{ pkg.name.includes('Premium') ? '100%' : '80%' }}</span>
                            <span style="font-size: 18px; display: block;">Quà tặng</span>
                        </h3>
                        <p class="text-muted small mb-5 px-3 gp-small">{{ pkg.note || 'Duy trì dịch vụ miễn phí.' }}</p>
                        <div class="text-start gp-feature mb-5 bg-light p-3 rounded-3">
                            <div class="d-flex align-items-start mb-3" v-for="feat in pkg.features" :key="feat">
                                <BaseIconComponent name="check-circle" type="lucide" :size="16" :color="pkg.color"
                                    class="me-2 mt-1 gp-feature-icon" />
                                <span class="small text-secondary gp-feature-text" style="font-size: 12px;">{{ feat
                                }}</span>
                            </div>
                        </div>
                        <button class="btn w-100 fw-bold gp-feature-button rounded-pill py-3 shadow-sm"
                            :style="{ backgroundColor: pkg.color, color: '#fff' }">
                            {{ pkg.btnText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <h5 class="fw-bold mb-4 gp-ha">Cách thức hoạt động</h5>
        <div class="card shadow-sm border-0 gp-ha-boxes rounded-1 p-3 mb-5">
            <div class="">
                <div class="flex-js-ac" v-for="(step, index) in steps" :class="{ 'mb-3': index < steps.length - 1 }"
                    :key="step.id">
                    <div class="step-number mb-3 shadow-sm me-3">{{ step.id }}</div>
                    <div>
                        <h6 class="fw-bold small mb-2 gp-ha-title">{{ step.title }}</h6>
                        <p class="text-muted mb-0 gp-ha-desc" style="font-size: 13px;">{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="start-today-banner p-5 rounded-4 text-center mb-5">
            <h4 class="fw-bold mb-3">Bắt đầu ngay hôm nay</h4>
            <p class="text-muted mx-auto mb-0" style="max-width: 600px;">
                Tạo thiệp online trực tuyến và trải nghiệm cách nhận quà tặng hiện đại, thuận tiện từ người thân và bạn
                bè.
            </p>
        </div>
    </div>
</template>

<style scoped>
.main-intro-card {
    border: 1px solid #f1f5f9;
}

.heart-icon-wrapper {
    font-size: 48px;
}

.gom-small {
    font-size: 15px;
}

.pkg-summary-card {
    transition: all 0.3s ease;
}

.current-badge {
    position: absolute;
    top: -12px;
    right: 15px;
    color: white;
    font-size: 10px;
    padding: 3px 12px;
    border-radius: 20px;
    font-weight: 800;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
}

.step-number {
    width: 32px;
    height: 32px;
    background-color: #e7f1ff;
    color: #007bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.start-today-banner {
    background-color: #f0f7ff;
}

.pkg-top-badge {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 11px;
    padding: 4px 25px;
    border-radius: 0 0 15px 15px;
    font-weight: 800;
}

.rounded-4 {
    border-radius: 1.25rem !important;
}

.btn-primary {
    background: linear-gradient(135deg, #6366f1, #007bff);
    border: none;
}

@media (max-width: 768px) {
    .go-title {
        display: flex;
    }

    .go-title-muted {
        margin-top: 30px;
    }

    .gom-title {
        font-size: 18px !important;
    }

    .main-intro-card {
        padding: 20px 15px !important;
        margin-bottom: 17px !important;
    }

    .gom-small {
        font-size: 12px !important;
        color: #000 !important;
    }

    .package-info-container {
        padding: 0 !important;
        background: none !important;
        margin-bottom: 15px !important;
    }

    .package-info-container h6 {
        font-size: 14px !important;
        text-transform: none !important;
        margin-bottom: 15px !important;
    }

    .pkg-summary-card {
        padding: 15px !important;
    }

    .packages-buttons {
        flex-direction: column;
        gap: 8px !important;
    }

    .packages-buttons a {
        border-radius: 7px !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        padding-top: 5px !important;
        padding-bottom: 5px !important;
        background: #63b6ff !important;
    }

    .packages-buttons button {
        border-radius: 7px !important;
        font-weight: 400 !important;
        font-size: 15px !important;
        padding-top: 5px !important;
        padding-bottom: 5px !important;
        border-color: #d9d9d9 !important;
    }

    .gom-card {
        padding: 5px 10px !important;
        margin-top: 5px !important;
    }

    .gom-card-gift,
    .program-box {
        padding: 15px 10px !important;
        border-radius: 7px !important;
    }

    .icon-circle {
        width: 100% !important;
        background: none !important;
        display: flex;
        justify-content: start !important;
        height: fit-content !important;
        margin-bottom: 5px !important;
    }

    .quick-access,
    .quick-access-title,
    .program-box-icon,
    .program-box-h5,
    .gp-box-icon,
    .gp-small {
        margin-bottom: 10px !important;
    }

    .program-box-h5,
    .gp-ha-title .start-today-banner h4 {
        font-size: 14px !important;
    }

    .program-box-desc,
    .gp-small,
    .gp-ha-desc,
    .start-today-banner p {
        font-size: 12px !important;
    }

    .program-features {
        margin-top: 15px !important;
    }

    .program-features:nth-child(1) {
        margin-top: 30px !important;
    }

    .quick-access-boxes,
    .gift-package-h6,
    .gift-package-row,
    .gp-ha,
    .gp-ha-boxes {
        margin-bottom: 15px !important;
    }

    .gp-box {
        padding: 25px 10px !important;
    }

    .gp-box-name {
        font-size: 17px !important;
    }

    .gp-box-percent {
        display: flex;
        justify-content: center;
        margin: 10px 0 !important;
    }

    .gp-box-percent span {
        font-size: 25px !important;
    }

    .gp-box-p {
        margin-right: 10px !important;
    }

    .gp-feature {
        padding: 0 !important;
        background: none !important;
        margin-top: 15px !important;
        margin-bottom: 15px !important;
    }

    .gp-feature-icon {
        padding: 0 !important;
        margin: 0 !important;
        margin-right: 10px !important;
    }

    .gp-feature-button {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        font-size: 14px !important;
        font-weight: 400 !important;
    }

    .step-number {
        width: 25px;
        height: 25px;
        min-width: 25px;
        min-height: 25px;
        font-size: 12px !important;
    }

    .start-today-banner {
        background-color: #fff;
        border-radius: 7px !important;
        padding: 35px 15px !important;
    }

    .gift-program-page {
        padding: 20px 7px 50px 7px;
    }
}
</style>