"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { z } from "zod";
import { useSearchNavigation } from "@/components/search-navigation-provider";
import { buildSearchUrl } from "@/lib/search-sync";
import { SearchBar } from "./search-bar";
import { SeriesSelect } from "./series-select";

// Zod schemas for validation
const NumberParamSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .optional();

const FiltersSchema = z.object({
  season: z.number().positive().optional(),
  episode: z.number().positive().optional(),
  query: z.string().trim(),
});

const FilterUpdatesSchema = z.object({
  season: z.number().positive().optional(),
  episode: z.number().positive().optional(),
});

type Filters = z.infer<typeof FiltersSchema>;

/**
 * Client component that handles search parameters, routing, and filter state
 * Includes series selection and explicit search submission
 * @param props - Component props
 * @param props.children - Server-rendered content (e.g., FeaturedCharacters)
 * @returns The navigation filters with interactive controls
 */
export function NavFilters({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { state, observeLocation, setSearchDraft, navigateSearch } =
    useSearchNavigation();

  // Read filters from URL and path
  const filters = useMemo((): Filters => {
    // Parse URL parameters
    const seasonParam = NumberParamSchema.safeParse(searchParams.get("season"));
    const episodeParam = NumberParamSchema.safeParse(
      searchParams.get("episode"),
    );
    const query = searchParams.get("q") ?? "";

    let season = seasonParam.success ? seasonParam.data : undefined;
    let episode = episodeParam.success ? episodeParam.data : undefined;

    // If not in URL params, try to get from path
    if (!season && pathname.startsWith("/series/")) {
      const matches = pathname.match(/^\/series\/(\d+)/);
      if (matches?.[1]) {
        const pathSeason = NumberParamSchema.safeParse(matches[1]);
        if (pathSeason.success) {
          season = pathSeason.data;
        }
      }

      if (season && pathname.includes("/episode/")) {
        const matches = pathname.match(/\/episode\/(\d+)/);
        if (matches?.[1]) {
          const pathEpisode = NumberParamSchema.safeParse(matches[1]);
          if (pathEpisode.success) {
            episode = pathEpisode.data;
          }
        }
      }
    }

    // Validate complete filters object
    const result = FiltersSchema.safeParse({
      season,
      episode,
      query: query.trim(),
    });

    // Return validated data or fallback to defaults
    return result.success ? result.data : { query: "" };
  }, [searchParams, pathname]);

  const urlQuery = searchParams.get("q") ?? "";
  const searchString = searchParams.toString();
  const inputQuery =
    state.status === "initializing" ? urlQuery : state.draftQuery;

  useEffect(() => {
    observeLocation({
      pathname,
      search: searchString,
      query: urlQuery,
    });
  }, [observeLocation, pathname, searchString, urlQuery]);

  const getCurrentFilterQuery = useCallback(
    (): { season?: number; episode?: number } => ({
      ...(filters.season && { season: filters.season }),
      ...(filters.episode && { episode: filters.episode }),
    }),
    [filters.episode, filters.season],
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (updates: { season?: number; episode?: number }) => {
      const result = FilterUpdatesSchema.safeParse(updates);
      if (!result.success) return;

      if (
        result.data.season === filters.season &&
        result.data.episode === filters.episode
      ) {
        return;
      }

      const trimmedQuery = inputQuery.trim();

      // If we have a search query or we're on the search page, update search params
      if (trimmedQuery || pathname === "/search") {
        const targetPath =
          trimmedQuery || pathname === "/search" ? "/search" : "/";

        const href = buildSearchUrl({
          query: trimmedQuery,
          season: result.data.season,
          episode: result.data.episode,
        });

        navigateSearch(targetPath === "/search" ? href : targetPath, "push");
      }
    },
    [filters, inputQuery, navigateSearch, pathname],
  );

  // Only consider it search mode if there's actual search text
  const isSearchMode = inputQuery.trim() !== "";

  const handleSearchChange = (value: string): void => {
    setSearchDraft(value, getCurrentFilterQuery());
  };

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      navigateSearch(
        buildSearchUrl({
          query: trimmedQuery,
          ...getCurrentFilterQuery(),
        }),
        "push",
      );
    },
    [getCurrentFilterQuery, navigateSearch],
  );

  return (
    <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col items-stretch justify-between gap-3 py-4 md:gap-4 md:py-5 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex w-full min-w-0 flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-4 md:gap-5 lg:w-auto">
            <div className="min-w-0 flex-shrink-0">
              <SeriesSelect
                season={filters.season}
                episode={filters.episode}
                onFilterChange={handleFilterChange}
                isSearchMode={isSearchMode}
              />
            </div>
            <div className="min-w-0 flex-1 sm:flex-none">
              <SearchBar
                value={inputQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                className="sm:w-64 md:w-72"
              />
            </div>
          </div>
          {children ? (
            <div className="w-full min-w-0 sm:flex sm:justify-end lg:w-auto lg:justify-start">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
