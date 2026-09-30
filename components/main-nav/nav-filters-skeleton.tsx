import type React from "react";

/**
 * Skeleton placeholder for NavFilters component during loading/suspense
 * Matches the layout and structure of NavFilters to prevent layout shift
 * @returns A loading skeleton that mimics the NavFilters component
 */
export function NavFiltersSkeleton(): React.ReactElement {
  return (
    <div
      className="border-t border-[#ffffff1f] bg-[#0b0c0c]"
      aria-busy="true"
      aria-label="Loading navigation filters"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Series select skeleton */}
            <div className="min-w-0 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Season dropdown skeleton */}
                <div
                  className="h-11 w-[100px] animate-pulse rounded-md bg-white/10 motion-reduce:animate-none"
                  aria-hidden="true"
                />
                {/* Episode dropdown skeleton */}
                <div
                  className="h-11 w-[120px] animate-pulse rounded-md bg-white/10 motion-reduce:animate-none"
                  aria-hidden="true"
                />
              </div>
            </div>
            {/* Search bar skeleton */}
            <div className="min-w-0 flex-1">
              <div
                className="h-11 w-full animate-pulse rounded-md bg-white/10 motion-reduce:animate-none"
                aria-hidden="true"
              />
            </div>
          </div>
          {/* Character badges skeleton */}
          <div className="min-w-0 shrink-0">
            <div className="flex flex-wrap gap-1 sm:gap-2" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-11 animate-pulse rounded-full border border-white/30 bg-white/10 motion-reduce:animate-none"
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
