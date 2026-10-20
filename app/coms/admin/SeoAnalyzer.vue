<script setup lang="ts">
import { computed } from 'vue';
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';

const props = defineProps({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    content: { type: String, default: '' },
    keyword: { type: String, default: '' },
    hasThumbnail: { type: Boolean, default: false }
});

const seoRules = computed(() => {
    // 1. Title Length
    const titleLen = (props.title || '').length;
    let titleStatus = 'error';
    let titleMsg = 'Tiêu đề quá ngắn (dưới 40 ký tự)';
    if (titleLen === 0) {
        titleStatus = 'error';
        titleMsg = 'Vui lòng nhập tiêu đề';
    } else if (titleLen >= 50 && titleLen <= 60) {
        titleStatus = 'success';
        titleMsg = 'Độ dài tiêu đề tuyệt vời (50-60 ký tự)';
    } else if (titleLen > 60) {
        titleStatus = 'warning';
        titleMsg = 'Tiêu đề hơi dài (trên 60 ký tự)';
    } else if (titleLen >= 40) {
        titleStatus = 'warning';
        titleMsg = 'Tiêu đề hơi ngắn (từ 40-49 ký tự)';
    }

    // 2. Description Length
    const descLen = (props.description || '').length;
    let descStatus = 'error';
    let descMsg = 'Mô tả quá ngắn (dưới 120 ký tự)';
    if (descLen === 0) {
        descStatus = 'error';
        descMsg = 'Vui lòng nhập mô tả ngắn';
    } else if (descLen >= 150 && descLen <= 160) {
        descStatus = 'success';
        descMsg = 'Độ dài mô tả tuyệt vời (150-160 ký tự)';
    } else if (descLen > 160) {
        descStatus = 'warning';
        descMsg = 'Mô tả hơi dài (trên 160 ký tự)';
    } else if (descLen >= 120) {
        descStatus = 'warning';
        descMsg = 'Mô tả chấp nhận được (120-149 ký tự)';
    }

    // 3. Word count
    // Strip HTML tags
    const cleanContent = (props.content || '').replace(/<[^>]*>?/gm, '');
    const wordCount = cleanContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    let wordStatus = 'error';
    let wordMsg = `Bài viết quá ngắn (${wordCount} từ). Cần ít nhất 300 từ.`;
    if (wordCount >= 300) {
        wordStatus = 'success';
        wordMsg = `Độ dài bài viết tốt (${wordCount} từ).`;
    }

    // 4. Headings
    const hasH2 = /<h2[^>]*>/i.test(props.content || '');
    const hasH3 = /<h3[^>]*>/i.test(props.content || '');
    let headingStatus = 'error';
    let headingMsg = 'Bài viết chưa có thẻ H2, H3 nào để chia bố cục.';
    if (hasH2 && hasH3) {
        headingStatus = 'success';
        headingMsg = 'Cấu trúc Heading (H2, H3) phân bổ tốt.';
    } else if (hasH2 || hasH3) {
        headingStatus = 'warning';
        headingMsg = 'Nên bổ sung đầy đủ cả thẻ H2 và H3 để tối ưu.';
    }

    // 5. Images
    const imgRegex = /<img[^>]*>/gi;
    const imgMatches = (props.content || '').match(imgRegex);
    
    let imgStatus = 'warning';
    let imgSrc = 'Nội dung chưa có hình ảnh. Hãy thêm hình ảnh chụp/thumbnail để sinh động hơn.';
    
    let totalImagesCounter = (imgMatches ? imgMatches.length : 0) + (props.hasThumbnail ? 1 : 0);

    if (totalImagesCounter > 0) {
        let validAltCount = props.hasThumbnail ? 1 : 0; // Assume thumbnail represents 1 valid image alt since system handles it

        if (imgMatches && imgMatches.length > 0) {
            const hasAltRegex = /alt=["']([^"']+)["']/i;
            const imagesWithAlt = imgMatches.filter((img: string) => {
                const match = img.match(hasAltRegex);
                return match && match[1] ? match[1].trim().length > 0 : false;
            });
            validAltCount += imagesWithAlt.length;
        }
        
        if (validAltCount === totalImagesCounter) {
            imgStatus = 'success';
            imgSrc = `Tuyệt vời! Tất cả ${totalImagesCounter} hình ảnh đều hợp lệ/có thuộc tính alt.`;
        } else if (validAltCount > 0) {
            imgStatus = 'warning';
            imgSrc = `Bạn có ${validAltCount}/${totalImagesCounter} hình ảnh có thuộc tính alt. Cần bổ sung thêm alt cho các hình còn lại!`;
        } else {
            imgStatus = 'error';
            imgSrc = `Tất cả ${totalImagesCounter} hình ảnh trong bài đang bị thiếu thuộc tính alt SEO!`;
        }
    }

    // 6. Focus keyword in Content and Description
    let kwStatus = 'error';
    let kwMsg = 'Chưa nhập từ khoá SEO';
    let kwDescStatus = 'error';
    let kwDescMsg = 'Chưa nhập từ khoá SEO';
    const keywordText = props.keyword ? props.keyword.trim() : '';

    if (keywordText.length > 0) {
        // Hỗ trợ nhiều từ khóa cách nhau dấu phẩy
        const keywords = keywordText.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const lowerContent = cleanContent.toLowerCase();
        const lowerDesc = (props.description || '').toLowerCase();

        let foundCount = 0;
        let foundDescCount = 0;

        keywords.forEach(kw => {
            if (lowerContent.includes(kw)) {
                foundCount++;
            }
            if (lowerDesc.includes(kw)) {
                foundDescCount++;
            }
        });

        // Đánh giá content
        if (foundCount === keywords.length) {
            kwStatus = 'success';
            kwMsg = 'Tốt! Tất cả từ khóa đã xuất hiện trong nội dung bài viết.';
        } else if (foundCount > 0) {
            kwStatus = 'warning';
            kwMsg = `Chỉ ${foundCount}/${keywords.length} từ khóa xuất hiện trong bài viết. Cần bổ sung thêm.`;
        } else {
            kwStatus = 'error';
            kwMsg = 'Từ khóa SEO không xuất hiện ở trong bài viết của bạn!';
        }

        // Đánh giá description
        if (foundDescCount === keywords.length) {
            kwDescStatus = 'success';
            kwDescMsg = 'Tốt! Tất cả từ khóa đã lọt vào Meta Description.';
        } else if (foundDescCount > 0) {
            kwDescStatus = 'warning';
            kwDescMsg = `Chỉ ${foundDescCount}/${keywords.length} từ khóa xuất hiện trong mô tả. Cần bổ sung thêm.`;
        } else {
            kwDescStatus = 'error';
            kwDescMsg = 'Từ khóa SEO không xuất hiện ở trong đoạn mô tả!';
        }
    }

    return [
        { label: 'Từ khóa SEO (Bài viết)', status: kwStatus, text: kwMsg },
        { label: 'Từ khóa SEO (Mô tả)', status: kwDescStatus, text: kwDescMsg },
        { label: 'Tiêu đề (Title)', status: titleStatus, text: titleMsg, len: titleLen },
        { label: 'Mô tả (Meta Desc)', status: descStatus, text: descMsg, len: descLen },
        { label: 'Độ dài nội dung', status: wordStatus, text: wordMsg },
        { label: 'Cấu trúc Heading', status: headingStatus, text: headingMsg },
        { label: 'Hình ảnh bài viết', status: imgStatus, text: imgSrc },
    ]
});

const getIcon = (status: string) => {
    switch (status) {
        case 'success': return 'check-circle';
        case 'warning': return 'alert-triangle';
        case 'error': return 'x-circle';
        default: return 'info';
    }
}

const getColor = (status: string) => {
    switch (status) {
        case 'success': return '#10b981'; // green
        case 'warning': return '#f59e0b'; // orange
        case 'error': return '#ef4444'; // red
        default: return '#6b7280'; // gray
    }
}
</script>

<template>
    <div class="seo-analyzer p-3 rounded-3 bg-white border">
        <h6 class="fw-bold mb-3 d-flex align-items-center text-dark" style="font-size: 15px;">
            <BaseIconComponent name="bar-chart-2" type="lucide" :size="18" class="me-2" color="#0ea5e9" />
            Phân tích SEO
        </h6>
        <div class="seo-list d-flex flex-column gap-3">
            <div v-for="(rule, index) in seoRules" :key="index" class="seo-item d-flex align-items-start">
                <BaseIconComponent :name="getIcon(rule.status)" type="lucide" :size="18" :color="getColor(rule.status)"
                    class="me-2 mt-1 flex-shrink-0" />
                <div>
                    <div class="fw-bold text-dark" style="font-size: 13px;">{{ rule.label }} <span
                            v-if="rule.len !== undefined" class="text-muted fw-normal ms-1">({{ rule.len }} kí
                            tự)</span></div>
                    <div class="text-muted mt-1" style="font-size: 11.5px; line-height: 1.4;">{{ rule.text }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.seo-analyzer {
    border-color: #e2e8f0 !important;
}
</style>
