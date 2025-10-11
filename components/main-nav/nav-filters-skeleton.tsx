import type React from "react";

/**
 * Skeleton placeholder for NavFilters component during loading/suspense
 * Matches the layout and structure of NavFilters to prevent layout shift
 * @returns A loading skeleton that mimics the NavFilters component
 */
export function NavFiltersSkeleton(): React.ReactElement {
  return (
    <div className="border-t border-[#ffffff1f] bg-[#0b0c0c]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
          <div className="flex w-full min-w-0 flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center">
            {/* Series select skeleton */}
            <div className="min-w-0 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Season dropdown skeleton */}
                <div className="h-9 w-[100px] animate-pulse rounded-md bg-white/10" />
                {/* Episode dropdown skeleton */}
                <div className="h-9 w-[120px] animate-pulse rounded-md bg-white/10" />
              </div>
            </div>
            {/* Search bar skeleton */}
            <div className="min-w-0 flex-1 sm:flex-none">
              <div className="h-9 w-full animate-pulse rounded-md bg-white/10 sm:w-64" />
            </div>
          </div>
          {/* Character badges skeleton */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-12 animate-pulse rounded-full border-2 border-[#1d70b8] bg-white/10"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
