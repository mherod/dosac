"use server";

import fs from "fs";
import path from "path";
import type { Frame } from "./frames";

/**
 * Server action to get frame data by ID
 * @param id - The frame ID to fetch
 * @returns The frame data or undefined if not found
 */
export async function getFrameData(id: string): Promise<Frame | undefined> {
  try {
    const match = id.match(/^s(\d{2})e(\d{2})-(\d{2})-(\d{2})\.(\d{3})$/);
    if (!match) return undefined;

    const season = `s${match[1]}e${match[2]}`;
    const timestamp = `${match[3]}-${match[4]}.${match[5]}`;

    const framePath = path.join(
      process.cwd(),
      "public",
      "frames",
      season,
      timestamp,
    );

    if (!fs.existsSync(framePath)) {
      return undefined;
    }

    const speechPath = path.join(framePath, "speech.txt");
    const speech = fs.readFileSync(speechPath, "utf-8").trim();

    return {
      id,
      imageUrl: `/frames/${season}/${timestamp}/frame-blank.jpg`,
      image2Url: `/frames/${season}/${timestamp}/frame-blank2.jpg`,
      timestamp,
      subtitle: speech,
      speech,
      episode: season,
      character: "",
    };
  } catch (error) {
    console.error(`Failed to get frame data for ${id}:`, error);
    return undefined;
  }
}
