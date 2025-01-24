import { CaptionEditor } from "./caption-editor";
import fs from "fs";
import path from "path";

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <div className="text-sm text-muted-foreground">
        <p>If this error persists:</p>
        <ul className="list-disc text-left pl-4 mt-2">
          <li>Check the URL format is correct</li>
          <li>Try refreshing the page</li>
          <li>Return home and select a different frame</li>
        </ul>
      </div>
      <a href="/" className="text-primary hover:underline">
        Return to Home
      </a>
    </div>
  );
}

interface Screenshot {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
  character: string;
}

const validateId = (id: string): { season: string; timestamp: string } => {
  const [season, ...timestampParts] = id.split("-");
  const timestamp = timestampParts.join("-");

  if (!season || !timestamp) {
    throw new Error(
      `Invalid URL format for ID '${id}'. Expected 'season-timestamp' (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^s\d{2}e\d{2}$/.test(season)) {
    throw new Error(
      `Invalid season format '${season}' in URL. Expected format: s01e01 (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^\d{2}-\d{2}\.\d{3}$/.test(timestamp)) {
    throw new Error(
      `Invalid timestamp format '${timestamp}' in URL. Expected format: MM-SS.mmm (e.g., 12-34.567)`,
    );
  }

  return { season, timestamp };
};

async function getScreenshot(id: string): Promise<Screenshot> {
  try {
    const { season, timestamp } = validateId(id);
    const baseFramePath = `/frames/${season}/${timestamp}`;
    const imageUrl = `${baseFramePath}/frame.jpg`;
    const blankImageUrl = `${baseFramePath}/frame-blank.jpg`;

    // Read speech directly from file system during build
    const speechPath = path.join(
      process.cwd(),
      "public",
      season,
      timestamp,
      "speech.txt",
    );
    let speech = "";

    if (fs.existsSync(speechPath)) {
      speech = fs.readFileSync(speechPath, "utf-8").trim();
    }

    return {
      id,
      imageUrl,
      blankImageUrl,
      timestamp: `${season} - ${timestamp}`,
      subtitle: speech,
      speech,
      episode: season,
      character: "",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "An unexpected error occurred while loading the screenshot.",
    );
  }
}

export async function generateStaticParams() {
  const frames: { id: string }[] = [];
  const seasonsDir = path.join(process.cwd(), "public", "frames");

  // Read all seasons
  const seasons = fs.readdirSync(seasonsDir);

  for (const season of seasons) {
    const seasonDir = path.join(seasonsDir, season);
    if (!fs.statSync(seasonDir).isDirectory()) continue;

    // Read all timestamps in the season
    const timestamps = fs.readdirSync(seasonDir);

    for (const timestamp of timestamps) {
      const frameDir = path.join(seasonDir, timestamp);
      if (!fs.statSync(frameDir).isDirectory()) continue;

      frames.push({
        id: `${season}-${timestamp}`,
      });
    }
  }

  return frames;
}

export default async function CaptionPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const screenshot = await getScreenshot(params.id);
    return <CaptionEditor screenshot={screenshot} />;
  } catch (error) {
    return (
      <ErrorMessage
        message={
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        }
      />
    );
  }
}
