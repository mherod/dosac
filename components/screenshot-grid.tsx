"use client";

import { FrameCard } from "@/components/frame-card";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationControls } from "@/components/pagination-controls";
import React from "react";

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentScreenshots.map((screenshot, index) => (
          <FrameCard
            key={screenshot.id}
            screenshot={screenshot}
            priority={index < 6}
          />
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
