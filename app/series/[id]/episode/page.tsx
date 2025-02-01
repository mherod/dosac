import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesInfo, getSeriesEpisodes } from "@/lib/series-info";
import { SeriesHeader } from "@/components/series/series-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

/**
 *
 * @param root0
 * @param root0.params
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) return {};

  return {
    title: `Series ${series.number} Episodes | Thick of It Quotes`,
    description: series.shortSummary,
  };
}

/**
 *
 * @param root0
 * @param root0.params
 */
export default async function EpisodesPage({ params }: Props) {
  const resolvedParams = await params;
  const series = getSeriesInfo(parseInt(resolvedParams.id, 10));
  if (!series) notFound();

  const episodes = getSeriesEpisodes(series.number);

  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <SeriesHeader
        title={`Series ${series.number} Episodes`}
        description={series.longSummary}
        itemCount={episodes.length}
      />

      <div className="container py-8">
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link
            href="/series"
            className="text-[#1d70b8] hover:underline hover:text-[#003078]"
          >
            All Series
          </Link>
          <span className="text-[#505a5f]">/</span>
          <Link
            href={`/series/${series.number}`}
            className="text-[#1d70b8] hover:underline hover:text-[#003078]"
          >
            Series {series.number}
          </Link>
          <span className="text-[#505a5f]">/</span>
          <span className="text-[#505a5f]">Episodes</span>
        </nav>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode) => (
            <Link
              key={episode.episodeNumber}
              href={`/series/${series.number}/episode/${episode.episodeNumber}`}
              className="group bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6] hover:border-[#1d70b8] transition-colors"
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#0b0c0c] group-hover:text-[#1d70b8]">
                    Episode {episode.episodeNumber}
                  </h2>
                  <h3 className="text-[#505a5f]">{episode.title}</h3>
                </div>

                {episode.airDate && (
                  <p className="text-sm text-[#505a5f]">
                    {new Date(episode.airDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}

                {episode.policyAreas && (
                  <div className="flex flex-wrap gap-2">
                    {episode.policyAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2 py-1 text-xs rounded-full bg-[#f3f2f1] text-[#0b0c0c] border border-[#b1b4b6]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
