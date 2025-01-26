"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { parseEpisodeId } from "@/lib/frames";
import type { Frame } from "@/lib/frames";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { MainNav } from "@/components/main-nav";

interface RankedMoment {
  id: string;
  episode: string;
  timestamp: string;
  quote: string;
  context: string;
  rank: number;
}

interface MatchedMoment {
  moment: RankedMoment;
  frame: Frame;
}

interface HomePageProps {
  screenshots: Frame[];
}

function SearchWrapper({ screenshots }: { screenshots: Frame[] }) {
  const searchParams = useSearchParams();
  const [rankedMoments, setRankedMoments] = React.useState<Frame[]>([]);

  // Load ranked moments on mount
  React.useEffect(() => {
    console.log("Loading ranked moments...");
    fetch("/api/moments")
      .then((res) => res.json())
      .then((matchedMoments: MatchedMoment[]) => {
        console.log("Received matched moments:", matchedMoments.length);
        setRankedMoments(matchedMoments.map((m) => m.frame));
      })
      .catch((error) => {
        console.error("Error loading ranked moments:", error);
      });
  }, []);

  // Get current filters from URL
  const filters = {
    season: searchParams.get("season")
      ? Number(searchParams.get("season"))
      : undefined,
    episode: searchParams.get("episode")
      ? Number(searchParams.get("episode"))
      : undefined,
    query: searchParams.get("q") ?? "",
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
