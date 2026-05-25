/**
 * Simple in-memory rate limiter for API routes
 * Uses a sliding window counter per IP address
 */

/** Rate limit configuration */
interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/** Tracks request count and window start per IP */
interface RateLimitEntry {
  /** Number of requests in the current window */
  count: number;
  /** Timestamp when the window started */
  resetTime: number;
}

const ipRequestMap = new Map<string, RateLimitEntry>();

/**
 * Creates a rate limiter with the given configuration
 * @param config - Rate limit settings
 * @returns A function that checks whether a request should be allowed
 */
export function createRateLimit(
  config: RateLimitConfig,
): (request: Request) => { limited: boolean; remaining: number } {
  const { limit, windowMs } = config;
  // Track the last sweep so we evict expired entries at most once per
  // window — without this the map grows unbounded with one-off IPs.
  let lastSweep = 0;

  return (request: Request) => {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const now = Date.now();

    if (now - lastSweep >= windowMs) {
      for (const [key, value] of ipRequestMap) {
        if (now >= value.resetTime) {
          ipRequestMap.delete(key);
        }
      }
      lastSweep = now;
    }

    const entry = ipRequestMap.get(ip);

    if (!entry || now >= entry.resetTime) {
      ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
      return { limited: false, remaining: limit - 1 };
    }

    entry.count++;

    if (entry.count > limit) {
      return { limited: true, remaining: 0 };
    }

    return { limited: false, remaining: limit - entry.count };
  };
}

/**
 * Default rate limiter: 60 requests per minute per IP
 */
export const apiRateLimit = createRateLimit({
  limit: 60,
  windowMs: 60_000,
});
