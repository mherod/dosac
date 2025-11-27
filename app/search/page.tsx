import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { compact } from "lodash-es";
import type { ExtendedFrame } from "@/components/search-result-card";
import { SearchResultCard } from "@/components/search-result-card";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import { fuzzyMatch } from "@/lib/utils";

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
 * Inner component that handles search logic and dynamic data access
 */
async function SearchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q || "").trim().toLowerCase();
  const seasonFilter = params.season
    ? Number.parseInt(params.season, 10)
    : undefined;
  const episodeFilter = params.episode
    ? Number.parseInt(params.episode, 10)
    : undefined;
  const page = Number.parseInt(params.page || "1", 10);
  const resultsPerPage = 24;

  // Get all frames
  const allFrames = await getFrameIndex();

  // Filter frames based on search criteria
  let results: Screenshot[] = [];

  if (query) {
    // Split query into words for better fuzzy matching
    // Use compact to remove empty strings from split
    const queryWords = compact(query.toLowerCase().split(/\s+/));

    results = allFrames.filter((frame) => {
      // Text search - check both speech and subtitle
      const searchText = (frame.speech || frame.subtitle || "").toLowerCase();

      // Check if all query words are present (fuzzy AND matching)
      const textMatch = queryWords.every((word) =>
        fuzzyMatch(word, searchText),
      );

      // Extract season/episode numbers from frame.episode (e.g., "s01e01")
      const episodeMatch = frame.episode.match(/s(\d+)e(\d+)/);
      const frameSeason = episodeMatch?.[1]
        ? Number.parseInt(episodeMatch[1], 10)
        : undefined;
      const frameEpisode = episodeMatch?.[2]
        ? Number.parseInt(episodeMatch[2], 10)
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
      const frameSeason = episodeMatch?.[1]
        ? Number.parseInt(episodeMatch[1], 10)
        : undefined;
      const frameEpisode = episodeMatch?.[2]
        ? Number.parseInt(episodeMatch[2], 10)
        : undefined;

      const seasonMatch = !seasonFilter || frameSeason === seasonFilter;
      const episodeFilterMatch =
        !episodeFilter || frameEpisode === episodeFilter;

      return seasonMatch && episodeFilterMatch;
    });
  }

  // Sort by relevance (frames with query in beginning of text first)
  if (query) {
    // Use compact to remove empty strings from split
    const queryWords = compact(query.toLowerCase().split(/\s+/));

    results.sort((a, b) => {
      const aText = (a.speech || a.subtitle || "").toLowerCase();
      const bText = (b.speech || b.subtitle || "").toLowerCase();

      // Priority 1: Exact phrase match
      const aExactMatch = aText.includes(query);
      const bExactMatch = bText.includes(query);
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Priority 2: Starts with first query word
      const aStartsWith = queryWords.some((word) => aText.startsWith(word));
      const bStartsWith = queryWords.some((word) => bText.startsWith(word));
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Priority 3: Words in order
      let aIndex = 0;
      let bIndex = 0;
      for (const word of queryWords) {
        const aPos = aText.indexOf(word, aIndex);
        const bPos = bText.indexOf(word, bIndex);
        if (aPos >= 0) aIndex = aPos + word.length;
        if (bPos >= 0) bIndex = bPos + word.length;
      }
      const aInOrder = aIndex > 0;
      const bInOrder = bIndex > 0;
      if (aInOrder && !bInOrder) return -1;
      if (!aInOrder && bInOrder) return 1;

      // Priority 4: Shorter text = more relevant
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
    <>
      {/* Search results description */}
      {query && (
        <p className="text-gray-600">
          Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "
          {query}"{seasonFilter && ` in Series ${seasonFilter}`}
          {episodeFilter && ` Episode ${episodeFilter}`}
        </p>
      )}
      {!query && (seasonFilter || episodeFilter) && (
        <p className="text-gray-600">
          Showing all results
          {seasonFilter && ` from Series ${seasonFilter}`}
          {episodeFilter && ` Episode ${episodeFilter}`}
        </p>
      )}
      {!query && !seasonFilter && !episodeFilter && (
        <p className="text-gray-600">
          Enter a search term or select filters to begin
        </p>
      )}

      {/* Results grid */}
      {paginatedResults.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedResults.map((frame) => {
              // Extract season and episode numbers for display
              const episodeMatch = frame.episode.match(/s(\d+)e(\d+)/);
              const frameSeason = episodeMatch?.[1]
                ? Number.parseInt(episodeMatch[1], 10)
                : 1;
              const frameEpisode = episodeMatch?.[2]
                ? Number.parseInt(episodeMatch[2], 10)
                : 1;

              const extendedFrame: ExtendedFrame = {
                ...frame,
                text: frame.speech || frame.subtitle || "",
                season: frameSeason,
                episode: frameEpisode,
                speaker: frame.character,
              };

              return (
                <SearchResultCard
                  key={frame.id}
                  frame={extendedFrame}
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
                  prefetch={true}
                  scroll={false}
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
                  prefetch={true}
                  scroll={false}
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
    </>
  );
}

/**
 * Search page component with static shell and dynamic results
 */
export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-6">
        {/* Static page header */}
        <div className="border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        </div>

        {/* Dynamic search content */}
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-6 w-64 animate-pulse rounded bg-gray-200" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-48 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            </div>
          }
        >
          <SearchPageContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
