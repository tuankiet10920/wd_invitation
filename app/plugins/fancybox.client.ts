import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      fancybox: Fancybox,
    },
  };
});
