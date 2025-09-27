import type { MetadataRoute } from "next";

/**
 * Generates robots.txt configuration for the application
 * Allows crawling of all content while providing sitemap location
 * @returns The robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
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
