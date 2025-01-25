"use client";

import { FrameCard } from "@/components/frame-card";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export function ScreenshotGrid({ screenshots }: ScreenshotGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartId, setDragStartId] = React.useState<string | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalScreenshots = screenshots.length;
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

  const safeSetSelectedIds = React.useCallback(
    (newIds: Set<string>) => {
      setSelectedIds(new Set([...newIds]));
    },
    [setSelectedIds],
  );

  const handleDragStart = React.useCallback((id: string) => {
    setIsDragging(true);
    setDragStartId(id);
    // Don't set a single frame selection on drag start
  }, []);

  const handleDragMove = React.useCallback(
    (id: string) => {
      if (isDragging && dragStartId) {
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
  }, []);

  React.useEffect(() => {
    const handleMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleDragEnd]);

  function getScreenshotUrl(id: string) {
    if (selectedIds.size === 0) {
      return `/caption/${id}`;
    }

    const selectedFrames = currentScreenshots
      .filter((s) => selectedIds.has(s.id))
      .sort((a, b) => {
        const aIndex = currentScreenshots.findIndex((s) => s.id === a.id);
        const bIndex = currentScreenshots.findIndex((s) => s.id === b.id);
        return aIndex - bIndex;
      });

    // Add the clicked frame if it's not already selected
    if (!selectedIds.has(id)) {
      selectedFrames.push(currentScreenshots.find((s) => s.id === id)!);
    }

    // Limit to 4 frames total
    const frames = selectedFrames.slice(0, 4);
    const combinedText = frames.map((s) => s.speech).join("\n");

    // Use path for first two IDs and compare query param for additional IDs
    const [first, second, ...rest] = frames.map((f) => f.id);
    const basePath = second ? `${first}/${second}` : first;
    const compareIds = rest.length > 0 ? `?compare=${rest.join(",")}` : "";
    const textParam = combinedText
      ? `${compareIds ? "&" : "?"}text=${encodeURIComponent(combinedText)}`
      : "";

    return `/caption/${basePath}${compareIds}${textParam}`;
  }

  return (
    <div className="space-y-4">
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {currentScreenshots.map((screenshot, index) => (
          <div key={screenshot.id}>
            <Link href={getScreenshotUrl(screenshot.id)}>
              <FrameCard
                screenshot={screenshot}
                priority={index < 6}
                isSelected={selectedIds.has(screenshot.id)}
                onSelect={(e: React.MouseEvent) => {
                  // Only handle selection if using modifier keys
                  if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    safeSetSelectedIds(new Set([screenshot.id]));
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
