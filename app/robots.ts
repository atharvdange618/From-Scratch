import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fromscratch.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/editor"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/editor"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/editor"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
