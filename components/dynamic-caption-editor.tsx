"use client";

import { CaptionEditor } from "@/app/caption/[id]/caption-editor";
import type { Screenshot } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface DynamicCaptionEditorProps {
  /** The base frame data */
  frame: Screenshot;
}

/**
 * Client component that handles dynamic text processing and caption creation
 * This moves URL parameter processing and text decoding out of the server component
 */
export function DynamicCaptionEditor({
  frame,
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

  return <CaptionEditor screenshot={combinedFrame} />;
}
