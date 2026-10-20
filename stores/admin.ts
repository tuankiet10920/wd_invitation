import { navigateTo } from "nuxt/app";
import { defineStore } from "pinia";
import type { Role, BodyDataAdminInfo } from "~~/interfaces";
export const useAdminStore = defineStore("admin", {
  state: () => ({
    isLogin: false,
    name: null as string | null,
    image: null as string | null,
    email: null as string | null,
    role: "admin" as Role,
    openModal: false,
  }),
  actions: {
    async logout() {
      const adminInfo = useCookie<BodyDataAdminInfo | null>("auth_admin_info");
      adminInfo.value = null;
      await navigateTo("/admin/login");
    },
    async checkLogin() {
      const adminInfo = useCookie<BodyDataAdminInfo>("auth_admin_info");
      if (!adminInfo.value) return await navigateTo("/admin/login");

      this.init();
    },
    init() {
      const adminInfo = useCookie<BodyDataAdminInfo>("auth_admin_info");
      
      this.isLogin = !!adminInfo.value;
      if (this.isLogin) {
          this.role = adminInfo.value?.role as Role;
          this.name = adminInfo.value?.name as string | null;
          this.image = adminInfo.value?.image as string | null;
          this.email = adminInfo.value?.email as string | null;
      }
    }
  },
});
