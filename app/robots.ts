import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

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
