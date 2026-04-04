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
 * Inner component that uses useSearchParams to read text/range
 * and passes them as props to CaptionEditor (eliminating redundant
 * useSearchParams call in CaptionEditor)
 */
function DynamicCaptionEditorInner({
  frame,
  characters,
}: DynamicCaptionEditorProps): React.ReactElement {
  const searchParams = useSearchParams();

  const { combinedFrame, initialText } = useMemo(() => {
    const text = searchParams.get("text");
    const range = searchParams.get("range");

    if (typeof text === "string") {
      return {
        combinedFrame: {
          ...frame,
          speech: decodeURIComponent(text),
          isMultiFrame: true,
          rangeEndId: range,
          originalSpeech: frame.speech,
        },
        initialText: text,
      };
    }

    return { combinedFrame: frame, initialText: undefined };
  }, [frame, searchParams]);

  return (
    <CaptionEditor
      screenshot={combinedFrame}
      characters={characters}
      initialText={initialText}
    />
  );
}

/**
 * Client component that handles dynamic text processing and caption creation
 * Reads URL parameters via useSearchParams (required because parent page uses
 * "use cache" which is incompatible with searchParams access)
 * Wraps inner component in Suspense for Next.js streaming
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
