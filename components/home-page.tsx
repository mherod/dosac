"use client";

import { FrameStrip } from "@/components/frame-strip";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import type { Frame } from "@/lib/frames";
import React, { Suspense, Component } from "react";

// Error boundary component for better error handling
class HomePageErrorBoundary extends Component<
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

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Filters {
  season?: number;
  episode?: number;
  query: string;
  page: number;
}

interface HomePageProps {
  screenshots: Frame[];
  allScreenshots: Frame[];
  rankedMoments: Frame[];
  filters: Filters;
  paginationData: PaginationData;
}

function HomePageContent({
  screenshots,
  allScreenshots,
  rankedMoments,
  filters,
  paginationData,
}: HomePageProps): React.ReactElement {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-sm text-muted-foreground">
          Showing {screenshots.length} of {paginationData.totalItems}{" "}
          screenshots
          {paginationData.totalPages > 1 && (
            <span>
              {" "}
              • Page {paginationData.currentPage} of {paginationData.totalPages}
            </span>
          )}
        </div>
      </div>

      <ScreenshotGrid
        screenshots={screenshots}
        allScreenshots={allScreenshots}
        rankedMoments={
          !filters.season && !filters.episode && !filters.query
            ? rankedMoments
            : undefined
        }
        filters={filters}
        paginationData={paginationData}
      />

      <div className="mt-8">
        <FrameStrip screenshots={screenshots.slice(0, 50)} frameWidth={192} />
      </div>
    </div>
  );
}

export function HomePage(props: HomePageProps): React.ReactElement {
  return (
    <HomePageErrorBoundary>
      <Suspense
        fallback={
          <div
            className="container mx-auto px-4 py-8"
            aria-live="polite"
            aria-label="Loading content"
          >
            <div className="text-center">
              <div className="animate-pulse">
                <div className="mx-auto mb-4 h-4 w-1/4 rounded bg-gray-200" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => {
                    // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton placeholders
                    return (
                      <div
                        key={`skeleton-${i}`}
                        className="aspect-video rounded bg-gray-200"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <HomePageContent {...props} />
      </Suspense>
    </HomePageErrorBoundary>
  );
}
