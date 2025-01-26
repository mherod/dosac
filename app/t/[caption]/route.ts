import { NextRequest, NextResponse } from "next/server";
import { getFrameIndex } from "@/lib/frames.server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caption: string }> },
) {
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
