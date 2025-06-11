import type { Screenshot } from "./types";

/** A frame from an episode with associated metadata */
export type Frame = Screenshot;

/**
 * Represents a parsed frame identifier with its components
 */
export interface ParsedFrameId {
  /** The season identifier (e.g., "s01") */
  season: string;
  /** The episode identifier (e.g., "e01") */
  episode: string;
  /** The timestamp within the episode (e.g., "12-34.567") */
  timestamp: string;
}

/**
 * Represents a parsed episode identifier with numeric components
 */
export interface ParsedEpisodeId {
  /** The season number (1-based) */
  season: number;
  /** The episode number within the season (1-based) */
  episode: number;
}

/**
 * Error thrown when a frame ID format is invalid
 */
export class InvalidFrameIdError extends Error {
  /**
   * Creates a new InvalidFrameIdError
   * @param message - The error message describing the validation failure
   */
  constructor(message: string) {
    super(message);
    this.name = "InvalidFrameIdError";
  }
}

/**
 * Parses an episode identifier string into its numeric components
 * @param episodeId - The episode identifier in the format "s01e01"
 * @returns Object containing the parsed season and episode numbers
 * @throws {InvalidFrameIdError} If the episode ID format is invalid
 */
export function parseEpisodeId(
  episodeId: string | null | undefined,
): ParsedEpisodeId {
  if (!episodeId) {
    throw new InvalidFrameIdError("Episode ID cannot be null or undefined");
  }
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/);
  if (!match || !match[1] || !match[2]) {
    throw new InvalidFrameIdError(`Invalid episode ID format: ${episodeId}`);
  }
  return {
    season: Number.parseInt(match[1]),
    episode: Number.parseInt(match[2]),
  };
}

/**
 * Formats a timestamp string into the directory format used for frame storage
 * @param timestamp - The timestamp string in the format "00:03.120 --> 00:04.960"
 * @returns The formatted timestamp (e.g., "00-03.120")
 * @throws {Error} If the timestamp format is invalid
 */
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

/**
 * Validates and parses a frame identifier string
 * @param id - The frame identifier in the format "s01e01-12-34.567"
 * @returns Object containing the parsed season, episode, and timestamp
 * @throws {InvalidFrameIdError} If any part of the frame ID format is invalid
 */
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

  return { season, episode: season, timestamp };
}

/**
 * Fetches the index of all available frames
 * @returns Promise resolving to an array of Frame objects
 * @throws {Error} If the fetch request fails
 */
export async function getFrameIndex(): Promise<Frame[]> {
  const response = await fetch("/api/frames/index", {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch frames");
  }
  return response.json();
}

/**
 * Fetches a specific frame by its identifier
 * @param id - The frame identifier in the format "s01e01-12-34.567"
 * @returns Promise resolving to the Frame object
 * @throws {Error} If the fetch request fails
 */
export async function getFrameById(id: string): Promise<Frame> {
  const response = await fetch(`/api/frames/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch frame");
  }
  return response.json();
}
