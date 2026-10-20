import Moveable from "vue3-moveable";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Moveable", Moveable);
});
