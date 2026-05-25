import { NextResponse } from "next/server";
import { getFrameById } from "@/lib/frames.server";
import { InvalidFrameIdError } from "@/lib/frames";
import { apiRateLimit } from "@/lib/rate-limit";

/**
 * API route handler for fetching a specific frame by ID
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters object
 * @param params.params - Promise resolving to route parameters
 * @param params.params.id - The unique identifier of the frame to fetch
 * @returns Response containing the frame data or error details
 *
 * @example
 * ```ts
 * // Success response
 * NextResponse.json({
 *   id: "s01e01-12-34.567",
 *   timestamp: "12-34.567",
 *   speech: "Example dialogue",
 *   ...frameData
 * })
 *
 * // Error response (invalid ID / not found)
 * NextResponse.json({ error: "Frame not found" }, { status: 404 })
 * ```
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { limited } = apiRateLimit(request);
  if (limited) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { id } = await params;
    const frame = await getFrameById(id);
    return NextResponse.json(frame);
  } catch (error) {
    // Invalid ID format or missing frame is a client-side 404,
    // anything else is an unexpected server error.
    if (error instanceof InvalidFrameIdError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
