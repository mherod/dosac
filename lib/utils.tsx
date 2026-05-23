import { type ClassValue, clsx } from "clsx";
import { compact, memoize } from "lodash-es";
import Link from "next/link";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { getFrameData } from "./actions";
import { formatTimestamp } from "./format-utils";
import { type CharacterId, characters } from "./profiles";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - The class names to combine
 * @returns The combined class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Types of content that can be rendered in text
 */
export type TextOrLink =
  | string
  | { text: string; profileId: keyof typeof characters }
  | { text: string; seriesId: number }
  | { text: string; episodeId: string }
  | { text: string; timestamp: string };

/**
 * Formats an episode ID from "s01e02" format to "S1 E2" format
 * @param episodeId - The episode ID to format
 * @returns The formatted episode string
 */
export function formatEpisodeId(episodeId: string | null | undefined): string {
  if (!episodeId) return "";
  const match = episodeId.match(/^s(\d{2})e(\d{2})$/i);
  if (!match || !match[1] || !match[2]) return episodeId;
  return `S${Number.parseInt(match[1], 10)} E${Number.parseInt(match[2], 10)}`;
}

// formatTimestamp re-exported from ./format-utils (single source of truth)
export { formatTimestamp };

/**
 * Processes text content with embedded links into React nodes
 * @param parts - The text parts to process
 * @param linkClassName - Optional class name for links
 * @returns An array of React nodes
 */
export function processTextWithLinks(
  parts: TextOrLink[] | TextOrLink,
  linkClassName = "text-blue-600 hover:underline",
): ReactNode[] {
  if (typeof parts === "string") {
    return [parts];
  }

  if (!Array.isArray(parts)) {
    const partsArray = [parts];
    return processTextWithLinks(partsArray, linkClassName);
  }

  const renderLink = (href: string, text: string, key: number): ReactNode => (
    <Link key={key} href={href} className={linkClassName} prefetch={null}>
      {text}
    </Link>
  );

  return parts.map((part, index) => {
    if (typeof part === "string") {
      // biome-ignore lint/suspicious/noArrayIndexKey: Text segments need index keys
      return <span key={index}>{part}</span>;
    }

    if ("profileId" in part) {
      const character = characters[part.profileId];
      const text =
        character?.name ||
        character?.fullName ||
        character?.shortName ||
        part.text;
      return renderLink(`/profiles/${part.profileId}`, text, index);
    }

    if ("episodeId" in part && part.episodeId) {
      return renderLink(
        `/series/episode/${part.episodeId}`,
        `${formatEpisodeId(part.episodeId)} - ${part.text}`,
        index,
      );
    }

    if ("timestamp" in part) {
      return renderLink(
        `/caption/${part.timestamp}`,
        `${formatTimestamp(part.timestamp)} - ${part.text}`,
        index,
      );
    }

    if ("seriesId" in part) {
      return renderLink(`/series/${part.seriesId}`, part.text, index);
    }

    // biome-ignore lint/suspicious/noArrayIndexKey: Fallback text segments
    return <span key={index}>{part.text}</span>;
  });
}

/**
 * Formats text with line breaks based on configuration
 * @param text - The text to format
 * @param relaxedLineBreaks - Whether to preserve all line breaks
 * @returns An array of formatted text lines
 */
export function formatTextLines(
  text: string,
  relaxedLineBreaks = false,
): string[] {
  return relaxedLineBreaks
    ? text.split("\n")
    : text.split(/\s+/).join(" ").split("\n");
}

/**
 * Generates CSS text-shadow value for caption outline and drop shadow effects
 * @param outlineWidth - Width of the text outline in pixels
 * @param shadowSize - Size of the drop shadow in pixels
 * @returns CSS text-shadow property value string
 */
export function generateTextShadow(
  outlineWidth: number = 1,
  shadowSize: number = 0,
): string {
  const shadows = [];

  // Add outline effect
  for (let x = -outlineWidth; x <= outlineWidth; x++) {
    for (let y = -outlineWidth; y <= outlineWidth; y++) {
      if (x === 0 && y === 0) continue;
      shadows.push(`${x}px ${y}px 0 #000`);
    }
  }

  // Add gaussian-like shadow if enabled
  if (shadowSize > 0) {
    shadows.push(`0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.7)`);
  }

  return shadows.join(", ");
}

/**
 * Gets the profile image URL for a character, with fallback handling
 * @param id - The character ID to get the image for
 * @returns The profile image URL or undefined if no image exists
 */
export async function getProfileImage(
  id: CharacterId,
): Promise<string | undefined> {
  const character = characters[id];
  if (!character) return undefined;

  // Return the character's image if it exists
  if (character.image) {
    return typeof character.image === "string"
      ? character.image
      : character.image.src;
  }

  // Try to get first frame highlight as fallback
  if (character.frameHighlights?.length) {
    const firstHighlight = character.frameHighlights[0];
    if (firstHighlight) {
      try {
        const frame = await getFrameData(firstHighlight);
        if (!frame?.imageUrl) {
          console.warn(`No image URL found in frame data for ${id}`);
          return undefined;
        }
        return frame.imageUrl;
      } catch (error) {
        console.error(`Failed to get frame for ${id}:`, error);
        return undefined;
      }
    }
  }

  // No image available
  return undefined;
}

/**
 * Calculates the Levenshtein distance between two strings
 * Memoized for performance since it's a pure function called frequently
 * @param a - First string
 * @param b - Second string
 * @returns The edit distance between the strings
 */
const levenshteinDistance = memoize(
  (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Create matrix with known dimensions
    const rows = b.length + 1;
    const cols = a.length + 1;
    const matrix: number[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0),
    );

    // Initialize first row and column
    for (let i = 0; i <= b.length; i++) {
      const row = matrix[i];
      if (row) {
        row[0] = i;
      }
    }
    for (let j = 0; j <= a.length; j++) {
      const row = matrix[0];
      if (row) {
        row[j] = j;
      }
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
      const row = matrix[i];
      const prevRow = matrix[i - 1];
      if (!row || !prevRow) {
        continue;
      }

      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          const prevValue = prevRow[j - 1];
          if (prevValue !== undefined) {
            row[j] = prevValue;
          }
        } else {
          const substitution = prevRow[j - 1];
          const insertion = row[j - 1];
          const deletion = prevRow[j];
          const values: number[] = [];
          if (substitution !== undefined) {
            values.push(substitution + 1);
          }
          if (insertion !== undefined) {
            values.push(insertion + 1);
          }
          if (deletion !== undefined) {
            values.push(deletion + 1);
          }
          if (values.length > 0) {
            row[j] = Math.min(...values);
          }
        }
      }
    }

    const result = matrix[b.length]?.[a.length];
    return result ?? a.length;
  },
  (a: string, b: string) => `${a}:${b}`,
);

/**
 * Checks if a query word fuzzy matches any word in the text
 * @param queryWord - The word to search for
 * @param text - The text to search in
 * @param maxDistance - Maximum allowed edit distance (default: auto-calculated)
 * @returns True if a fuzzy match is found
 */
export function fuzzyMatch(queryWord: string, text: string): boolean {
  // Fast path: exact substring match
  if (text.includes(queryWord)) {
    return true;
  }

  // Split text into words for word-level matching
  // Use compact to remove empty strings from split
  const textWords = compact(text.toLowerCase().split(/\s+/));
  const queryLower = queryWord.toLowerCase();

  // Calculate max allowed distance based on word length
  // For short words (<=4 chars), allow 1 edit
  // For medium words (5-7 chars), allow 2 edits
  // For longer words, allow up to 3 edits or 20% of length
  const maxDistance =
    queryLower.length <= 4
      ? 1
      : queryLower.length <= 7
        ? 2
        : Math.max(2, Math.floor(queryLower.length * 0.2));

  // Check each word in the text
  for (const word of textWords) {
    // Skip very short words that can't match
    if (word.length < queryLower.length - maxDistance) {
      continue;
    }

    // Check if query is a substring of word (handles partial matches)
    if (word.includes(queryLower) || queryLower.includes(word)) {
      return true;
    }

    // Calculate edit distance
    const distance = levenshteinDistance(queryLower, word);

    // If distance is within threshold, it's a match
    if (distance <= maxDistance) {
      return true;
    }

    // Also check if query matches a substring of word with fuzzy matching
    // This handles cases like "malcom" matching "malcolm"
    if (word.length >= queryLower.length) {
      for (let i = 0; i <= word.length - queryLower.length; i++) {
        const substring = word.slice(i, i + queryLower.length);
        const substringDistance = levenshteinDistance(queryLower, substring);
        if (substringDistance <= maxDistance) {
          return true;
        }
      }
    }
  }

  return false;
}
