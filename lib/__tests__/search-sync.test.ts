import {
  areSearchResultsStale,
  buildSearchUrl,
  createSearchLocationKey,
  INITIAL_SEARCH_NAVIGATION_STATE,
  reduceSearchNavigation,
} from "@/lib/search-sync";
import type { SearchNavigationState } from "@/lib/search-sync";

function commitExternalLocation(
  query: string,
  generation = 1,
): SearchNavigationState {
  return reduceSearchNavigation(INITIAL_SEARCH_NAVIGATION_STATE, {
    type: "external-location-committed",
    query,
    generation,
  });
}

describe("buildSearchUrl", () => {
  it("builds a stable search URL and preserves filters", () => {
    expect(
      buildSearchUrl({
        query: "  omnishambles  ",
        season: 3,
        episode: 1,
      }),
    ).toBe("/search?q=omnishambles&season=3&episode=1");
  });

  it("omits empty values and page one", () => {
    expect(buildSearchUrl({ query: "", page: 1 })).toBe("/search");
  });

  it("includes later pages", () => {
    expect(buildSearchUrl({ query: "malcolm", page: 2 })).toBe(
      "/search?q=malcolm&page=2",
    );
  });
});

describe("createSearchLocationKey", () => {
  it("matches equivalent locations regardless of parameter order", () => {
    expect(createSearchLocationKey("/search", "?season=2&q=malcolm")).toBe(
      createSearchLocationKey("/search", "?q=malcolm&season=2"),
    );
  });
});

describe("search navigation generations", () => {
  it("locks results from the first draft change", () => {
    const initial = commitExternalLocation("malcolm");
    const pending = reduceSearchNavigation(initial, {
      type: "draft-changed",
      query: "malcolm tucker",
      generation: 2,
    });

    expect(pending.status).toBe("pending");
    expect(pending.draftQuery).toBe("malcolm tucker");
    expect(pending.committedQuery).toBe("malcolm");
    expect(areSearchResultsStale(pending)).toBe(true);
  });

  it("does not unlock for an older delayed route response", () => {
    let state = commitExternalLocation("malcolm");
    state = reduceSearchNavigation(state, {
      type: "search-navigation-started",
      query: "malcolm tucker",
      generation: 2,
    });
    state = reduceSearchNavigation(state, {
      type: "draft-changed",
      query: "nicola",
      generation: 3,
    });
    state = reduceSearchNavigation(state, {
      type: "search-location-committed",
      query: "malcolm tucker",
      generation: 2,
    });

    expect(state.status).toBe("pending");
    expect(state.draftQuery).toBe("nicola");
    expect(state.committedQuery).toBe("malcolm tucker");
    expect(areSearchResultsStale(state)).toBe(true);
  });

  it("unlocks only when the active generation commits", () => {
    let state = commitExternalLocation("malcolm");
    state = reduceSearchNavigation(state, {
      type: "search-navigation-started",
      query: "malcolm tucker",
      generation: 2,
    });
    state = reduceSearchNavigation(state, {
      type: "search-location-committed",
      query: "malcolm tucker",
      generation: 2,
    });

    expect(state.status).toBe("idle");
    expect(state.committedGeneration).toBe(2);
    expect(areSearchResultsStale(state)).toBe(false);
  });

  it("keeps result navigation ahead of a superseded search commit", () => {
    let state = commitExternalLocation("malcolm");
    state = reduceSearchNavigation(state, {
      type: "search-navigation-started",
      query: "malcolm tucker",
      generation: 2,
    });
    state = reduceSearchNavigation(state, {
      type: "result-navigation-started",
      generation: 3,
    });
    state = reduceSearchNavigation(state, {
      type: "search-location-committed",
      query: "malcolm tucker",
      generation: 2,
    });

    expect(state.status).toBe("navigating");
    expect(state.activeGeneration).toBe(3);
    expect(areSearchResultsStale(state)).toBe(true);
  });

  it("adopts an external back or forward location as authoritative", () => {
    let state = commitExternalLocation("malcolm");
    state = reduceSearchNavigation(state, {
      type: "draft-changed",
      query: "nicola",
      generation: 2,
    });
    state = reduceSearchNavigation(state, {
      type: "external-location-committed",
      query: "peter",
      generation: 3,
    });

    expect(state).toEqual({
      draftQuery: "peter",
      committedQuery: "peter",
      activeGeneration: 3,
      committedGeneration: 3,
      status: "idle",
    });
  });
});
