import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesPage } from "@/components/series-page";
import {
  DEFAULT_OG_IMAGE_URL,
  truncateMetadataText,
  truncatePageTitle,
} from "@/lib/seo";
import { getAllSeries, getSeriesInfo } from "@/lib/series-info";

/**
 * Generates static params for all series pages at build time
 * Creates paths for each series in the show
 * @returns Array of objects containing series IDs for static generation
 */
export async function generateStaticParams(): Promise<{ id: string }[]> {
  const series = getAllSeries();
  return series.map((seriesInfo: { number: number }) => ({
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
  const series = getSeriesInfo(Number.parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  const summary = series.shortSummary
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("");
  const title = truncatePageTitle(`Series ${series.number} - The Thick of It`);
  const description = truncateMetadataText(
    `${summary} Browse all episodes and create memes from Series ${series.number} of The Thick of It.`,
    155,
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dosac.uk";
  const pageUrl = new URL(`/series/${series.number}`, baseUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl.toString(),
      type: "website",
      siteName: "DOSAC.UK",
      locale: "en_GB",
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `Series ${series.number} - The Thick of It`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_URL],
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
 * Page component for displaying a specific series and its episodes
 * Shows series information and a grid of episodes with their associated frames
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series ID
 * @returns The series page with episode grids and navigation
 */
export default function Page(props: Props): React.ReactElement {
  return <SeriesPage {...props} />;
}
