import type { DataSEO } from "~~/interfaces";

export const useAppSeo = (data: DataSEO | undefined | null) => {
  const config = useRuntimeConfig();

  if (!data) return;

  const siteUrl = (config.public.env === "production" || config.public.env === "test") ? config.public.siteUrl : config.public.urlLocalHost;

  // Xử lý absolute URL cho hình ảnh nếu cần
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${siteUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  return useServerSeoMeta({
    fbAppId: () => config.public.fbAppID,
    title: () => data.title,
    description: () => data.description,
    ogTitle: () => data.og_title,
    ogDescription: () => data.og_description,
    ogImage: () => getFullImageUrl(data.og_image),
    ogImageAlt: () => data.title,
    ogUrl: () => data.og_url,
    ogType: () => data.og_type as any,
    twitterCard: () => data.twitter_card as any,
    twitterTitle: () => data.twitter_title,
    twitterImage: () => getFullImageUrl(data.twitter_image),
    twitterSite: () => data.twitter_site,
  });
};
