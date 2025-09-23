import { NextRequest, NextResponse } from "next/server";
import searchIndex from "@/public/search-index.json";

// Use Edge Runtime for better performance
export const runtime = "edge";

// Cache configuration
export const revalidate = 3600; // Cache for 1 hour

interface SearchResult {
  episode: string;
  timestamp: string;
  text: string;
  score: number;
}

/**
 * Edge-optimized search API endpoint
 * Performs full-text search across all dialogue
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 },
      );
    }

    // Perform case-insensitive search
    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search through the index
    for (const [episode, entries] of Object.entries(searchIndex)) {
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          const text = entry.text?.toLowerCase() || "";
          if (text.includes(searchTerm)) {
            // Calculate relevance score based on position and frequency
            const score = calculateScore(text, searchTerm);
            results.push({
              episode,
              timestamp: entry.timestamp,
              text: entry.text,
              score,
            });
          }
        }
      }
    }

    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    // Add cache headers
    const response = NextResponse.json({
      results: paginatedResults,
      total: results.length,
      limit,
      offset,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );

    return response;
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Calculate relevance score for search results
 */
function calculateScore(text: string, searchTerm: string): number {
  let score = 0;

  // Exact match bonus
  if (text === searchTerm) {
    score += 100;
  }

  // Start of text bonus
  if (text.startsWith(searchTerm)) {
    score += 50;
  }

  // Word boundary match bonus
  const wordBoundaryRegex = new RegExp(`\\b${searchTerm}\\b`, "gi");
  const wordMatches = text.match(wordBoundaryRegex);
  if (wordMatches) {
    score += wordMatches.length * 20;
  }

  // Frequency bonus
  const allMatches = text.split(searchTerm).length - 1;
  score += allMatches * 10;

  // Length penalty (prefer shorter, more relevant results)
  score -= text.length / 100;

  return Math.max(score, 0);
}
