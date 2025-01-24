export interface Frame {
  id: string;
  imageUrl: string;
  blankImageUrl: string;
  timestamp: string;
  subtitle: string;
  speech: string;
  episode: string;
  character: string;
}

export interface ParsedFrameId {
  season: string;
  timestamp: string;
}

export class InvalidFrameIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFrameIdError";
  }
}

export function formatTimestamp(timestamp: string): string {
  // Extract the start time from "00:03.120 --> 00:04.960"
  const parts = timestamp.split("-->");
  if (parts.length === 0) {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  const startTime = parts[0]?.trim();
  if (!startTime) {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  // Convert "00:03.120" to "00-03.120" to match directory format
  return startTime.replace(/:/g, "-");
}

export function validateFrameId(id: string): ParsedFrameId {
  const [season, ...timestampParts] = id.split("-");
  const timestamp = timestampParts.join("-");

  if (!season || !timestamp) {
    throw new InvalidFrameIdError(
      `Invalid URL format for ID '${id}'. Expected 'season-timestamp' (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^s\d{2}e\d{2}$/.test(season)) {
    throw new InvalidFrameIdError(
      `Invalid season format '${season}' in URL. Expected format: s01e01 (e.g., s01e01-12-34.567)`,
    );
  }

  if (!/^\d{2}-\d{2}\.\d{3}$/.test(timestamp)) {
    throw new InvalidFrameIdError(
      `Invalid timestamp format '${timestamp}' in URL. Expected format: MM-SS.mmm (e.g., 12-34.567)`,
    );
  }

  return { season, timestamp };
}

export async function getFrameIndex(): Promise<Frame[]> {
  const response = await fetch("/api/frames/index", {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch frames");
  }
  return response.json();
}

export async function getFrameById(id: string): Promise<Frame> {
  const response = await fetch(`/api/frames/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch frame");
  }
  return response.json();
}
