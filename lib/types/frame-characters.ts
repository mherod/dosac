/**
 * Frame character identification types
 * Generated from face clustering and character mapping
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CharacterInFrame {
  /** Character name (e.g., "Malcolm Tucker") */
  name: string;
  /** Cluster ID this character belongs to */
  clusterId: string;
  /** Face detection confidence (0-1) */
  confidence: number;
  /** Optional bounding box for face location */
  bbox?: BoundingBox;
}

export interface FrameCharacterData {
  /** Frame identifier (e.g., "s01e01-00-03.120") */
  frameId: string;
  /** Relative path to frame image */
  imagePath?: string;
  /** List of characters detected in this frame */
  characters: CharacterInFrame[];
  /** Total number of faces detected */
  faceCount: number;
}

export interface CharacterCluster {
  /** Cluster ID */
  id: string;
  /** Character name */
  name: string;
  /** Total number of frame appearances */
  appearances: number;
  /** Episodes where character appears */
  episodes: string[];
  /** Average cluster similarity confidence */
  avgConfidence: number;
}

export interface FrameCharactersMetadata {
  /** Schema version */
  version: string;
  /** Timestamp when generated */
  generatedAt: string;
  /** Total number of frames processed */
  totalFrames: number;
  /** Total number of unique characters */
  totalCharacters: number;
  /** Similarity threshold used for clustering */
  clusterThreshold: number;
}

export interface FrameCharactersData {
  /** Metadata about the dataset */
  metadata: FrameCharactersMetadata;
  /** Character cluster definitions */
  characters: Record<string, CharacterCluster>;
  /** Frame-to-character mappings */
  frames: Record<string, FrameCharacterData>;
}

/**
 * Helper type for querying characters by frame ID
 */
export type FrameId = string;

/**
 * Helper type for character names
 */
export type CharacterName = string;

/**
 * Utility functions for working with frame character data
 */
export class FrameCharacterUtils {
  /**
   * Get characters for a specific frame
   */
  static getCharactersForFrame(
    data: FrameCharactersData,
    frameId: string,
  ): CharacterInFrame[] {
    return data.frames[frameId]?.characters || [];
  }

  /**
   * Get all frames featuring a specific character
   */
  static getFramesWithCharacter(
    data: FrameCharactersData,
    characterName: string,
  ): FrameCharacterData[] {
    return Object.values(data.frames).filter((frame) =>
      frame.characters.some((char) => char.name === characterName),
    );
  }

  /**
   * Get character statistics
   */
  static getCharacterStats(
    data: FrameCharactersData,
    characterName: string,
  ): {
    totalAppearances: number;
    episodes: string[];
    avgConfidence: number;
  } | null {
    const cluster = Object.values(data.characters).find(
      (c) => c.name === characterName,
    );

    if (!cluster) return null;

    return {
      totalAppearances: cluster.appearances,
      episodes: cluster.episodes,
      avgConfidence: cluster.avgConfidence,
    };
  }

  /**
   * Filter frames by minimum confidence threshold
   */
  static filterByConfidence(
    frames: FrameCharacterData[],
    minConfidence: number,
  ): FrameCharacterData[] {
    return frames.map((frame) => ({
      ...frame,
      characters: frame.characters.filter(
        (char) => char.confidence >= minConfidence,
      ),
    }));
  }

  /**
   * Get frames with multiple characters (scenes with interactions)
   */
  static getMultiCharacterFrames(
    data: FrameCharactersData,
    minCharacters: number = 2,
  ): FrameCharacterData[] {
    return Object.values(data.frames).filter(
      (frame) => frame.characters.length >= minCharacters,
    );
  }

  /**
   * Get character co-appearances (which characters appear together)
   */
  static getCharacterCoAppearances(
    data: FrameCharactersData,
  ): Map<string, Map<string, number>> {
    const coAppearances = new Map<string, Map<string, number>>();

    Object.values(data.frames).forEach((frame) => {
      const characters = frame.characters.map((c) => c.name);

      characters.forEach((char1) => {
        if (!coAppearances.has(char1)) {
          coAppearances.set(char1, new Map());
        }

        characters.forEach((char2) => {
          if (char1 !== char2) {
            const char1Map = coAppearances.get(char1)!;
            char1Map.set(char2, (char1Map.get(char2) || 0) + 1);
          }
        });
      });
    });

    return coAppearances;
  }
}
