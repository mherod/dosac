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
    season: Number.parseInt(match[1], 10),
    episode: Number.parseInt(match[2], 10),
  };
}
