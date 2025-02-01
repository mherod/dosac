/**
 * Represents a single frame/screenshot from an episode, including its metadata and associated dialogue.
 * Each screenshot is captured at a specific timestamp and includes both the immediate frame
 * and a follow-up frame captured one second later.
 */
export type Screenshot = {
  /** Unique identifier for the screenshot, typically derived from episode and timestamp */
  id: string;
  /** URL to the primary frame image captured at the exact timestamp */
  imageUrl: string;
  /** URL to the secondary frame image captured exactly 1 second after the primary frame */
  image2Url: string;
  /** Timestamp in the format "MM:SS.mmm" where the frame was captured */
  timestamp: string;
  /** Raw subtitle text from the VTT file, may include speaker labels and formatting */
  subtitle: string;
  /** Processed speech text optimised for display, typically cleaned of speaker labels and formatting */
  speech: string;
  /** Episode identifier in the format "SXXEXX" (e.g., "S01E01") */
  episode: string;
  /** Name of the character speaking in the frame */
  character: string;
};
