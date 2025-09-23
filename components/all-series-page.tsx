import { PageLayout } from "@/components/layout/page-layout";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { Badge } from "@/components/ui/badge";
import { parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import { getBaseBreadcrumbs } from "@/lib/navigation";
import { type SeriesInfo, seriesInfo } from "@/lib/series-info";
import { processTextWithLinks } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

/**
 * Content component for the series page
 * Fetches and organizes frames by series
 * @returns A grid layout of series sections with their frames
 */
async function SeriesContent(): Promise<React.ReactElement> {
  // Get all frames
  const allFrames = await getFrameIndex();

  // Group frames by series
  const seriesFrames = new Map<number, typeof allFrames>();
  for (const frame of allFrames) {
    const { season } = parseEpisodeId(frame.episode);
    if (!seriesFrames.has(season)) {
      seriesFrames.set(season, []);
    }
    seriesFrames.get(season)?.push(frame);
  }

  return (
    <div className="space-y-16">
      {seriesInfo.map((series: SeriesInfo) => {
        const frames = seriesFrames.get(series.number) || [];
        return (
          <div key={series.number} className="space-y-6">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    Series {series.number}
                  </h2>
                  <div className="mt-4 flex items-center gap-3">
                    <Badge variant="secondary">
                      {series.episodeCount} Episodes
                    </Badge>
                    <Link
                      href={`/series/${series.number}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      View series →
                    </Link>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {processTextWithLinks(series.shortSummary)}
                  </p>
                </div>
              </div>

              {/* Featured frames */}
              <div className="hidden md:block">
                {frames[0] && (
                  <div className="aspect-video rounded-lg">
                    <ScreenshotGrid
                      screenshots={[frames[0]]}
                      allScreenshots={frames}
                      filters={{ query: "", page: 1 }}
                      paginationData={{
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 1,
                        hasNextPage: false,
                        hasPrevPage: false,
                      }}
                      multiselect={false}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Grid of additional frames */}
            <ScreenshotGrid
              screenshots={frames.slice(1, 7)}
              allScreenshots={frames}
              filters={{ query: "", page: 1 }}
              paginationData={{
                currentPage: 1,
                totalPages: 1,
                totalItems: frames.slice(1, 7).length,
                hasNextPage: false,
                hasPrevPage: false,
              }}
              multiselect={true}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Main series page component
 * Displays all series with their associated frames
 * @returns The series page with content wrapped in PageLayout
 */
export function AllSeriesPage(): React.ReactElement {
  const breadcrumbs = getBaseBreadcrumbs().map(
    (item: { label: string; href?: string }) =>
      item.label === "Series" ? { ...item, current: true } : item,
  );

  const headerContent = (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Series
        </h1>
        <div className="mt-4">
          <p className="text-lg text-muted-foreground">
            Browse all series and their memorable moments from the show
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs} headerContent={headerContent}>
      <Suspense>
        <SeriesContent />
      </Suspense>
    </PageLayout>
  );
}
