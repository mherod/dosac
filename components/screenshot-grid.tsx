"use client";

import React from "react";

import { FrameCard } from "@/components/frame-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { useSpeculationRules } from "@/lib/speculation-rules";
import type { Screenshot } from "@/lib/types";
import Link from "next/link";
import {
  Suspense,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";

/**
 * Props for the ScreenshotGrid component
 */
interface ScreenshotGridProps {
  /** Array of screenshots to display in the grid */
  screenshots: Screenshot[];
  /** Optional array of ranked moments to display */
  rankedMoments?: Screenshot[];
  /** Whether multiple screenshots can be selected (defaults to false) */
  multiselect?: boolean;
}

const ITEMS_PER_PAGE = 36;

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
  multiselect = false,
}: ScreenshotGridProps): React.ReactElement {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalScreenshots = screenshots.length;
  const totalPages = Math.ceil(totalScreenshots / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalScreenshots);
  const currentScreenshots = screenshots.slice(startIndex, endIndex);

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
      const compareIds = rest.length > 0 ? `?compare=${rest.join(",")}` : "";
      const textParam = combinedText
        ? `${compareIds ? "&" : "?"}text=${encodeURIComponent(combinedText)}`
        : "";

      return `/caption/${basePath}${compareIds}${textParam}`;
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

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "1") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const getPageUrl = React.useCallback(
    (newPage: number) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);
      const queryString = createQueryString("page", validPage.toString());
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [pathname, totalPages, createQueryString],
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
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleDragEnd]);

  return (
    <div className="space-y-4 sm:space-y-8">
      {rankedMoments && rankedMoments.length > 0 && (
        <div className="grid grid-cols-1 gap-2 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3">
          {rankedMoments.map((screenshot: Screenshot, index: number) => (
            <div key={screenshot.id} className="relative">
              <Link
                key={`ranked-moment-${screenshot.id}-${index}`}
                href={getScreenshotUrl(screenshot.id)}
                prefetch={true}
                rel="prerender"
                scroll={false}
                suppressHydrationWarning
              >
                <FrameCard
                  screenshot={screenshot}
                  priority={true}
                  isSelected={selectedIds.has(screenshot.id)}
                  onSelect={(e) => {
                    if (
                      "ctrlKey" in e &&
                      (e.ctrlKey || e.metaKey || e.shiftKey)
                    ) {
                      safeSetSelectedIds(new Set([screenshot.id]));
                    }
                  }}
                  onDragStart={() => {
                    handleDragStart(screenshot.id);
                  }}
                  onDragMove={() => {
                    handleDragMove(screenshot.id);
                  }}
                  onTouchStart={() => {
                    handleDragStart(screenshot.id);
                  }}
                  onTouchMove={() => {
                    handleDragMove(screenshot.id);
                  }}
                  onTouchEnd={handleDragEnd}
                />
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 sm:space-y-4">
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-2 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3"
        >
          {currentScreenshots.map((screenshot: Screenshot, index: number) => (
            <div key={screenshot.id}>
              <Link
                key={`screenshot-${screenshot.id}-${index}`}
                href={getScreenshotUrl(screenshot.id)}
                prefetch={true}
                rel="prerender"
                scroll={false}
                suppressHydrationWarning
              >
                <FrameCard
                  screenshot={screenshot}
                  priority={index < 6}
                  isSelected={selectedIds.has(screenshot.id)}
                  onSelect={(e) => {
                    if (
                      "ctrlKey" in e &&
                      (e.ctrlKey || e.metaKey || e.shiftKey)
                    ) {
                      safeSetSelectedIds(new Set([screenshot.id]));
                    }
                  }}
                  onDragStart={() => {
                    handleDragStart(screenshot.id);
                  }}
                  onDragMove={() => {
                    handleDragMove(screenshot.id);
                  }}
                  onTouchStart={() => {
                    handleDragStart(screenshot.id);
                  }}
                  onTouchMove={() => {
                    handleDragMove(screenshot.id);
                  }}
                  onTouchEnd={handleDragEnd}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
            disabled={currentPage === 1}
          >
            {currentPage === 1 ? (
              <span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            ) : (
              <Link
                href={getPageUrl(currentPage - 1)}
                scroll={false}
                prefetch={true}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            asChild
            disabled={currentPage === totalPages}
          >
            {currentPage === totalPages ? (
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            ) : (
              <Link
                href={getPageUrl(currentPage + 1)}
                scroll={false}
                prefetch={true}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </Button>
        </div>
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
