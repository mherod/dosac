import { getAllSeries, getSeriesEpisodes } from "@/lib/series-info";
import { CATEGORIES } from "@/lib/categories";
import { characters } from "@/lib/profiles";
import { getFrameIndex } from "@/lib/frames.server";
import type { MetadataRoute } from "next";

/**
 * Generates a dynamic sitemap for the application
 * Includes all static pages, series, episodes, categories, and character profiles
 * @returns The sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profiles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Series pages
  const seriesPages: MetadataRoute.Sitemap = getAllSeries().map((series) => ({
    url: `${baseUrl}/series/${series.number}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Episode pages
  const episodePages: MetadataRoute.Sitemap = getAllSeries().flatMap((series) =>
    getSeriesEpisodes(series.number).map((episodeNumber) => ({
      url: `${baseUrl}/series/${series.number}/episode/${episodeNumber}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Character profile pages
  const profilePages: MetadataRoute.Sitemap = Object.keys(characters).map(
    (id) => ({
      url: `${baseUrl}/profiles/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  // Caption pages (limited to first 1000 for performance)
  const allFrames = await getFrameIndex();
  const captionPages: MetadataRoute.Sitemap = allFrames
    .slice(0, 1000)
    .map((frame) => ({
      url: `${baseUrl}/caption/${frame.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...seriesPages,
    ...episodePages,
    ...categoryPages,
    ...profilePages,
    ...captionPages,
  ];
}
