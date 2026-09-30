import type React from "react";
import { Card } from "@/components/ui/card";

/**
 * Skeleton placeholder for HomePage component during loading/suspense
 * Mirrors the standard 36-frame page beneath the persistent heading
 * @returns A loading skeleton that mimics the HomePage component
 */
export function HomePageSkeleton(): React.ReactElement {
  return (
    <div aria-busy="true" aria-label="Loading content">
      {/* Stats text skeleton */}
      <div className="mb-6 md:mb-8">
        <div
          className="h-5 w-64 animate-pulse rounded bg-muted/50"
          aria-hidden="true"
        />
      </div>

      {/* Grid skeleton */}
      <div
        className="space-y-4 md:space-y-6 lg:space-y-8"
        role="list"
        aria-label="Loading frames"
      >
        <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={`skeleton-${i}`} role="listitem" aria-hidden="true">
              <Card className="relative overflow-hidden bg-black/5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] dark:bg-white/5 dark:shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
                <div className="relative overflow-hidden rounded-lg">
                  {/* Image placeholder with correct aspect ratio */}
                  <div className="relative aspect-video w-full">
                    <div className="absolute inset-0 animate-pulse bg-muted/30" />
                  </div>

                  {/* Info chips positioned at the top */}
                  <div className="absolute left-2 right-2 top-2 flex flex-wrap gap-1.5">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-background/70 backdrop-blur-[2px]" />
                    <div className="h-5 w-14 animate-pulse rounded-full bg-background/70 backdrop-blur-[2px]" />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-4 flex h-10 items-center justify-center gap-3 md:mt-6 md:gap-4 lg:mt-8"
        aria-hidden="true"
      >
        <div className="h-10 w-10 animate-pulse rounded bg-muted/50" />
        <div className="h-5 w-32 animate-pulse rounded bg-muted/50" />
        <div className="h-10 w-10 animate-pulse rounded bg-muted/50" />
      </div>

      {/* Frame strip skeleton at the bottom */}
      <div className="mt-6 md:mt-8 lg:mt-10" aria-hidden="true">
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted/30">
          <div className="absolute inset-0 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
