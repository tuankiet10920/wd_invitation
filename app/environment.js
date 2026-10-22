/*
  http://localhost:3333/api
  https://ntkmarket.shop/api
  http://localhost:5000
  https://phucansolutions.com/api
  http://209.146.60.146:5566/api
  https://www.mocgarden.net
*/

const infoCompany = {
  name: "Phúc An Solutions",
  phone: "0918931193",
  hotline: "0918931193",
  facebook: "phucansolutionsvietnam",
  zalo: "0918931193",
  email: "info@phucansolutions.vn",
  addresses: [
    // '432 Nguyễn Huệ, Phường An Lộc, Tỉnh Đồng Nai',
    "351 Nguyễn Huệ, Phường Bình Long, Tỉnh Đồng Nai",
  ],
  business_license:
    "Công ty TNHH Phúc An Solutions - Giấy phép kinh doanh số: 3801292127 cấp ngày 04/10/2023 bởi Sở kế hoạch và đầu tư tỉnh Bình Phước.",
  copyright:
    "Copyright © 2024 Phúc An Solutions | Powered by Phuc An Solutions",
};

export const KPI_IN_MONTH = 1 * 100 * 1000 * 1000;

export const KPI_IN_DAY = Math.floor(KPI_IN_MONTH / 30);

export const JWT_SECRET = "UtMS&1MGo@_:WjY/[zNL88%sT$M]-i";

export const PORT = 3000;

export const LIFETIME_COOKIE = 60 * 60 * 24 * 30;

export const NUXT_SESSION_PASSWORD = "31945ccaae194bfd803edf1e07740bc3";

export const GOOGLE_CLIENT_ID = "";
export const GOOGLE_CLIENT_SECRET = "";

export const FACEBOOK_CLIENT_ID = "1238638101738706";
export const FACEBOOK_CLIENT_SECRET = "eba3192729134cfb3716b83d298c2680";

export const LIFETIME_COOKIE_ADMIN = 60 * 60 * 24;

// Sepay configurations for different environments
export const SEPAY_API_KEY_DEV =
  "VEAKGQOWR5L1K5NIJHDFNUMBCK02LOLR243IBBYWV0ZXM3PNUEZF6YSXI8QKJTBG";
export const SEPAY_WEBHOOK_SECRET_DEV =
  "VEAKGQOWR5L1K5NIJHDFNUMBCK02LOLR243IBBYWV0ZXM3PNUEZF6YSXI8QKJTBG";

export const SEPAY_API_KEY_PROD =
  "GBQYO1OJLY1YBPMDEU5MZMPWFPHFVC48IFT4XMHDL3VSAKNLS0UA2XJSGCRWUCX7";
export const SEPAY_WEBHOOK_SECRET_PROD =
  "GBQYO1OJLY1YBPMDEU5MZMPWFPHFVC48IFT4XMHDL3VSAKNLS0UA2XJSGCRWUCX7";

export const SEPAY_API_KEY_TEST = SEPAY_API_KEY_DEV;
export const SEPAY_WEBHOOK_SECRET_TEST = SEPAY_WEBHOOK_SECRET_DEV;

/**
 * @target NODE_ENV
 * @desc CẤU HÌNH DATABASE CONFIG
 * @option test
 * @option production
 * @option development
 */
export const NODE_ENV = "development";

export const DOMAIN_TEST = "subanconeal-nasir-lithologic.ngrok-free.dev";

// Default/fallback values for backward compatibility
export const SEPAY_API_KEY =
  NODE_ENV == "production"
    ? SEPAY_API_KEY_PROD
    : NODE_ENV == "test"
    ? SEPAY_API_KEY_TEST
    : SEPAY_API_KEY_DEV;
export const SEPAY_WEBHOOK_SECRET =
  NODE_ENV == "production"
    ? SEPAY_WEBHOOK_SECRET_PROD
    : NODE_ENV == "test"
    ? SEPAY_WEBHOOK_SECRET_TEST
    : SEPAY_WEBHOOK_SECRET_DEV;
export const SEPAY_ACC_NO = "101874133953";
export const SEPAY_BANK = "Vietinbank";
export const SEPAY_ACC_NAME = "NGUYEN TUAN KIET";
export const configs = {
  debug: true,
  info_company: infoCompany,
  is_replace_route: false,
  admin: {
    title: "ANNA BUILDINGS PANEL",
    prefix: "quan-tri",
  },
  google_analytics_id: "G-8TZ15FNY4J",
  domain: "test.ntkservices.com",
};

export const routesMap = [
  {
    en: "account",
    vi: "thong-tin-tai-khoan",
    children: [
      {
        en: "account",
        vi: "",
      },
      {
        en: "love",
        vi: "san-pham-yeu-thich",
      },
      {
        en: "address",
        vi: "dia-chi",
      },
      {
        en: "orders",
        vi: "don-hang-cua-toi",
      },
      {
        en: "voucher",
        vi: "diem-tich-luy",
      },
    ],
  },
  {
    en: "product-slug",
    vi: "san-pham",
  },
  {
    en: "about",
    vi: "gioi-thieu",
  },
];
