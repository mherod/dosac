import { withQuery } from "ufo";

/**
 * Inputs for {@link computeSearchRouteUpdate}.
 */
export interface SearchRouteInput {
  /** The debounced value of the live search input. */
  debouncedQuery: string;
  /** The current `q` search param from the URL. */
  urlQuery: string;
  /** The current pathname (e.g. `/search`, `/`). */
  pathname: string;
  /** Extra filter params (season/episode) to preserve on the pushed route. */
  filterQuery: Record<string, string | undefined>;
}

/**
 * Decide whether a debounced typing change should push a new search route.
 *
 * Returns the href to push, or `null` when no navigation is needed: the URL
 * already reflects the query, or the box was cleared on a non-search route
 * (a no-op). Route updates are a debounced side effect of typing — the live
 * input stays locally controlled, so this never feeds back into input state.
 * @param input - The current debounced query, URL query, pathname, and filters.
 * @returns The `/search` href to push, or `null` to push nothing.
 */
export function computeSearchRouteUpdate({
  debouncedQuery,
  urlQuery,
  pathname,
  filterQuery,
}: SearchRouteInput): string | null {
  const trimmed = debouncedQuery.trim();

  // Already reflected in the URL — nothing to push.
  if (trimmed === urlQuery.trim()) return null;

  // Clearing the box on a non-search route should not spawn a /search nav.
  if (pathname !== "/search" && trimmed === "") return null;

  const query: Record<string, string | undefined> = {
    ...(trimmed ? { q: trimmed } : {}),
    ...filterQuery,
  };

  return withQuery("/search", query);
}

/**
 * The component's live query state, used to classify a URL change.
 */
export interface LiveQueryState {
  /** The live, authoritative input value. */
  localQuery: string;
  /** The debounced input value (what is/was being pushed to the URL). */
  debouncedQuery: string;
}

/**
 * Decide whether the live input should adopt the URL's `q` value.
 *
 * Only external navigations (links, back/forward) should overwrite the input.
 * A URL change is treated as our own typing loop — and ignored — when it equals
 * either the live input or the debounced value; adopting it would revert
 * characters typed after a stale debounced push fired (the #75 race). Reading
 * only state values keeps this callable during render without touching a ref.
 * @param urlQuery - The current `q` search param from the URL.
 * @param live - The current local and debounced query values.
 * @returns `true` when the input should be set from the URL, else `false`.
 */
export function shouldAdoptUrlQuery(
  urlQuery: string,
  live: LiveQueryState,
): boolean {
  return (
    urlQuery !== live.localQuery.trim() &&
    urlQuery !== live.debouncedQuery.trim()
  );
}
