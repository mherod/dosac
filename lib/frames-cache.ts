import "server-only";
import type { Frame } from "./frames";

/**
 * In-memory cache for frame data
 * This cache persists across requests in production builds
 */
let frameIndexCache: Frame[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour TTL

/**
 * Gets the frame index from cache or loads it
 * Uses both in-memory and Next.js cache layers
 */
export async function getCachedFrameIndex(): Promise<Frame[]> {
  // Check in-memory cache first
  if (frameIndexCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return frameIndexCache;
  }

  // Load frames directly without Next.js cache due to size limits (>2MB)
  // The in-memory cache is sufficient for performance
  const { getFrameIndex } = await import("./frames.server");

  const frames = await getFrameIndex();

  // Update in-memory cache
  frameIndexCache = frames;
  cacheTimestamp = Date.now();

  return frames;
}

/**
 * Clears the frame cache (useful for development or updates)
 */
export function clearFrameCache(): void {
  frameIndexCache = null;
  cacheTimestamp = 0;
}

/**
 * Preloads the frame index into cache
 * Useful for warming up the cache on server start
 */
export async function preloadFrameIndex(): Promise<void> {
  await getCachedFrameIndex();
}
