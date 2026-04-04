import { NextResponse } from "next/server";
import { getFrameIndex } from "@/lib/frames.server";
import { apiRateLimit } from "@/lib/rate-limit";

/**
 * API route handler for fetching all available frames
 *
 * Returns an array of frame objects containing metadata about each frame,
 * including episode information, timestamps, and captions.
 *
 * @param request - The incoming HTTP request
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
export async function GET(request: Request): Promise<NextResponse | Response> {
  const { limited } = apiRateLimit(request);
  if (limited) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const frames = await getFrameIndex();
  return NextResponse.json(frames);
}
