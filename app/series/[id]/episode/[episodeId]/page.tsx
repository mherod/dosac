import { EpisodePage } from "@/components/episode-page";
import { formatPageTitle } from "@/lib/constants";
import { getEpisodeInfo } from "@/lib/episode-info";
import {
  getAllSeries,
  getSeriesEpisodes,
  getSeriesInfo,
} from "@/lib/series-info";
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

  const title = episode?.title || `Episode ${resolvedParams.episodeId}`;

  const description = episode?.shortSummary
    ? episode.shortSummary
        .map((part: unknown) =>
          typeof part === "string" ? part : (part as { text: string }).text,
        )
        .join("")
    : series.shortSummary
        .map((part: unknown) =>
          typeof part === "string" ? part : (part as { text: string }).text,
        )
        .join("");

  return {
    title: formatPageTitle(`${title} | Series ${series.number}`),
    description,
  };
}

/**
 * Page component for displaying a specific episode and its frames
 * Shows episode details, cast, crew, and a grid of all frames from the episode
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series and episode IDs
 * @returns The episode page with details and frame grid
 */
export default function Page(props: Props): React.ReactElement {
  return <EpisodePage {...props} />;
}
