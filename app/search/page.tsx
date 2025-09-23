import { SearchResultCard } from "@/components/search-result-card";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; season?: string; episode?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";

  return {
    title: query ? `Search results for "${query}"` : "Search",
    description:
      "Search through ministerial communications and departmental records",
  };
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    season?: string;
    episode?: string;
    page?: string;
  }>;
}

/**
 * Server-side search page with results
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim().toLowerCase();
  const seasonFilter = params.season ? parseInt(params.season, 10) : undefined;
  const episodeFilter = params.episode
    ? parseInt(params.episode, 10)
    : undefined;
  const page = parseInt(params.page || "1", 10);
  const resultsPerPage = 24;

  // Get all frames
  const allFrames = await getFrameIndex();

  // Filter frames based on search criteria
  let results: Screenshot[] = [];

  if (query) {
    results = allFrames.filter((frame) => {
      // Text search - check both speech and subtitle
      const searchText = (frame.speech || frame.subtitle || "").toLowerCase();
      const textMatch = searchText.includes(query);

      // Extract season/episode numbers from frame.episode (e.g., "s01e01")
      const episodeMatch = frame.episode.match(/s(\d+)e(\d+)/);
      const frameSeason =
        episodeMatch && episodeMatch[1]
          ? parseInt(episodeMatch[1], 10)
          : undefined;
      const frameEpisode =
        episodeMatch && episodeMatch[2]
          ? parseInt(episodeMatch[2], 10)
          : undefined;

      // Season/episode filters
      const seasonMatch = !seasonFilter || frameSeason === seasonFilter;
      const episodeFilterMatch =
        !episodeFilter || frameEpisode === episodeFilter;

      return textMatch && seasonMatch && episodeFilterMatch;
    });
  } else if (seasonFilter || episodeFilter) {
    // Filter by season/episode even without text query
    results = allFrames.filter((frame) => {
      // Extract season/episode numbers from frame.episode (e.g., "s01e01")
      const episodeMatch = frame.episode.match(/s(\d+)e(\d+)/);
      const frameSeason =
        episodeMatch && episodeMatch[1]
          ? parseInt(episodeMatch[1], 10)
          : undefined;
      const frameEpisode =
        episodeMatch && episodeMatch[2]
          ? parseInt(episodeMatch[2], 10)
          : undefined;

      const seasonMatch = !seasonFilter || frameSeason === seasonFilter;
      const episodeFilterMatch =
        !episodeFilter || frameEpisode === episodeFilter;

      return seasonMatch && episodeFilterMatch;
    });
  }

  // Sort by relevance (frames with query in beginning of text first)
  if (query) {
    results.sort((a, b) => {
      const aText = a.speech || a.subtitle || "";
      const bText = b.speech || b.subtitle || "";

      const aStartsWith = aText.toLowerCase().startsWith(query);
      const bStartsWith = bText.toLowerCase().startsWith(query);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Secondary sort by text length (shorter = more relevant)
      return aText.length - bText.length;
    });
  }

  // Pagination
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (page - 1) * resultsPerPage;
  const paginatedResults = results.slice(
    startIndex,
    startIndex + resultsPerPage,
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-6">
        {/* Search header */}
        <div className="border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
          {query && (
            <p className="mt-2 text-gray-600">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "
              {query}"{seasonFilter && ` in Series ${seasonFilter}`}
              {episodeFilter && ` Episode ${episodeFilter}`}
            </p>
          )}
          {!query && (seasonFilter || episodeFilter) && (
            <p className="mt-2 text-gray-600">
              Showing all results
              {seasonFilter && ` from Series ${seasonFilter}`}
              {episodeFilter && ` Episode ${episodeFilter}`}
            </p>
          )}
          {!query && !seasonFilter && !episodeFilter && (
            <p className="mt-2 text-gray-600">
              Enter a search term or select filters to begin
            </p>
          )}
        </div>

        {/* Results grid */}
        {paginatedResults.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedResults.map((frame) => {
                // Extract season and episode numbers for display
                const episodeMatch = frame.episode.match(/s(\d+)e(\d+)/);
                const frameSeason =
                  episodeMatch && episodeMatch[1]
                    ? parseInt(episodeMatch[1], 10)
                    : 1;
                const frameEpisode =
                  episodeMatch && episodeMatch[2]
                    ? parseInt(episodeMatch[2], 10)
                    : 1;

                return (
                  <SearchResultCard
                    key={frame.id}
                    frame={
                      {
                        ...frame,
                        text: frame.speech || frame.subtitle || "",
                        season: frameSeason,
                        episode: frameEpisode,
                        speaker: frame.character,
                      } as any
                    }
                    query={query}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                {page > 1 && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(query && { q: query }),
                      ...(seasonFilter && { season: seasonFilter.toString() }),
                      ...(episodeFilter && {
                        episode: episodeFilter.toString(),
                      }),
                      page: (page - 1).toString(),
                    }).toString()}`}
                    className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}

                <span className="px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(query && { q: query }),
                      ...(seasonFilter && { season: seasonFilter.toString() }),
                      ...(episodeFilter && {
                        episode: episodeFilter.toString(),
                      }),
                      page: (page + 1).toString(),
                    }).toString()}`}
                    className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : query || seasonFilter || episodeFilter ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">
              No results found. Try adjusting your search terms or filters.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
