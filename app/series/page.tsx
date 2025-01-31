import type { Metadata } from "next";
import { getFrameIndex } from "@/lib/frames.server";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { parseEpisodeId } from "@/lib/frames";
import { seriesInfo } from "@/lib/series-info";

export const metadata: Metadata = {
  title: "Series | Thick of It Quotes",
  description: "Browse all series of The Thick of It",
};

export default async function SeriesPage() {
  // Get all frames
  const allFrames = await getFrameIndex();

  // Group frames by series
  const seriesFrames = new Map<number, typeof allFrames>();
  allFrames.forEach((frame) => {
    const { season } = parseEpisodeId(frame.episode);
    if (!seriesFrames.has(season)) {
      seriesFrames.set(season, []);
    }
    seriesFrames.get(season)?.push(frame);
  });

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Series</h1>
      <div className="grid gap-12">
        {seriesInfo.map((series) => {
          const frames = seriesFrames.get(series.number) || [];
          return (
            <div key={series.number} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    Series {series.number}
                  </h2>
                  <a
                    href={`/series/${series.number}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Browse episodes →
                  </a>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p>{series.shortSummary}</p>
                  <p className="text-sm text-muted-foreground">
                    {series.episodeCount} episodes
                  </p>
                </div>
              </div>
              <ScreenshotGrid
                screenshots={frames.slice(0, 6)}
                multiselect={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
