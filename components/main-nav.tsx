"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";
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

  const createQueryString = React.useCallback(
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

  // Read filters from URL
  const filters = React.useMemo(
    (): Filters => ({
      season: searchParams.get("season")
        ? Number(searchParams.get("season"))
        : undefined,
      episode: searchParams.get("episode")
        ? Number(searchParams.get("episode"))
        : undefined,
      query: searchParams.get("q") ?? "",
    }),
    [searchParams],
  );

  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (updates: Partial<Filters>) => {
      const queryString = createQueryString({
        season:
          updates.season?.toString() ?? filters.season?.toString() ?? null,
        episode:
          updates.episode?.toString() ?? filters.episode?.toString() ?? null,
        page: null, // Reset page when filters change
      });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router, filters.season, filters.episode],
  );

  // Handle query changes
  const handleQueryChange = React.useCallback(
    (query: string) => {
      const queryString = createQueryString({
        q: query || null,
      });
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router],
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
