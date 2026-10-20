<script setup lang="ts">
import BaseIconComponent from "~/coms/icons/BaseIconComponent.vue"

const config = ref({
    title: 'Trò chơi troll',
    description: 'Trò chơi troll vui nhộn cho crush',
    // Popup chào hỏi
    welcome_greeting: 'He luu cậu!',
    welcome_lead: 'Tớ có điều này muốn hỏi cậu nhớ phải trả lời thật lòng nhaaa.',
    // Màn hình chính
    main_question: 'Cậu yêu tớ có phải không nào ._.',
    main_warning: 'Nếu cậu ko trả lời mà thoát ra tức là muốn làm vợ tớ rùi đó nha :v',
    main_btn_no: 'Cậu mơ à',
    main_btn_yes: 'Yêu ơi là yêu <3',
    // Popup hỏi lý do
    reason_question: 'Lí do cậu thích tớ đi :vvv',
    reason_btn_send: 'Gửi cho tớ <3',
    reason_default_answer: 'Vì cậu đẹp try vlllll',
    // Popup kết thúc
    final_thanks: 'Tớ biết mà ^^ Yêu cậu 300.000',
    final_invite: 'Tối nay tớ qua đón cậu đi chơi nhaaaaaaaaa :v Còn giờ thì chờ gì nữa mà ko inbox cho tớ đi nàoooooo',
    final_btn_ok: 'Okii lunn <3'
})

const maxDescription = 200
const descriptionCount = computed(() => config.value.description.length)
</script>

<template>
    <div class="config-card">
        <div class="config-header">
            <h3 class="config-title">Thông tin cơ bản</h3>
        </div>
        <div class="config-body">
            <!-- Website Title -->
            <div class="form-group mb-4">
                <label class="form-label">
                    <span class="required">*</span> Tiêu đề website
                </label>
                <input 
                    type="text" 
                    v-model="config.title" 
                    class="form-control-custom" 
                    placeholder="Nhập tiêu đề website"
                >
            </div>

            <!-- Short Description -->
            <div class="form-group mb-0">
                <label class="form-label">Mô tả ngắn</label>
                <div class="textarea-wrapper">
                    <textarea 
                        v-model="config.description" 
                        class="form-textarea-custom" 
                        rows="3" 
                        :maxlength="maxDescription"
                        placeholder="Nhập mô tả ngắn cho website"
                    ></textarea>
                    <div class="char-counter">
                        {{ descriptionCount }} / {{ maxDescription }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Customization Section -->
    <div class="config-card mt-4">
        <div class="config-header">
            <h3 class="config-title">Tùy chỉnh hình ảnh</h3>
        </div>
        <div class="config-body">
            <p class="section-desc mb-4">
                Tùy chỉnh ảnh hiển thị trong popup và ảnh nền của trò chơi.
            </p>

            <div class="row g-4">
                <!-- Popup Image -->
                <div class="col-12 col-md-6">
                    <div class="image-upload-wrapper">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <BaseIconComponent name="image" :size="20" class="text-secondary" />
                            <span class="image-label">Ảnh popup chào hỏi</span>
                            <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted cursor-pointer" />
                        </div>
                        
                        <div class="image-preview mb-3">
                            <NuxtImg src="/images/web/cuteCat.jpg" class="preview-img rounded-3" />
                        </div>

                        <div class="d-flex gap-2">
                            <button class="btn-change-image flex-grow-1">
                                <BaseIconComponent name="image" :size="18" class="me-2" />
                                Thay đổi ảnh
                            </button>
                            <button class="btn-delete-image">
                                <BaseIconComponent name="delete-outline" type="mdi" :size="20" color="#ef4444" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Background Image -->
                <div class="col-12 col-md-6">
                    <div class="image-upload-wrapper">
                        <div class="d-flex align-items-center gap-2 mb-3">
                            <BaseIconComponent name="image" :size="20" class="text-secondary" />
                            <span class="image-label">Ảnh nền trang</span>
                            <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted cursor-pointer" />
                        </div>
                        
                        <div class="image-preview mb-3">
                            <NuxtImg src="/images/web/puung3.jpg" class="preview-img rounded-3" />
                        </div>

                        <div class="d-flex gap-2">
                            <button class="btn-change-image flex-grow-1">
                                <BaseIconComponent name="image" :size="18" class="me-2" />
                                Thay đổi ảnh
                            </button>
                            <button class="btn-delete-image">
                                <BaseIconComponent name="delete-outline" type="mdi" :size="20" color="#ef4444" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Game Content Customization Section -->
    <div class="config-card mt-4">
        <div class="config-header">
            <h3 class="config-title">Tùy chỉnh nội dung trò chơi</h3>
        </div>
        <div class="config-body">
            <p class="section-desc mb-4">
                Tùy chỉnh tất cả các câu nói trong trò chơi. Bạn có thể thay đổi để phù hợp với phong cách và mối quan hệ của mình.
            </p>

            <!-- 1. Popup chào hỏi -->
            <div class="sub-section-header">
                <span class="sub-icon">🎭</span>
                <span class="sub-title">Popup chào hỏi</span>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Lời chào đầu tiên <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.welcome_greeting" class="form-control-custom" :maxlength="50">
                    <span class="inner-counter">{{ config.welcome_greeting.length }} / 50</span>
                </div>
            </div>

            <div class="form-group mb-5">
                <label class="form-label"><span class="required">*</span> Lời dẫn dắt <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.welcome_lead" class="form-control-custom" :maxlength="100">
                    <span class="inner-counter">{{ config.welcome_lead.length }} / 100</span>
                </div>
            </div>

            <!-- 2. Màn hình chính -->
            <div class="sub-section-header">
                <span class="sub-icon">🎮</span>
                <span class="sub-title">Màn hình chính</span>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Câu hỏi chính <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.main_question" class="form-control-custom" :maxlength="80">
                    <span class="inner-counter">{{ config.main_question.length }} / 80</span>
                </div>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Lời cảnh báo <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="textarea-wrapper">
                    <textarea v-model="config.main_warning" class="form-textarea-custom" rows="2" :maxlength="150"></textarea>
                    <div class="char-counter">{{ config.main_warning.length }} / 150</div>
                </div>
            </div>

            <div class="row mb-5">
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> Text nút 'Không' <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                        <div class="input-with-counter">
                            <input type="text" v-model="config.main_btn_no" class="form-control-custom" :maxlength="30">
                            <span class="inner-counter">{{ config.main_btn_no.length }} / 30</span>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-group">
                        <label class="form-label"><span class="required">*</span> Text nút 'Có' <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                        <div class="input-with-counter">
                            <input type="text" v-model="config.main_btn_yes" class="form-control-custom" :maxlength="30">
                            <span class="inner-counter">{{ config.main_btn_yes.length }} / 30</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Popup hỏi lý do -->
            <div class="sub-section-header">
                <span class="sub-icon">💬</span>
                <span class="sub-title">Popup hỏi lý do</span>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Câu hỏi lý do <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.reason_question" class="form-control-custom" :maxlength="80">
                    <span class="inner-counter">{{ config.reason_question.length }} / 80</span>
                </div>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Text nút gửi <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.reason_btn_send" class="form-control-custom" :maxlength="30">
                    <span class="inner-counter">{{ config.reason_btn_send.length }} / 30</span>
                </div>
            </div>

            <div class="form-group mb-5">
                <label class="form-label"><span class="required">*</span> Câu trả lời mặc định <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.reason_default_answer" class="form-control-custom" :maxlength="100">
                    <span class="inner-counter">{{ config.reason_default_answer.length }} / 100</span>
                </div>
            </div>

            <!-- 4. Popup kết thúc -->
            <div class="sub-section-header">
                <span class="sub-icon">🎉</span>
                <span class="sub-title">Popup kết thúc</span>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Lời cảm ơn <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.final_thanks" class="form-control-custom" :maxlength="80">
                    <span class="inner-counter">{{ config.final_thanks.length }} / 80</span>
                </div>
            </div>

            <div class="form-group mb-4">
                <label class="form-label"><span class="required">*</span> Lời mời đi chơi <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="textarea-wrapper">
                    <textarea v-model="config.final_invite" class="form-textarea-custom" rows="2" :maxlength="200"></textarea>
                    <div class="char-counter">{{ config.final_invite.length }} / 200</div>
                </div>
            </div>

            <div class="form-group mb-0">
                <label class="form-label"><span class="required">*</span> Text nút OK cuối <BaseIconComponent name="help-circle-outline" type="mdi" :size="16" class="text-muted ms-1" /></label>
                <div class="input-with-counter">
                    <input type="text" v-model="config.final_btn_ok" class="form-control-custom" :maxlength="30">
                    <span class="inner-counter">{{ config.final_btn_ok.length }} / 30</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Game Flow Instructions Card -->
    <div class="flow-card mt-4">
        <div class="flow-header">
            <h3 class="flow-title">Luồng trò chơi</h3>
        </div>
        <div class="flow-body">
            <div class="flow-section mb-4">
                <h4 class="section-subtitle">Cách trò chơi hoạt động:</h4>
                <ul class="flow-list">
                    <li><span class="li-icon">🗂️</span> 1. Hiển thị popup chào hỏi với <strong>text1</strong> và <strong>text2</strong> + <strong>ảnh popup</strong></li>
                    <li><span class="li-icon">🎮</span> 2. Màn hình chính với câu hỏi <strong>text3</strong> và cảnh báo <strong>text4</strong> trên <strong>ảnh nền</strong></li>
                    <li><span class="li-icon">🎯</span> 3. Hai nút: "<strong>text6</strong>" (Có) và "<strong>text5</strong>" (Không - sẽ trốn tránh)</li>
                    <li><span class="li-icon">💭</span> 4. Khi bấm "Có": popup hỏi lý do với <strong>text7</strong></li>
                    <li><span class="li-icon">⌨️</span> 5. Input tự động điền <strong>text9</strong>, nút gửi là <strong>text8</strong></li>
                    <li><span class="li-icon">🎉</span> 6. Popup kết thúc với <strong>text10</strong>, <strong>text11</strong> và nút <strong>text12</strong></li>
                </ul>
            </div>

            <div class="flow-section">
                <h4 class="section-subtitle">Hình ảnh:</h4>
                <div class="image-rule">
                    <span class="li-icon">🖼️</span> <strong>Ảnh popup:</strong> Hiển thị trong popup chào hỏi đầu tiên
                </div>
                <div class="image-rule">
                    <span class="li-icon">🌅</span> <strong>Ảnh nền:</strong> Làm nền cho toàn bộ trang trò chơi (có hiệu ứng blur)
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Flow Card Styles */
.flow-card {
    background-color: #fdfae9; /* Light yellow/cream */
    border: 1px solid #fef3c7;
    border-radius: 12px;
    overflow: hidden;
}

.flow-header {
    padding: 16px 24px;
    border-bottom: 1px solid #fef3c7;
}

.flow-title {
    font-size: 16px;
    font-weight: 700;
    color: #92400e; /* Darker amber */
    margin: 0;
}

.flow-body {
    padding: 24px;
}

.section-subtitle {
    font-size: 14px;
    font-weight: 700;
    color: #1a1c21;
    margin-bottom: 16px;
}

.flow-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.flow-list li {
    font-size: 14px;
    color: #4b5563;
    display: flex;
    align-items: center;
}

.li-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-right: 8px;
}

.image-rule {
    font-size: 14px;
    color: #4b5563;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.config-card {
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    overflow: hidden;
}

.mt-4 {
    margin-top: 24px;
}

.config-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eef0f3;
}

.config-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1c21;
    margin: 0;
}

.config-body {
    padding: 24px;
}

.section-desc {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.sub-section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 32px;
    margin-bottom: 24px;
    position: relative;
}

.sub-section-header::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #f3f4f6;
}

.sub-icon {
    font-size: 20px;
}

.sub-title {
    font-size: 15px;
    font-weight: 700;
    color: #374151;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-label {
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.required {
    color: #ef4444;
    margin-right: 4px;
}

.input-with-counter {
    position: relative;
    display: flex;
    align-items: center;
}

.form-control-custom {
    width: 100%;
    height: 44px;
    padding: 10px 16px;
    padding-right: 75px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    color: #111827;
    transition: all 0.2s;
}

.form-control-custom:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
}

.inner-counter {
    position: absolute;
    right: 16px;
    font-size: 12px;
    color: #9ca3af;
    pointer-events: none;
}

.textarea-wrapper {
    position: relative;
}

.form-textarea-custom {
    width: 100%;
    padding: 12px 16px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    color: #111827;
    resize: none;
    transition: all 0.2s;
}

.form-textarea-custom:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    outline: none;
}

.char-counter {
    position: absolute;
    bottom: -22px;
    right: 0;
    font-size: 12px;
    color: #9ca3af;
}

.image-label {
    font-size: 15px;
    font-weight: 500;
    color: #374151;
}

.image-preview {
    width: 100%;
    aspect-ratio: 16/10;
    background-color: #f9fafb;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.preview-img {
    width: 65%;
    height: 90%;
    object-fit: cover;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-change-image {
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-change-image:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.btn-delete-image {
    width: 44px;
    height: 44px;
    background-color: #fff;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-delete-image:hover {
    background-color: #fff5f5;
    border-color: #feb2b2;
}
</style>