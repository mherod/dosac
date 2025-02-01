import { getFrameById } from "@/lib/frames.server";

export const dynamic = "force-dynamic";

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
 * Response.json({
 *   id: "s01e01-12-34.567",
 *   caption: "Example caption",
 *   ...frameData
 * })
 *
 * // Error response
 * Response.json({
 *   error: "Frame not found"
 * }, { status: 400 })
 * ```
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await params;
    const frame = await getFrameById(id);
    return Response.json(frame);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 400 },
    );
  }
}
