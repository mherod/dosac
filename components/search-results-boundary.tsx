"use client";

import type React from "react";
import { useSearchNavigation } from "@/components/search-navigation-provider";
import { cn } from "@/lib/utils";

/**
 * Locks server-rendered search results while their URL generation is stale.
 * @param props - Boundary props.
 * @param props.children - Search description, cards, and pagination.
 * @returns An accessible result lifecycle boundary.
 */
export function SearchResultsBoundary({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const {
    state,
    resultsAreStale,
    prepareSearchNavigation,
    beginResultNavigation,
  } = useSearchNavigation();

  const handleClickCapture = (event: React.MouseEvent<HTMLElement>): void => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const anchor = event.target.closest("a[href]");
    const rawHref = anchor?.getAttribute("href");
    if (!rawHref) return;

    const target = new URL(rawHref, window.location.href);
    if (target.origin !== window.location.origin) return;

    if (target.pathname === "/search") {
      prepareSearchNavigation(`${target.pathname}${target.search}`);
      return;
    }

    if (target.pathname.startsWith("/caption/")) {
      beginResultNavigation();
    }
  };

  return (
    <section
      aria-busy={resultsAreStale}
      data-search-results-state={state.status}
      onClickCapture={handleClickCapture}
      className="relative"
    >
      {resultsAreStale && state.status !== "initializing" ? (
        <p
          role="status"
          className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-900"
        >
          Updating search results…
        </p>
      ) : null}
      <div
        inert={resultsAreStale}
        className={cn(
          "space-y-6 transition-opacity duration-150",
          resultsAreStale && "pointer-events-none opacity-50",
        )}
      >
        {children}
      </div>
    </section>
  );
}
