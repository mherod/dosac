import { EpisodeFramesCard } from "@/components/episode-frames-card";
import { PageLayout } from "@/components/layout/page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getEpisodeInfo } from "@/lib/episode-info";
import { type Frame, parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import { getEpisodeListBreadcrumbs } from "@/lib/navigation";
import { characters } from "@/lib/profiles";
import { getSeriesEpisodes, getSeriesInfo } from "@/lib/series-info";
import { processTextWithLinks } from "@/lib/utils";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";

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
export async function EpisodesPage({
  params,
}: EpisodesPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const series = getSeriesInfo(Number.parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  const episodes = getSeriesEpisodes(series.number);

  // Get all frames
  const allFrames = await getFrameIndex();

  // Group frames by episode
  const episodeFrames: Map<string, typeof allFrames> = new Map();
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
  const episodesWithFrames = Array.from(episodeFrames.entries())
    .map(([episodeId, frames]: [string, Frame[]]) => {
      const { episode } = parseEpisodeId(episodeId);
      const episodeInfo = getEpisodeInfo(series.number, episode);
      return { episodeNumber: episode, frames, info: episodeInfo };
    })
    .sort(
      (a: { episodeNumber: number }, b: { episodeNumber: number }) =>
        a.episodeNumber - b.episodeNumber,
    );

  const breadcrumbs = getEpisodeListBreadcrumbs(series.number, true);

  const headerContent = (
    <div className="space-y-4">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">
        Series {series.number} Episodes
      </h1>
      <p className="max-w-[750px] text-lg text-slate-600">
        {series.longSummary.map(
          (
            part: string | { text: string; profileId: keyof typeof characters },
            index: number,
          ) => {
            if (typeof part === "string") {
              // biome-ignore lint/suspicious/noArrayIndexKey: Text parts don't have unique IDs
              return <span key={`text-${index}`}>{part}</span>;
            }
            const character = characters[part.profileId];
            return (
              <Link
                key={`link-${part.profileId}`}
                href={`/profiles/${part.profileId}`}
                className="text-blue-600 hover:underline"
              >
                {character?.name || part.text}
              </Link>
            );
          },
        )}
      </p>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{episodes.length} Episodes</Badge>
      </div>
    </div>
  );

  return (
    <PageLayout breadcrumbs={breadcrumbs} headerContent={headerContent}>
      <div className="grid gap-6">
        {episodesWithFrames.map(
          ({
            episodeNumber,
            frames,
            info,
          }: {
            episodeNumber: number;
            frames: Frame[];
            info: ReturnType<typeof getEpisodeInfo>;
          }) => (
            <Card
              key={episodeNumber}
              className="group border border-slate-200 shadow-sm"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Link
                      href={`/series/${series.number}/episode/${episodeNumber}`}
                      className="inline-block transition-colors group-hover:text-blue-600"
                    >
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {info?.title || `Episode ${episodeNumber}`}
                      </h2>
                    </Link>
                    {info?.shortSummary && (
                      <p className="text-slate-600">
                        {processTextWithLinks(info.shortSummary)}
                      </p>
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
                    className="text-slate-600 transition-colors hover:text-blue-600"
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
          ),
        )}
      </div>
    </PageLayout>
  );
}
