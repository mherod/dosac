import { NextResponse, NextRequest } from "next/server";
import { getFrameIndex } from "@/lib/frames.server";

/**
 * Route handler for finding frames by caption text
 * @param request - The incoming request object containing URL and headers
 * @param root0 - The object containing route parameters
 * @param root0.params - Promise resolving to route parameters containing the caption text to search for
 * @returns A response redirecting to either the best matching frame or the home page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caption: string }> },
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const allFrames = await getFrameIndex();

    // Find frame with highest percentage match
    let bestMatch = null;
    let bestMatchPercentage = 0;

    for (const frame of allFrames) {
      const speechLength = frame.speech.length;
      const captionLength = resolvedParams.caption.length;

      if (frame.speech.includes(resolvedParams.caption)) {
        const matchPercentage = (captionLength / speechLength) * 100;
        if (matchPercentage > bestMatchPercentage) {
          bestMatch = frame;
          bestMatchPercentage = matchPercentage;
        }
      }
    }

    if (!bestMatch) {
      return NextResponse.json({
        error: "No matching frame found",
      });
    }

    const url = new URL(request.url);
    url.pathname = "api/og";
    url.searchParams.set("imageUrl", bestMatch.imageUrl);
    url.searchParams.set("caption", bestMatch.speech);

    return NextResponse.redirect(url.toString());
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
