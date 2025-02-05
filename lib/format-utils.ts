/**
 * Formats an episode ID from "s01e02" format to "S1 E2" format
 * @param episodeId - The episode ID to format
 * @returns The formatted episode string
 */
export function formatEpisodeId(episodeId: string | null | undefined): string {
  if (!episodeId) return "";
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;
  return `S${parseInt(match[1])} E${parseInt(match[2])}`;
}

/**
 * Formats a timestamp from "00-03.120" format to "0:03" format
 * @param timestamp - The timestamp to format
 * @returns The formatted timestamp string
 */
export function formatTimestamp(timestamp: string): string {
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;
  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Formats a VTT timestamp string into the directory format used for frame storage
 * @param timestamp - The timestamp string in the format "00:03.120 --> 00:04.960"
 * @returns The formatted timestamp (e.g., "00-03.120")
 * @throws {Error} If the timestamp format is invalid
 */
export function formatVttTimestamp(timestamp: string): string {
  if (!timestamp) {
    throw new Error("Invalid timestamp format: timestamp cannot be empty");
  }

  const parts = timestamp.split("-->");
  if (parts.length !== 2) {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  const startTime = parts[0]?.trim();
  if (!startTime || !/^\d{2}:\d{2}\.\d{3}$/.test(startTime)) {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  return startTime.replace(/:/g, "-");
}

/**
 * Parses an episode identifier string into its numeric components
 * @param episodeId - The episode identifier in the format "s01e01"
 * @returns Object containing the parsed season and episode numbers
 * @throws {Error} If the episode ID format is invalid
 */
export function parseEpisodeId(episodeId: string | null | undefined): {
  season: number;
  episode: number;
} {
  if (!episodeId) {
    throw new Error("Episode ID cannot be null or undefined");
  }
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid episode ID format: ${episodeId}`);
  }
  return {
    season: parseInt(match[1]),
    episode: parseInt(match[2]),
  };
}

/**
 * Validates and parses a frame identifier string
 * @param id - The frame identifier in the format "s01e01-12-34.567"
 * @returns Object containing the parsed season, episode, and timestamp
 * @throws {Error} If any part of the frame ID format is invalid
 */
export function parseFrameId(id: string): {
  season: string;
  episode: string;
  timestamp: string;
} {
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

  return { season, episode: season, timestamp };
}
