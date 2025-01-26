import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getFrameIndex } from "@/lib/frames.server";

interface RankedMoment {
  id: string;
  episode: string;
  timestamp: string;
  quote: string;
  context: string;
  rank: number;
}

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
