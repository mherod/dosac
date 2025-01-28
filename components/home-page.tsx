"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { parseEpisodeId } from "@/lib/frames";
import type { Frame } from "@/lib/frames";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { MainNav } from "@/components/main-nav";

interface HomePageProps {
  screenshots: Frame[];
  rankedMoments: Frame[];
  initialSearchParams?: {
    season?: string;
    episode?: string;
    q?: string;
  };
}

function SearchWrapper({
  screenshots,
  rankedMoments,
  initialSearchParams,
}: {
  screenshots: Frame[];
  rankedMoments: Frame[];
  initialSearchParams?: HomePageProps["initialSearchParams"];
}) {
  const searchParams = useSearchParams();

  // Get current filters from URL or initial props
  const filters = {
    season:
      (searchParams.get("season") ?? initialSearchParams?.season)
        ? Number(searchParams.get("season") ?? initialSearchParams?.season)
        : undefined,
    episode:
      (searchParams.get("episode") ?? initialSearchParams?.episode)
        ? Number(searchParams.get("episode") ?? initialSearchParams?.episode)
        : undefined,
    query: searchParams.get("q") ?? initialSearchParams?.q ?? "",
  };

  // Filter screenshots based on URL parameters
  const filteredScreenshots = React.useMemo(() => {
    const isShowingRanked =
      !filters.season && !filters.episode && !filters.query;
    const screenshotsToFilter = isShowingRanked
      ? screenshots.filter((s) => !rankedMoments.some((r) => r.id === s.id))
      : screenshots;

    return screenshotsToFilter.filter((screenshot) => {
      try {
        const { season, episode } = parseEpisodeId(screenshot.episode);

        if (filters.season && season !== filters.season) return false;
        if (filters.episode && episode !== filters.episode) return false;
        if (filters.query) {
          return screenshot.speech
            .toLowerCase()
            .includes(filters.query.toLowerCase());
        }

        return true;
      } catch (error) {
        console.error("Error parsing episode ID:", error);
        return false;
      }
    });
  }, [
    screenshots,
    filters.season,
    filters.episode,
    filters.query,
    rankedMoments,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground">
          Showing {filteredScreenshots.length} of {screenshots.length}{" "}
          screenshots
        </div>
      </div>

      <ScreenshotGrid
        screenshots={filteredScreenshots}
        rankedMoments={
          !filters.season && !filters.episode && !filters.query
            ? rankedMoments
            : undefined
        }
      />
    </div>
  );
}

export function HomePage({
  screenshots,
  rankedMoments,
  initialSearchParams,
}: HomePageProps) {
  return (
    <>
      <Suspense>
        <MainNav />
      </Suspense>
      <Suspense>
        <SearchWrapper
          screenshots={screenshots}
          rankedMoments={rankedMoments}
          initialSearchParams={initialSearchParams}
        />
      </Suspense>
    </>
  );
}
