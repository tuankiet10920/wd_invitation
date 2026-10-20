<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
    defaultText?: string
}>();

const route = useRoute();
const invitorData = inject('invitorData', null) as any;

const guestName = computed(() => {
    // 1. If we have invitorData (on /invite/ page)
    if (invitorData?.value) {
        try {
            const content = invitorTokenParseJSON(invitorData.value.content);
            const invitation = content.invitation || '';
            const value = content.value || '';

            if (content.isCustom && invitation.includes('...')) {
                const parts = invitation.split('...');
                const values = value ? value.split(',').map((v: string) => v.trim()) : [];
                
                let result = '';
                for (let i = 0; i < parts.length; i++) {
                    result += parts[i];
                    if (i < parts.length - 1) {
                        result += (values[i] !== undefined && values[i] !== '') ? values[i] : '...';
                    }
                }
                return result || invitorData.value.content;
            }

            if (invitation && value) {
                return `${invitation} ${value}`;
            }
            return value || invitorData.value.content;
        } catch (e) {
            return invitorData.value.content;
        }
    }

    // 2. Determine guest name from route query 'name', or fallback to defaultText, or fallback to default placeholder
    return route.query.name || props.defaultText || 'Tên khách mời';
});

// Helper for parsing JSON content if necessary
const invitorTokenParseJSON = (str: string) => {
    try {
        if (typeof str === 'object') return str;
        return JSON.parse(str);
    } catch (e) {
        return { value: str };
    }
}
</script>

<template>
    <div class="node-guest-name">
        <span style="white-space: pre-wrap; word-break: break-word;">{{ guestName }}</span>
    </div>
</template>

<style scoped>
.node-guest-name {
    min-width: 50px;
    min-height: 24px;
    display: inline-block;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    font-style: inherit;
    text-align: inherit;
    text-decoration: inherit;
    text-transform: inherit;
}
</style>