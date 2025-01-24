"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import type { Frame } from "@/lib/frames";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { MainNav } from "@/components/main-nav";

interface HomePageProps {
  screenshots: Frame[];
}

function SearchWrapper({ screenshots }: { screenshots: Frame[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router, searchParams]);

  const filteredScreenshots = React.useMemo(() => {
    if (!debouncedQuery) return screenshots;
    const search = debouncedQuery.toLowerCase();
    return screenshots.filter((screenshot) =>
      screenshot.speech.toLowerCase().includes(search),
    );
  }, [screenshots, debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="search"
          placeholder="Search quotes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <ScreenshotGrid screenshots={filteredScreenshots} />
    </div>
  );
}

export function HomePage({ screenshots }: HomePageProps) {
  return (
    <>
      <MainNav />
      <Suspense>
        <SearchWrapper screenshots={screenshots} />
      </Suspense>
    </>
  );
}
