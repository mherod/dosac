import type { Metadata } from "next";
import {
  getSeriesInfo,
  getAllSeries,
  getSeriesEpisodes,
  type SeriesInfo,
} from "@/lib/series-info";
import { getEpisodeInfo } from "@/lib/episode-info";
import { formatPageTitle } from "@/lib/constants";
import { EpisodePage } from "@/components/episode-page";

/**
 * Generates static params for all episode pages at build time
 * Creates paths for each episode in each series
 * @returns Array of objects containing series and episode IDs for static generation
 */
export async function generateStaticParams() {
  const allSeries = getAllSeries();
  return allSeries.flatMap((series: SeriesInfo) => {
    const episodes = getSeriesEpisodes(series.number);
    return episodes.map((episodeNumber) => ({
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
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  const episode = getEpisodeInfo(
    parseInt(resolvedParams.id, 10),
    parseInt(resolvedParams.episodeId, 10),
  );
  if (!series) return {};

  const title = episode?.title || `Episode ${resolvedParams.episodeId}`;

  return {
    title: formatPageTitle(`${title} | Series ${series.number}`),
    description: episode?.shortSummary || series.shortSummary,
  };
}

/**
 * Page component for displaying a specific episode and its frames
 * Shows episode details, cast, crew, and a grid of all frames from the episode
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series and episode IDs
 * @returns The episode page with details and frame grid
 */
export default function Page(props: Props) {
  return <EpisodePage {...props} />;
}
