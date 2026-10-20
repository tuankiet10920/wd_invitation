// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import {
  configs,
  JWT_SECRET,
  routesMap,
  NODE_ENV,
  PORT,
  LIFETIME_COOKIE,
  NUXT_SESSION_PASSWORD,
  GOOGLE_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET,
  LIFETIME_COOKIE_ADMIN,
  SEPAY_API_KEY_DEV,
  SEPAY_WEBHOOK_SECRET_DEV,
  SEPAY_API_KEY_PROD,
  SEPAY_WEBHOOK_SECRET_PROD,
  SEPAY_API_KEY_TEST,
  SEPAY_WEBHOOK_SECRET_TEST,
  SEPAY_ACC_NO,
  SEPAY_BANK,
  SEPAY_ACC_NAME,
  DOMAIN_TEST,
} from "./app/environment";

interface RouteMapInterface {
  en: string;
  vi: string;
  children?: RouteMapInterface[];
}

type NodeEnvType = "production" | "development" | "test";

const isProd = (NODE_ENV as NodeEnvType) === "production";
const isTest = (NODE_ENV as NodeEnvType) === "test";

const sepayApiKey = isProd
  ? SEPAY_API_KEY_PROD
  : isTest
  ? SEPAY_API_KEY_TEST
  : SEPAY_API_KEY_DEV;
const sepayWebhookSecret = isProd
  ? SEPAY_WEBHOOK_SECRET_PROD
  : isTest
  ? SEPAY_WEBHOOK_SECRET_TEST
  : SEPAY_WEBHOOK_SECRET_DEV;

const formatDomainUrl = (domainOrUrl: string) => {
  if (!domainOrUrl) return `http://localhost:${PORT}`;
  if (domainOrUrl.startsWith("http://") || domainOrUrl.startsWith("https://")) {
    return domainOrUrl;
  }
  return `https://${domainOrUrl}`;
};

const activeSiteUrl = isProd
  ? formatDomainUrl(configs.domain)
  : isTest
  ? formatDomainUrl(DOMAIN_TEST || configs.domain)
  : `http://localhost:${PORT}`;

export default defineNuxtConfig({
  srcDir: "app",
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  debug: false,
  devServer: {
    port: PORT,
  },
  css: [
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-vue-next/dist/bootstrap-vue-next.css",
  ],
  plugins: [{ src: "~/plugins/bootstrap-vue.client.ts", mode: "client" }],
  routeRules: {
    "/images/wcards/**": {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          integrity:
            "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer",
        },
      ],
    },
  },
  runtimeConfig: {
    environment: NODE_ENV as NodeEnvType,
    url: activeSiteUrl,
    lifetimeCookie: `${LIFETIME_COOKIE}`,
    lifetimeCookieAdmin: `${LIFETIME_COOKIE_ADMIN}`,
    session: {
      password: NUXT_SESSION_PASSWORD,
    },
    jwtSecret: JWT_SECRET,
    payment: {
      sepay: {
        apiKey: sepayApiKey,
        webhookSecret: sepayWebhookSecret,
        accNo: SEPAY_ACC_NO,
        bank: SEPAY_BANK,
        accName: SEPAY_ACC_NAME,
      },
    },
    publicDir: process.env.NODE_ENV === "production" ? "../public" : "public",
    seederDir: process.env.NODE_ENV === "production" ? "../seeders" : "seeders",
    public: {
      fbAppID: "1129451982583555",
      siteUrl: activeSiteUrl,
      urlLocalHost: `http://localhost:${PORT}`,
      env: NODE_ENV as NodeEnvType,
      sepay: {
        apiKey: sepayApiKey,
        accNo: SEPAY_ACC_NO,
        bank: SEPAY_BANK,
        accName: SEPAY_ACC_NAME,
      },
    },
    oauth: {
      facebook: {
        clientId: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        redirectURL: "",
      },
      google: {
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        redirectURL: "",
      },
    },
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  hooks: {
    "pages:extend"(routes) {
      if (configs.is_replace_route) {
        let routesHasPath: RouteMapInterface[] = [];

        // lọc và chia ra các route có và không có chilren
        routesHasPath = routesMap;

        routes.forEach((route) => {
          if (route.path) {
            if (route.path.includes("admin")) {
              route.path = route.path.replace("admin", configs.admin.prefix);
            }

            // các routes lồng nhau
            if (routesHasPath.length > 0) {
              // cấu hình cho các route lồng nhau
              let nameOfRoute: string = "";

              // nếu không tìm thấy name của route thì dùng path và tách thành mảng theo dấu /
              if (route.name) nameOfRoute = route.name ?? "";
              else nameOfRoute = route.path.split("/")[1] ?? "";

              if (nameOfRoute.trim() != "") {
                const currentRouteInRouteMap = routesHasPath.find(
                  (item) => item.en == nameOfRoute,
                );

                const params = ["slug", "id"];
                let indexOfParam = -1;

                const isExistParamInRoute = params.some((param, index) => {
                  if (nameOfRoute.includes(param)) {
                    indexOfParam = index;
                    return true;
                  }
                  return false;
                });

                // cập nhật route đơn
                if (isExistParamInRoute) {
                  route.path = route.path.replace(
                    `/${nameOfRoute.split("-")[0]}/:${params[indexOfParam]}()`,
                    `/${currentRouteInRouteMap?.vi}/:${params[indexOfParam]}()`,
                  );
                } else {
                  route.path = route.path.replace(
                    `/${nameOfRoute}`,
                    `/${currentRouteInRouteMap?.vi}`,
                  );
                }

                route.children?.map((item) => {
                  const equalRoute = currentRouteInRouteMap?.children?.find(
                    (_item) => `${nameOfRoute}-${_item.en}` == item.name,
                  );
                  if (equalRoute) item.path = equalRoute.vi;
                  return item;
                });
              }
            }
          }
        });
      }
    },
  },
  modules: [
    "@nuxt/eslint", // "@nuxt/hints",
    "@nuxt/fonts",
    "@nuxt/image",
    "nuxt-swiper",
    "@nuxtjs/sitemap",
    "nuxt-gtag",
    "nuxt-svgo",
    "@nuxt/icon",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "@vueuse/motion/nuxt",
  ],
  svgo: {
    autoImportPath: "./assets/icons/", // Đường dẫn nơi bạn để các file SVG
    componentPrefix: "icon",
  },
  // gtag: {
  //   id: configs.google_analytics_id,
  //   config: {
  //     enabled: (NODE_ENV as NodeEnvType) === "production",
  //     page_title: "Phúc An Solutions", // Tùy chọn đặt tiêu đề mặc định
  //   },
  // },
  image: {
    quality: 80,
    format: ["webp"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
    },
    provider: "ipx",
    domains: [
      "babythrees.ntkmarket.shop",
      "http://localhost:3000",
      "lh3.googleusercontent.com",
    ],
  },
  site: {
    url: "https://babythrees.ntkmarket.shop",
    name: "Phúc An Solutions",
  },
  sitemap: {
    // Nếu bạn có các link động từ Database (như bài viết)
    sources: ["/api/v1/sitemap"],
    exclude: ["/admin/**"],
  },
  typescript: {
    includeWorkspace: true,
  },
  nitro: {
    // Tăng giới hạn payload để tải ảnh Base64 dung lượng lớn
    experimental: {
      openAPI: true,
      websocket: true,
    }
  }
});
