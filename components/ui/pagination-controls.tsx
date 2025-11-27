"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type React from "react";
import { withQuery } from "ufo";
import { Button } from "@/components/ui/button";

/**
 * Props for the PaginationControls component
 */
interface PaginationControlsProps {
  /** The current active page number (1-indexed) */
  currentPage: number;
  /** The total number of pages available */
  totalPages: number;
}

/**
 * A reusable pagination control component for navigating between pages
 * Preserves existing query parameters while updating the page number
 *
 * Features:
 * - Previous/Next navigation buttons
 * - Disabled states for first/last pages
 * - Current page indicator
 * - Automatic query parameter preservation
 * - Clean URLs (removes page=1 from URL)
 *
 * @param props - The component props
 * @param props.currentPage - The current active page number (1-indexed)
 * @param props.totalPages - The total number of pages available
 * @returns A pagination control component with previous/next buttons and page indicator
 *
 * @example
 * ```tsx
 * <PaginationControls currentPage={2} totalPages={5} />
 * ```
 *
 * @example
 * With URL: `/search?q=test&season=1&page=2`
 * Clicking "Previous" navigates to: `/search?q=test&season=1`
 * Clicking "Next" navigates to: `/search?q=test&season=1&page=3`
 */
export function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps): React.ReactElement {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  /**
   * Builds a URL for a specific page number while preserving existing query parameters
   * Removes the page parameter if navigating to page 1 (cleaner URLs)
   * @param page - The target page number (1-indexed)
   * @returns The URL string with updated page parameter
   */
  const buildPageUrl = (page: number): string => {
    const currentQuery = Object.fromEntries(searchParams.entries());
    const query: Record<string, string | undefined> = {
      ...currentQuery,
      page: page === 1 ? undefined : page.toString(),
    };
    return withQuery(pathname, query);
  };

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage === 1 ? (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildPageUrl(prevPage)} prefetch={true} scroll={false}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage === totalPages ? (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildPageUrl(nextPage)} prefetch={true} scroll={false}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
