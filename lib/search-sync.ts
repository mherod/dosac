import { parseQuery, withQuery } from "ufo";

/** Search navigation lifecycle states shared by the nav and result list. */
export type SearchNavigationStatusType =
  | "initializing"
  | "idle"
  | "pending"
  | "navigating";

/** State for the search navigation state machine. */
export interface SearchNavigationState {
  /** The value currently displayed in the search input. */
  draftQuery: string;
  /** The query represented by the currently rendered server results. */
  committedQuery: string;
  /** The newest user navigation generation. */
  activeGeneration: number;
  /** The generation represented by the rendered server results. */
  committedGeneration: number;
  /** The current navigation lifecycle state. */
  status: SearchNavigationStatusType;
}

/** Events accepted by the search navigation state machine. */
export type SearchNavigationActionType =
  | {
      type: "draft-changed";
      query: string;
      generation: number;
    }
  | {
      type: "search-navigation-started";
      query: string;
      generation: number;
    }
  | {
      type: "search-location-committed";
      query: string;
      generation: number;
    }
  | {
      type: "external-location-committed";
      query: string;
      generation: number;
    }
  | {
      type: "result-navigation-started";
      generation: number;
    };

/** Input used to build a canonical search URL. */
export interface SearchUrlInput {
  query?: string;
  season?: number | string;
  episode?: number | string;
  page?: number;
}

/** Initial state used until the navigation observes the browser location. */
export const INITIAL_SEARCH_NAVIGATION_STATE: SearchNavigationState = {
  draftQuery: "",
  committedQuery: "",
  activeGeneration: 0,
  committedGeneration: 0,
  status: "initializing",
};

/**
 * Normalize a query for comparisons while retaining the input's display value.
 * @param query - Search query to normalize.
 * @returns The trimmed query.
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim();
}

/**
 * Build a canonical search URL in a stable parameter order.
 * @param input - Search text, filters, and optional pagination.
 * @returns A canonical `/search` URL.
 */
export function buildSearchUrl(input: SearchUrlInput): string {
  const query = normalizeSearchQuery(input.query ?? "");
  const season = input.season?.toString();
  const episode = input.episode?.toString();

  return withQuery("/search", {
    ...(query && { q: query }),
    ...(season && { season }),
    ...(episode && { episode }),
    ...(input.page && input.page > 1 && { page: input.page.toString() }),
  });
}

/**
 * Produce a stable key for an observed or issued browser location.
 * @param pathname - Browser pathname.
 * @param search - Browser search string, with or without a leading question.
 * @returns A canonical pathname and sorted query string.
 */
export function createSearchLocationKey(
  pathname: string,
  search: string,
): string {
  const params = parseQuery(search);
  const sortedParams = Object.fromEntries(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right)),
  );
  return withQuery(pathname, sortedParams);
}

/**
 * Advance the search navigation state machine.
 *
 * A route commit only settles the active navigation when its explicit
 * generation matches. Older route responses may update the committed result
 * identity, but they cannot unlock those results for a newer draft.
 * @param state - Current search navigation state.
 * @param action - Navigation event to apply.
 * @returns The next immutable state.
 */
export function reduceSearchNavigation(
  state: SearchNavigationState,
  action: SearchNavigationActionType,
): SearchNavigationState {
  switch (action.type) {
    case "draft-changed":
    case "search-navigation-started":
      return {
        ...state,
        draftQuery: action.query,
        activeGeneration: action.generation,
        status: "pending",
      };
    case "search-location-committed": {
      const isActiveGeneration = action.generation === state.activeGeneration;

      return {
        ...state,
        committedQuery: action.query,
        committedGeneration: action.generation,
        status: isActiveGeneration ? "idle" : state.status,
      };
    }
    case "external-location-committed":
      return {
        draftQuery: action.query,
        committedQuery: action.query,
        activeGeneration: action.generation,
        committedGeneration: action.generation,
        status: "idle",
      };
    case "result-navigation-started":
      return {
        ...state,
        activeGeneration: action.generation,
        status: "navigating",
      };
  }
}

/**
 * Check whether rendered results are safe to activate.
 * @param state - Current search navigation state.
 * @returns Whether the server results are stale or navigation is in flight.
 */
export function areSearchResultsStale(state: SearchNavigationState): boolean {
  return (
    state.status !== "idle" ||
    normalizeSearchQuery(state.draftQuery) !==
      normalizeSearchQuery(state.committedQuery)
  );
}
