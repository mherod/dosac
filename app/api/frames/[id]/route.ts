import { NextResponse } from "next/server";
import { getFrameById } from "@/lib/frames.server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const frame = await getFrameById(params.id);
    return NextResponse.json(frame);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      { status: 400 },
    );
  }
}
