import { getSiteUrl } from "@/helpers/config/siteConfig";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/home",
      disallow: ["/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
