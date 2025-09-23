import type { MetadataRoute } from "next";
import { getCachedFrameIndex } from "@/lib/frames-cache";
import { getAllSeries, getSeriesEpisodes } from "@/lib/series-info";
import { characters } from "@/lib/profiles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";

  // Get all frames for caption pages
  const frames = await getCachedFrameIndex();

  // Get all series
  const series = getAllSeries();

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profiles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Series pages
  const seriesPages: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${baseUrl}/series/${s.number}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Episode pages
  const episodePages: MetadataRoute.Sitemap = series.flatMap((s) => {
    const episodes = getSeriesEpisodes(s.number);
    return episodes.map((episodeNumber) => ({
      url: `${baseUrl}/series/${s.number}/episode/${episodeNumber}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  });

  // Profile pages
  const profilePages: MetadataRoute.Sitemap = Object.keys(characters).map(
    (profileId) => ({
      url: `${baseUrl}/profiles/${profileId}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }),
  );

  // Caption pages (limit to most important 1000 to avoid huge sitemap)
  const captionPages: MetadataRoute.Sitemap = frames
    .slice(0, 1000)
    .map((frame) => ({
      url: `${baseUrl}/caption/${frame.id}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    }));

  return [
    ...staticPages,
    ...seriesPages,
    ...episodePages,
    ...profilePages,
    ...captionPages,
  ];
}
