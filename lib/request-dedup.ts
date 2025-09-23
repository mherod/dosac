/**
 * Request deduplication utility to prevent duplicate API calls
 * Uses a cache to store in-flight requests and returns the same promise
 */

type RequestCache = Map<string, Promise<any>>;

const requestCache: RequestCache = new Map();
const CACHE_TTL = 5000; // 5 seconds TTL for deduplication

/**
 * Creates a deduped fetch function that prevents duplicate requests
 */
export function dedupedFetch<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string,
): Promise<T> {
  const key = cacheKey || `${url}-${JSON.stringify(options || {})}`;

  // Check if request is already in flight
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }

  // Create new request promise
  const requestPromise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      return (await res.json()) as T;
    } finally {
      // Clear from cache after TTL
      setTimeout(() => {
        requestCache.delete(key);
      }, CACHE_TTL);
    }
  })();

  // Store in cache
  requestCache.set(key, requestPromise);

  return requestPromise;
}

/**
 * Creates a deduped function that prevents duplicate calls
 */
export function createDedupedFunction<
  T extends (...args: any[]) => Promise<any>,
>(fn: T, getCacheKey?: (...args: Parameters<T>) => string): T {
  const cache = new Map<string, Promise<ReturnType<T>>>();

  return ((...args: Parameters<T>) => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = (async () => {
      try {
        return await fn(...args);
      } finally {
        // Clear from cache after TTL
        setTimeout(() => {
          cache.delete(key);
        }, CACHE_TTL);
      }
    })();

    cache.set(key, promise);
    return promise;
  }) as T;
}

/**
 * Batch multiple requests into a single call
 */
export class RequestBatcher<T> {
  private batch: Array<{
    key: string;
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchSize: number;
  private batchDelay: number;
  private processBatch: (keys: string[]) => Promise<Map<string, T>>;

  constructor(
    processBatch: (keys: string[]) => Promise<Map<string, T>>,
    options: { batchSize?: number; batchDelay?: number } = {},
  ) {
    this.processBatch = processBatch;
    this.batchSize = options.batchSize || 50;
    this.batchDelay = options.batchDelay || 10;
  }

  async get(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.batch.push({ key, resolve, reject });

      if (this.batch.length >= this.batchSize) {
        this.flush();
      } else if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.batch.length === 0) return;

    const currentBatch = this.batch;
    this.batch = [];

    try {
      const keys = currentBatch.map((item) => item.key);
      const results = await this.processBatch(keys);

      currentBatch.forEach(({ key, resolve, reject }) => {
        if (results.has(key)) {
          resolve(results.get(key)!);
        } else {
          reject(new Error(`No result for key: ${key}`));
        }
      });
    } catch (error) {
      currentBatch.forEach(({ reject }) => reject(error));
    }
  }
}
