import { PageLayout } from "@/components/layout/page-layout";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { Badge } from "@/components/ui/badge";
import { parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import { getSeriesBreadcrumbs } from "@/lib/navigation";
import { getSeriesInfo } from "@/lib/series-info";
import type { Screenshot } from "@/lib/types";
import { processTextWithLinks } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { Suspense } from "react";

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

  // Group frames by episode
  const episodeFrames = new Map<string, typeof allFrames>();
  for (const frame of allFrames) {
    const { season } = parseEpisodeId(frame.episode);
    if (season === series.number) {
      if (!episodeFrames.has(frame.episode)) {
        episodeFrames.set(frame.episode, []);
      }
      episodeFrames.get(frame.episode)?.push(frame);
    }
  }

  // Convert to array and sort by episode number
  const episodes: Array<{ episodeNumber: number; frames: Screenshot[] }> =
    Array.from(episodeFrames.entries())
      .map(([episodeId, frames]: [string, Screenshot[]]) => {
        const { episode } = parseEpisodeId(episodeId);
        return { episodeNumber: episode, frames };
      })
      .sort(
        (a: { episodeNumber: number }, b: { episodeNumber: number }) =>
          a.episodeNumber - b.episodeNumber,
      );

  const breadcrumbs = getSeriesBreadcrumbs(series.number, true);

  const headerContent = (
    <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
      <div className="space-y-6">
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

      {/* Featured frame could go here */}
      <div className="hidden md:block">
        {episodes[0]?.frames[0] && (
          <div className="aspect-video rounded-lg">
            <ScreenshotGrid
              screenshots={[episodes[0].frames[0]]}
              multiselect={false}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs} headerContent={headerContent}>
      <div className="space-y-8">
        {/* Featured frame */}
        {episodes[0]?.frames[0] && (
          <div className="aspect-video rounded-lg">
            <ScreenshotGrid
              screenshots={[episodes[0].frames[0]]}
              multiselect={false}
            />
          </div>
        )}
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
