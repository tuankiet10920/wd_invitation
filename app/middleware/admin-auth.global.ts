import { useAdminStore } from "~~/stores/admin";
import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const adminStore = useAdminStore();
  const userStore = useUserStore();
  const excluded = ["/admin/login"];

  if (excluded.includes(to.path)) return;

  if (to.path.startsWith("/admin")) {
    const result = await adminStore.checkLogin();
    if (result) return result;
  }

  if (to.path.startsWith("/dashboard") || to.path.startsWith("/editor")) {
    await userStore.checkLogin();
    if (!userStore.isLogin) {
      if (import.meta.client) {
        userStore.openModal = true;
      }
      return navigateTo("/");
    }
  }
});
