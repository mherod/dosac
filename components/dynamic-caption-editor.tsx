"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { CaptionEditor } from "@/app/caption/[id]/caption-editor";
import type { Screenshot } from "@/lib/types";

interface CharacterInFrame {
  name: string;
  confidence: number;
}

interface DynamicCaptionEditorProps {
  /** The base frame data */
  frame: Screenshot;
  /** Detected characters in the frame */
  characters?: CharacterInFrame[] | null;
}

/**
 * Inner component that uses useSearchParams
 */
function DynamicCaptionEditorInner({
  frame,
  characters,
}: DynamicCaptionEditorProps): React.ReactElement {
  const searchParams = useSearchParams();

  const combinedFrame = useMemo(() => {
    const text = searchParams.get("text");
    const range = searchParams.get("range");

    // If we have a text parameter, create an extended frame with the combined text
    if (typeof text === "string") {
      return {
        ...frame,
        speech: decodeURIComponent(text),
        isMultiFrame: true,
        rangeEndId: range,
        originalSpeech: frame.speech, // Keep the original speech for comparison
      };
    }

    return frame;
  }, [frame, searchParams]);

  return <CaptionEditor screenshot={combinedFrame} characters={characters} />;
}

/**
 * Client component that handles dynamic text processing and caption creation
 * This moves URL parameter processing and text decoding out of the server component
 */
export function DynamicCaptionEditor({
  frame,
  characters,
}: DynamicCaptionEditorProps): React.ReactElement {
  return (
    <Suspense
      fallback={<CaptionEditor screenshot={frame} characters={characters} />}
    >
      <DynamicCaptionEditorInner frame={frame} characters={characters} />
    </Suspense>
  );
}
