"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { TopBanner } from "./main-nav/top-banner";
import { CivilServiceHeader } from "./main-nav/civil-service-header";
import { NavFilters } from "./main-nav/nav-filters";
import { BottomNav } from "./main-nav/bottom-nav";

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
type QueryUpdates = Record<string, string | null>;

/**
 * Content component of the main navigation
 * Handles search parameters, routing, and filter state
 * @returns The main navigation content with filters and controls
 */
function MainNavContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (updates: QueryUpdates) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return params.toString();
    },
    [searchParams],
  );

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
      if (trimmedQuery) {
        const queryUpdates = {
          season:
            result.data.season?.toString() ??
            filters.season?.toString() ??
            null,
          episode:
            result.data.episode?.toString() ??
            filters.episode?.toString() ??
            null,
          q: trimmedQuery,
          page: null,
        };

        router.push(`/?${createQueryString(queryUpdates)}`, { scroll: false });
      }
    },
    [createQueryString, router, filters],
  );

  // Handle query changes
  const handleQueryChange = useCallback(
    (query: string) => {
      const trimmedQuery = z.string().trim().parse(query);
      const queryUpdates: QueryUpdates = {
        q: trimmedQuery || null,
        season: trimmedQuery ? (filters.season?.toString() ?? null) : null,
        episode: trimmedQuery ? (filters.episode?.toString() ?? null) : null,
        page: null,
      };

      const queryString = createQueryString(queryUpdates);
      const targetPath = trimmedQuery ? "/" : pathname;
      router.push(targetPath + (queryString ? `?${queryString}` : ""), {
        scroll: false,
      });
    },
    [createQueryString, router, filters.season, filters.episode, pathname],
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
export function MainNav() {
  return (
    <header className="bg-[#0b0c0c] text-white">
      <div className="mx-auto">
        <TopBanner />
        <CivilServiceHeader />
      </div>
      <Suspense>
        <MainNavContent />
      </Suspense>
      <BottomNav />
    </header>
  );
}
