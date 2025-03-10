import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSeriesInfo,
  getAllSeries,
  type SeriesInfo,
} from "@/lib/series-info";
import { formatPageTitle } from "@/lib/constants";
import { SeriesPage } from "@/components/series-page";

// Enable PPR for this route
// noinspection JSUnusedGlobalSymbols
export const experimental_ppr = true;

/**
 * Generates static params for all series pages at build time
 * Creates paths for each series in the show
 * @returns Array of objects containing series IDs for static generation
 */
export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((seriesInfo: SeriesInfo) => ({
    id: seriesInfo.number.toString(),
  }));
}

/**
 * Interface for page component props
 */
interface Props {
  /** Promise resolving to route parameters */
  params: Promise<{
    /** Series ID */
    id: string;
  }>;
}

/**
 * Generates metadata for the series page
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series ID
 * @returns Metadata object with title and description
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  return {
    title: formatPageTitle(`Series ${series.number}`),
    description: series.shortSummary
      .map((part) => (typeof part === "string" ? part : part.text))
      .join(""),
  };
}

/**
 * Page component for displaying a specific series and its episodes
 * Shows series information and a grid of episodes with their associated frames
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series ID
 * @returns The series page with episode grids and navigation
 */
export default function Page(props: Props) {
  return <SeriesPage {...props} />;
}
