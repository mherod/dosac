import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for grid components
 */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-video rounded-lg" />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for strip components
 */
function StripSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-video w-64 flex-shrink-0" />
      ))}
    </div>
  );
}

/**
 * Dynamically imported ScreenshotGrid with loading state
 */
export const DynamicScreenshotGrid = dynamic(
  async () => {
    const mod = await import("@/components/screenshot-grid");
    return mod.ScreenshotGrid;
  },
  {
    loading: () => <GridSkeleton />,
    ssr: true,
  },
);

/**
 * Dynamically imported FrameStrip with loading state
 */
export const DynamicFrameStrip = dynamic(
  async () => {
    const mod = await import("@/components/frame-strip");
    return mod.FrameStrip;
  },
  {
    loading: () => <StripSkeleton />,
    ssr: true,
  },
);

/**
 * Dynamically imported FrameGrid for caption editor
 */
export const DynamicFrameGrid = dynamic(
  async () => {
    const mod = await import("@/components/frame-grid");
    return mod.FrameGrid;
  },
  {
    loading: () => <GridSkeleton />,
    ssr: true,
  },
);

/**
 * Dynamically imported FrameStack for caption editor
 */
export const DynamicFrameStack = dynamic(
  async () => {
    const mod = await import("@/components/frame-stack");
    return mod.FrameStack;
  },
  {
    loading: () => <StripSkeleton />,
    ssr: true,
  },
);

/**
 * Dynamically imported EditorControlsCard
 */
export const DynamicEditorControls = dynamic(
  async () => {
    const mod = await import(
      "@/components/caption-controls/editor-controls-card"
    );
    return mod.EditorControlsCard;
  },
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: true,
  },
);
