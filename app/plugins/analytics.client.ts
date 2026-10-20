import type { FetchInterface } from "~~/interfaces";

interface Response extends FetchInterface {
  data: {
    id: string | number;
    key: string;
    value: string | boolean;
  };
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute();
  if (route.path.startsWith("admin")) return;

  try {
    const { data } = await $fetch<Response>(
      "/api/v1/admin/settings/key/google_analytics_id",
    );

    const gaId = data.value;

    if (gaId) {
      useHead({
        script: [
          {
            src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
            async: true,
          },
          {
            innerHTML: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
            `,
            type: "text/javascript",
          },
        ],
      });
    }
  } catch (e) {
    console.error("Không thể load Google Analytics ID từ DB", e);
  }
});
