import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';

export const useFavoriteStore = defineStore('favorites', () => {
    const favorites = ref<number[]>([]);

    // Initialize from localStorage immediately if on client
    const init = () => {
        if (import.meta.client) {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        favorites.value = parsed.map((id: any) => Number(id));
                    } else {
                        favorites.value = [];
                    }
                } catch (e) {
                    console.error('Failed to parse favorites from localStorage', e);
                    favorites.value = [];
                }
            }
        }
    }

    // Call init immediately
    init();

    // Also call onMounted just in case
    onMounted(() => {
        if (favorites.value.length === 0) {
            init();
        }
    });

    // Synchronize favorites to localStorage
    watch(favorites, (newVal) => {
        if (import.meta.client) {
            localStorage.setItem('favorites', JSON.stringify(newVal));
        }
    }, { deep: true });

    function toggleFavorite(id: any) {
        if (!id) return;
        const numId = Number(id);
        const index = favorites.value.indexOf(numId);
        if (index > -1) {
            favorites.value = favorites.value.filter(item => item !== numId);
        } else {
            favorites.value = [...favorites.value, numId];
        }
    }

    function isFavorite(id: any) {
        if (!id) return false;
        return favorites.value.includes(Number(id));
    }

    return {
        favorites,
        toggleFavorite,
        isFavorite
    };
});
