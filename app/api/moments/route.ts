import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getFrameIndex } from "@/lib/frames.server";

/**
 * Represents a ranked moment from the show with its metadata
 */
interface RankedMoment {
  /** Unique identifier for the moment */
  id: string;
  /** Episode identifier (e.g., "s01e01") */
  episode: string;
  /** Timestamp within the episode (format: "MM:SS.mmm") */
  timestamp: string;
  /** The quote or dialogue from this moment */
  quote: string;
  /** Additional context about the scene or moment */
  context: string;
  /** Numerical ranking of the moment's significance/popularity */
  rank: number;
}

/**
 * Converts a timestamp string to seconds
 *
 * Handles both "MM:SS.mmm" and raw seconds formats
 *
 * @param timestamp - The timestamp to convert
 * @returns The timestamp converted to seconds
 *
 * @example
 * ```ts
 * timestampToSeconds("01:23.456") // returns 83.456
 * timestampToSeconds("45.789") // returns 45.789
 * ```
 */
function timestampToSeconds(timestamp: string): number {
  // Handle both "MM:SS.mmm" and raw seconds formats
  const parts = timestamp.split(".");
  const time = parts[0] || "0";
  const ms = parseInt(parts[1] || "000", 10) / 1000;

  if (time.includes(":")) {
    const [minutesStr = "0", secondsStr = "0"] = time.split(":");
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    return minutes * 60 + seconds + ms;
  } else {
    return parseInt(time, 10) + ms;
  }
}

/**
 * API route handler for fetching ranked moments with their matching frames
 *
 * Reads ranked moments from frame-rank.json and matches each moment with
 * its closest corresponding frame from the frames index. Moments are matched
 * to frames from the same episode within a 2-second window.
 *
 * @returns NextResponse containing an array of matched moments and frames
 *
 * @example
 * ```ts
 * // Success response
 * NextResponse.json([
 *   {
 *     moment: {
 *       id: "moment1",
 *       episode: "s01e01",
 *       timestamp: "12:34.567",
 *       quote: "Example quote",
 *       context: "Scene context",
 *       rank: 1
 *     },
 *     frame: {
 *       id: "s01e01-12-34.567",
 *       caption: "Example caption",
 *       ...frameData
 *     }
 *   },
 *   // ... more matched moments
 * ])
 *
 * // Error response
 * NextResponse.json(
 *   { error: "Failed to load ranked moments" },
 *   { status: 500 }
 * )
 * ```
 */
export async function GET() {
  try {
    // Read the ranked moments from frame-rank.json
    const filePath = path.join(process.cwd(), "public", "frame-rank.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContents) as { rankedMoments: RankedMoment[] };

    // Get all available frames
    const frames = await getFrameIndex();

    // Match each ranked moment to its corresponding frame
    const matchedMoments = data.rankedMoments
      .map((moment) => {
        const momentSeconds = timestampToSeconds(moment.timestamp);

        // Find frames from the same episode within 2 seconds of the timestamp
        const matches = frames
          .filter((frame) => {
            if (frame.episode !== moment.episode) return false;
            const frameSeconds = timestampToSeconds(
              frame.timestamp.replace("-", ":"),
            );
            return Math.abs(momentSeconds - frameSeconds) < 2;
          })
          .sort((a, b) => {
            const aSeconds = timestampToSeconds(a.timestamp.replace("-", ":"));
            const bSeconds = timestampToSeconds(b.timestamp.replace("-", ":"));
            return (
              Math.abs(momentSeconds - aSeconds) -
              Math.abs(momentSeconds - bSeconds)
            );
          });

        const match = matches[0];
        if (!match) {
          console.warn(
            `No frame found for moment: ${moment.episode} at ${moment.timestamp}`,
          );
          return null;
        }

        return {
          moment,
          frame: match,
        };
      })
      .filter(Boolean);

    return NextResponse.json(matchedMoments, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error loading ranked moments:", error);
    return NextResponse.json(
      { error: "Failed to load ranked moments" },
      { status: 500 },
    );
  }
}
