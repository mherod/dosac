import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { getFrameIndex } from "@/lib/frames.server";
import { getSeriesInfo } from "@/lib/series-info";
import { getEpisodeInfo } from "@/lib/episode-info";
import { SeriesHeader } from "@/components/series/series-header";

interface Props {
  params: Promise<{
    id: string;
    episodeId: string;
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
  const episode = getEpisodeInfo(
    parseInt(resolvedParams.id, 10),
    parseInt(resolvedParams.episodeId, 10),
  );
  if (!series) return {};

  const title = episode?.title || `Episode ${resolvedParams.episodeId}`;

  return {
    title: `${title} | Series ${series.number} | Thick of It Quotes`,
    description: episode?.shortSummary || series.shortSummary,
  };
}

/**
 *
 * @param root0
 * @param root0.params
 */
export default async function EpisodePage({ params }: Props) {
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

  return (
    <main className="flex-1 bg-[#f3f2f1]">
      <SeriesHeader
        title={episode?.title || `Episode ${resolvedParams.episodeId}`}
        description={`Series ${series.number}`}
        itemCount={episodeFrames.length}
      />

      <div className="container py-8">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
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
            <span className="text-[#505a5f]">
              {episode?.title || `Episode ${resolvedParams.episodeId}`}
            </span>
          </nav>
          <div className="border-b border-[#b1b4b6] pb-4">
            <div className="flex items-baseline gap-3 mb-2">
              <h1 className="text-4xl font-bold text-[#0b0c0c]">
                {episode?.title || `Episode ${resolvedParams.episodeId}`}
              </h1>
              <p className="text-xl text-[#505a5f]">Series {series.number}</p>
            </div>
            {episode?.shortSummary && (
              <p className="text-lg text-[#0b0c0c]">{episode.shortSummary}</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6]">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {episode?.airDate && (
                  <div>
                    <dt className="text-sm font-semibold text-[#505a5f]">
                      Original Air Date
                    </dt>
                    <dd className="text-[#0b0c0c]">
                      {new Date(episode.airDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                )}
                {episode?.runtime && (
                  <div>
                    <dt className="text-sm font-semibold text-[#505a5f]">
                      Runtime
                    </dt>
                    <dd className="text-[#0b0c0c]">
                      {episode.runtime} minutes
                    </dd>
                  </div>
                )}
                {episode?.productionCode && (
                  <div>
                    <dt className="text-sm font-semibold text-[#505a5f]">
                      Production Code
                    </dt>
                    <dd className="text-[#0b0c0c]">{episode.productionCode}</dd>
                  </div>
                )}
              </div>

              {episode?.policyAreas && (
                <div>
                  <dt className="text-sm font-semibold text-[#505a5f] mb-2">
                    Policy Areas
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {episode.policyAreas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 text-sm rounded-full bg-[#f3f2f1] text-[#0b0c0c] border border-[#b1b4b6]"
                      >
                        {area}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episode?.directors && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6]">
                <h3 className="text-lg font-semibold text-[#0b0c0c] mb-4">
                  Direction
                </h3>
                <ul className="space-y-2">
                  {episode.directors.map((director) => (
                    <li key={director} className="text-[#0b0c0c]">
                      {director}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {episode?.writers && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6]">
                <h3 className="text-lg font-semibold text-[#0b0c0c] mb-4">
                  Writing Credits
                </h3>
                <ul className="space-y-2">
                  {episode.writers.map((writer) => (
                    <li key={writer.name} className="text-[#0b0c0c]">
                      {writer.name}
                      {writer.role && writer.role !== "writer" && (
                        <span className="text-sm text-[#505a5f] ml-2">
                          ({writer.role})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {episode?.cast && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6]">
                <h3 className="text-lg font-semibold text-[#0b0c0c] mb-4">
                  Featured Cast
                </h3>
                <ul className="space-y-3">
                  {episode.cast.map((member) => (
                    <li
                      key={member.character}
                      className="flex justify-between items-center"
                    >
                      <span className="text-[#0b0c0c] font-medium">
                        {member.character}
                      </span>
                      <span className="text-[#505a5f]">
                        {member.actor}
                        {member.isGuest && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#f3f2f1] text-[#0b0c0c]">
                            Guest
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border border-[#b1b4b6]">
            <h2 className="text-xl font-semibold text-[#0b0c0c] mb-6">
              Episode Quotes
            </h2>
            <ScreenshotGrid screenshots={episodeFrames} multiselect={true} />
          </div>
        </div>
      </div>
    </main>
  );
}
