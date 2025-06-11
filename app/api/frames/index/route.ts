import { getFrameIndex } from "@/lib/frames.server";
import { NextResponse } from "next/server";

/**
 * API route handler for fetching all available frames
 *
 * Returns an array of frame objects containing metadata about each frame,
 * including episode information, timestamps, and captions.
 *
 * @returns NextResponse containing an array of frame objects
 *
 * @example
 * ```ts
 * // Response format
 * NextResponse.json([
 *   {
 *     id: "s01e01-12-34.567",
 *     caption: "Example caption",
 *     episode: "s01e01",
 *     timestamp: "12:34.567",
 *     ...frameData
 *   },
 *   // ... more frames
 * ])
 * ```
 */
export async function GET(): Promise<NextResponse> {
  const frames = await getFrameIndex();
  return NextResponse.json(frames);
}
