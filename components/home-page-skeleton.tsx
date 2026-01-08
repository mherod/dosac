import type React from "react";
import { Card } from "@/components/ui/card";

/**
 * Skeleton placeholder for HomePage component during loading/suspense
 * Matches the layout and structure of HomePage to prevent layout shift
 * @returns A loading skeleton that mimics the HomePage component
 */
export function HomePageSkeleton(): React.ReactElement {
  return (
    <div
      className="container mx-auto px-4 py-8"
      aria-busy="true"
      aria-label="Loading content"
    >
      {/* Stats text skeleton */}
      <div className="mb-8">
        <div
          className="h-5 w-64 animate-pulse rounded bg-muted/50"
          aria-hidden="true"
        />
      </div>

      {/* Grid skeleton */}
      <div
        className="space-y-2 sm:space-y-4"
        role="list"
        aria-label="Loading frames"
      >
        <div className="grid grid-cols-1 gap-2 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0 lg:grid-cols-3">
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

      {/* Frame strip skeleton at the bottom */}
      <div className="mt-8" aria-hidden="true">
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted/30">
          <div className="absolute inset-0 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
