import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFrameIndex } from "@/lib/frames.server";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { parseEpisodeId } from "@/lib/frames";
import { getSeriesInfo } from "@/lib/series-info";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) return {};

  return {
    title: `Series ${series.number} | Thick of It Quotes`,
    description: series.shortSummary,
  };
}

export default async function SeriesPage({ params }: Props) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

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
  const episodes = Array.from(episodeFrames.entries())
    .map(([episodeId, frames]) => {
      const { episode } = parseEpisodeId(episodeId);
      return { episodeNumber: episode, frames };
    })
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Link href="/series" className="text-[#1d70b8] hover:underline">
            All Series
          </Link>
          <span className="text-[#505a5f]">/</span>
          <span>Series {series.number}</span>
        </div>
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Series {series.number}</h1>
          <div className="prose prose-invert max-w-none">
            <p>{series.longSummary}</p>
            <p className="text-sm text-muted-foreground">
              {series.episodeCount} episodes
            </p>
          </div>
        </div>
        <div className="grid gap-8">
          {episodes.map(({ episodeNumber, frames }) => (
            <div key={episodeNumber} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Episode {episodeNumber}
                </h2>
                <Link
                  href={`/series/${series.number}/episode/${episodeNumber}`}
                  className="text-primary hover:text-primary/80"
                >
                  View all quotes →
                </Link>
              </div>
              <ScreenshotGrid
                screenshots={frames.slice(0, 6)}
                multiselect={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
