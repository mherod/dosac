"use client";

import { useState, useEffect } from "react";
import { Building2, Moon, Sun, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Frame } from "@/lib/frames";
import React from "react";
import { MainNav } from "@/components/main-nav";

interface SearchResult {
  episodeId: string;
  timestamp: string;
  text: string;
  startTime: number;
}

interface HomePageProps {
  screenshots: Frame[];
}

function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the search query from URL parameters
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);

  // Load the search index
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data) => setSearchIndex(data))
      .catch((error) => console.error("Failed to load search index:", error));
  }, []);

  // Update URL when debounced query changes
  useEffect(() => {
    const trimmedValue = debouncedQuery.trim();
    router.push(
      trimmedValue
        ? `${pathname}?${createQueryString("q", trimmedValue)}`
        : pathname,
      { scroll: false },
    );
  }, [debouncedQuery, pathname, router]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery && searchIndex.length > 0) {
      setIsLoading(true);
      try {
        const results = searchIndex.filter((item) =>
          item.text.toLowerCase().includes(debouncedQuery.toLowerCase()),
        );
        setSearchResults(results.slice(0, 50));
        setTotalResults(results.length);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setTotalResults(0);
    }
  }, [debouncedQuery, searchIndex]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search the screenshot database..."
        className="h-10 pl-9 pr-24"
      />
      {searchQuery && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-20 top-1/2 h-8 -translate-y-1/2 px-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <Button
        type="submit"
        size="sm"
        disabled={isLoading}
        className="absolute right-2 top-1/2 h-8 -translate-y-1/2"
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function HomePage({ screenshots }: HomePageProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <MainNav />

      <div className="border-b bg-muted/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                DoSaC Generator
              </h1>
              <p className="text-lg text-muted-foreground">
                Internal meme creation and sharing service
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4 shadow-sm">
              <SearchForm />
              <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border bg-muted px-2 py-0.5">
                  BETA
                </span>
                <span>
                  This is a new service – your feedback will help us improve it
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Screenshots</h2>
          <span className="text-sm text-muted-foreground">
            Showing {screenshots.length} results
          </span>
        </div>
        <div className="rounded-lg border bg-background shadow-sm">
          <ScreenshotGrid screenshots={screenshots} />
        </div>
      </div>
    </div>
  );
}
