import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameIndex } from "@/lib/frames.server";
import { getSeriesInfo } from "@/lib/series-info";

interface Props {
  params: Promise<{
    id: string;
    episodeId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) return {};

  return {
    title: `Series ${series.number} Episode ${resolvedParams.episodeId} | Thick of It Quotes`,
    description: series.shortSummary,
  };
}

export default async function EpisodePage({ params }: Props) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  // Format series and episode numbers to match the frame ID format (e.g., "s01e01")
  const episodeId = `s${series.number.toString().padStart(2, "0")}e${resolvedParams.episodeId.toString().padStart(2, "0")}`;

  // Get all frames and filter for this episode
  const allFrames = await getFrameIndex();
  const episodeFrames = allFrames.filter(
    (frame) => frame.episode === episodeId,
  );

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Link href="/series" className="text-[#1d70b8] hover:underline">
            All Series
          </Link>
          <span className="text-[#505a5f]">/</span>
          <Link
            href={`/series/${series.number}`}
            className="text-[#1d70b8] hover:underline"
          >
            Series {series.number}
          </Link>
          <span className="text-[#505a5f]">/</span>
          <span>Episode {resolvedParams.episodeId}</span>
        </div>
      </div>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">
          Series {series.number} Episode {resolvedParams.episodeId}
        </h1>
        <p className="text-lg">{series.longSummary}</p>
      </div>
      <ScreenshotGrid screenshots={episodeFrames} multiselect={true} />
    </div>
  );
}
