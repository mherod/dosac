"use client";

import { FrameStrip } from "@/components/frame-strip";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { parseEpisodeId } from "@/lib/frames";
import type { Frame } from "@/lib/frames";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

// Error boundary component for better error handling
class HomePageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("HomePage error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="container mx-auto px-4 py-8"
          role="alert"
          aria-live="polite"
        >
          <h2 className="mb-4 text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">
            There was an error loading the page. Please try refreshing.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

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
}): React.ReactElement {
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
      ? screenshots.filter(
          (s: Frame) => !rankedMoments.some((r: Frame) => r.id === s.id),
        )
      : screenshots;

    return screenshotsToFilter.filter((screenshot: Frame) => {
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

      <div className="mt-8">
        <FrameStrip
          screenshots={filteredScreenshots.slice(0, 100)}
          frameWidth={192}
        />
      </div>
    </div>
  );
}

export function HomePage({
  screenshots,
  rankedMoments,
  initialSearchParams,
}: HomePageProps): React.ReactElement {
  return (
    <HomePageErrorBoundary>
      <Suspense
        fallback={
          <div
            className="container mx-auto px-4 py-8"
            role="status"
            aria-live="polite"
            aria-label="Loading content"
          >
            <div className="text-center">
              <div className="animate-pulse">
                <div className="mx-auto mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded bg-gray-200"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <SearchWrapper
          screenshots={screenshots}
          rankedMoments={rankedMoments}
          initialSearchParams={initialSearchParams}
        />
      </Suspense>
    </HomePageErrorBoundary>
  );
}
