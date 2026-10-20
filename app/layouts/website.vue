<script setup lang="ts">
import { useUserStore } from "~~/stores/user"
import InfoComponent from "~/coms/user/InfoComponent.vue"
import BaseIconComponent from "~/coms/icons/BaseIconComponent.vue"

const userStore = useUserStore()
const router = useRouter()

const goBack = () => {
    router.back()
}

// Call checkLogin on mount to ensure user status is up to date
onMounted(async () => {
    await userStore.checkLogin()
})
</script>

<template>
    <div class="website-layout">
        <!-- Header -->
        <header class="website-header">
            <div class="header-left">
                <button class="btn-back" @click="goBack">
                    <span class="back-icon">←</span>
                    Quay lại
                </button>
                <div class="divider"></div>
                <div class="logo-container" @click="navigateTo('/')">
                    <NuxtImg src="/others/logo.svg" class="logo-icon" />
                    <NuxtImg src="/others/logo-text-dark.svg" class="logo-text" />
                </div>
            </div>

            <div class="header-info">
                <h1 class="page-title">Cấu hình Crush Killer</h1>
                <p class="page-subtitle">Tùy chỉnh nội dung và thiết lập cho website của bạn</p>
            </div>

            <div class="header-right">
                <div class="avatar-wrapper">
                    <InfoComponent v-if="userStore.isLogin" />
                    <div v-else class="avatar-placeholder">k</div>
                </div>
            </div>
        </header>

        <!-- Main Body -->
        <main class="website-body container py-5">
            <div class="row mb-4">
                <div class="col-12">
                    <div class="stepper-section">
                        <div class="stepper-container">
                            <!-- Step 1 -->
                            <div class="step active">
                                <div class="step-circle">
                                    <svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span class="step-label">Cấu hình</span>
                            </div>

                            <div class="step-line active"></div>

                            <!-- Step 2 -->
                            <div class="step doing">
                                <div class="step-circle">
                                    <svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span class="step-label">Xem trước</span>
                            </div>

                            <div class="step-line"></div>

                            <!-- Step 3 -->
                            <div class="step pending">
                                <div class="step-circle">
                                    <svg class="step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                                        <path d="M12 15l-3-3m-3 9l3-3m6-6l-1.5-1.5"></path>
                                        <path d="M13 12.04a8.039 8.039 0 0 0 4.32-4.74 8.502 8.502 0 0 0 0-5.3 8.502 8.502 0 0 0-5.3 0 8.039 8.039 0 0 0-4.74 4.32"></path>
                                        <path d="M7.11 12.112a7.662 7.662 0 0 1 1.127-1.711m3.235-3.235a7.662 7.662 0 0 1 1.711-1.127"></path>
                                        <path d="M10 10l-2 1m3-2l1-2"></path>
                                    </svg>
                                </div>
                                <span class="step-label">Triển khai</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <!-- Configuration Info Panel -->
                    <div class="panel main-panel">
                        <div class="panel-header">
                            <h2 class="panel-title">Thông tin cấu hình</h2>
                        </div>
                        <div class="panel-body">
                            <slot name="config-content"></slot>
                            <slot />
                        </div>
                    </div>

                    <!-- Custom URL Panel -->
                    <div class="panel main-panel mt-4">
                        <div class="panel-header">
                            <h2 class="panel-title">Tùy chỉnh URL</h2>
                        </div>
                        <div class="panel-body">
                            <div class="url-customization">
                                <label class="url-label">Đường dẫn website</label>
                                <div class="url-input-wrapper">
                                    <div class="url-prefix">cinelove.vn/web/</div>
                                    <input type="text" class="url-input" value="ten-website-cua-ban" placeholder="nhap-ten-website">
                                    <button class="btn-copy-url" title="Sao chép đường dẫn">
                                        <BaseIconComponent name="copy" :size="18" />
                                    </button>
                                </div>
                                <div class="url-status-hint">
                                    <BaseIconComponent name="check-circle" :size="16" color="#10b981" class="me-1" />
                                    <span>Đường dẫn này hợp lệ và có thể sử dụng.</span>
                                </div>
                            </div>
                            <slot name="url-content"></slot>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 mt-4 mt-lg-0">
                    <!-- Action Sidebar Panel -->
                    <div class="panel side-panel">
                        <div class="panel-header">
                            <h2 class="panel-title">Hành động</h2>
                        </div>
                        <div class="panel-body">
                            <div class="action-sidebar-content">
                                <!-- Template Status Info -->
                                <div class="status-card info-card">
                                    <div class="d-flex gap-3 align-items-center mb-3">
                                        <div class="template-thumbnail">
                                            <NuxtImg src="/images/web/cuteCat.jpg" class="img-fluid" />
                                        </div>
                                        <div class="template-info">
                                            <div class="template-name">Crush Killer</div>
                                            <div class="template-diff">Rất dễ</div>
                                        </div>
                                    </div>
                                    <p class="template-desc">
                                        Trò chơi troll vui nhộn với câu hỏi 'Cậu có yêu tớ không?' và nút bấm trốn tránh
                                    </p>
                                </div>

                                <!-- Subscription Status -->
                                <div class="status-card plan-card">
                                    <div class="plan-label">Gói hiện tại</div>
                                    <div class="plan-name">Premium</div>
                                    <div class="plan-count">Đã tạo: 4 website</div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="action-buttons-group">
                                    <button class="btn-action btn-preview-web">
                                        <BaseIconComponent name="eye" :size="20" class="me-2" />
                                        Xem trước
                                    </button>
                                    <button class="btn-action btn-create-web">
                                        <BaseIconComponent name="rocket-launch" :size="20" color="#ffffff" class="me-2" />
                                        Tạo website
                                    </button>
                                </div>

                                <!-- Hint Text -->
                                <div class="action-hint">
                                    <span class="hint-icon">💡</span>
                                    Bạn có thể xem trước để kiểm tra trước khi tạo website
                                </div>
                            </div>
                            <slot name="action-content"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="website-footer">
            <div class="footer-container">
                <div class="footer-left">
                    © 2024 CineLove. Tất cả quyền được bảo lưu.
                </div>
                <div class="footer-right">
                    <NuxtLink to="/help" class="footer-link">Trợ giúp</NuxtLink>
                    <NuxtLink to="/privacy" class="footer-link">Chính sách bảo mật</NuxtLink>
                    <NuxtLink to="/terms" class="footer-link">Điều khoản sử dụng</NuxtLink>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.website-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f9fa;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.website-header {
    height: 64px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 24px;
    border-bottom: 1px solid #eef0f3;
    position: sticky;
    top: 0;
    z-index: 1001;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
}

.btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-back:hover {
    background-color: #f3f4f6;
    color: #111827;
}

.divider {
    width: 1px;
    height: 24px;
    background-color: #e5e7eb;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.logo-icon {
    width: 32px;
    height: 32px;
}

.logo-text {
    height: 22px;
}

.header-info {
    text-align: right;
    margin-right: 20px;
}

.page-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.2;
}

.page-subtitle {
    font-size: 11px;
    color: #9ca3af;
    margin: 3px 0 0 0;
}

.header-right {
    display: flex;
    align-items: center;
}

.avatar-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 50%;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    background-color: #0088cc;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
}

.website-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
}

/* Stepper Styles */
.stepper-section {
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
}

.stepper-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 900px;
    padding: 0 40px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
}

.step-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-icon {
    width: 22px;
    height: 22px;
}

.step-label {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: color 0.3s;
}

/* Active State (Done) */
.step.active .step-circle {
    background-color: #2563eb;
    color: #fff;
    border: none;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

.step.active .step-label {
    color: #2563eb;
}

/* Doing State (Next) */
.step.doing .step-circle {
    background-color: #f0f7ff;
    border: 2px solid #2563eb;
    color: #2563eb;
}

.step.doing .step-label {
    color: #2563eb;
}

/* Pending State (Future) */
.step.pending .step-circle {
    background-color: #f3f4f6;
    border: 2px solid #e5e7eb;
    color: #9ca3af;
}

.step.pending .step-label {
    color: #9ca3af;
}

/* Step Lines */
.step-line {
    flex: 1;
    height: 2px;
    background-color: #e5e7eb;
    margin: 0 -10px;
    margin-bottom: 25px; /* Alignment with circle centers */
    position: relative;
    z-index: 1;
}

.step-line.active {
    background-color: #2563eb;
}

.content-section {
    flex: 1;
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.panel {
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.main-panel {
    width: 100%;
}

.left-column {
    flex: 2;
    display: flex;
    flex-direction: column;
}

.mt-4 {
    margin-top: 24px;
}

.side-panel {
    flex: 1;
    width: 380px;
    min-width: 380px;
    position: sticky;
    top: 80px; /* Header (64px) + margin (16px) */
    align-self: flex-start;
}

.panel-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eef0f3;
}

.panel-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1c21;
    margin: 0;
}

.panel-body {
    padding: 24px;
    flex: 1;
}

/* Sidebar Action Styles */
.action-sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.status-card {
    border-radius: 12px;
    padding: 20px;
}

.info-card {
    background-color: #f9fafb;
}

.template-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
}

.template-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.template-name {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}

.template-diff {
    font-size: 14px;
    color: #6b7280;
}

.template-desc {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
}

.plan-card {
    background-color: #eff6ff;
}

.plan-label {
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 4px;
}

.plan-name {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 4px;
}

.plan-count {
    font-size: 13px;
    color: #6b7280;
}

.action-buttons-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn-action {
    width: 100%;
    height: 48px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-preview-web {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-preview-web:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}

.btn-create-web {
    background: #3b82f6;
    border: none;
    color: #fff;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.btn-create-web:hover {
    background: #2563eb;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
}

.action-hint {
    font-size: 13px;
    color: #6b7280;
    text-align: center;
    line-height: 1.5;
}

.hint-icon {
    margin-right: 4px;
}

/* URL Customization Styles */
.url-customization {
    display: flex;
    flex-direction: column;
}

.url-label {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 8px;
}

.url-input-wrapper {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    height: 44px;
    overflow: hidden;
    transition: all 0.2s;
}

.url-input-wrapper:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.url-prefix {
    padding: 0 0 0 16px;
    background: #fff;
    color: #374151;
    font-size: 15px;
    white-space: nowrap;
}

.url-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0 8px;
    font-size: 15px;
    color: #111827;
    outline: none;
    height: 100%;
}

.btn-copy-url {
    background: none;
    border: none;
    padding: 0 16px;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.btn-copy-url:hover {
    color: #3b82f6;
}

.url-status-hint {
    margin-top: 12px;
    font-size: 13px;
    color: #10b981;
    display: flex;
    align-items: center;
    font-weight: 400;
}

.website-footer {
    background-color: #fff;
    border-top: 1px solid #eef0f3;
    padding: 30px 0;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #9ca3af;
    font-size: 12px;
}

.footer-right {
    display: flex;
    gap: 30px;
}

.footer-link {
    color: #9ca3af;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-link:hover {
    color: #4b5563;
}

@media (max-width: 1024px) {
    .header-info {
        display: none;
    }
}
</style>