"use client";

import { FrameCard } from "@/components/frame-card";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import React from "react";
import Link from "next/link";

type Screenshot = {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
};

interface ScreenshotGridProps {
  screenshots: Screenshot[];
}

const ITEMS_PER_PAGE = 36;
const MAX_DISPLAYED_FRAMES = 800;

export function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const [dragEndId, setDragEndId] = React.useState<string | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalScreenshots = Math.min(screenshots.length, MAX_DISPLAYED_FRAMES);
  const totalPages = Math.ceil(totalScreenshots / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalScreenshots);
  const currentScreenshots = screenshots.slice(startIndex, endIndex);

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === "1") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);
      const queryString = createQueryString("page", validPage.toString());
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [router, pathname, totalPages, createQueryString],
  );

  // Wrap setSelectedIds to prevent single-frame selection
  const safeSetSelectedIds = React.useCallback(
    (newSelection: Set<string> | ((prev: Set<string>) => Set<string>)) => {
      setSelectedIds((prev) => {
        // Handle function updates
        const nextSelection =
          typeof newSelection === "function"
            ? newSelection(prev)
            : newSelection;

        // Never allow a single-frame selection
        if (nextSelection.size === 1) {
          return new Set();
        }
        return nextSelection;
      });
    },
    [],
  );

  const toggleSelection = React.useCallback(
    (id: string, e: React.MouseEvent) => {
      // If using modifier keys or we already have a selection
      safeSetSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    [safeSetSelectedIds],
  );

  const handleDragStart = React.useCallback((id: string) => {
    setIsDragging(true);
    setDragStartId(id);
    setDragEndId(id);
    // Don't set a single frame selection on drag start
  }, []);

  const handleDragMove = React.useCallback(
    (id: string) => {
      if (isDragging && dragStartId) {
        setDragEndId(id);

        const startIndex = currentScreenshots.findIndex(
          (s) => s.id === dragStartId,
        );
        const endIndex = currentScreenshots.findIndex((s) => s.id === id);

        if (startIndex !== -1 && endIndex !== -1) {
          const start = Math.min(startIndex, endIndex);
          const end = Math.max(startIndex, endIndex);

          // Only set selection if we have multiple frames
          if (start !== end) {
            const selectedFrames = currentScreenshots
              .slice(start, end + 1)
              .map((s) => s.id);
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
    setDragEndId(null);
  }, []);

  const selectAll = React.useCallback(() => {
    safeSetSelectedIds(new Set(currentScreenshots.map((s) => s.id)));
  }, [currentScreenshots, safeSetSelectedIds]);

  const clearSelection = React.useCallback(() => {
    safeSetSelectedIds(new Set());
  }, [safeSetSelectedIds]);

  React.useEffect(() => {
    const handleMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleDragEnd]);

  const isFrameInDragSelection = React.useCallback(
    (id: string) => {
      if (!isDragging || !dragStartId || !dragEndId) return false;

      const startIndex = currentScreenshots.findIndex(
        (s) => s.id === dragStartId,
      );
      const endIndex = currentScreenshots.findIndex((s) => s.id === dragEndId);
      const currentIndex = currentScreenshots.findIndex((s) => s.id === id);

      if (startIndex === -1 || endIndex === -1 || currentIndex === -1)
        return false;

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      return currentIndex >= start && currentIndex <= end;
    },
    [isDragging, dragStartId, dragEndId, currentScreenshots],
  );

  // Get the URL for the current selection
  const getSelectionUrl = React.useCallback(() => {
    if (selectedIds.size === 0) return null;

    // Get all selected frames in their original order
    const selectedFrames = currentScreenshots
      .filter((s) => selectedIds.has(s.id))
      .sort((a, b) => {
        const aIndex = currentScreenshots.findIndex((s) => s.id === a.id);
        const bIndex = currentScreenshots.findIndex((s) => s.id === b.id);
        return aIndex - bIndex;
      });

    if (selectedFrames.length === 0) return null;

    // Get the first and last frames
    const firstFrame = selectedFrames[0]!;
    const lastFrame = selectedFrames[selectedFrames.length - 1]!;

    // Combine all selected frames' text
    const combinedText = selectedFrames.map((s) => s.speech).join("\n");

    return `/caption/${firstFrame.id}?range=${lastFrame.id}&text=${encodeURIComponent(combinedText)}`;
  }, [selectedIds, currentScreenshots]);

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="flex flex-col space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedIds.size} selected in sequence
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-8 px-2"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={selectAll}
                className="h-8"
              >
                Select All on Page
              </Button>
            </div>
          </div>
          {selectedIds.size > 0 && (
            <>
              <div className="text-sm text-muted-foreground">
                {currentScreenshots
                  .filter((s) => selectedIds.has(s.id))
                  .sort((a, b) => {
                    const aIndex = currentScreenshots.findIndex(
                      (s) => s.id === a.id,
                    );
                    const bIndex = currentScreenshots.findIndex(
                      (s) => s.id === b.id,
                    );
                    return aIndex - bIndex;
                  })
                  .map((s) => s.speech)
                  .join("\n")}
              </div>
              <Link
                href={getSelectionUrl() || ""}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Open combined caption
              </Link>
            </>
          )}
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {currentScreenshots.map((screenshot, index) => (
          <div key={screenshot.id}>
            <Link
              href={
                selectedIds.size > 0
                  ? getSelectionUrl() || `/caption/${screenshot.id}`
                  : `/caption/${screenshot.id}`
              }
            >
              <FrameCard
                screenshot={screenshot}
                priority={index < 6}
                isSelected={selectedIds.has(screenshot.id)}
                onSelect={(e: React.MouseEvent) => {
                  // Only handle selection if using modifier keys
                  if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    toggleSelection(screenshot.id, e);
                  }
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
            {screenshots.length > MAX_DISPLAYED_FRAMES && (
              <span className="ml-1 text-muted-foreground">
                (showing first {MAX_DISPLAYED_FRAMES})
              </span>
            )}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
