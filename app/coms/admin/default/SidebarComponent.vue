<script setup lang="ts">
import type { IconInterface } from '~~/interfaces'
import BaseIconComponent from '~/coms/icons/BaseIconComponent.vue';
import NewDesignComponent from '~/coms/dashboard/modal/NewDesignComponent.vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

interface Button {
    id: number
    text: string
    icon: IconInterface
    isChoose: boolean
    url?: string
}

interface Group {
    id: number
    text: string
    list: Button[]
}

const groups = ref<Group[]>([
    {
        id: 1,
        text: 'home',
        list: [
            {
                id: 1,
                text: 'Tổng quan',
                icon: {
                    name: 'dashboard-customize-line',
                    type: 'si'
                },
                isChoose: true,
                url: '/dashboard'
            },
            {
                id: 2,
                text: 'Gói dịch vụ',
                icon: {
                    name: 'crown-line-duotone',
                    type: 'solar'
                },
                isChoose: false,
                url: '/dashboard/my-plan'
            },
            {
                id: 3,
                text: 'Tạo thiết kế',
                icon: {
                    name: 'pen-new-square-linear',
                    type: 'solar'
                },
                isChoose: false,
            }
        ]
    },
    {
        id: 2,
        text: 'thiết kế của tôi',
        list: [
            {
                id: 4,
                text: 'Thiệp online',
                icon: {
                    name: 'cards-playing-diamond-outline',
                    type: 'mdi'
                },
                isChoose: false,
                url: '/dashboard/pages'
            },
            {
                id: 5,
                text: 'Website khác',
                icon: {
                    name: 'sticker-smile-square-outline',
                    type: 'solar'
                },
                isChoose: false,
                url: '/dashboard/my-custom-web'
            }
        ]
    },
    {
        id: 3,
        text: 'quà tặng và lời chúc',
        list: [
            {
                id: 6,
                text: 'Lời chúc',
                icon: {
                    name: 'comment-processing-outline',
                    type: 'mdi'
                },
                isChoose: false,
                url: '/dashboard/blessing-box'
            },
            {
                id: 7,
                text: 'Quà tặng',
                icon: {
                    name: 'gift-line-duotone',
                    type: 'solar'
                },
                isChoose: false,
                url: '/dashboard/gifts-overview'
            }
        ]
    },
    {
        id: 4,
        text: 'tài khoản',
        list: [
            {
                id: 8,
                text: 'Thông tin cá nhân',
                icon: {
                    name: 'shield-person-outline-rounded',
                    type: 'material-symbols'
                },
                isChoose: false,
                url: '/dashboard/profile'
            },
        ]
    },
    {
        id: 5,
        text: 'hỗ trợ',
        list: [
            {
                id: 9,
                text: 'Đóng góp ý kiến',
                icon: {
                    name: 'mailbox-line-duotone',
                    type: 'solar'
                },
                isChoose: false,
                url: '/dashboard/feedback'
            },
        ]
    },
])


const isShowNewDesign = ref(false)

const handleClickItem = (item: Button) => {
    if (item.id === 3) {
        isShowNewDesign.value = true
    }
    // Close sidebar on mobile when item clicked
    if (window.innerWidth < 992) {
        emit('close')
    }
}

const chooseSite = (path: string) => {
    groups.value = groups.value.map(g => {
        g.list = g.list.map(item => {
            item.isChoose = item.url == path
            return item
        })
        return g
    })
}

const route = useRoute()

watch(() => route.path, (newValue) => {
    chooseSite(newValue)
}, { immediate: true })
</script>
<template>
    <div>
        <div class="sidebar py-4" :class="{ 'open': isOpen }">
            <div class="logo-brand flex-js-ac mb-3 cursor-pointer" @click="navigateTo('/')">
                <NuxtImg :src="`/others/logo.svg`" class="me-2" :width="35" :height="35" />
                <NuxtImg :src="`/others/logo-text-dark.svg`" :width="95" />
            </div>
            <div v-for="(item, index) in groups" :key="item.id" class="group pb-2" :class="{
                'group-border': index < groups.length - 1,
                'mb-3': index < groups.length - 1
            }">
                <span class="text-uppercase d-block mb-1 title">{{ item.text }}</span>
                <div v-for="btn in item.list" :key="btn.id" class="text-decoration-none cursor-pointer"
                    @click="handleClickItem(btn)">
                    <NuxtLink v-if="btn.url" :to="btn.url" class="text-decoration-none">
                        <button type="button" class="d-flex flex-js-ac" :class="{
                            'active': btn.isChoose
                        }">
                            <BaseIconComponent class="me-3" :type="btn.icon.type" :name="btn.icon.name" :size="18" />
                            <span>{{ btn.text }}</span>
                        </button>
                    </NuxtLink>
                    <button v-else type="button" class="d-flex flex-js-ac" :class="{
                        'active': btn.isChoose
                    }">
                        <BaseIconComponent class="me-3" :type="btn.icon.type" :name="btn.icon.name" :size="18" />
                        <span>{{ btn.text }}</span>
                    </button>
                </div>
            </div>

            <NewDesignComponent v-model="isShowNewDesign" />
        </div>
        <!-- Overlay for mobile -->
        <div class="sidebar-overlay" v-if="isOpen" @click="emit('close')"></div>
    </div>
</template>
<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 270px;
    height: 100vh;
    background-color: #fff;
    padding: 10px 20px;
    border-right: 1px solid #eee;
    z-index: 3000;
    overflow-y: auto;
    transition: transform 0.3s ease;
}

.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
}

@media (max-width: 991px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .sidebar-overlay {
        display: block;
    }
}

.title {
    font-size: 13px;
    font-weight: 500;
}

.group button span {
    font-size: 16px;
    transition: all .3s ease;
}

.group button:hover span {
    color: #3a9bff !important;
}

.group button {
    width: 100%;
    padding: 10px 10px 10px 20px;
    border-radius: 8px;
    background: none;
    border: none;
}

.group button.active {
    background-color: #3a9bff;
    box-shadow: 0 0 #0000, 0 0 #0000, 0px 17px 20px -8px rgba(77, 91, 236, 0.231372549);
}

.group button.active span {
    color: #fff !important;
}

.group-border {
    border-bottom: 1px solid #ccc;
}

.flex-js-ac {
    display: flex;
    justify-content: start;
    align-items: center;
}
</style>