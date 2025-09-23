"use server";

import { parseEpisodeId } from "@/lib/frames";
import { getCachedFrameIndex } from "@/lib/frames-cache";
import type { Screenshot } from "@/lib/types";

export interface SearchFilters {
  season?: number;
  episode?: number;
  query?: string;
  page?: number;
}

export interface SearchResult {
  screenshots: Screenshot[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Server action to search and filter screenshots
 * Leverages React 19's Server Actions for optimized data fetching
 */
export async function searchScreenshots(
  filters: SearchFilters,
): Promise<SearchResult> {
  const allScreenshots = await getCachedFrameIndex();
  const { season, episode, query, page = 1 } = filters;

  // Apply filtering logic
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

  // Pagination
  const ITEMS_PER_PAGE = 36;
  const totalItems = filteredScreenshots.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const validPage = Math.min(Math.max(1, page), totalPages || 1);

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageScreenshots = filteredScreenshots.slice(startIndex, endIndex);

  return {
    screenshots: pageScreenshots,
    totalItems,
    totalPages,
    currentPage: validPage,
  };
}

/**
 * Server action to get episode details
 */
export async function getEpisodeScreenshots(
  episodeId: string,
): Promise<Screenshot[]> {
  const allScreenshots = await getCachedFrameIndex();
  return allScreenshots.filter(
    (screenshot) => screenshot.episode === episodeId,
  );
}

/**
 * Server action to get screenshots by character
 */
export async function getCharacterScreenshots(
  character: string,
): Promise<Screenshot[]> {
  const allScreenshots = await getCachedFrameIndex();
  return allScreenshots.filter((screenshot) =>
    screenshot.speech.toLowerCase().includes(character.toLowerCase()),
  );
}
