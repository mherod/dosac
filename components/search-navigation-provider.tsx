"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type React from "react";
import {
  areSearchResultsStale,
  buildSearchUrl,
  createSearchLocationKey,
  INITIAL_SEARCH_NAVIGATION_STATE,
  normalizeSearchQuery,
  reduceSearchNavigation,
} from "@/lib/search-sync";
import type {
  SearchNavigationActionType,
  SearchNavigationState,
  SearchUrlInput,
} from "@/lib/search-sync";

const SEARCH_ROUTE_DEBOUNCE_MS = 300;

interface ObservedSearchLocation {
  pathname: string;
  search: string;
  query: string;
}

interface IssuedSearchNavigation {
  generation: number;
  targetKey: string;
  query: string;
}

interface SearchNavigationContextValue {
  state: SearchNavigationState;
  resultsAreStale: boolean;
  observeLocation: (location: ObservedSearchLocation) => void;
  setSearchDraft: (query: string, filters: SearchUrlInput) => void;
  navigateSearch: (href: string, historyMode: "push" | "replace") => void;
  prepareSearchNavigation: (href: string) => void;
  beginResultNavigation: () => void;
}

const SearchNavigationContext =
  createContext<SearchNavigationContextValue | null>(null);

/**
 * Owns the search input, route generations, and result activation lifecycle.
 * @param props - Provider props.
 * @param props.children - Navigation and page content sharing the lifecycle.
 * @returns A shared search navigation provider.
 */
export function SearchNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const router = useRouter();
  const [state, setState] = useState<SearchNavigationState>(
    INITIAL_SEARCH_NAVIGATION_STATE,
  );
  const stateRef = useRef(state);
  const generationRef = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationRef = useRef<ObservedSearchLocation | null>(null);
  const issuedRef = useRef<IssuedSearchNavigation[]>([]);

  const applyAction = useCallback(
    (action: SearchNavigationActionType): void => {
      const nextState = reduceSearchNavigation(stateRef.current, action);
      stateRef.current = nextState;
      setState(nextState);
    },
    [],
  );

  const nextGeneration = useCallback((): number => {
    generationRef.current += 1;
    return generationRef.current;
  }, []);

  const clearDebounce = useCallback((): void => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const recordIssuedNavigation = useCallback(
    (href: string, generation: number): IssuedSearchNavigation => {
      const target = new URL(href, "http://search.local");
      const issued = {
        generation,
        targetKey: createSearchLocationKey(target.pathname, target.search),
        query: target.searchParams.get("q") ?? "",
      };
      issuedRef.current.push(issued);
      return issued;
    },
    [],
  );

  const prepareSearchNavigation = useCallback(
    (href: string): void => {
      clearDebounce();
      const generation = nextGeneration();
      const issued = recordIssuedNavigation(href, generation);
      applyAction({
        type: "search-navigation-started",
        query: issued.query,
        generation,
      });

      const currentLocation = locationRef.current;
      const currentKey = currentLocation
        ? createSearchLocationKey(
            currentLocation.pathname,
            currentLocation.search,
          )
        : null;
      if (issued.targetKey === currentKey) {
        issuedRef.current = issuedRef.current.filter(
          (navigation) => navigation.generation !== generation,
        );
        applyAction({
          type: "search-location-committed",
          query: issued.query,
          generation,
        });
      }
    },
    [applyAction, clearDebounce, nextGeneration, recordIssuedNavigation],
  );

  const navigateSearch = useCallback(
    (href: string, historyMode: "push" | "replace"): void => {
      prepareSearchNavigation(href);
      router[historyMode](href, { scroll: false });
    },
    [prepareSearchNavigation, router],
  );

  const setSearchDraft = useCallback(
    (query: string, filters: SearchUrlInput): void => {
      clearDebounce();
      const generation = nextGeneration();
      applyAction({ type: "draft-changed", query, generation });

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        const currentLocation = locationRef.current;
        const normalizedQuery = normalizeSearchQuery(query);

        if (currentLocation?.pathname !== "/search" && normalizedQuery === "") {
          applyAction({
            type: "external-location-committed",
            query: currentLocation?.query ?? "",
            generation,
          });
          return;
        }

        const href = buildSearchUrl({ ...filters, query });
        const target = new URL(href, "http://search.local");
        const targetKey = createSearchLocationKey(
          target.pathname,
          target.search,
        );
        const currentKey = currentLocation
          ? createSearchLocationKey(
              currentLocation.pathname,
              currentLocation.search,
            )
          : null;

        if (targetKey === currentKey) {
          applyAction({
            type: "search-location-committed",
            query: normalizedQuery,
            generation,
          });
          return;
        }

        recordIssuedNavigation(href, generation);
        applyAction({
          type: "search-navigation-started",
          query,
          generation,
        });
        router.replace(href, { scroll: false });
      }, SEARCH_ROUTE_DEBOUNCE_MS);
    },
    [
      applyAction,
      clearDebounce,
      nextGeneration,
      recordIssuedNavigation,
      router,
    ],
  );

  const observeLocation = useCallback(
    (location: ObservedSearchLocation): void => {
      const locationKey = createSearchLocationKey(
        location.pathname,
        location.search,
      );
      const previousLocation = locationRef.current;
      const previousKey = previousLocation
        ? createSearchLocationKey(
            previousLocation.pathname,
            previousLocation.search,
          )
        : null;

      locationRef.current = location;
      if (
        locationKey === previousKey &&
        stateRef.current.status !== "initializing"
      ) {
        return;
      }

      let matchingIndex = -1;
      for (let index = issuedRef.current.length - 1; index >= 0; index -= 1) {
        if (issuedRef.current[index]?.targetKey === locationKey) {
          matchingIndex = index;
          break;
        }
      }

      const matchingNavigation = issuedRef.current[matchingIndex];
      if (matchingNavigation) {
        issuedRef.current = issuedRef.current.filter(
          (issued) => issued.generation > matchingNavigation.generation,
        );
        applyAction({
          type: "search-location-committed",
          query: location.query,
          generation: matchingNavigation.generation,
        });
        return;
      }

      clearDebounce();
      issuedRef.current = [];
      const generation = nextGeneration();
      applyAction({
        type: "external-location-committed",
        query: location.query,
        generation,
      });
    },
    [applyAction, clearDebounce, nextGeneration],
  );

  const beginResultNavigation = useCallback((): void => {
    clearDebounce();
    issuedRef.current = [];
    applyAction({
      type: "result-navigation-started",
      generation: nextGeneration(),
    });
  }, [applyAction, clearDebounce, nextGeneration]);

  useEffect(
    () => () => {
      clearDebounce();
    },
    [clearDebounce],
  );

  const value = useMemo<SearchNavigationContextValue>(
    () => ({
      state,
      resultsAreStale: areSearchResultsStale(state),
      observeLocation,
      setSearchDraft,
      navigateSearch,
      prepareSearchNavigation,
      beginResultNavigation,
    }),
    [
      beginResultNavigation,
      navigateSearch,
      observeLocation,
      prepareSearchNavigation,
      setSearchDraft,
      state,
    ],
  );

  return (
    <SearchNavigationContext.Provider value={value}>
      {children}
    </SearchNavigationContext.Provider>
  );
}

/**
 * Access the shared search navigation lifecycle.
 * @returns The search navigation context.
 */
export function useSearchNavigation(): SearchNavigationContextValue {
  const context = useContext(SearchNavigationContext);
  if (!context) {
    throw new Error(
      "useSearchNavigation must be used within SearchNavigationProvider",
    );
  }
  return context;
}
