export * from "./banner";
export * from "./category";
export * from "./product";
export * from "./seo";
export * from "./tag";
export * from "./brand";
export * from "./news-type";
export * from "./news";

export interface FetchInterface {
  success: boolean;
  message: string;
  code: number | string;
}

export type IconType =
  | "lucide"
  | "ph"
  | "mdi"
  | "tabler"
  | "ri"
  | "si"
  | "line-md"
  | "solar"
  | "iconoir"
  | "streamline"
  | "logos"
  | "simple-icons"
  | "fa6-brands"
  | "fa6-solid"
  | "bi"
  | "heroicons"
  | "carbon"
  | "ant-design"
  | "material-symbols"
  | "hugeicons"
  | "majesticons"
  | "ic"
  | "mingcute"
  | "mynaui";

export interface IconInterface {
  name: string;
  type?: IconType;
  size?: number;
  style?: object;
  color?: string;
  variant?:
    | "outline"
    | "rounded"
    | "sharp"
    | "solid"
    | "duotone"
    | "thin"
    | "fill"
    | "default";
}

export type Role = "admin" | "user";

export interface BodyDataSession {
  name: string;
  image: string;
  email?: string;
  role: Role;
  remember: boolean;
}

export interface BodyDataAdminInfo {
  name: string;
  image: string;
  email?: string;
  role: Role;
}

export type Social = "normal" | "facebook" | "google";

export interface DataSEO {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  og_url: string;
  og_type: string;
  twitter_card: string;
  twitter_title: string;
  twitter_image: string;
  twitter_site: string;
}
