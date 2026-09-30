import "server-only";

import type React from "react";
import { FrameCardContent } from "@/components/frame-card-content";
import {
  type GridFrame,
  ScreenshotGridClient,
  type ScreenshotGridClientProps,
} from "@/components/screenshot-grid-client";
import type { Screenshot } from "@/lib/types";
import { formatEpisodeId, formatTimestamp } from "@/lib/utils";

/** Public grid inputs remain server-owned until card presentation is built. */
interface ScreenshotGridProps extends Omit<
  ScreenshotGridClientProps,
  "screenshots" | "rankedMoments"
> {
  screenshots: Screenshot[];
  rankedMoments?: Screenshot[];
}

/**
 * Builds a card slot on the server, with minimal data for client selection.
 * @param screenshot - Source frame
 * @param priority - Whether the image is an initial visible candidate
 * @returns Serializable interaction data and server-rendered presentation
 */
function prepareCard(screenshot: Screenshot, priority: boolean): GridFrame {
  const episode = formatEpisodeId(screenshot.episode);
  const timestamp = formatTimestamp(screenshot.timestamp);

  return {
    id: screenshot.id,
    speech: screenshot.speech,
    label: `${screenshot.speech || "Frame"} from ${episode} at ${timestamp}`,
    content: <FrameCardContent screenshot={screenshot} priority={priority} />,
  };
}

/**
 * Keeps card presentation on the server while the client owns grid selection.
 * @param props - Server-provided frames, filters and pagination
 * @returns Interactive grid composed with server-rendered card slots
 */
export function ScreenshotGrid({
  screenshots,
  rankedMoments,
  ...props
}: ScreenshotGridProps): React.ReactElement {
  return (
    <ScreenshotGridClient
      {...props}
      screenshots={screenshots.map((frame, index) =>
        prepareCard(frame, index < 6),
      )}
      rankedMoments={rankedMoments?.map((frame) => prepareCard(frame, true))}
    />
  );
}
