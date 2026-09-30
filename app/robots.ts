import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

/**
 * Generates robots.txt configuration for the application
 * Allows crawling of all content while providing sitemap location
 * @returns The robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = BASE_URL.replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og?"],
      disallow: [
        "/api/", // Disallow API routes
        "/share/", // Disallow share routes (dynamic content)
        "/t/", // Disallow Twitter OG routes
        "/caption/compare/", // Disallow comparison routes
        "/profiles/*/space/", // Disallow profile space routes
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
