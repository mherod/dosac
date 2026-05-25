import {
  computeSearchRouteUpdate,
  shouldAdoptUrlQuery,
} from "@/lib/search-sync";

/**
 * Models the NavFilters local-state-authoritative search loop using the pure
 * decision helpers, so the #75 race (URL echoes reverting fast typing) can be
 * exercised without a DOM. Each keystroke updates local state immediately;
 * the debounce is modelled as "settle to the final value, then push once".
 */
function simulateTyping(
  keystrokes: string[],
  opts: { pathname: string; startUrlQuery?: string },
): {
  localQuery: string;
  urlQuery: string;
  pushes: string[];
  adoptedUrlAfterPush: boolean;
} {
  let localQuery = opts.startUrlQuery ?? "";
  let urlQuery = opts.startUrlQuery ?? "";
  const pushes: string[] = [];

  // Live input updates synchronously on every keystroke.
  for (const next of keystrokes) {
    localQuery = next;
  }

  // Debounce settles on the final value and pushes the route once.
  const debouncedQuery = localQuery;
  const href = computeSearchRouteUpdate({
    debouncedQuery,
    urlQuery,
    pathname: opts.pathname,
    filterQuery: {},
  });
  if (href) {
    pushes.push(href);
    urlQuery = localQuery.trim();
  }

  // The URL now echoes our push; the input sync must NOT adopt it.
  const adoptedUrlAfterPush = shouldAdoptUrlQuery(urlQuery, {
    localQuery,
    debouncedQuery,
  });

  return { localQuery, urlQuery, pushes, adoptedUrlAfterPush };
}

describe("computeSearchRouteUpdate", () => {
  it("pushes /search?q= once for a burst of fast typing", () => {
    const result = simulateTyping(["h", "he", "hel", "hell", "hello"], {
      pathname: "/",
    });

    // Input keeps every character — no drop, reorder, or revert.
    expect(result.localQuery).toBe("hello");
    // URL updates after the debounce, not per keystroke: exactly one push.
    expect(result.pushes).toEqual(["/search?q=hello"]);
    // Our own URL echo must not overwrite the live input.
    expect(result.adoptedUrlAfterPush).toBe(false);
  });

  it("does not push when the URL already matches the query", () => {
    expect(
      computeSearchRouteUpdate({
        debouncedQuery: "malcolm",
        urlQuery: "malcolm",
        pathname: "/search",
        filterQuery: {},
      }),
    ).toBeNull();
  });

  it("ignores whitespace-only differences", () => {
    expect(
      computeSearchRouteUpdate({
        debouncedQuery: "  malcolm  ",
        urlQuery: "malcolm",
        pathname: "/search",
        filterQuery: {},
      }),
    ).toBeNull();
  });

  it("clears to /search (no q) when emptied on the search route", () => {
    expect(
      computeSearchRouteUpdate({
        debouncedQuery: "",
        urlQuery: "malcolm",
        pathname: "/search",
        filterQuery: {},
      }),
    ).toBe("/search");
  });

  it("is a no-op when the box is cleared on a non-search route", () => {
    expect(
      computeSearchRouteUpdate({
        debouncedQuery: "",
        urlQuery: "",
        pathname: "/",
        filterQuery: {},
      }),
    ).toBeNull();
  });

  it("preserves season/episode filters on the pushed route", () => {
    expect(
      computeSearchRouteUpdate({
        debouncedQuery: "omnishambles",
        urlQuery: "",
        pathname: "/search",
        filterQuery: { season: "3", episode: "1" },
      }),
    ).toBe("/search?q=omnishambles&season=3&episode=1");
  });
});

describe("shouldAdoptUrlQuery", () => {
  it("adopts the URL for external navigation (back/forward, links)", () => {
    // URL differs from both live and debounced values → external nav → adopt.
    expect(
      shouldAdoptUrlQuery("hi", { localQuery: "hello", debouncedQuery: "hello" }),
    ).toBe(true);
  });

  it("ignores a URL echo of our own debounced push", () => {
    expect(
      shouldAdoptUrlQuery("hello", {
        localQuery: "hello",
        debouncedQuery: "hello",
      }),
    ).toBe(false);
  });

  it("does not revert characters typed after a stale debounced push", () => {
    // We pushed "hello" (now the URL) but the user has typed on to "hellox".
    expect(
      shouldAdoptUrlQuery("hello", {
        localQuery: "hellox",
        debouncedQuery: "hello",
      }),
    ).toBe(false);
  });
});
