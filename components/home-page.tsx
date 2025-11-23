import type React from "react";
import { FrameStrip } from "@/components/frame-strip";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import type { Frame } from "@/lib/frames";

/**
 * Pagination data interface for navigation controls
 */
interface PaginationData {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
}

/**
 * Active filters interface
 */
interface Filters {
  /** Selected season number */
  season?: number;
  /** Selected episode number */
  episode?: number;
  /** Search query string */
  query: string;
  /** Current page number */
  page: number;
}

/**
 * Props for the HomePage component
 */
interface HomePageProps {
  /** Array of screenshots to display on current page */
  screenshots: Frame[];
  /** Complete array of all screenshots for filtering */
  allScreenshots: Frame[];
  /** Array of ranked/featured moments to highlight */
  rankedMoments: Frame[];
  /** Current filter state */
  filters: Filters;
  /** Pagination metadata */
  paginationData: PaginationData;
}

/**
 * Server component for the home page layout and content
 * Displays screenshot grid with pagination, stats, and frame strip
 * @param props - The component props
 * @param props.screenshots - Screenshots to display on current page
 * @param props.allScreenshots - All screenshots for client-side operations
 * @param props.rankedMoments - Featured moments to highlight (shown when no filters active)
 * @param props.filters - Active filter state
 * @param props.paginationData - Pagination metadata and controls
 * @returns The complete home page content with grid and controls
 */
export function HomePage({
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
