import { EpisodePage } from "@/components/episode-page";
import { formatPageTitle } from "@/lib/constants";
import { getEpisodeInfo } from "@/lib/episode-info";
import {
  getAllSeries,
  getSeriesEpisodes,
  getSeriesInfo,
} from "@/lib/series-info";
import { generateEpisodeStructuredData } from "@/lib/structured-data";
import type { Metadata } from "next";

/**
 * Generates static params for all episode pages at build time
 * Creates paths for each episode in each series
 * @returns Array of objects containing series and episode IDs for static generation
 */
export async function generateStaticParams(): Promise<
  { id: string; episodeId: string }[]
> {
  const allSeries = getAllSeries();
  return allSeries.flatMap((series: { number: number }) => {
    const episodes = getSeriesEpisodes(series.number);
    return episodes.map((episodeNumber: number) => ({
      id: series.number.toString(),
      episodeId: episodeNumber.toString(),
    }));
  });
}

/**
 * Interface for page component props
 */
type Props = {
  /** Promise resolving to route parameters */
  params: Promise<{ id: string; episodeId: string }>;
};

/**
 * Generates metadata for the episode page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series and episode IDs
 * @returns Metadata object with title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(Number.parseInt(resolvedParams.id, 10));
  const episode = getEpisodeInfo(
    Number.parseInt(resolvedParams.id, 10),
    Number.parseInt(resolvedParams.episodeId, 10),
  );
  if (!series) return {};

  const episodeTitle = episode?.title || `Episode ${resolvedParams.episodeId}`;
  const fullTitle = `${episodeTitle} | Series ${series.number}`;

  const description = episode?.shortSummary
    ? episode.shortSummary
        .map((part) => (typeof part === "string" ? part : part.text))
        .join("")
    : series.shortSummary
        .map((part) => (typeof part === "string" ? part : part.text))
        .join("");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const pageUrl = new URL(
    `/series/${series.number}/episode/${resolvedParams.episodeId}`,
    baseUrl,
  );

  return {
    title: formatPageTitle(fullTitle),
    description: `${description} Browse memes and quotes from ${episodeTitle} of The Thick of It. Create your own captions from iconic moments.`,
    openGraph: {
      title: fullTitle,
      description: `${description} Create memes from ${episodeTitle} of The Thick of It.`,
      url: pageUrl.toString(),
      type: "website",
      siteName: "DOSAC.UK",
      locale: "en_GB",
      images: [
        {
          url: `${baseUrl}/og-episode-s${series.number}e${resolvedParams.episodeId}.jpg`,
          width: 1200,
          height: 630,
          alt: `${episodeTitle} - Series ${series.number} - The Thick of It`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: `${description} Create memes from ${episodeTitle} of The Thick of It.`,
      images: [
        `${baseUrl}/og-episode-s${series.number}e${resolvedParams.episodeId}.jpg`,
      ],
    },
    alternates: {
      canonical: pageUrl.toString(),
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

/**
 * Page component for displaying a specific episode and its frames
 * Shows episode details, cast, crew, and a grid of all frames from the episode
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series and episode IDs
 * @returns The episode page with details and frame grid
 */
export default async function Page(props: Props): Promise<React.ReactElement> {
  const resolvedParams = await props.params;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateEpisodeStructuredData(
              Number.parseInt(resolvedParams.id, 10),
              Number.parseInt(resolvedParams.episodeId, 10),
            ),
          ),
        }}
      />
      <EpisodePage {...props} />
    </>
  );
}
