"use client";

import { useState, useEffect } from "react";
import { Search, Building2, Moon, Sun, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScreenshotGrid } from "@/components/screenshot-grid";
import { useTheme } from "next-themes";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  episodeId: string;
  timestamp: string;
  text: string;
  startTime: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
}

function formatTimestamp(timestamp: string): string {
  // Extract the start time from "00:03.120 --> 00:04.960"
  const startTime = timestamp.split("-->")[0].trim();
  // Convert "00:03.120" to "00-03.120" to match directory format
  return startTime.replace(/:/g, "-");
}

export default function Home() {
  const { theme, setTheme } = useTheme();
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
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.100),transparent)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),transparent)]" />

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <a className="flex items-center space-x-2" href="/">
            <Building2 className="h-6 w-6" />
            <span className="font-bold">DoSaCGenerator</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-12">
            <h1 className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-6xl font-black tracking-tight text-transparent dark:from-white dark:via-gray-200 dark:to-gray-400 sm:text-7xl">
              DoSaC Generator
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="group relative mb-12">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
            <Input
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quote, character, or episode..."
              className="h-14 rounded-2xl border-2 pl-12 pr-32 text-lg shadow-sm transition-shadow focus-visible:shadow-md"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-24 top-1/2 h-10 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-6 shadow-sm transition-all hover:shadow-md"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>

          {searchResults.length > 0 && (
            <div className="text-sm text-muted-foreground mb-4">
              Showing {searchResults.length} of {totalResults} results
            </div>
          )}
        </div>

        <div className="mx-auto max-w-[90rem] rounded-3xl border bg-card/50 p-4 sm:p-6 shadow-sm backdrop-blur-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-[600px]">
              <div className="animate-pulse text-lg text-muted-foreground">
                Searching...
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <ScrollArea className="h-[600px] rounded-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((result, index) => {
                  const formattedTimestamp = formatTimestamp(result.timestamp);
                  const framePath = `/frames/${result.episodeId}/${formattedTimestamp}/frame.jpg`;

                  return (
                    <Link
                      key={`${result.episodeId}-${result.startTime}-${index}`}
                      href={`/caption/${result.episodeId}-${formattedTimestamp}`}
                    >
                      <Card className="overflow-hidden">
                        <div className="relative aspect-video">
                          <Image
                            src={framePath}
                            alt={result.text}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 6}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (!img.src.includes("-blank")) {
                                img.src = framePath.replace(
                                  "frame.jpg",
                                  "frame-blank.jpg",
                                );
                              }
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>{result.episodeId}</span>
                            <span>•</span>
                            <span>
                              {result.timestamp.split("-->")[0].trim()}
                            </span>
                          </div>
                          <p className="font-medium line-clamp-2">
                            {result.text}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <ScreenshotGrid />
          )}
        </div>
      </div>
    </div>
  );
}
