import { NextResponse } from "next/server";
import { getFrameIndex } from "@/lib/frames.server";

export async function GET() {
  const frames = await getFrameIndex();
  return NextResponse.json(frames);
}
