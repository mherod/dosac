import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getFrameIndex } from "@/lib/frames.server";
import { getServerPolicies } from "@/lib/policies.server";
import { characters } from "@/lib/profiles";
import { BASE_URL } from "@/lib/seo";
import { getAllSeries, getSeriesEpisodes } from "@/lib/series-info";

/**
 * Generates a dynamic sitemap for the application
 * Includes all static pages, series, episodes, categories, and character profiles
 * @returns The sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL.replace(/\/+$/, "");
  const [policies, allFrames] = await Promise.all([
    getServerPolicies(),
    getFrameIndex(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/series`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profiles`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Series pages
  const seriesPages: MetadataRoute.Sitemap = getAllSeries().map((series) => ({
    url: `${baseUrl}/series/${series.number}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const episodeIndexPages: MetadataRoute.Sitemap = getAllSeries().map(
    (series) => ({
      url: `${baseUrl}/series/${series.number}/episode`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }),
  );

  // Episode pages
  const episodePages: MetadataRoute.Sitemap = getAllSeries().flatMap((series) =>
    getSeriesEpisodes(series.number).map((episodeNumber) => ({
      url: `${baseUrl}/series/${series.number}/episode/${episodeNumber}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Character profile pages
  const profilePages: MetadataRoute.Sitemap = Object.keys(characters).map(
    (id) => ({
      url: `${baseUrl}/profiles/${id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  const policyPages: MetadataRoute.Sitemap = policies.map((policy) => ({
    url: `${baseUrl}/policies/${policy.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Caption pages
  const captionPages: MetadataRoute.Sitemap = allFrames.map((frame) => ({
    url: `${baseUrl}/caption/${frame.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...seriesPages,
    ...episodeIndexPages,
    ...episodePages,
    ...categoryPages,
    ...profilePages,
    ...policyPages,
    ...captionPages,
  ];
}
