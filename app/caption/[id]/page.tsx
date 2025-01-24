import { CaptionEditor } from "./caption-editor";

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/frames`,
    );
    if (!response.ok) {
      throw new Error(
        "Unable to load screenshots. Please check your connection and try again.",
      );
    }

    const frames: Screenshot[] = await response.json();
    const screenshot = frames.find((frame) => frame.id === id);

    if (!screenshot) {
      throw new Error(
        `Screenshot not found: ${id}. This frame may have been removed or relocated.`,
      );
    }

    // Construct the correct image URLs based on our directory structure
    const baseFramePath = `/frames/${season}/${timestamp}`;
    const imageUrl = `${baseFramePath}/frame.jpg`;
    const blankImageUrl = `${baseFramePath}/frame-blank.jpg`;

    return {
      ...screenshot,
      imageUrl,
      blankImageUrl,
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
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/frames`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch frames");
    }
    const frames: Screenshot[] = await response.json();
    return frames.map((frame) => ({
      id: frame.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
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
