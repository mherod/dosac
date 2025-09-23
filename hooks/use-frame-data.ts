"use client";

import { use } from "react";
import type { Frame } from "@/lib/frames";

/**
 * Fetches frame data using React 19's use() hook
 * Enables concurrent rendering and automatic suspense integration
 */
let framePromise: Promise<Frame[]> | null = null;

/**
 * Creates or returns existing promise for frame data
 */
function getFramePromise(): Promise<Frame[]> {
  if (!framePromise) {
    framePromise = fetch("/api/frames/index")
      .then((res) => res.json())
      .catch((error) => {
        console.error("Failed to fetch frames:", error);
        return [];
      });
  }
  return framePromise;
}

/**
 * React 19 hook to fetch frame data with automatic suspense
 * @returns Array of frames
 */
export function useFrameData(): Frame[] {
  return use(getFramePromise());
}

/**
 * Prefetch frame data to warm the cache
 */
export function prefetchFrameData(): void {
  getFramePromise();
}
