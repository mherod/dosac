"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { Suspense } from "react";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { CategoryNav } from "./main-nav/category-nav";
import { CivilServiceHeader } from "./main-nav/civil-service-header";
import { NavFilters } from "./main-nav/nav-filters";
import { TopBanner } from "./main-nav/top-banner";

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
 * Content component of the main navigation
 * Handles search parameters, routing, and filter state
 * @returns The main navigation content with filters and controls
 */
function MainNavContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  // Handle filter changes
  const handleFilterChange = useCallback(
    (updates: { season?: number; episode?: number }) => {
      const result = FilterUpdatesSchema.safeParse(updates);
      if (!result.success) return;

      const trimmedQuery = filters.query.trim();

      // If we have a search query or we're on the search page, update search params
      if (trimmedQuery || pathname === "/search") {
        const searchParams = new URLSearchParams({
          ...(trimmedQuery && { q: trimmedQuery }),
          ...(result.data.season?.toString() && {
            season: result.data.season.toString(),
          }),
          ...(result.data.episode?.toString() && {
            episode: result.data.episode.toString(),
          }),
        });

        const targetPath =
          trimmedQuery || pathname === "/search" ? "/search" : "/";
        router.push(`${targetPath}?${searchParams.toString()}`, {
          scroll: false,
        });
      }
    },
    [router, filters, pathname],
  );

  // Handle query changes - redirect to search page
  const handleQueryChange = useCallback(
    (query: string) => {
      const trimmedQuery = z.string().trim().parse(query);

      if (trimmedQuery) {
        // Redirect to search page with query
        const searchParams = new URLSearchParams({
          q: trimmedQuery,
          ...(filters.season && { season: filters.season.toString() }),
          ...(filters.episode && { episode: filters.episode.toString() }),
        });
        router.push(`/search?${searchParams.toString()}`);
      } else if (pathname === "/search") {
        // If on search page and query is cleared, go back to home
        router.push("/");
      }
    },
    [router, filters.season, filters.episode, pathname],
  );

  return (
    <div>
      <NavFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onQueryChange={handleQueryChange}
      />
    </div>
  );
}

/**
 * Main navigation component for the application
 * Wraps the navigation content in a Suspense boundary and includes header components
 * @returns The complete navigation bar with all controls and filters
 */
export function MainNav(): React.ReactElement {
  return (
    <header className="bg-[#0b0c0c] text-white">
      <div className="mx-auto max-w-7xl">
        <TopBanner />
        <CivilServiceHeader />
        <Suspense>
          <MainNavContent />
        </Suspense>
        <CategoryNav />
      </div>
    </header>
  );
}
