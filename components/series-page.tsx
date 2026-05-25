import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { Badge } from "@/components/ui/badge";
import { parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import { getSeriesBreadcrumbs } from "@/lib/navigation";
import { getSeriesInfo } from "@/lib/series-info";
import type { Screenshot } from "@/lib/types";
import { processTextWithLinks } from "@/lib/utils";

/**
 * Interface for SeriesPage component props
 */
interface SeriesPageProps {
  /** Promise resolving to route parameters */
  params: Promise<{
    /** Series ID */
    id: string;
  }>;
}

/**
 * Series page content component
 * @param props - The component props
 * @param props.params - Route parameters containing series ID
 * @returns The series page content with episode grids and navigation
 */
async function SeriesPageContent({
  params,
}: SeriesPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const series = getSeriesInfo(Number.parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  // Get all frames
  const allFrames = await getFrameIndex();

  // Filter frames for this series.
  const seriesFrames = allFrames.filter((frame: Screenshot) => {
    const { season } = parseEpisodeId(frame.episode);
    return season === series.number;
  });

  const breadcrumbs = getSeriesBreadcrumbs(series.number, true);

  const headerContent = (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Series {series.number}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <Badge variant="secondary">{series.episodeCount} Episodes</Badge>
          <Link
            href={`/series/${series.number}/episode`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all episodes →
          </Link>
        </div>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {processTextWithLinks(series.longSummary)}
        </p>
      </div>
    </div>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs} headerContent={headerContent}>
      <div className="space-y-8">
        <ScreenshotGrid
          screenshots={seriesFrames.slice(0, 6)}
          filters={{ query: "", page: 1 }}
          paginationData={{
            currentPage: 1,
            totalPages: 1,
            totalItems: Math.min(seriesFrames.length, 6),
            hasNextPage: false,
            hasPrevPage: false,
          }}
          multiselect={true}
        />
      </div>
    </PageLayout>
  );
}

/**
 * Page component for displaying a specific series and its episodes
 * Shows series information and a grid of episodes with their associated frames
 * @param props - The component props
 * @param props.params - Promise resolving to route parameters containing series ID
 * @returns The series page with episode grids and navigation
 */
export function SeriesPage(props: SeriesPageProps): React.ReactElement {
  return (
    <Suspense>
      <SeriesPageContent {...props} />
    </Suspense>
  );
}
