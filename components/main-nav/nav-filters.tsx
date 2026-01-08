"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { withQuery } from "ufo";
import { z } from "zod";
import { useDebounce } from "@/hooks/use-debounce";
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
 * Includes series selection and search bar with debounced input
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
        const targetPath =
          trimmedQuery || pathname === "/search" ? "/search" : "/";

        const query: Record<string, string | undefined> = {
          ...(trimmedQuery && { q: trimmedQuery }),
          ...(result.data.season?.toString() && {
            season: result.data.season.toString(),
          }),
          ...(result.data.episode?.toString() && {
            episode: result.data.episode.toString(),
          }),
        };

        router.push(withQuery(targetPath, query), {
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
        // Get current filter values from URL to avoid stale closures
        const currentSeason = NumberParamSchema.safeParse(
          searchParams.get("season"),
        );
        const currentEpisode = NumberParamSchema.safeParse(
          searchParams.get("episode"),
        );

        // Redirect to search page with query
        const queryParams: Record<string, string | undefined> = {
          q: trimmedQuery,
          ...(currentSeason.success &&
            currentSeason.data && {
              season: currentSeason.data.toString(),
            }),
          ...(currentEpisode.success &&
            currentEpisode.data && {
              episode: currentEpisode.data.toString(),
            }),
        };
        router.push(withQuery("/search", queryParams), { scroll: false });
      } else if (pathname === "/search") {
        // If on search page and query is cleared, go back to home
        router.push("/", { scroll: false });
      }
    },
    [router, searchParams, pathname],
  );

  const [localQuery, setLocalQuery] = useState(filters.query);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSyncedQueryRef = useRef<string>(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Only consider it search mode if there's actual search text
  const isSearchMode = filters.query.trim() !== "";

  // Update parent when debounced query changes (but not if we just submitted)
  useEffect(() => {
    if (!isSubmitting && debouncedQuery.trim()) {
      handleQueryChange(debouncedQuery);
    }
  }, [debouncedQuery, handleQueryChange, isSubmitting]);

  // Sync URL searchParams to local input state when URL changes externally
  // This is necessary for browser back/forward navigation and external URL changes
  // Note: This pattern is acceptable for syncing URL params to controlled inputs in Next.js
  useLayoutEffect(() => {
    const query = searchParams.get("q") || "";
    // Only update if URL changed externally (different from last synced value)
    if (lastSyncedQueryRef.current !== query) {
      lastSyncedQueryRef.current = query;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalQuery(query);
    }
    setIsSubmitting(false);
  }, [searchParams]);

  const handleSearchChange = (value: string): void => {
    setLocalQuery(value);
    setIsSubmitting(false);
  };

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      // Mark as submitting to prevent debounced effect from interfering
      setIsSubmitting(true);
      // Update local state immediately
      setLocalQuery(trimmedQuery);

      // Get current filter values from URL to avoid stale closures
      const currentSeason = NumberParamSchema.safeParse(
        searchParams.get("season"),
      );
      const currentEpisode = NumberParamSchema.safeParse(
        searchParams.get("episode"),
      );

      // Immediately navigate to search page
      const queryParams: Record<string, string | undefined> = {
        q: trimmedQuery,
        ...(currentSeason.success &&
          currentSeason.data && {
            season: currentSeason.data.toString(),
          }),
        ...(currentEpisode.success &&
          currentEpisode.data && {
            episode: currentEpisode.data.toString(),
          }),
      };
      router.push(withQuery("/search", queryParams), { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center sm:gap-5 md:gap-6 md:py-5">
          <div className="flex w-full min-w-0 flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:gap-5">
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
                value={localQuery}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                className="sm:w-64 md:w-72"
              />
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
