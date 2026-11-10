import { navigateTo } from "nuxt/app";
import { defineStore } from "pinia";
import type { Role } from "~~/interfaces";
type Social = "normal" | "facebook" | "google";
export const useUserStore = defineStore("user", {
  state: () => ({
    isLogin: false,
    name: null as string | null,
    image: null as string | null,
    email: null as string | null,
    birthday: null as string | null,
    phone: null as string | null,
    role: "user" as Role,
    bio: null as string | null,
    remember: false,
    openModal: false,
    social: "normal" as Social,
    packageId: 1 as number,
    packageName: "Free" as string,
    packageLevel: 1 as number,
    numberOfCards: 1 as number,
    imageLimits: 5 as number,
    maximumViews: 1000 as number,
    currentWebsites: 0 as number,
    currentImages: 0 as number,
    currentViews: 0 as number,
  }),
  getters: {
    avatarUrl: (state): string => {
      if (!state.image) return "/others/logo.svg";
      if (
        state.image.startsWith("http://") ||
        state.image.startsWith("https://") ||
        state.image.startsWith("data:") ||
        state.image.startsWith("blob:")
      ) {
        return state.image;
      }
      if (state.image.startsWith("/")) {
        return state.image;
      }
      return `/images/avatars/${state.image}`;
    },
    isWebsiteLimitReached: (state): boolean => {
      if (state.role === "admin") return false;
      return state.currentWebsites >= state.numberOfCards;
    },
    isImageLimitReached: (state): boolean => {
      if (state.role === "admin") return false;
      return state.currentImages >= state.imageLimits;
    },
    isViewLimitReached: (state): boolean => {
      if (state.role === "admin") return false;
      return state.currentViews >= state.maximumViews;
    },
  },
  actions: {
    async logout() {
      const { clear } = useUserSession();
      await clear();
      this.$reset();
      navigateTo("/");
    },
    async fetchPlan() {
      try {
        const res: any = await $fetch("/api/v1/client/my-plan");
        if (res?.success && res?.data) {
          this.packageId = Number(res.data.id) || 1;
          this.packageName = res.data.name || "Free";
          this.packageLevel = Number(res.data.level) || 1;
          this.numberOfCards = Number(res.data.number_of_cards) || 1;
          this.imageLimits = Number(res.data.image_limits) || 5;
          this.maximumViews = Number(res.data.maximum_views) || 1000;
          this.currentWebsites = Number(res.data.currentWebsites) || 0;
          this.currentImages = Number(res.data.currentImages) || 0;
          this.currentViews = Number(res.data.currentViews) || 0;
          return res.data;
        }
      } catch (e) {}
      return null;
    },
    async checkLogin() {
      const { loggedIn, user, fetch } = useUserSession();
      if (import.meta.client) await fetch();
      this.remember = user.value?.remember ?? false;
      this.isLogin = loggedIn.value;
      this.role = user.value?.role as Role;
      this.name = loggedIn.value ? (user.value?.name as string | null) : null;
      this.image = loggedIn.value ? (user.value?.image as string | null) : null;
      this.email = loggedIn.value ? (user.value?.email as string | null) : null;
      if (import.meta.client && this.isLogin) {
        await this.fetchPlan();
      }
    },
  },
});
