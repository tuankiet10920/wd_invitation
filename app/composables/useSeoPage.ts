import type { DataSEO } from "~~/interfaces";

export const useSeoPage = async (slug: string): Promise<DataSEO | null> => {
  const config = useRuntimeConfig();
  const { data: response } = await useFetch<any>(`/api/v1/client/seo-pages/${slug}`);

  if (response.value?.data) {
    const item = response.value.data;
    const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;
    const imageUrl = item.image; // Giữ nguyên tên file ảnh, xử lý ghép path ở useAppSeo hoặc giữ nguyên tùy logic SEO.ts

    return {
      title: item.title,
      description: item.description,
      og_title: item.title,
      og_description: item.description,
      og_image: imageUrl,
      og_url: `${siteUrl}/${slug === "trang-chu" ? "" : slug}`,
      og_type: "website",
      twitter_card: "summary_large_image",
      twitter_title: item.title,
      twitter_image: imageUrl,
      twitter_site: "@cinelove", // Default value hoặc lấy từ config nếu có
    };
  }
  return null;
};
