<script setup>
import BreadcumbNormalComponent from '~/coms/breadcumb/BreadcumbNormalComponent.vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import { useUserStore } from '~~/stores/user';
definePageMeta({
    layout: 'user-default'
})

const seoData = await useSeoPage('goi-dich-vu')
useAppSeo(seoData)

const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getDiscount = (original, sale) => {
    if (!original || !sale || sale >= original) return 0;
    return Math.round(((original - sale) / original) * 100);
};

const plans = ref([]);

const fetchPackages = async () => {
    try {
        const response = await $fetch('/api/v1/client/packages');
        if (response && response.data && response.data.data) {
            plans.value = response.data.data;
        }
    } catch (error) {
        console.error("Failed to fetch packages:", error);
    }
}

onMounted(() => {
    fetchPackages();
});

const planFree = computed(() => plans.value.find(p => p.level === 1));
const planBasic = computed(() => plans.value.find(p => p.level === 2));
const planPremium = computed(() => plans.value.find(p => p.level === 3));

const featuresList = computed(() => {
    if (!plans.value.length) return [];

    // Package limits mapped to comparison table rows
    const limitsRows = [
        {
            name: 'Số lượng website/thiệp có thể tạo',
            free: `${planFree.value?.number_of_cards || 1} thiệp`,
            basic: `${planBasic.value?.number_of_cards || 3} thiệp`,
            premium: planPremium.value?.number_of_cards >= 1000 ? 'Không giới hạn' : `${planPremium.value?.number_of_cards || 5} thiệp`
        },
        {
            name: 'Thời hạn lưu website',
            free: `${planFree.value?.time_save_card || 6} tháng`,
            basic: `${planBasic.value?.time_save_card || 24} tháng`,
            premium: planPremium.value?.time_save_card >= 100 ? 'Vĩnh viễn' : `${planPremium.value?.time_save_card || 60} tháng`
        },
        {
            name: 'Số lượng hình ảnh tải lên',
            free: `${planFree.value?.image_limits || 10} hình`,
            basic: `${planBasic.value?.image_limits || 50} hình`,
            premium: planPremium.value?.image_limits >= 1000 ? 'Không giới hạn' : `${planPremium.value?.image_limits || 100} hình`
        },
        {
            name: 'Số lượt xem thiệp/website tối đa',
            free: `${formatPrice(planFree.value?.maximum_views || 300)} lượt`,
            basic: `${formatPrice(planBasic.value?.maximum_views || 10000)} lượt`,
            premium: `${formatPrice(planPremium.value?.maximum_views || 50000)} lượt`
        }
    ];

    // Use the first plan's feature list to iterate
    const allFeatures = plans.value[0]?.feature_list || [];

    const dbFeaturesRows = allFeatures.map(f => {
        const row = { name: f.name, free: false, basic: false, premium: false };

        if (planFree.value) {
            const feat = planFree.value.feature_list.find(pf => pf.id_feature === f.id_feature);
            row.free = feat ? feat.status === 1 : false;
        }
        if (planBasic.value) {
            const feat = planBasic.value.feature_list.find(pf => pf.id_feature === f.id_feature);
            row.basic = feat ? feat.status === 1 : false;
        }
        if (planPremium.value) {
            const feat = planPremium.value.feature_list.find(pf => pf.id_feature === f.id_feature);
            row.premium = feat ? feat.status === 1 : false;
        }

        return row;
    });

    return [...limitsRows, ...dbFeaturesRows];
});

const breadcumb = computed(() => [
    { id: 1, text: 'Trang chủ', path: '/', icon: 'home' },
    { id: 2, text: 'Gói dịch vụ', path: '#' }
]);

const userStore = useUserStore();
const currentPlanName = computed(() => {
    if (!userStore.isLogin) return null;
    if (userStore.role === 'admin') return 'Admin';
    // Simplified logic: usually users have a package_level or similar
    // We'll default to 'Free' if not specified, but this should be adjusted to your data
    return 'Premium';
});

const currentPlanLevel = computed(() => {
    if (!userStore.isLogin) return 0;
    if (userStore.role === 'admin') return 3; // Admin has highest level
    if (currentPlanName.value === 'Premium') return 3;
    if (currentPlanName.value === 'Basic') return 2;
    if (currentPlanName.value === 'Free') return 1;
    return 1;
});

const faqs = [
    {
        q: 'Tôi có thể nâng cấp gói dịch vụ sau khi đăng ký không?',
        a: 'Có, bạn có thể dễ dàng nâng cấp lên gói cao hơn bất kỳ lúc nào. Chỉ cần đăng nhập vào tài khoản của bạn và chọn tùy chọn nâng cấp.'
    },
    {
        q: 'Thời hạn lưu trữ website/thiệp là gì?',
        a: 'Là thời hạn các website/thiệp của bạn có thể hiển thị và truy cập. Sau khi hết hạn, các website/thiệp của bạn sẽ không còn hiển thị, không truy cập được và sẽ bị xóa sau 30 ngày. Thời hạn lưu trữ phụ thuộc vào gói bạn sử dụng. Gói Free: 6 tháng, Basic: 2 năm, và Premium: 5 năm. Có thể nâng cấp thời hạn lưu trữ bất cứ lúc nào.'
    },
    {
        q: 'Tôi có thể tạo bao nhiêu thiệp hoặc website?',
        a: 'Số lượng thiệp/website bạn có thể tạo phụ thuộc vào gói: Free: 1, Basic: 3, và Premium: 5. Có thể nâng cáp thêm số lượng tuỳ theo nhu cầu sử dụng.'
    },
    {
        q: 'Lượt xem trang/thiệp tối đa là gì?',
        a: 'Lượt xem trang/thiệp tối đa là số lần người dùng có thể truy cập và xem website/thiệp của bạn. Giới hạn này phụ thuộc vào gói bạn sử dụng: Gói Free: 300 lượt, Basic: 10000 lượt, và Premium: 50000 lượt. Khi đạt giới hạn lượt xem, website/thiệp của bạn sẽ tạm thời không thể truy cập cho đến khi bạn nâng cấp hoặc mua thêm addon. Lượt xem được tính cho mỗi lần người dùng truy cập vào trang, bao gồm cả việc refresh.'
    },
    {
        q: 'Tôi có được sử dụng template Basic và Premium không?',
        a: 'Gói Basic cho phép bạn sử dụng các template Basic với thiết kế chuyên nghiệp. Gói Premium cung cấp quyền truy cập vào cả template Basic và Premium độc quyền với nhiều tính năng và hiệu ứng cao cấp hơn.'
    },
    {
        q: 'Gói dịch vụ có thời hạn bao lâu?',
        a: 'Tất cả các gói trả phí (Basic và Premium) đều có thời hạn 1 năm. Sau khi hết hạn bạn có thể tiếp tục gia hạn, hoặc nếu không, bạn vẫn có thể truy cập vào các tài nguyên đã tạo trước đó. Các thiệp/website đã xuất bản sẽ vẫn được giữ nguyên thời hạn lưu trữ như cũ.'
    },
    {
        q: "Tính năng 'Tên khách mời tự động' là gì?",
        a: "Tính năng này cho phép bạn tạo 1 mẫu thiệp duy nhất nhưng gửi cho mỗi khách mời sẽ tự động hiển thị tên của họ. Ví dụ: cùng 1 thiệp cưới, nhưng 'Anh Minh' sẽ thấy 'Trân trọng kính mời Anh Minh', còn 'Bạn Lan' sẽ thấy 'Thân mời Bạn Lan',... Bạn không cần tạo nhiều thiệp khác nhau, chỉ cần 1 mẫu duy nhất."
    },
    {
        q: 'Tôi có thể tạo bao nhiêu Tên khách mời tự động?',
        a: 'Bạn có thể tạo không giới hạn số lượng tên khách mời tự động. Bạn có thể thêm hàng loạt tên chỉ với 1 click, xuất file CSV để quản lý, và theo dõi trạng thái đã gửi/chưa gửi cho từng khách mời.'
    }
];
</script>

<template>
    <div class="pricing-page container my-5">

        <BreadcumbNormalComponent :config="breadcumb" />

        <!-- HEADER -->
        <div class="pricing-header text-center mb-2">
            <h1 class="page-title fw-bold">Bảng giá dịch vụ</h1>
            <p class="text-muted text-pricing-header">Lựa chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn để
                tạo ra những website
                cưới, thiệp mời và trang web đặc biệt tuyệt đẹp và ấn tượng</p>
        </div>

        <!-- CURRENT PLAN -->
        <div v-if="userStore.isLogin && currentPlanName" class="d-flex justify-content-center mb-5">
            <div class="current-plan-badge">
                <BaseIconComponent name="star" type="mdi" :size="16" color="#2563eb" />
                <span class="badge-text">Gói hiện tại: <span class="fw-bold">{{ currentPlanName }}</span></span>
            </div>
        </div>

        <!-- PROMO BANNER -->
        <div class="promo-banner mb-5 text-center text-white">
            <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
                <span class="emoji fs-3">🔥</span>
                <h4 class="m-0 fw-bold text-uppercase">Chương trình khuyến mãi đặc biệt</h4>
                <span class="emoji fs-3">🔥</span>
            </div>
            <p class="mb-0 fs-18 lh-28px">Giảm giá lên đến <span class="fw-bold text-warning">15%</span> cho các gói
                Basic &
                Premium</p>
            <small class="d-block text-white lh-24px fs-16 mt-2">⏳ Khuyến mãi có hạn - Đăng ký ngay!</small>
        </div>

        <!-- PRICING CARDS -->
        <div class="row g-4 mb-5">
            <!-- FREE PLAN -->
            <div class="col-lg-4">
                <div class="pricing-card pricing-card-free">
                    <!-- Stackable Headers -->
                    <div class="card-headers">
                        <div v-if="currentPlanName === 'Free'" class="card-header-status bg-blue-header">
                            <p class="mb-0 text-white fw-bold">
                                <BaseIconComponent name="star" type="mdi" :size="14" color="#fff" class="me-1" /> Gói
                                hiện tại
                            </p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="card-content">
                        <!-- Title -->
                        <h3 class="plan-title">{{ planFree?.name || 'Free' }}</h3>
                        <p class="plan-subtitle">{{ planFree?.short_description || 'Dành cho những ai muốn trải nghiệm'
                        }}</p>

                        <!-- Price -->
                        <div class="price-section">
                            <div class="price-main">{{ planFree?.sale_price === 0 && planFree?.original_price === 0 ?
                                '0' : formatPrice(planFree?.sale_price || planFree?.original_price) }}</div>
                        </div>

                        <!-- Package Limits -->
                        <div class="package-limits">
                            <h6 class="section-title">📊 Giới hạn gói</h6>
                            <div class="limit-item">
                                <span>Thời hạn lưu thiệp:</span>
                                <span class="limit-value">{{ planFree?.time_save_card || 6 }} tháng</span>
                            </div>
                            <div class="limit-item">
                                <span>Giới hạn hình ảnh:</span>
                                <span class="limit-value">{{ planFree?.image_limits || 10 }} ảnh</span>
                            </div>
                            <div class="limit-item">
                                <span>Số thiệp có thể tạo:</span>
                                <span class="limit-value">{{ planFree?.number_of_cards || 1 }} thiệp</span>
                            </div>
                            <div class="limit-item">
                                <span>Lượt xem tối đa:</span>
                                <span class="limit-value">{{ planFree ? formatPrice(planFree.maximum_views) : 300 }}
                                    lượt</span>
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="features-section">
                            <h6 class="section-title">✨ Tính năng chính</h6>
                            <ul class="features-list-new" v-if="planFree">
                                <li v-for="feat in planFree.feature_list" :key="feat.id" class="feature-item"
                                    :class="feat.status === 1 ? 'feature-enabled' : 'feature-disabled'">
                                    <BaseIconComponent class="feature-icon"
                                        :name="feat.status === 1 ? 'check-circle' : 'cancel'"
                                        :color="feat.status === 1 ? '#268e6c' : '#d1d5db'" :size="16" />
                                    <span>{{ feat.name }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Action Button -->
                        <div class="card-action">
                            <div v-if="currentPlanLevel > 1" class="lower-tier-label">
                                Gói thấp hơn gói hiện tại
                            </div>
                            <button v-else-if="currentPlanLevel === 1" class="btn-plan btn-plan-disabled" disabled>
                                Gói hiện tại
                            </button>
                            <button v-else class="btn-plan btn-plan-basic">
                                Chọn gói {{ planFree?.name || 'Free' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BASIC PLAN -->
            <div class="col-lg-4">
                <div class="pricing-card pricing-card-basic">
                    <!-- Stackable Headers -->
                    <div class="card-headers">
                        <div v-if="currentPlanName === 'Basic'" class="card-header-status bg-blue-header">
                            <p class="mb-0 text-white fw-bold">
                                <BaseIconComponent name="star" type="mdi" :size="14" color="#fff" class="me-1" /> Gói
                                hiện tại
                            </p>
                        </div>
                        <div class="card-header-status bg-pink-header">
                            <p class="mb-0 text-white fw-bold">
                                <BaseIconComponent name="heart" type="mdi" :size="14" color="#fff" class="me-1" /> Lựa
                                chọn phổ biến
                            </p>
                        </div>
                        <div class="card-header-status bg-orange-header">
                            <p class="mb-0 text-white fw-bold">🔥 Khuyến mãi 33% OFF</p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="card-content">
                        <!-- Title -->
                        <h3 class="plan-title plan-title-basic">{{ planBasic?.name || 'Basic' }}</h3>
                        <p class="plan-subtitle">{{ planBasic?.short_description || 'Phù hợp cho hầu hết người dùng' }}
                        </p>

                        <!-- Price -->
                        <div class="price-section">
                            <div class="price-old" v-if="planBasic?.original_price > planBasic?.sale_price">{{
                                formatPrice(planBasic?.original_price) }}</div>
                            <div class="price-wrapper">
                                <div class="price-main price-main-basic">{{ formatPrice(planBasic?.sale_price ||
                                    planBasic?.original_price) }}</div>
                                <span class="price-discount"
                                    v-if="planBasic?.original_price > planBasic?.sale_price">-{{
                                        getDiscount(planBasic?.original_price, planBasic?.sale_price) }}%</span>
                            </div>
                            <!-- <div class="price-expiry">⏰ Khuyến mãi đến 17/1/2026</div> -->
                        </div>

                        <!-- Package Limits -->
                        <div class="package-limits">
                            <h6 class="section-title">📊 Giới hạn gói</h6>
                            <div class="limit-item">
                                <span>Thời hạn lưu thiệp:</span>
                                <span class="limit-value">{{ planBasic?.time_save_card || 24 }} tháng</span>
                            </div>
                            <div class="limit-item">
                                <span>Giới hạn hình ảnh:</span>
                                <span class="limit-value">{{ planBasic?.image_limits || 50 }} ảnh</span>
                            </div>
                            <div class="limit-item">
                                <span>Số thiệp có thể tạo:</span>
                                <span class="limit-value">{{ planBasic?.number_of_cards || 3 }} thiệp</span>
                            </div>
                            <div class="limit-item">
                                <span>Lượt xem tối đa:</span>
                                <span class="limit-value">{{ planBasic ? formatPrice(planBasic.maximum_views) : '10.000'
                                    }} lượt</span>
                            </div>
                        </div>

                        <!-- Features -->
                        <div class="features-section">
                            <h6 class="section-title">✨ Tính năng chính</h6>
                            <ul class="features-list-new" v-if="planBasic">
                                <li v-for="feat in planBasic.feature_list" :key="feat.id" class="feature-item"
                                    :class="feat.status === 1 ? 'feature-enabled' : 'feature-disabled'">
                                    <BaseIconComponent class="feature-icon"
                                        :name="feat.status === 1 ? 'check-circle' : 'cancel'"
                                        :color="feat.status === 1 ? '#268e6c' : '#d1d5db'" :size="16" />
                                    <span>{{ feat.name }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Action Button -->
                        <div class="card-action">
                            <div v-if="currentPlanLevel > 2" class="lower-tier-label">
                                Gói thấp hơn gói hiện tại
                            </div>
                            <button v-else-if="currentPlanLevel === 2" class="btn-plan btn-plan-disabled" disabled>
                                Gói hiện tại
                            </button>
                            <button v-else class="btn-plan btn-plan-basic">
                                Chọn gói {{ planBasic?.name || 'Basic' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PREMIUM PLAN -->
            <div class="col-lg-4">
                <div class="pricing-card pricing-card-premium">
                    <!-- Stackable Headers -->
                    <div class="card-headers">
                        <div v-if="currentPlanName === 'Premium'" class="card-header-status bg-blue-header">
                            <p class="mb-0 text-white fw-bold">
                                <BaseIconComponent name="star" type="mdi" :size="14" color="#fff" class="me-1" /> Gói
                                hiện tại
                            </p>
                        </div>
                        <div class="card-header-status bg-purple-header">
                            <p class="mb-0 text-white fw-bold">👑 Gói đặc biệt dành cho bạn</p>
                        </div>
                        <div class="card-header-status bg-orange-header">
                            <p class="mb-0 text-white fw-bold">🔥 Khuyến mãi 40% OFF</p>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="card-content position-relative">
                        <!-- Title -->
                        <div class="plan-title-wrapper">
                            <h3 class="plan-title plan-title-premium">
                                <BaseIconComponent name="crown" type="mdi" :size="24" color="#bf125d"
                                    class="me-1 v-middle" />
                                Premium
                            </h3>
                            <span class="premium-badge">Premium</span>
                        </div>
                        <p class="plan-subtitle">{{ planPremium?.short_description || 'Giải pháp cao cấp và toàn diện'
                        }}</p>

                        <!-- Price -->
                        <div class="price-section">
                            <div class="price-old" v-if="planPremium?.original_price > planPremium?.sale_price">{{
                                formatPrice(planPremium?.original_price) }}</div>
                            <div class="price-wrapper">
                                <div class="price-main price-main-premium">{{ formatPrice(planPremium?.sale_price ||
                                    planPremium?.original_price) }}</div>
                                <span class="price-discount"
                                    v-if="planPremium?.original_price > planPremium?.sale_price">-{{
                                        getDiscount(planPremium?.original_price, planPremium?.sale_price) }}%</span>
                            </div>
                            <!-- <div class="price-expiry">⏰ Khuyến mãi đến 17/1/2026</div> -->
                        </div>

                        <!-- Package Limits -->
                        <div class="package-limits">
                            <h6 class="section-title">📊 Giới hạn gói</h6>
                            <div class="limit-item">
                                <span>Thời hạn lưu thiệp:</span>
                                <span class="limit-value">{{ planPremium?.time_save_card || 60 }} tháng</span>
                            </div>
                            <div class="limit-item">
                                <span>Giới hạn hình ảnh:</span>
                                <span class="limit-value">{{ planPremium?.image_limits || 100 }} ảnh</span>
                            </div>
                            <div class="limit-item">
                                <span>Số thiệp có thể tạo:</span>
                                <span class="limit-value">{{ planPremium?.number_of_cards || 5 }} thiệp</span>
                            </div>
                            <div class="limit-item">
                                <span>Lượt xem tối đa:</span>
                                <span class="limit-value">{{ planPremium ? formatPrice(planPremium.maximum_views) :
                                    '50.000' }} lượt</span>
                            </div>
                        </div>

                        <!-- Best Value Sticker -->
                        <div class="best-value-sticker">BEST VALUE</div>

                        <!-- Features -->
                        <div class="features-section">
                            <h6 class="section-title">✨ Tính năng chính</h6>
                            <ul class="features-list-new" v-if="planPremium">
                                <li v-for="feat in planPremium.feature_list" :key="feat.id" class="feature-item"
                                    :class="feat.status === 1 ? 'feature-enabled' : 'feature-disabled'">
                                    <BaseIconComponent class="feature-icon"
                                        :name="feat.status === 1 ? 'check-circle' : 'cancel'"
                                        :color="feat.status === 1 ? '#268e6c' : '#d1d5db'" :size="16" />
                                    <span>{{ feat.name }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Action Button -->
                        <div class="card-action">
                            <div v-if="currentPlanLevel > 3" class="lower-tier-label">
                                Gói thấp hơn gói hiện tại
                            </div>
                            <button v-else-if="currentPlanLevel === 3" class="btn-plan btn-plan-disabled" disabled>
                                Gói hiện tại
                            </button>
                            <button v-else class="btn-plan btn-plan-premium">
                                Chọn gói {{ planPremium?.name || 'Premium' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- COMPARISON TITLE -->
        <h3 class="text-center fw-bold mb-4 mt-5">So sánh chi tiết các gói dịch vụ</h3>

        <!-- COMPARISON TABLE -->
        <div class="comparison-table-wrapper mb-5">
            <div class="table-header">
                <h5 class="table-title">Tính năng cơ bản</h5>
            </div>
            <div class="table-responsive">
                <table class="table mb-0 comparison-table">
                    <thead>
                        <tr>
                            <th class="feature-name-col"></th>
                            <th class="text-center plan-col">Free</th>
                            <th class="text-center plan-col">Basic</th>
                            <th class="text-center plan-col">Premium</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, idx) in featuresList" :key="idx">
                            <td class="feature-name">{{ row.name }}</td>

                            <!-- Free Col -->
                            <td class="text-center feature-value">
                                <BaseIconComponent v-if="row.free === true" name="check-circle" color="#268e6c"
                                    :size="18" />
                                <BaseIconComponent v-else-if="row.free === false" name="cancel" color="#d1d5db"
                                    :size="18" />
                                <span v-else class="text-value">{{ row.free }}</span>
                            </td>

                            <!-- Basic Col -->
                            <td class="text-center feature-value">
                                <BaseIconComponent v-if="row.basic === true" name="check-circle" color="#268e6c"
                                    :size="18" />
                                <BaseIconComponent v-else-if="row.basic === false" name="cancel" color="#d1d5db"
                                    :size="18" />
                                <span v-else class="text-value">{{ row.basic }}</span>
                            </td>

                            <!-- Premium Col -->
                            <td class="text-center feature-value">
                                <BaseIconComponent v-if="row.premium === true" name="check-circle" color="#268e6c"
                                    :size="18" />
                                <BaseIconComponent v-else-if="row.premium === false" name="cancel" color="#d1d5db"
                                    :size="18" />
                                <span v-else class="text-value">{{ row.premium }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FAQ -->
        <h3 class="text-center fw-bold mb-5">Câu hỏi thường gặp</h3>
        <div class="row g-4 mb-5">
            <div class="col-md-6" v-for="(item, i) in faqs" :key="i">
                <div class="faq-card h-100">
                    <h6 class="fw-bold mb-2">{{ item.q }}</h6>
                    <p class="text-muted small m-0">{{ item.a }}</p>
                </div>
            </div>
        </div>

        <!-- WHY CHOOSE -->
        <div class="why-section p-5 rounded-4 mb-5 text-center">
            <h4 class="fw-bold mb-5">Vì sao nên chọn gói Basic hoặc Premium?</h4>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="why-item">
                        <div class="icon big-icon mb-3">💯</div>
                        <h6 class="fw-bold">Thiết kế độc quyền</h6>
                        <p class="small text-muted">Trải nghiệm hàng trăm mẫu thiệp cao cấp, sang trọng</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="why-item">
                        <div class="icon big-icon mb-3">🎥</div>
                        <h6 class="fw-bold">Đa phương tiện</h6>
                        <p class="small text-muted">Lưu trữ hình ảnh, video chất lượng cao không giới hạn</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="why-item">
                        <div class="icon big-icon mb-3">🔧</div>
                        <h6 class="fw-bold">Tùy chỉnh hoàn toàn</h6>
                        <p class="small text-muted">Toàn quyền chỉnh sửa nội dung, bố cục theo ý muốn</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- FINAL CTA -->
        <div class="text-center pb-5">
            <h3 class="fw-bold mb-3">Sẵn sàng tạo website/thiệp online ấn tượng?</h3>
            <p class="text-muted mb-4">Đăng ký ngay hôm nay để bắt đầu lưu giữ khoảnh khắc hạnh phúc với các<br>ưu đãi
                hấp dẫn dành riêng cho bạn</p>
            <button class="btn btn-danger-gradient btn-lg rounded-pill px-5 shadow">
                Đăng ký ngay hôm nay
            </button>
        </div>

    </div>
</template>

<style scoped>
/* ========== CURRENT PLAN BADGE ========== */
.current-plan-badge {
    background-color: #eff6ff;
    color: #2563eb;
    border-radius: 9999px;
    padding: 8px 18px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.badge-text {
    font-size: 14px;
    line-height: 20px;
}

/* ========== NEW PRICING CARD STYLES ========== */

/* Card Container */
.pricing-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.pricing-card:hover {
    transform: translateY(-5px);
}

/* Free Card */
.pricing-card-free {
    box-shadow: 0 0 0 3px #c3ddfd, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Basic Card */
.pricing-card-basic {
    box-shadow: 0 0 0 3px #fecaca, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Premium Card */
.pricing-card-premium {
    box-shadow: 0 0 0 3px #e9d5ff, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Card Headers */
.card-headers {
    display: flex;
    flex-direction: column;
}

.card-header-status {
    padding: 8px 16px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header-status:last-child {
    border-bottom: none;
}

.bg-blue-header {
    background: #3b82f6;
}

.bg-pink-header {
    background: #fb7185;
}

.bg-orange-header {
    background: #ff5722;
}

.bg-purple-header {
    background: #c026d3;
}

.card-header-status p {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Card Content */
.card-content {
    padding: 20px 24px 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Plan Title */
.plan-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    color: #111827;
    margin-bottom: 4px;
}

.plan-title-basic {
    color: #ef4444;
}

.plan-title-premium {
    color: #bf125d;
}

.v-middle {
    vertical-align: middle;
}

.plan-title-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.premium-badge {
    background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
    color: #854d0e;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #fbbf24;
}

.plan-subtitle {
    font-size: 14px;
    line-height: 20px;
    color: #6b7280;
    margin-bottom: 16px;
}

/* Price Section */
.price-section {
    margin-bottom: 20px;
}

.price-old {
    font-size: 14px;
    line-height: 20px;
    color: #9ca3af;
    text-decoration: line-through;
    margin-bottom: 4px;
}

.price-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.price-main {
    font-size: 36px;
    font-weight: 700;
    line-height: 40px;
    color: #7b8893;
}

.price-main-basic {
    color: #e02424;
}

.price-main-premium {
    color: #bf125d;
}

.price-discount {
    background: #fee2e2;
    color: #dc2626;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
}

.price-expiry {
    font-size: 12px;
    line-height: 16px;
    color: #6b7280;
}

/* Package Limits */
.package-limits {
    margin-bottom: 20px;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #1f2937;
    margin-bottom: 12px;
}

.limit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    line-height: 16px;
    color: #7b8893;
    margin-bottom: 8px;
}

.limit-value {
    font-weight: 500;
}

/* Features Section */
.features-section {
    margin-bottom: 20px;
    flex: 1;
}

.features-list-new {
    list-style: none;
    padding: 0;
    margin: 0;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 16px;
}

.feature-icon {
    flex-shrink: 0;
    margin-top: 2px;
}

.feature-enabled span {
    color: #374151;
}

.feature-disabled span {
    color: #9ca3af;
    text-decoration: line-through;
}

/* Action Buttons */
.card-action {
    margin-top: auto;
}

.btn-plan {
    width: 100%;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-plan-disabled {
    background: #f3f4f6;
    color: #999;
    border: 1px solid #e5e7eb;
    cursor: not-allowed;
}

.lower-tier-label {
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 12px;
    font-weight: 500;
}

.btn-plan-basic {
    background: linear-gradient(135deg, #fda4af 0%, #fb7185 100%);
    color: white;
}

.btn-plan-basic:hover {
    background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
}

.btn-plan-premium {
    background: linear-gradient(135deg, #d946ef 0%, #c026d3 100%);
    color: white;
}

.btn-plan-premium:hover {
    background: linear-gradient(135deg, #c026d3 0%, #a21caf 100%);
}

/* Best Value Sticker */
.best-value-sticker {
    position: absolute;
    top: 110px;
    right: 20px;
    background: #ffc107;
    color: #bf125d;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 50px;
    transform: rotate(15deg);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 5;
    letter-spacing: 0.5px;
}

/* ========== EXISTING STYLES ========== */

.border-none {
    border: none;
}

.table> :not(caption)>*>* {
    background: none !important;
}

.page-title {
    font-size: 36px;
    font-weight: 700;
    line-height: 40px;
    color: #111827;
}

.text-muted {
    color: #4b5563;
    font-size: 18px;
    line-height: 28px;
}

.text-purple {
    color: #8b5cf6;
}

.bg-purple-subtle {
    background-color: #f3e8ff;
    color: #8b5cf6;
}

/* PROMO BANNER */
.promo-banner {
    background: linear-gradient(to right, rgb(240, 82, 82), rgb(231, 70, 148), rgb(255, 90, 31));
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.2);
}

/* TABLE */
.comparison-table-wrapper {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.table-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.table-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
    color: #111827;
    margin: 0;
}

.comparison-table {
    width: 100%;
    margin: 0;
}

.comparison-table thead tr {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.comparison-table th {
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: #6b7280;
    border: none;
}

.comparison-table .feature-name-col {
    width: 40%;
    text-align: left;
    padding-left: 24px;
}

.comparison-table .plan-col {
    width: 20%;
}

.comparison-table tbody tr {
    border-bottom: 1px solid #f3f4f6;
}

.comparison-table tbody tr:last-child {
    border-bottom: none;
}

.comparison-table tbody tr:hover {
    background: #f9fafb;
}

.comparison-table td {
    padding: 14px 16px;
    border: none;
}

.comparison-table .feature-name {
    font-size: 14px;
    line-height: 20px;
    color: #374151;
    padding-left: 24px;
}

.comparison-table .feature-value {
    padding: 14px 16px;
}

.comparison-table .text-value {
    font-size: 13px;
    line-height: 20px;
    color: #6b7280;
}

/* Old table styles - keeping for compatibility */
.comparison-table th {
    text-transform: none;
    font-size: 13px;
    letter-spacing: normal;
}

.icon-check {
    color: #22c55e;
    font-weight: bold;
}

.icon-cross {
    color: #cbd5e1;
    font-weight: bold;
}

/* FAQ */
.faq-card {
    background: #f8fafc;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
}

/* WHY SECTION */
.why-section {
    background: #f8fafc;
}

.big-icon {
    font-size: 3rem;
}

/* Buttons */
.btn-danger-gradient {
    background: #ff8fa3;
    color: white;
    border: none;
}

.btn-danger-gradient:hover {
    background: linear-gradient(45deg, #ef4444, #dc2626);
    color: white;
}

.btn-purple-gradient {
    background: linear-gradient(45deg, #c084fc, #a855f7);
    color: white;
    border: none;
}

.btn-purple-gradient:hover {
    background: linear-gradient(45deg, #a855f7, #9333ea);
    color: white;
}

@media (max-width: 991px) {
    .why-section h4 {
        font-size: 25px !important;
    }
}

@media (min-width: 1024px) {
    .text-pricing-header {
        width: 58%;
        display: flex;
        justify-self: center;
        text-align: center;
    }
}

@media (max-width: 768px) {
    .text-pricing-header {
        font-size: 14px !important;
    }

    .pricing-page {
        margin-top: 0px !important;
    }

    .pricing-header {
        margin-bottom: 10px !important;
    }
}
</style>
