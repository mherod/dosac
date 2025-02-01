import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesInfo, getSeriesEpisodes } from "@/lib/series-info";
import { getEpisodeInfo } from "@/lib/episode-info";
import { SeriesHeader } from "@/components/series/series-header";
import { getFrameIndex } from "@/lib/frames.server";
import { parseEpisodeId } from "@/lib/frames";
import { EpisodeFramesCard } from "@/components/episode-frames-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PageHeader } from "@/components/layout/page-header";

/**
 * Interface for EpisodesPage component props
 */
interface EpisodesPageProps {
  /** Promise resolving to route parameters */
  params: Promise<{
    /** Series ID */
    id: string;
  }>;
}

/**
 * Episodes page component for a specific series
 * Shows a list of episodes with navigation and series information
 * @param props - The component props
 * @param props.params - Route parameters containing series ID
 * @returns The episodes page content with episode grid and navigation
 */
export async function EpisodesPage({ params }: EpisodesPageProps) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  const episodes = getSeriesEpisodes(series.number);

  // Get all frames
  const allFrames = await getFrameIndex();

  // Group frames by episode
  const episodeFrames = new Map<string, typeof allFrames>();
  allFrames.forEach((frame) => {
    const { season } = parseEpisodeId(frame.episode);
    if (season === series.number) {
      if (!episodeFrames.has(frame.episode)) {
        episodeFrames.set(frame.episode, []);
      }
      episodeFrames.get(frame.episode)?.push(frame);
    }
  });

  // Convert to array and sort by episode number
  const episodesWithFrames = Array.from(episodeFrames.entries())
    .map(([episodeId, frames]) => {
      const { episode } = parseEpisodeId(episodeId);
      const episodeInfo = getEpisodeInfo(series.number, episode);
      return { episodeNumber: episode, frames, info: episodeInfo };
    })
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const breadcrumbItems = [
    { label: "Series", href: "/series" },
    { label: `Series ${series.number}`, href: `/series/${series.number}` },
    { label: "Episodes", current: true },
  ];

  return (
    <main className="container py-12 max-w-7xl">
      <PageHeader>
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            Series {series.number} Episodes
          </h1>
          <p className="text-lg text-slate-600 max-w-[750px]">
            {series.longSummary}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{episodes.length} Episodes</Badge>
          </div>
        </div>
      </PageHeader>

      <div className="container py-12">
        <div className="grid gap-6">
          {episodesWithFrames.map(({ episodeNumber, frames, info }) => (
            <Card
              key={episodeNumber}
              className="group border border-slate-200 shadow-sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Link
                      href={`/series/${series.number}/episode/${episodeNumber}`}
                      className="inline-block group-hover:text-blue-600 transition-colors"
                    >
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {info?.title || `Episode ${episodeNumber}`}
                      </h2>
                    </Link>
                    {info?.shortSummary && (
                      <p className="text-slate-600">{info.shortSummary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      {info?.airDate && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {new Date(info.airDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                      {info?.runtime && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{info.runtime} minutes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/series/${series.number}/episode/${episodeNumber}`}
                    className="text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <EpisodeFramesCard
                  seriesNumber={series.number}
                  episodeNumber={episodeNumber}
                  frames={frames}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
