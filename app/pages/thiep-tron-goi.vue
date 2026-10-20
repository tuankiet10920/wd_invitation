<script setup>
import { ref, computed } from 'vue'
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue'
definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('tao-thiep-tron-goi')
useAppSeo(seoData)

const features = [
    {
        icon: '💎',
        title: 'Thiết kế chuyên nghiệp',
        desc: 'Lấy cảm hứng từ những xu hướng mới nhất. Giao diện đẹp, trải nghiệm mượt mà.'
    },
    {
        icon: '📱',
        title: 'Tối ưu đa nền tảng',
        desc: 'Hiển thị hoàn hảo trên mọi thiết bị: Điện thoại, máy tính bảng, máy tính.'
    },
    {
        icon: '❤️',
        title: 'Cá nhân hóa 100%',
        desc: 'Tùy chỉnh màu sắc, phông chữ, bố cục theo phong cách riêng của bạn.'
    },
    {
        icon: '💬',
        title: 'Quản lý khách mời',
        desc: 'Dễ dàng kiểm soát danh sách tham dự, gửi lời cảm ơn tự động.'
    },
    {
        icon: '🔒',
        title: 'Bảo mật cao',
        desc: 'Thông tin của bạn được mã hóa và bảo vệ tuyệt đối an toàn.'
    },
    {
        icon: '🎧',
        title: 'Hỗ trợ 24/7',
        desc: 'Luôn sẵn sàng giải đáp mọi thắc mắc của bạn trong quá trình sử dụng.'
    }
]

const testimonials = [
    {
        rating: 5,
        content: 'Tuyệt vời! Thiệp cưới rất đẹp, mọi người đều khen ngợi. Giao diện dễ sử dụng, mình làm xong chỉ trong 15 phút.',
        name: 'Trần Minh & Phương Lan',
        role: 'Hà Nội'
    },
    {
        rating: 5,
        content: 'Dịch vụ chăm sóc khách hàng rất tốt. Mình cần chỉnh sửa chút xíu vào lúc 10h đêm mà vẫn được hỗ trợ nhiệt tình.',
        name: 'Anh Tuấn & Mai Hà',
        role: 'TP.HCM'
    },
    {
        rating: 5,
        content: 'Ban đầu mình định thuê thiết kế bên ngoài mất cả triệu, may mà biết đến CineLove. Vừa rẻ vừa đẹp, ưng ý lắm!',
        name: 'Duy Hải & Thanh Tâm',
        role: 'Đà Nẵng'
    }
]

const packagesRes = [
    { id: 1, name: 'Gói 1', price: 149000, desc: '1 thiệp Nhà Trai hoặc Nhà Gái' },
    { id: 2, name: 'Gói 2', price: 219000, desc: '1 thiệp dùng chung cho Nhà Trai & Nhà Gái' },
    { id: 3, name: 'Gói 3', price: 249000, desc: 'Combo 2 thiệp (1 Nhà Trai + 1 Nhà Gái)', badge: '✨ Combo 2 thiệp' },
]

const addonsList = [
    { id: 'urgent', icon: '🔥', name: 'Làm gấp', price: 69000, desc: 'Hoàn thành trong vòng 24 giờ' },
    { id: 'names', icon: '', name: 'Tên khách mời tự động', price: 99000, desc: 'Cá nhân hóa hiển thị tên từng khách mời riêng biệt' },
    { id: 'extra', icon: '', name: 'Thiệp bổ sung thứ 3 trở đi', price: 90000, desc: 'VD: làm thêm thiệp bảo hỷ, ...', unit: '/thiệp' },
    { id: 'custom', icon: '', name: 'Tùy chỉnh nội dung chuyên sâu', price: 50000, desc: 'Các thay đổi liên quan tới màu sắc, bố cục (có thể thỏa đổi sau)', unit: '/yêu cầu' },
]

const selectedPackageId = ref(2);
const selectedAddonIds = ref([]);

const totalPrice = computed(() => {
    const pkg = packagesRes.find(p => p.id === selectedPackageId.value);
    const addonsTotal = addonsList
        .filter(a => selectedAddonIds.value.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0);
    return (pkg ? pkg.price : 0) + addonsTotal;
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

const selectedPackage = computed(() => packagesRes.find(p => p.id === selectedPackageId.value));
</script>

<template>
    <main class="landing-page">

        <!-- HERO SECTION -->
        <section class="hero-section">
            <div class="container">
                <div class="nav-breadcumb w-100 d-flex justify-content-between align-items-center mb-4">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item">
                                <NuxtLink to="/" class="text-decoration-none">
                                    <button class="d-flex align-items-center">
                                        <BaseIconComponent class="me-1" :name="`house`" :color="`#00000073`" />
                                        <span class="text text-decoration-none">Trang chủ</span>
                                    </button>
                                </NuxtLink>
                            </li>
                            <li class="breadcrumb-item" aria-current="page">
                                <button>
                                    <span>Thiệp trọn gói</span>
                                </button>
                            </li>
                        </ol>
                    </nav>
                </div>
                <div class="row align-items-center">
                    <div class="col-lg-6 hero-content">
                        <h1 class="hero-title">
                            Dịch vụ tạo thiệp cưới<br>
                            online <span class="text-gradient">trọn gói</span>
                        </h1>

                        <p class="hero-desc">
                            Với dịch vụ <strong>thiệp trọn gói</strong> của CineLove, bạn sẽ được CineLove sẽ tự vận
                            và <strong>thiết kế – hoàn thiện</strong> thiệp cho bạn từ A-Z, sau đó bàn giao thiệp sẵn
                            sàng sử dụng. Khác với mô hình <strong>tài khoản</strong> mà bạn tự tạo/tự chỉnh thiệp
                            trên hệ thống.
                        </p>

                        <div class="price-badge mb-4">
                            <span class="fire-icon">🔥</span>
                            <span class="price-label">CHỈ TỪ</span>
                            <span class="price-amount">149k</span>
                            <span class="price-unit">VNĐ</span>
                        </div>

                        <div class="hero-actions d-flex gap-3 mb-4">
                            <button class="btn btn-primary-gradient btn-lg rounded-pill">
                                Xem gói dịch vụ
                            </button>
                            <button class="btn btn-outline-primary-custom btn-lg rounded-pill">
                                Xem các mẫu thiệp
                            </button>
                        </div>

                        <div class="hero-stats d-flex align-items-center gap-4">
                            <div class="stat-item d-flex align-items-center gap-2">
                                <span class="stat-icon">⭐</span>
                                <span class="stat-text text-secondary">4.9/5 đánh giá</span>
                            </div>
                            <div class="stat-item d-flex align-items-center gap-2">
                                <span class="stat-icon small text-primary">👥</span>
                                <span class="stat-text text-secondary">1000+ cặp đôi tin tưởng</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 hero-image position-relative">
                        <!-- Multiple phone mockups -->
                        <div class="phones-grid">
                            <img src="https://assets.cinelove.me/images/cinelove-template-thumbnail.jpg"
                                alt="Wedding invitation 1" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Thiệp cưới online trọn gói SECTION -->
        <section class="package-features-section pt-5 pb-1">
            <div class="container">
                <div class="text-center mb-4">
                    <h2 class="section-title-main fw-bold">Thiệp cưới online trọn gói</h2>
                    <p class="section-desc">
                        Chọn gói thiệp phù hợp với nhu cầu của bạn. Không cần tạo tài khoản, thanh toán 1 lần duy nhất.
                    </p>
                </div>

                <div class="features-highlight-box">
                    <div class="row g-4">
                        <!-- Left Column -->
                        <div class="col-md-6 features-box">
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>Quản lý khách mời, xác nhận tham dự & hộp lời chúc</span>
                            </div>
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>Cá nhân hóa tên từng khách mời</span>
                            </div>
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>Nhạc nền thiệp cưới</span>
                            </div>
                        </div>

                        <!-- Center Title -->
                        <div class="col-12 text-center features-title-wrapper">
                            <h5 class="features-title">✨ Tính năng nổi bật</h5>
                        </div>

                        <!-- Right Column -->
                        <div class="col-md-6 features-box">
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>Đầy đủ thông tin cơ cưới – trình bày chỉnh chu</span>
                            </div>
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>QR mừng cưới tiện lợi</span>
                            </div>
                            <div class="feature-item-inline">
                                <BaseIconComponent class="me-2 feature-check-icon" name="check-circle" color="#268e6c"
                                    :size="15" />
                                <span>Lưu trữ thiệp đến 1 năm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Bảng giá SECTION -->
        <section class="pricing-table-section py-5">
            <div class="container">
                <div class="pricing-main-box bg-white p-4 rounded-4">
                    <h2 class="text-center fw-bold mb-5">Bảng giá</h2>

                    <!-- Pricing Cards -->
                    <div class="row g-4 mb-4">
                        <div v-for="pkg in packagesRes" :key="pkg.id" class="col-lg-4">
                            <div class="pricing-package-card cursor-pointer"
                                :class="{ 'selected': selectedPackageId === pkg.id, 'pricing-package-featured': pkg.id === 2 }"
                                @click="selectedPackageId = pkg.id">
                                <h5 class="package-name">{{ pkg.name }}</h5>
                                <p class="package-desc">{{ pkg.desc }}</p>
                                <div class="package-price-box">
                                    <div class="package-price" :class="{ 'package-price-featured': pkg.id === 2 }">
                                        {{ formatPrice(pkg.price) }}
                                    </div>
                                </div>
                                <div v-if="pkg.badge" class="combo-badge-bottom mt-3">{{ pkg.badge }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Completion Time -->
                    <div class="text-center mb-4">
                        <p class="completion-time" style="color: #6b7280;">⏰ Thời gian hoàn thiện: 2-3 ngày</p>
                    </div>

                    <!-- Add-on Services -->
                    <div class="addon-services-box mb-4">
                        <h6 class="addon-title">➕ Dịch vụ bổ sung (tùy chọn):</h6>

                        <div v-for="addon in addonsList" :key="addon.id" class="addon-item">
                            <input type="checkbox" class="addon-checkbox" :id="addon.id" :value="addon.id"
                                v-model="selectedAddonIds">
                            <label :for="addon.id" class="addon-label-full mb-0 cursor-pointer">
                                <div class="addon-content">
                                    <div class="addon-name">{{ addon.icon }} {{ addon.name }}</div>
                                    <div class="addon-desc">{{ addon.desc }}</div>
                                </div>
                                <div class="addon-price">
                                    {{ formatPrice(addon.price) }}
                                    <br v-if="addon.unit">
                                    <span v-if="addon.unit" class="addon-unit">{{ addon.unit }}</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Total Payment -->
                    <div class="total-payment-box mb-4">
                        <div class="total-label">Tổng thanh toán</div>
                        <div class="total-amount">{{ formatPrice(totalPrice) }}</div>
                        <div class="total-desc">{{ selectedPackage.name }} - {{ selectedPackage.desc }}</div>

                        <div v-if="selectedAddonIds.length > 0">
                            <hr class="hr-line my-3 opacity-25">
                            <div class="selected-addons-list">
                                <div v-for="id in selectedAddonIds" :key="id" class="selected-addon-item">
                                    + {{addonsList.find(a => a.id === id).name}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Register Button -->
                    <div class="text-center">
                        <button class="btn-register-now">
                            🎨 Đăng ký ngay - {{ formatPrice(totalPrice) }}
                        </button>
                        <p class="register-note">💡 Chúng tôi sẽ liên hệ trong vòng 4 giờ sau khi thanh toán</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Khách hàng nói gì về CineLove SECTION -->
        <section class="testimonials-section py-5">
            <div class="container">
                <div class="text-center mb-5 title-bar">
                    <h2 class="fw-bold section-title-main">Khách hàng nói gì về CineLove</h2>
                    <p class="section-desc">
                        Những phản hồi chân thực từ các cặp đôi đã sử dụng dịch vụ của CineLove
                    </p>
                </div>

                <div class="row g-4">
                    <!-- Testimonial 1 -->
                    <div class="col-lg-4">
                        <div class="testimonial-card">
                            <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                            <p class="testimonial-content">
                                "Dịch vụ tạo thiệp trọn gói của Cinelove thực sự tuyệt vời! Thiết kế đẹp, dễ sử dụng và
                                khách mời rất thích. Nhất là chức năng hộp lời chúc. Chúng mình đã nhận được rất nhiều
                                lời chúc tuyệt vời."
                            </p>
                            <div class="testimonial-author">
                                <div class="author-avatar">
                                    <span class="avatar-icon">💗</span>
                                </div>
                                <div class="author-info">
                                    <div class="author-name">Tuấn Minh & Phương Lan</div>
                                    <div class="author-location">Hà Nội</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Testimonial 2 -->
                    <div class="col-lg-4">
                        <div class="testimonial-card">
                            <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                            <p class="testimonial-content">
                                "Trợ giúp đắc lực trước khí, mọi thứ đều hoàn hảo. Đội ngũ hỗ trợ rất nhiệt tình và
                                chuyên nghiệp. Chúng mình rất hài lòng với dịch vụ này."
                            </p>
                            <div class="testimonial-author">
                                <div class="author-avatar">
                                    <span class="avatar-icon">💗</span>
                                </div>
                                <div class="author-info">
                                    <div class="author-name">Anh Đức & Thu Hà</div>
                                    <div class="author-location">TP.HCM</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Testimonial 3 -->
                    <div class="col-lg-4">
                        <div class="testimonial-card">
                            <div class="stars mb-3">⭐⭐⭐⭐⭐</div>
                            <p class="testimonial-content">
                                "Thiệp cưới online của 2 đứa chúng mình trông rất chuyên nghiệp và sang trọng. Khách mời
                                đã đáng xác nhận tham dự và gửi quà mừng cưới luôn trong hộp mừng QR. Cảm ơn Cinelove
                                rất nhiều!"
                            </p>
                            <div class="testimonial-author">
                                <div class="author-avatar">
                                    <span class="avatar-icon">💗</span>
                                </div>
                                <div class="author-info">
                                    <div class="author-name">Duy Tuấn & Mai Anh</div>
                                    <div class="author-location">Đà Nẵng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA SECTION -->
        <section class="cta-final-section">
            <div class="cta-overlay"></div>
            <div class="container position-relative">
                <div class="cta-content text-center">
                    <h2 class="cta-title">Sẵn sàng tạo thiệp cưới hoàn hảo?</h2>
                    <p class="cta-desc">
                        Liên hệ ngay với CineLove để được tư vấn miễn phí và tạo ra thiệp cưới
                        đẹp nhất, ấn tượng cho ngày trọng đại của bạn.
                    </p>
                    <div class="cta-buttons">
                        <button class="btn-cta-outline">Liên hệ tư vấn</button>
                        <button class="btn-cta-outline">Xem các mẫu thiệp</button>
                    </div>
                </div>
            </div>
        </section>

    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* VARIABLES */
.landing-page {
    --primary-color: #FD3078;
    --primary-gradient: linear-gradient(135deg, #FF5E93 0%, #FD3078 100%);
    --secondary-color: #FFF0F5;
    --text-dark: #334155;
    --text-light: #64748B;
    --border-radius-xl: 24px;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    color: var(--text-dark);
    background-color: #fff;
    overflow-x: hidden;
}

/* UTILS */
.text-gradient {
    background: var(--primary-gradient);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

.btn-primary-gradient {
    background: var(--primary-gradient);
    border: none;
    color: white;
    box-shadow: 0 10px 20px -5px rgba(253, 48, 120, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
}



.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 25px -5px rgba(253, 48, 120, 0.5);
    color: white;
}

.btn-outline-soft {
    border: 2px solid #ddd;
    color: var(--text-dark);
}

.btn-outline-soft:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.section-title {
    font-size: 2rem;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

/* HERO SECTION */
.hero-section {
    padding: 80px 0;
    overflow: hidden;
    background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}

.hero-title {
    font-size: 3.5rem;
    line-height: 1.2;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    color: #1a1a1a;
}

.text-gradient {
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
}

.hero-desc {
    font-size: 16px;
    line-height: 1.7;
    color: #4b5563;
    margin-bottom: 24px;
    max-width: 540px;
}

.hero-desc strong {
    color: #1f2937;
    font-weight: 600;
}

/* Price Badge */
.price-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #fb923c 0%, #f472b6 100%);
    padding: 18px 25px;
    border-radius: 50px;
    box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
    border: 2px solid #faca15;
}

.price-label {
    font-size: 12px;
    font-weight: 600;
    color: white;
    letter-spacing: 0.5px;
}

.price-amount {
    font-size: 30px;
    font-weight: 900;
    color: #fce96a;
    line-height: 1;
    letter-spacing: 1.1px;
}

.price-unit {
    font-size: 12px;
    font-weight: 600;
    color: white;
}

/* Buttons */
.btn-primary-gradient {
    background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
    border: none;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
    transition: all 0.3s;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(168, 85, 247, 0.4);
    color: white;
}

.btn-outline-primary-custom {
    border: 2px solid;
    font-weight: 600;
    background: white;
    transition: all 0.3s;
    border-color: #ec4899;
    color: #ec4899;
}

.btn-outline-primary-custom:hover {
    background: #fdf2f8;
}

/* Hero Stats */
.hero-stats {
    margin-top: 24px;
}

.stat-item {
    font-size: 14px;
    color: #6b7280;
}

.stat-icon {
    font-size: 16px;
}

.stat-text {
    font-weight: 500;
}

@media (max-width: 991px) {
    .hero-section {
        padding: 40px 0;
    }

    .hero-title {
        font-size: 2.2rem;
        text-align: left;
    }

    .hero-desc {
        text-align: left;
    }

    .price-badge {
        display: flex;
        justify-content: center;
        width: fit-content;
        margin: 0 auto 30px auto;
        padding: 10px 18px !important;
    }

    .price-badge .fire-icon {
        font-size: 16px !important;
    }

    .price-label {
        font-size: 10px !important;
    }

    .price-amount {
        font-size: 22px !important;
    }

    .price-unit {
        font-size: 10px !important;
    }

    .hero-actions {
        flex-direction: column;
        gap: 15px !important;
    }

    .hero-actions button {
        width: 100%;
        margin: 0;
    }

    .hero-stats {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 12px !important;
    }

    .hero-image {
        margin-top: 20px;
    }
}

/* Phones Grid */
.phones-grid {
    position: relative;
    height: 400px;
    width: 100%;
    padding: 20px;
    overflow: hidden;
    border-radius: 20px;
}

.phones-grid img {
    border-radius: 20px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.phone-mockup {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
    background: white;
    border: 6px solid #1a1a1a;
}

.phone-mockup img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.phone-mockup:hover {
    transform: translateY(-10px) scale(1.05);
    z-index: 10;
}

/* Individual phone positioning */
.phone-1 {
    transform: rotate(-8deg) translateY(20px);
}

.phone-2 {
    transform: rotate(-4deg) translateY(-10px);
}

.phone-3 {
    transform: rotate(2deg) translateY(30px);
}

.phone-4 {
    transform: rotate(6deg) translateY(-5px);
}

.phone-5 {
    transform: rotate(10deg) translateY(15px);
}

/* Old styles - keeping for compatibility */
.hero-tag {
    background: #FFF0F6;
    color: #DB2777;
    padding: 8px 16px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 0.9rem;
}

.badge-soft {
    background-color: rgba(253, 48, 120, 0.1);
    color: var(--primary-color);
    padding: 6px 16px;
    border-radius: 99px;
    font-weight: 600;
    font-size: 0.9rem;
    display: inline-block;
}

.price-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #FFEDF4;
    padding: 10px 24px;
    border-radius: 50px;
}

.price-pill .amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: #db2777;
    line-height: 1;
}

.phones-container {
    position: relative;
    height: 500px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.phone {
    position: absolute;
    width: 240px;
    height: 480px;
    border-radius: 30px;
    border: 8px solid #111;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background: white;
    transition: transform 0.5s ease;
}

.phone img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.phone-back {
    transform: rotate(-10deg) translateX(-60px) scale(0.9);
    z-index: 1;
    top: 20px;
}

.phone-front {
    transform: rotate(5deg) translateX(40px);
    z-index: 2;
    top: 40px;
    border-color: #333;
}

/* FEATURES */
.package-features-section {
    background: #fafafa;
}

.section-title-main {
    font-size: 2.5rem;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
}

.section-desc {
    font-size: 20px;
    line-height: 1.6;
    color: #6b7280;
    max-width: 1000px;
    margin: 0 auto;
}

.features-highlight-box {
    background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
    border-radius: 20px;
    padding: 25px 20px 10px 20px;
    margin-top: 32px;
    border: 1px solid #fecaca;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.features-title-wrapper {
    order: -1;
    margin-bottom: 0px;
}

.features-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.feature-item-inline {
    display: flex;
    justify-content: start;
    margin-bottom: 16px;
    align-items: center;
}

.feature-item-inline span {
    font-size: 14px;
    line-height: 1.2;
    color: #374151;
}

@media (max-width: 991px) {
    .features-highlight-box {
        padding: 15px;
        margin-top: 24px;
    }

    .features-title {
        font-size: 16px;
    }

    .feature-item-inline {
        margin-bottom: 12px;
    }

    .feature-item-inline span {
        font-size: 11.5px;
    }

    .feature-check-icon {
        width: 16px !important;
        height: 16px !important;
    }

    .features-box {
        margin-top: 0;
    }

    .package-features-section {
        padding: 10px 0 !important;
    }

    .pricing-table-section {
        padding: 10px 13px !important;
    }

    .pricing-table-section h2 {
        margin-bottom: 20px !important;
    }
}

/* BREADCRUMB STYLES */
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
    margin-top: 0;
}


.feature-card {
    background: #fff;
    border-radius: var(--border-radius-xl);
    padding: 2rem;
    height: 100%;
    border: 1px solid #f1f5f9;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: rgba(253, 48, 120, 0.2);
}

.icon-box {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFF1F2;
    border-radius: 16px;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}

/* PRICING TABLE SECTION */
.pricing-table-section {
    background: #fafafa;
}

.pricing-main-box {
    box-shadow: 0 0 #000000, 0 0 #000000, 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.pricing-package-card {
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s;
    position: relative;
    height: 100%;
}

.pricing-package-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.pricing-package-featured {
    border: 2px solid #60a5fa;
    background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}

.package-name {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
}

.package-desc {
    font-size: 14px;
    line-height: 1.5;
    color: #6b7280;
    margin-bottom: 16px;
    min-height: 42px;
}

.package-price-box {
    background: #f0f5ff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #c3ddfd;
}

.package-price {
    font-size: 24px;
    font-weight: 800;
    color: #2563eb;
}

.package-price-featured {
    color: #2563eb;
}

.combo-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #fbbf24;
}

.completion-time {
    font-size: 14px;
    color: #dc2626;
    font-weight: 500;
    margin: 0;
}

@media (max-width: 991px) {
    .pricing-table-section .container {
        padding: 0px !important;
    }

    .pricing-package-card {
        padding: 20px;
    }

    .package-price-box {
        padding: 5px;
        background: #f0f7ff;
        border: 1px solid #c3ddfd;
    }

    .package-desc {
        min-height: 0;
    }

    .completion-time {
        color: #000;
    }

    .addon-desc,
    .total-desc,
    .register-note {
        font-size: 12px !important;
    }

    .addon-services-box {
        padding: 10px !important;
    }

    .package-price {
        font-size: 24px;
    }

    .combo-badge-bottom {
        font-size: 12px;
        color: #8b5cf6;
        font-weight: 600;
    }
}

.cursor-pointer {
    cursor: pointer;
}

.pricing-package-card {
    position: relative;
    border: 1px solid #e5e7eb;
    background: #fff;
    transition: all 0.3s;
}

.pricing-package-card:hover {
    border-color: #4c8df6;
}

.pricing-package-card.selected {
    border-color: #4c8df6 !important;
    background-color: rgba(76, 141, 246, 0.08);
    box-shadow: 0 10px 30px rgba(21, 35, 56, 0.2);
    transform: scale(1.04);
    z-index: 4;
}

.selection-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5;
}

.addon-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 12px;
    background: #fff;
    transition: all 0.2s;
}

.addon-item:hover {
    border-color: #4c8df6;
    background-color: rgba(76, 141, 246, 0.02);
}

.addon-item.selected-addon {
    border-color: #4c8df6;
    background-color: rgba(76, 141, 246, 0.08);
}

/* Add-on Services */
.addon-services-box {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
}

.addon-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
}

.addon-checkbox {
    margin-top: 4px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    flex-shrink: 0;
    border-radius: 4px;
}

.addon-label-full {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    cursor: pointer;
    flex: 1;
    gap: 12px;
}

.addon-content {
    flex: 1;
}

.addon-name {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
}

.addon-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
}

.addon-price {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    text-align: right;
    white-space: nowrap;
    flex-shrink: 0;
}

.addon-unit {
    font-size: 12px;
    font-weight: 400;
    color: #9ca3af;
}

/* Old addon styles - remove if not needed */
.addon-left {
    display: flex;
    align-items: flex-start;
    flex: 1;
}

.addon-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    flex: 1;
}

.addon-icon {
    font-size: 18px;
}

.addon-info {
    flex: 1;
}

/* Total Payment */
.total-payment-box {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
}

.total-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
}

.total-amount {
    font-size: 32px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 8px;
}

.total-desc {
    font-size: 14px;
    color: #6b7280;
}

.selected-addons-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.selected-addon-item {
    font-size: 14px;
    color: #4b5563;
    display: flex;
    align-items: center;
}

/* Register Button */
.btn-register-now {
    background: #3a9bff;
    color: white;
    font-size: 18px;
    padding: 7px 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-register-now:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(236, 72, 153, 0.4);
}

.register-note {
    font-size: 12px;
    color: #6b7280;
    margin-top: 16px;
    margin-bottom: 0;
}

@media (max-width: 991px) {
    .btn-register-now {
        width: 100%;
        padding: 14px 20px;
        font-size: 16px;
    }

    .total-amount {
        font-size: 26px;
    }

    .addon-name {
        font-size: 14px;
    }

    .addon-price {
        font-size: 14px;
    }
}

/* PRICING */
.bg-light-soft {
    background-color: #F8FAFC;
}

.pricing-card {
    background: #fff;
    border-radius: var(--border-radius-xl);
    padding: 2.5rem 2rem;
    border: 1px solid #e2e8f0;
    position: relative;
    transition: all 0.3s;
}

.pricing-card.featured {
    border: 2px solid var(--primary-color);
    box-shadow: 0 20px 40px -12px rgba(253, 48, 120, 0.2);
    transform: scale(1.02);
    z-index: 2;
}

.popular-badge {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-gradient);
    color: white;
    padding: 6px 20px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
    box-shadow: 0 4px 10px rgba(253, 48, 120, 0.3);
}

.pkg-name {
    font-weight: 800;
    font-size: 1.4rem;
    margin-bottom: 0.25rem;
}

.current-price {
    font-size: 2.5rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1px;
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.feature-list li {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.feature-list li.inactive {
    opacity: 0.5;
    text-decoration: line-through;
}

/* TESTIMONIALS SECTION */
.testimonials-section {
    background: white;
}

.testimonial-card {
    background: #f9fafb;
    border: 1px solid #f9fafb;
    border-radius: 16px;
    padding: 28px;
    height: 100%;
    transition: all 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.testimonial-card .stars {
    font-size: 16px;
    line-height: 1;
}

.testimonial-content {
    font-size: 14px;
    line-height: 1.7;
    color: #4b5563;
    font-style: italic;
    margin-bottom: 24px;
    min-height: 120px;
}

.testimonial-author {
    display: flex;
    align-items: center;
    gap: 12px;
}

.author-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.avatar-icon {
    font-size: 24px;
}

.author-info {
    flex: 1;
}

.author-name {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
}

.author-location {
    font-size: 13px;
    color: #9ca3af;
}

.hero-actions button {
    font-size: 15px;
    padding: 12px 30px;
}

.hero-actions button:first-child {
    border: 2px solid #fff;
}

/* TESTIMONIALS */
.review-card {
    background: #fff;
    border-radius: var(--border-radius-xl);
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
    border: 1px solid #f8fafc;
}

.avatar-placeholder {
    width: 50px;
    height: 50px;
    background: #e2e8f0;
}

/* CTA FINAL SECTION */
.cta-final-section {
    position: relative;
    padding: 60px 20px;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
        url('/others/slider.webp');
    background-size: cover;
    background-position: center;
}

.cta-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 60%, #751a3d99 100%);
    z-index: 1;
}

.cta-final-section .container {
    z-index: 2;
}

.cta-content {
    max-width: 800px;
    margin: 0 auto;
}

.cta-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
    line-height: 1.2;
}

.cta-desc {
    font-size: 16px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 32px;
}

.cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-cta-outline {
    background: transparent;
    border: 2px solid white;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 14px 32px;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cta-outline:hover {
    background: white;
    color: #1f2937;
}

/* CTA */
.bottom-cta {
    padding: 80px 20px;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1546193430-c2d207799309?q=80&w=2000&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    border-radius: 30px 30px 0 0;
    margin-top: 40px;
}

.btn-soft-pink {
    background: #FFF0F6;
    color: #BE185D;
    font-weight: 600;
}

.btn-soft-pink:hover {
    background: #FCE7F3;
    color: #831843;
}

@media (max-width: 991px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-section {
        text-align: center;
        padding: 40px 0;
    }

    .hero-desc {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
    }

    .hero-actions {
        justify-content: center;
        flex-direction: column;
    }

    .hero-actions .btn {
        width: 100%;
    }

    .hero-content {
        margin-bottom: 5px;
    }

    .hero-stats {
        justify-content: center;
        flex-direction: column;
        gap: 16px !important;
    }

    .pricing-card.featured {
        transform: scale(1);
    }

    .phones-grid {
        grid-template-columns: repeat(3, 1fr);
        height: 400px;
    }

    .phone-mockup:nth-child(4),
    .phone-mockup:nth-child(5) {
        display: none;
    }
}

@media (max-width: 768px) {

    .package-name,
    .cta-desc {
        font-size: 15px !important;
    }

    .package-desc,
    .testimonial-content,
    .author-location {
        font-size: 12px !important;
    }

    .testimonial-content {
        min-height: 0px;
        margin-bottom: 10px;
    }

    .package-price,
    .total-amount {
        font-size: 18px !important;
    }

    .pricing-main-box {
        padding: 10px 14px !important;
    }

    .addon-name,
    .total-label,
    .selected-addon-item,
    .testimonial-card .stars,
    .author-name {
        font-size: 13px !important;
    }

    .addon-desc {
        font-size: 10px !important;
    }

    .total-payment-box {
        padding: 16px;
    }

    .btn-register-now {
        padding-top: 8px;
        padding-bottom: 8px;
    }

    .features-title-wrapper {
        margin-bottom: 10px !important;
    }

    .hr-line {
        margin-top: 3px !important;
        margin-bottom: 3px !important;
    }

    .testimonials-section {
        padding-top: 25px !important;
        padding-bottom: 25px !important;
    }

    .section-title-main,
    .cta-title {
        font-size: 20px !important;
    }

    .cta-title {
        margin-bottom: 7px !important;
    }

    .section-desc {
        font-size: 16px;
        max-width: 88%;
    }

    .testimonial-card {
        padding: 15px;
    }

    .title-bar {
        margin-bottom: 20px !important;
    }

    .cta-final-section {
        padding: 30px 20px !important;
    }

    .cta-final-section .container {
        padding: 0 !important;
    }

    .cta-buttons {
        width: 100%;
    }

    .cta-desc {
        margin-bottom: 20px;
    }

    .cta-buttons button {
        width: 100%;
        font-size: 14px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
}

@media (max-width: 576px) {
    .hero-title {
        font-size: 2rem;
    }

    .phones-grid {
        grid-template-columns: repeat(2, 1fr);
        height: 300px;
        padding: 0;
    }

    .phone-mockup:nth-child(3) {
        display: none;
    }
}
</style>
