import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ChevronRight,
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  UsersIcon,
  PenToolIcon,
} from "lucide-react";

import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameIndex } from "@/lib/frames.server";
import { getSeriesInfo } from "@/lib/series-info";
import { getEpisodeInfo } from "@/lib/episode-info";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { charactersList } from "@/lib/profiles";
import { cn } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { PageHeader } from "@/components/layout/page-header";

interface EpisodePageProps {
  params: Promise<{
    id: string;
    episodeId: string;
  }>;
}

async function EpisodePageContent({ params }: EpisodePageProps) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  const episode = getEpisodeInfo(
    parseInt(resolvedParams.id, 10),
    parseInt(resolvedParams.episodeId, 10),
  );
  if (!series) notFound();

  // Format series and episode numbers to match the frame ID format (e.g., "s01e01")
  const episodeId = `s${series.number.toString().padStart(2, "0")}e${resolvedParams.episodeId.toString().padStart(2, "0")}`;

  // Get all frames and filter for this episode
  const allFrames = await getFrameIndex();
  const episodeFrames = allFrames.filter(
    (frame) => frame.episode === episodeId,
  );

  const breadcrumbItems = [
    { label: "Series", href: "/series" },
    { label: `Series ${series.number}`, href: `/series/${series.number}` },
    { label: `Episode ${episode?.episodeNumber}`, current: true },
  ];

  return (
    <main className="container py-12 max-w-7xl">
      <PageHeader>
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            {episode?.title}
          </h1>
          {episode?.shortSummary && (
            <p className="text-lg text-slate-600 max-w-[750px] leading-relaxed">
              {episode.shortSummary}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {episode?.airDate && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span>
                  {new Date(episode.airDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {episode?.runtime && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                <ClockIcon className="h-4 w-4 opacity-70" />
                <span>{episode.runtime} minutes</span>
              </div>
            )}
          </div>
        </div>
      </PageHeader>

      {/* Content Section with improved grid layout */}
      <div className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Captions Grid */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="space-y-1 border-b border-slate-200 bg-slate-50">
                <CardTitle className="text-2xl text-slate-900">
                  Episode Captions
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Select captions to compare or share
                </p>
              </CardHeader>
              <CardContent>
                <ScreenshotGrid
                  screenshots={episodeFrames}
                  multiselect={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with improved card styling */}
          <div className="space-y-8">
            {/* Cast */}
            {episode?.cast && episode.cast.length > 0 && (
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-slate-200 bg-slate-50">
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-slate-900">
                    Featured Cast
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {episode.cast.map((member, index) => {
                      const characterProfile = charactersList.find(
                        (char) =>
                          char.name === member.character ||
                          char.fullName === member.character,
                      );

                      return (
                        <div key={member.character}>
                          {index > 0 && (
                            <Separator className="my-4 bg-slate-200" />
                          )}
                          <div className="group flex items-start gap-4">
                            {characterProfile?.image && (
                              <Link
                                href={`/profiles/${characterProfile.id}`}
                                className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden ring-1 ring-slate-200 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-blue-600"
                              >
                                <Image
                                  src={characterProfile.image}
                                  alt={characterProfile.name}
                                  fill
                                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                                  sizes="48px"
                                />
                              </Link>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="space-y-1.5">
                                  <div className="font-medium truncate text-slate-900">
                                    {characterProfile ? (
                                      <Link
                                        href={`/profiles/${characterProfile.id}`}
                                        className="hover:text-blue-600 transition-colors"
                                      >
                                        {member.character}
                                      </Link>
                                    ) : (
                                      member.character
                                    )}
                                  </div>
                                  <div className="text-sm text-slate-600 truncate">
                                    {member.actor}
                                  </div>
                                </div>
                                {member.isGuest && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs shrink-0 bg-blue-50 text-blue-600 border-blue-100"
                                  >
                                    Guest
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credits with improved typography */}
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-slate-200 bg-slate-50">
                <PenToolIcon className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-slate-900">Credits</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Directors */}
                  {episode?.directors && episode.directors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-blue-600">
                        Direction
                      </h4>
                      <div className="space-y-2">
                        {episode.directors.map((director) => (
                          <div
                            key={director}
                            className="text-sm text-slate-600"
                          >
                            {director}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Writers */}
                  {episode?.writers && episode.writers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-blue-600">
                        Writing
                      </h4>
                      <div className="space-y-2">
                        {episode.writers.map((writer) => (
                          <div
                            key={writer.name}
                            className="flex items-baseline justify-between text-sm"
                          >
                            <span className="text-slate-600">
                              {writer.name}
                            </span>
                            {writer.role && writer.role !== "writer" && (
                              <span className="text-xs text-slate-500">
                                {writer.role}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 *
 * @param props
 */
export function EpisodePage(props: EpisodePageProps) {
  return (
    <Suspense>
      <EpisodePageContent {...props} />
    </Suspense>
  );
}
