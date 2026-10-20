<script setup lang="ts">
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import PopupInfoComponent from '~/coms/admin/dash/childs/info/PopupInfoComponent.vue';
import { useAdminStore } from '~~/stores/admin';

defineProps({
    isDarkMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['toggle-sidebar', 'toggle-theme'])
const showUserMenu = ref(false)
const store = useAdminStore()
</script>

<template>
    <header class="topbar d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
        <div class="d-flex align-items-center">
            <!-- Hamburger Icon (Visible < 1280px) -->
            <button class="btn btn-link text-body p-0 me-3 navbar-toggle" @click="emit('toggle-sidebar')">
                <BaseIconComponent name="menu" type="lucide" :size="24" />
            </button>

            <!-- Navbar Logo (Visible > 1280px) -->
            <div class="navbar-logo align-items-center me-3" @click="navigateTo('/')" role="button">
                <NuxtImg :src="`/others/logo-ntkservices.png`" :width="32" :height="32" class="me-2" />
                <span class="logo-text fw-bold">NTK SERVICES</span>
            </div>

            <h4 class="mb-0 fw-bold d-none d-lg-block page-title">Dashboard</h4>
        </div>

        <div class="d-flex align-items-center gap-3">
            <button class="btn btn-icon rounded-circle" @click="emit('toggle-theme')">
                <BaseIconComponent :name="isDarkMode ? 'sun' : 'moon'" type="lucide" :size="20" />
            </button>
            <!-- USER ICON -->
            <div class="dropdown position-relative d-flex align-items-center" @click="showUserMenu = !showUserMenu"
                role="button">
                <NuxtImg :src="`/images/avatars/default-avatar.png`" :width="38" :height="38" class="rounded-circle" />
                <PopupInfoComponent v-if="showUserMenu" class="position-absolute end-0 top-100 mt-2" />
            </div>
        </div>
    </header>
</template>

<style scoped>
.topbar {
    background-color: var(--bg-card);
    height: 70px;
    border-bottom: 1px solid var(--border-color);
}

/* Custom Responsive logic for 1280px */
@media (min-width: 1280px) {
    .navbar-toggle {
        display: none !important;
    }

    .navbar-logo {
        display: flex !important;
    }
}

@media (max-width: 1279.98px) {
    .navbar-toggle {
        display: block !important;
    }

    .navbar-logo {
        display: none !important;
    }
}

.btn-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    background-color: rgba(0, 0, 0, 0.05);
}

.btn-icon:hover {
    background-color: rgba(0, 0, 0, 0.3);
    color: #3b82f6;
}

.page-title {
    color: var(--text-primary);
}
</style>