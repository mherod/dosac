import type { Metadata } from "next";
import {
  getSeriesInfo,
  getAllSeries,
  type SeriesInfo,
} from "@/lib/series-info";
import { formatPageTitle } from "@/lib/constants";
import { EpisodesPage } from "@/components/episodes-page";

/**
 * Generates static params for all episode pages at build time
 */
export async function generateStaticParams() {
  const allSeries = getAllSeries();
  return allSeries.map((series: SeriesInfo) => ({
    id: series.number.toString(),
  }));
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate metadata for the episodes page
 *
 * @param props - Page props
 * @param props.params - Route parameters containing series ID
 * @returns Metadata for the page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) return {};

  return {
    title: formatPageTitle(`Series ${series.number} Episodes`),
    description: series.shortSummary,
  };
}

/**
 * Page component for displaying episodes of a specific series
 * @param props - Page props
 * @param props.params - Route parameters containing series ID
 * @returns React component for the episodes page
 */
export default function Page(props: Props) {
  return <EpisodesPage {...props} />;
}
