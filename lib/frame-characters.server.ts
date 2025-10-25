import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cacheLife } from "next/cache";

/**
 * Interface for character information in a frame
 */
export interface CharacterInFrame {
  name: string;
  confidence: number;
}

/**
 * Interface for frame character data
 */
export interface FrameCharacterData {
  characters: string[];
  confidence: number[];
  imagePath: string;
}

/**
 * Type for the complete frame-characters data structure
 */
export type FrameCharactersData = Record<string, FrameCharacterData>;

let cachedCharacterData: FrameCharactersData | null = null;

/**
 * Loads the frame-characters.json file
 * @returns The complete frame characters data
 */
function loadFrameCharactersData(): FrameCharactersData {
  if (cachedCharacterData) {
    return cachedCharacterData;
  }

  try {
    const dataPath = join(process.cwd(), "public", "frame-characters.json");
    const data = readFileSync(dataPath, "utf-8");
    cachedCharacterData = JSON.parse(data);
    return cachedCharacterData || {};
  } catch (error) {
    console.error("Failed to load frame-characters.json:", error);
    return {};
  }
}

/**
 * Gets characters for a specific frame
 * @param frameId - The frame ID (e.g., "s03e01-08-24.000")
 * @returns Array of characters with confidence scores
 */
export async function getCharactersForFrame(
  frameId: string,
): Promise<CharacterInFrame[] | null> {
  "use cache";
  cacheLife("stable");

  const data = loadFrameCharactersData();
  const frameData = data[frameId];

  if (
    !frameData ||
    !frameData.characters ||
    frameData.characters.length === 0
  ) {
    return null;
  }

  return frameData.characters.map((name, index) => ({
    name,
    confidence: frameData.confidence[index] || 0,
  }));
}

/**
 * Gets all frames featuring a specific character
 * @param characterName - The name of the character
 * @returns Array of frame IDs
 */
export async function getFramesWithCharacter(
  characterName: string,
): Promise<string[]> {
  "use cache";
  cacheLife("stable");

  const data = loadFrameCharactersData();
  return Object.keys(data).filter((frameId) =>
    data[frameId]?.characters.includes(characterName),
  );
}

/**
 * Gets statistics about character appearances
 * @returns Record of character names to appearance counts
 */
export async function getCharacterStats(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("stable");

  const data = loadFrameCharactersData();
  const stats: Record<string, number> = {};

  for (const frameData of Object.values(data)) {
    for (const character of frameData.characters) {
      stats[character] = (stats[character] || 0) + 1;
    }
  }

  return stats;
}
