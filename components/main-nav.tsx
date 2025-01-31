"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { TopBanner } from "./main-nav/top-banner";
import { CivilServiceHeader } from "./main-nav/civil-service-header";
import { NavFilters } from "./main-nav/nav-filters";
import { BottomNav } from "./main-nav/bottom-nav";

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

type QueryUpdates = Record<string, string | null>;

export function MainNav() {
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
    // First try to get from URL params
    let season = searchParams.get("season")
      ? Number(searchParams.get("season"))
      : undefined;
    let episode = searchParams.get("episode")
      ? Number(searchParams.get("episode"))
      : undefined;

    // If not in URL params, try to get from path
    if (!season && pathname.startsWith("/series/")) {
      const matches = pathname.match(/^\/series\/(\d+)/);
      if (matches?.[1]) {
        season = parseInt(matches[1], 10);
      }

      if (season && pathname.includes("/episode/")) {
        const matches = pathname.match(/\/episode\/(\d+)/);
        if (matches?.[1]) {
          episode = parseInt(matches[1], 10);
        }
      }
    }

    const query = searchParams.get("q") ?? "";
    return {
      season,
      episode,
      query: query.trim(), // Trim the query to handle whitespace-only searches
    };
  }, [searchParams, pathname]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (updates: { season?: number; episode?: number }) => {
      // If we're in search mode (query exists and isn't empty), update filters in URL
      if (filters.query.trim()) {
        const queryString = createQueryString({
          season:
            updates.season?.toString() ?? filters.season?.toString() ?? null,
          episode:
            updates.episode?.toString() ?? filters.episode?.toString() ?? null,
          q: filters.query,
          page: null, // Reset page when filters change
        });
        router.push(`/?${queryString}`, { scroll: false });
      }
      // Otherwise, we're in navigation mode - handled by SeriesSelect component
    },
    [createQueryString, router, filters.query, filters.season, filters.episode],
  );

  // Handle query changes
  const handleQueryChange = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        // If there's actual search text, redirect to home with search query
        const queryString = createQueryString({
          q: trimmedQuery,
          // Preserve season/episode filters when starting a search
          season: filters.season?.toString() ?? null,
          episode: filters.episode?.toString() ?? null,
          page: null,
        });
        router.push(`/?${queryString}`, { scroll: false });
      } else {
        // If search is empty, clear search params but maintain current path
        const queryString = createQueryString({
          q: null,
          season: null,
          episode: null,
          page: null,
        });
        router.push(pathname + (queryString ? `?${queryString}` : ""), {
          scroll: false,
        });
      }
    },
    [createQueryString, router, filters.season, filters.episode, pathname],
  );

  return (
    <header className="bg-[#0b0c0c] text-white">
      <div className="mx-auto">
        <TopBanner />
        <CivilServiceHeader />
      </div>
      <NavFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onQueryChange={handleQueryChange}
      />
      <BottomNav />
    </header>
  );
}
