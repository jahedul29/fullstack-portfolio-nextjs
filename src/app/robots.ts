import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/home",
      disallow: ["/admin/"],
    },
    sitemap: "https://jahedulhoque.com/sitemap.xml",
  };
}
