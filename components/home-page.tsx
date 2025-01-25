"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { parseEpisodeId } from "@/lib/frames";
import type { Frame } from "@/lib/frames";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { MainNav } from "@/components/main-nav";

interface HomePageProps {
  screenshots: Frame[];
}

interface Filters {
  season?: number;
  episode?: number;
  query: string;
}

type FilterUpdates = Partial<Filters>;
type QueryUpdates = Record<string, string | null>;

const MAX_DISPLAYED_FRAMES = 800;

function SearchWrapper({ screenshots }: { screenshots: Frame[] }) {
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

  const [localQuery, setLocalQuery] = React.useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 300);

  // Update URL when debounced query changes
  React.useEffect(() => {
    const queryString = createQueryString({
      q: debouncedQuery || null,
    });
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [debouncedQuery, createQueryString, pathname, router]);

  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (updates: FilterUpdates) => {
      const queryString = createQueryString({
        // Preserve existing values unless they're being updated
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

  const filteredScreenshots = React.useMemo(() => {
    return screenshots.filter((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);

        if (filters.season && season !== filters.season) return false;
        if (filters.episode && episode !== filters.episode) return false;
        if (localQuery) {
          return screenshot.speech
            .toLowerCase()
            .includes(localQuery.toLowerCase());
        }

        return true;
      } catch (error) {
        console.error("Error parsing episode ID:", error);
        return false;
      }
    });
  }, [screenshots, localQuery, filters.season, filters.episode]);

  const { seasons, episodes } = React.useMemo(() => {
    const seasonsSet = new Set<number>();
    const episodesSet = new Set<number>();

    screenshots.forEach((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);
        seasonsSet.add(season);
        if (!filters.season || season === filters.season) {
          episodesSet.add(episode);
        }
      } catch (error) {
        console.error("Error parsing episode ID:", error);
      }
    });

    return {
      seasons: Array.from(seasonsSet).sort((a, b) => a - b),
      episodes: Array.from(episodesSet).sort((a, b) => a - b),
    };
  }, [screenshots, filters.season]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select
            value={filters.season || ""}
            onChange={(e) => {
              const newSeason = e.target.value
                ? Number(e.target.value)
                : undefined;
              handleFilterChange({
                season: newSeason,
                episode: newSeason ? filters.episode : undefined,
              });
            }}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background"
          >
            <option value="">All Seasons</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                Season {season}
              </option>
            ))}
          </select>

          <select
            value={filters.episode || ""}
            onChange={(e) => {
              handleFilterChange({
                episode: e.target.value ? Number(e.target.value) : undefined,
              });
            }}
            disabled={!filters.season}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Episodes</option>
            {episodes.map((episode) => (
              <option key={episode} value={episode}>
                Episode {episode}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="search"
            placeholder="Search quotes..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredScreenshots.length} of {screenshots.length}{" "}
          screenshots
        </div>
      </div>

      <ScreenshotGrid screenshots={filteredScreenshots} />
    </div>
  );
}

export function HomePage({ screenshots }: HomePageProps) {
  return (
    <>
      <MainNav />
      <Suspense>
        <SearchWrapper screenshots={screenshots} />
      </Suspense>
    </>
  );
}
