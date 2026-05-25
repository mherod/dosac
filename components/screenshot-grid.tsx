"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { withQuery } from "ufo";
import { FrameCard } from "@/components/frame-card";
import { Button } from "@/components/ui/button";
import { useSpeculationRules } from "@/lib/speculation-rules";
import type { Screenshot } from "@/lib/types";

/**
 * Props for the ScreenshotGrid component
 */
interface ScreenshotGridProps {
  /** Array of screenshots to display in the grid (current page) */
  screenshots: Screenshot[];
  /** Optional array of ranked moments to display */
  rankedMoments?: Screenshot[];
  /** Current filters applied */
  filters: {
    season?: number;
    episode?: number;
    query: string;
    page: number;
  };
  /** Pagination information */
  paginationData: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  /** Whether multiple screenshots can be selected (defaults to false) */
  multiselect?: boolean;
}

/**
 * Grid component for displaying and managing screenshots with pagination
 * @param props - The component props
 * @param props.screenshots - Array of screenshots to display
 * @param props.rankedMoments - Optional array of ranked moments to display
 * @param props.multiselect - Whether multiple screenshots can be selected
 * @returns A paginated grid of screenshot cards with navigation controls
 */
function ScreenshotGridInner({
  screenshots,
  rankedMoments,
  filters,
  paginationData,
  multiselect = false,
}: ScreenshotGridProps): React.ReactElement {
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Use server-prepared data directly
  const currentScreenshots = screenshots;
  const { currentPage, totalPages } = paginationData;

  const getScreenshotUrl = useCallback(
    (id: string) => {
      if (!currentScreenshots || !multiselect) return `/caption/${id}`;

      if (selectedIds.size === 0) {
        return `/caption/${id}`;
      }

      const selectedFrames = currentScreenshots
        .filter((s: Screenshot) => selectedIds.has(s.id))
        .sort((a: Screenshot, b: Screenshot) => {
          const aIndex = currentScreenshots.findIndex(
            (s: Screenshot) => s.id === a.id,
          );
          const bIndex = currentScreenshots.findIndex(
            (s: Screenshot) => s.id === b.id,
          );
          return aIndex - bIndex;
        });

      // Add the clicked frame if it's not already selected
      if (!selectedIds.has(id)) {
        const clickedFrame = currentScreenshots.find(
          (s: Screenshot) => s.id === id,
        );
        if (clickedFrame) {
          selectedFrames.push(clickedFrame);
        }
      }

      // Limit to 4 frames total
      const frames = selectedFrames.slice(0, 4);
      const combinedText = frames.map((s: Screenshot) => s.speech).join("\n");

      // Use path for first two IDs and compare query param for additional IDs
      const [first, second, ...rest] = frames.map((f: Screenshot) => f.id);
      const basePath = second ? `${first}/${second}` : first;

      const query: Record<string, string | undefined> = {
        ...(rest.length > 0 && { compare: rest.join(",") }),
        ...(combinedText && { text: combinedText }),
      };

      return withQuery(`/caption/${basePath}`, query);
    },
    [currentScreenshots, multiselect, selectedIds],
  );

  // Get all possible URLs for current page
  const allPossibleUrls = useMemo(() => {
    const urls = currentScreenshots.map((screenshot: Screenshot) =>
      getScreenshotUrl(screenshot.id),
    );
    if (rankedMoments) {
      urls.push(
        ...rankedMoments.map((screenshot: Screenshot) =>
          getScreenshotUrl(screenshot.id),
        ),
      );
    }
    return urls;
  }, [currentScreenshots, getScreenshotUrl, rankedMoments]);

  // Use our speculation rules hook
  useSpeculationRules(allPossibleUrls, {
    behavior: "prerender",
    score: 0.5,
    requires: ["hover"],
    eagerness: "moderate",
  });

  const getPageUrl = React.useCallback(
    (newPage: number) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);

      // Preserve current filters
      const query: Record<string, string | undefined> = {
        ...(filters.season && { season: filters.season.toString() }),
        ...(filters.episode && { episode: filters.episode.toString() }),
        ...(filters.query && { q: filters.query }),
        // Add page parameter (only if not page 1)
        ...(validPage > 1 && { page: validPage.toString() }),
      };

      return withQuery(pathname, query);
    },
    [pathname, totalPages, filters],
  );

  const safeSetSelectedIds = React.useCallback((newIds: Set<string>) => {
    setSelectedIds(new Set([...newIds]));
  }, []);

  const handleDragStart = React.useCallback((id: string) => {
    setIsDragging(true);
    setDragStartId(id);
    // Don't set a single frame selection on drag start
  }, []);

  const handleDragMove = React.useCallback(
    (id: string) => {
      if (isDragging && dragStartId) {
        const startIndex = currentScreenshots.findIndex(
          (s: Screenshot) => s.id === dragStartId,
        );
        const endIndex = currentScreenshots.findIndex(
          (s: Screenshot) => s.id === id,
        );

        if (startIndex !== -1 && endIndex !== -1) {
          const start = Math.min(startIndex, endIndex);
          const end = Math.max(startIndex, endIndex);

          // Only set selection if we have multiple frames
          if (start !== end) {
            const selectedFrames = currentScreenshots
              .slice(start, end + 1)
              .map((s: Screenshot) => s.id);
            safeSetSelectedIds(new Set(selectedFrames));
          }
        }
      }
    },
    [isDragging, dragStartId, currentScreenshots, safeSetSelectedIds],
  );

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    setDragStartId(null);
  }, []);

  useEffect(() => {
    const handleMouseUp = (): void => {
      handleDragEnd();
    };

    const handleTouchEnd = (): void => {
      handleDragEnd();
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleDragEnd]);

  // Escape clears an in-progress selection so a drag-select can be undone
  // without navigating away.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape" && selectedIds.size > 0) {
        safeSetSelectedIds(new Set());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIds, safeSetSelectedIds]);

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {rankedMoments && rankedMoments.length > 0 && (
        <section aria-label="Featured moments">
          <h2 className="sr-only">Featured moments</h2>
          <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 md:gap-5 lg:grid-cols-3 lg:gap-6">
            {rankedMoments.map((screenshot: Screenshot, index: number) => (
              <div key={screenshot.id} className="relative">
                <Link
                  key={`ranked-moment-${screenshot.id}-${index}`}
                  href={getScreenshotUrl(screenshot.id)}
                  prefetch={true}
                  scroll={false}
                  suppressHydrationWarning
                >
                  <FrameCard
                    screenshot={screenshot}
                    priority={true}
                    isSelected={selectedIds.has(screenshot.id)}
                    onSelect={() => {
                      const next = new Set(selectedIds);
                      if (next.has(screenshot.id)) {
                        next.delete(screenshot.id);
                      } else {
                        next.add(screenshot.id);
                      }
                      safeSetSelectedIds(next);
                    }}
                    onDragStart={() => {
                      handleDragStart(screenshot.id);
                    }}
                    onDragMove={() => {
                      handleDragMove(screenshot.id);
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Screenshots">
        <h2 className="sr-only">Screenshots</h2>
        <div className="space-y-3 md:space-y-4">
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 md:gap-5 lg:grid-cols-3 lg:gap-6"
            role="list"
            aria-label="Screenshot grid"
          >
            {currentScreenshots.map((screenshot: Screenshot, index: number) => (
              <div key={screenshot.id}>
                <Link
                  key={`screenshot-${screenshot.id}-${index}`}
                  href={getScreenshotUrl(screenshot.id)}
                  prefetch={true}
                  scroll={false}
                  suppressHydrationWarning
                >
                  <FrameCard
                    screenshot={screenshot}
                    priority={index < 6}
                    isSelected={selectedIds.has(screenshot.id)}
                    onSelect={() => {
                      const next = new Set(selectedIds);
                      if (next.has(screenshot.id)) {
                        next.delete(screenshot.id);
                      } else {
                        next.add(screenshot.id);
                      }
                      safeSetSelectedIds(next);
                    }}
                    onDragStart={() => {
                      handleDragStart(screenshot.id);
                    }}
                    onDragMove={() => {
                      handleDragMove(screenshot.id);
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-3 md:gap-4"
        >
          <Button
            variant="outline"
            size="icon"
            asChild
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          >
            {currentPage === 1 ? (
              <span>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </span>
            ) : (
              <Link
                href={getPageUrl(currentPage - 1)}
                scroll={false}
                prefetch={true}
                aria-label={`Go to page ${currentPage - 1}`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Previous page</span>
              </Link>
            )}
          </Button>
          <span className="text-sm md:text-base" aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            asChild
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          >
            {currentPage === totalPages ? (
              <span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </span>
            ) : (
              <Link
                href={getPageUrl(currentPage + 1)}
                scroll={false}
                prefetch={true}
                aria-label={`Go to page ${currentPage + 1}`}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Next page</span>
              </Link>
            )}
          </Button>
        </nav>
      )}
    </div>
  );
}

/**
 * Screenshot grid component with suspense wrapper
 * @param props - The screenshot grid props
 * @returns The screenshot grid component wrapped in suspense
 */
export function ScreenshotGrid(props: ScreenshotGridProps): React.ReactElement {
  return (
    <Suspense>
      <ScreenshotGridInner {...props} />
    </Suspense>
  );
}
