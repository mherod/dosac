import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    title: `Series ${series.number} Episodes | Thick of It Quotes`,
    description: series.shortSummary,
  };
}

export default async function EpisodesPage({ params }: Props) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

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
          <span>Episodes</span>
        </div>
      </div>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">Series {series.number} Episodes</h1>
        <p className="text-lg">{series.longSummary}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: series.episodeCount }, (_, i) => i + 1).map(
            (episodeNumber) => (
              <Link
                key={episodeNumber}
                href={`/series/${series.number}/episode/${episodeNumber}`}
                className="block rounded-lg border border-[#ffffff33] bg-[#0b0c0c] p-4 hover:bg-[#1d1d1d]"
              >
                <h2 className="text-xl font-semibold">
                  Episode {episodeNumber}
                </h2>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
