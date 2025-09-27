import { type ClassValue, clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { getFrameData } from "./actions";
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
  return `S${Number.parseInt(match[1])} E${Number.parseInt(match[2])}`;
}

/**
 * Formats a timestamp from "00-03.120" format to "0:03" format
 * @param timestamp - The timestamp to format
 * @returns The formatted timestamp string
 */
export function formatTimestamp(timestamp: string): string {
  const match = timestamp.match(/^(\d{2})-(\d{2})\.\d{3}$/);
  if (!match || !match[1] || !match[2]) return timestamp;
  const minutes = Number.parseInt(match[1]);
  const seconds = Number.parseInt(match[2]);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

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
    <Link key={key} href={href} className={linkClassName}>
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
