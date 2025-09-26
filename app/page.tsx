import { HomePage } from "@/components/home-page";
import { parseEpisodeId } from "@/lib/frames";
import { getFrameIndex } from "@/lib/frames.server";
import type { Screenshot } from "@/lib/types";
import { redirect } from "next/navigation";

// Configure page for optimal performance
// Pages will be dynamically rendered on first request then cached with ISR
// This provides the best balance between performance and functionality

// Enable ISR with 1 hour revalidation for all pages
// This means once a page is requested, it will be cached for 1 hour
export const revalidate = 3600;

/**
 * Interface for page component props
 */
type Props = {
  /** Promise resolving to empty route parameters */
  params: Promise<Record<string, never>>;
  /** Promise resolving to search parameters */
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Home page component that displays a grid of screenshots and ranked moments
 * Supports filtering by series, episode, and search query
 * @param props - The component props
 * @param props.searchParams - Promise resolving to search parameters for filtering content
 * @returns The home page with filtered screenshot grid and ranked moments
 */
export default async function Home({
  searchParams,
}: Props): Promise<React.ReactElement> {
  const allScreenshots = await getFrameIndex();
  const resolvedParams = await searchParams;

  // Parse search parameters
  const currentPage = Number(resolvedParams.page) || 1;
  const season = resolvedParams.season
    ? Number(resolvedParams.season)
    : undefined;
  const episode = resolvedParams.episode
    ? Number(resolvedParams.episode)
    : undefined;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

  // Apply server-side filtering (same logic as client-side)
  let filteredScreenshots = allScreenshots;
  if (season || episode || query) {
    filteredScreenshots = allScreenshots.filter((screenshot) => {
      try {
        const { season: screenshotSeason, episode: screenshotEpisode } =
          parseEpisodeId(screenshot.episode);

        if (season && screenshotSeason !== season) return false;
        if (episode && screenshotEpisode !== episode) return false;
        if (
          query &&
          !screenshot.speech.toLowerCase().includes(query.toLowerCase())
        )
          return false;

        return true;
      } catch {
        return false;
      }
    });
  }

  // Server-side pagination
  const ITEMS_PER_PAGE = 36;
  const totalItems = filteredScreenshots.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  // Redirect if the requested page doesn't match the valid page
  if (currentPage !== validPage) {
    const params = new URLSearchParams();

    // Preserve current filters
    if (season) params.set("season", season.toString());
    if (episode) params.set("episode", episode.toString());
    if (query) params.set("q", query);

    // Add page parameter only if not page 1
    if (validPage > 1) {
      params.set("page", validPage.toString());
    }

    const queryString = params.toString();
    const redirectUrl = queryString ? `/?${queryString}` : "/";
    redirect(redirectUrl);
  }

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageScreenshots = filteredScreenshots.slice(startIndex, endIndex);

  // Ranked moments only for homepage (no filters)
  const rankedMoments: Screenshot[] = [];

  const paginationData = {
    currentPage: validPage,
    totalPages,
    totalItems,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };

  const filters = { season, episode, query, page: validPage };

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6">
      <HomePage
        screenshots={pageScreenshots}
        allScreenshots={allScreenshots}
        rankedMoments={rankedMoments}
        filters={filters}
        paginationData={paginationData}
      />
    </div>
  );
}
