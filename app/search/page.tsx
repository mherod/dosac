import { compact } from "lodash-es";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { withQuery } from "ufo";
import type { ExtendedFrame } from "@/components/search-result-card";
import { SearchResultCard } from "@/components/search-result-card";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import { fuzzyMatch } from "@/lib/utils";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    season?: string;
    episode?: string;
    page?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseRequestedPage(params.page);
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";

  return {
    title: query ? `Search results for "${query}"${pageSuffix}` : "Search",
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

const SEARCH_SKELETON_KEYS = [
  "search-skeleton-1",
  "search-skeleton-2",
  "search-skeleton-3",
  "search-skeleton-4",
  "search-skeleton-5",
  "search-skeleton-6",
  "search-skeleton-7",
  "search-skeleton-8",
];

/**
 * Parses a positive page number from a query parameter.
 * @param page - The raw page query parameter
 * @returns A valid positive page number
 */
function parseRequestedPage(page: string | undefined): number {
  const parsedPage = Number.parseInt(page || "1", 10);
  return Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

/**
 * Builds a canonical search URL while omitting the page query for page one.
 * @param params - Search filters and pagination state
 * @returns A URL for the search route
 */
function getSearchUrl({
  query,
  season,
  episode,
  page,
}: {
  query: string;
  season?: number;
  episode?: number;
  page: number;
}): string {
  return withQuery("/search", {
    ...(query && { q: query }),
    ...(season && { season: season.toString() }),
    ...(episode && { episode: episode.toString() }),
    ...(page > 1 && { page: page.toString() }),
  });
}

/**
 * Inner component that handles search logic and dynamic data access
 */
async function SearchPageContent({
  searchParams,
}: SearchPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const query = (params.q || "").trim().toLowerCase();
  const seasonFilter = params.season
    ? Number.parseInt(params.season, 10)
    : undefined;
  const episodeFilter = params.episode
    ? Number.parseInt(params.episode, 10)
    : undefined;
  const requestedPage = parseRequestedPage(params.page);
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
  const validPage = Math.min(requestedPage, Math.max(1, totalPages));
  const canonicalPageParam = validPage > 1 ? validPage.toString() : undefined;

  if (params.page !== canonicalPageParam) {
    redirect(
      getSearchUrl({
        query,
        season: seasonFilter,
        episode: episodeFilter,
        page: validPage,
      }),
    );
  }

  const startIndex = (validPage - 1) * resultsPerPage;
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
            <nav
              aria-label="Pagination"
              className="flex items-center justify-center gap-3 pt-6 md:gap-4"
            >
              {validPage > 1 ? (
                <a
                  href={getSearchUrl({
                    query,
                    season: seasonFilter,
                    episode: episodeFilter,
                    page: validPage - 1,
                  })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-50"
                  aria-label={`Go to page ${validPage - 1}`}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Previous page</span>
                </a>
              ) : (
                <span
                  className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-gray-200 text-sm text-gray-300"
                  aria-disabled="true"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Previous page</span>
                </span>
              )}

              <span className="text-sm text-gray-600 md:text-base">
                Page {validPage} of {totalPages}
              </span>

              {validPage < totalPages ? (
                <a
                  href={getSearchUrl({
                    query,
                    season: seasonFilter,
                    episode: episodeFilter,
                    page: validPage + 1,
                  })}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-50"
                  aria-label={`Go to page ${validPage + 1}`}
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Next page</span>
                </a>
              ) : (
                <span
                  className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-gray-200 text-sm text-gray-300"
                  aria-disabled="true"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Next page</span>
                </span>
              )}
            </nav>
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
export default function SearchPage({
  searchParams,
}: SearchPageProps): React.ReactElement {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-6">
        {/* Static page header */}
        <div className="border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {SEARCH_SKELETON_KEYS.map((key) => (
                  <div key={key} className="h-64 rounded-lg bg-gray-200" />
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
