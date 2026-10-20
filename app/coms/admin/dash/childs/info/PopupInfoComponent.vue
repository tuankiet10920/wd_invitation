<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import type { IconType } from "~~/interfaces"
import { useAdminStore } from '~~/stores/admin';

interface MenuItem {
    text: string
    icon: string
    type: IconType
    badge?: string | number
    hasDivider?: boolean
}

const menuItems: MenuItem[] = [
    { text: 'Profile', icon: 'user', type: 'lucide' },
    { text: 'Chat', icon: 'smile', type: 'lucide' },
    { text: 'Inbox', icon: 'mail', type: 'lucide', badge: '25' },
    { text: 'Messages', icon: 'message-square', type: 'lucide' },
    { text: 'Settings', icon: 'settings', type: 'lucide', hasDivider: true },
    { text: 'Sign Out', icon: 'log-out', type: 'lucide', hasDivider: true },
]

const store = useAdminStore()

const logout = (text: string) => {
    if (text == 'Sign Out') store.logout()
}
</script>

<template>
    <div class="popup-info bg-white rounded shadow-lg border">
        <ul class="list-unstyled mb-0">
            <template v-for="(item, index) in menuItems" :key="index">
                <li class="menu-item-wrapper" :class="{ 'border-top': item.hasDivider }">
                    <a href="#" class="menu-link text-decoration-none text-body" @click="logout(item.text)">
                        <BaseIconComponent :name="item.icon" :type="item.type" :size="18"
                            class="me-3 text-muted icon-fixed" />
                        <span class="flex-grow-1">{{ item.text }}</span>
                        <span v-if="item.badge" class="badge rounded bg-info-subtle text-info fw-bold">{{ item.badge
                            }}</span>
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
.popup-info {
    min-width: 200px;
    padding: 0.5rem 0;
    z-index: 1050;
    font-size: 0.9rem;
}

/* No default border */
/* .menu-item-wrapper {
} */

.menu-link {
    padding: 8px 24px;
    display: flex;
    align-items: center;
    color: #64748b;
    /* Slate 500 */
    transition: all 0.2s;
}

.menu-link:hover {
    color: #3b82f6;
    /* Blue 500 */
    background-color: transparent;
}

.menu-link:hover .text-muted {
    color: #3b82f6 !important;
}

.icon-fixed {
    width: 20px;
    text-align: center;
}

/* Badge specific override */
.badge {
    font-size: 0.75rem;
    padding: 0.35em 0.65em;
    background-color: #d1fae5 !important;
    /* Greenish/Teal match */
    color: #10b981 !important;
    /* Emerald 500 */
}

/* Divider override */
.border-top {
    border-top: 1px solid #f1f5f9 !important;
    margin-top: 4px;
    /* Spacing for divider */
    padding-top: 4px;
}
</style>