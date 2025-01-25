"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import type { Frame } from "@/lib/frames";
import { parseEpisodeId } from "@/lib/frames";
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

const MAX_DISPLAYED_FRAMES = 800;

function SearchWrapper({ screenshots }: { screenshots: Frame[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = React.useState<Filters>({
    season: searchParams.get("season")
      ? Number(searchParams.get("season"))
      : undefined,
    episode: searchParams.get("episode")
      ? Number(searchParams.get("episode"))
      : undefined,
    query: searchParams.get("q") ?? "",
  });

  const debouncedQuery = useDebounce(filters.query, 300);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    if (filters.season) {
      params.set("season", filters.season.toString());
    } else {
      params.delete("season");
    }
    if (filters.episode) {
      params.set("episode", filters.episode.toString());
    } else {
      params.delete("episode");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    debouncedQuery,
    filters.season,
    filters.episode,
    pathname,
    router,
    searchParams,
  ]);

  const filteredScreenshots = React.useMemo(() => {
    return screenshots
      .filter((screenshot) => {
        try {
          const { season, episode } = parseEpisodeId(screenshot.episode);

          // Apply season filter
          if (filters.season && season !== filters.season) {
            return false;
          }

          // Apply episode filter
          if (filters.episode && episode !== filters.episode) {
            return false;
          }

          // Apply text search
          if (debouncedQuery) {
            return screenshot.speech
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase());
          }

          return true;
        } catch (error) {
          console.error("Error parsing episode ID:", error);
          return false;
        }
      })
      .slice(0, MAX_DISPLAYED_FRAMES);
  }, [screenshots, debouncedQuery, filters.season, filters.episode]);

  // Get unique seasons and episodes for the filter dropdowns
  const { seasons, episodes } = React.useMemo(() => {
    const seasonsSet = new Set<number>();
    const episodesSet = new Set<number>();

    screenshots.forEach((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);
        seasonsSet.add(season);
        episodesSet.add(episode);
      } catch (error) {
        console.error("Error parsing episode ID:", error);
      }
    });

    return {
      seasons: Array.from(seasonsSet).sort((a, b) => a - b),
      episodes: Array.from(episodesSet).sort((a, b) => a - b),
    };
  }, [screenshots]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={filters.season || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                season: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
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
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                episode: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background"
          >
            <option value="">All Episodes</option>
            {episodes.map((episode) => (
              <option key={episode} value={episode}>
                Episode {episode}
              </option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search quotes..."
            value={filters.query}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, query: e.target.value }))
            }
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
