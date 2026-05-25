"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedRouteTransitionProps {
  children: React.ReactNode;
  routeKey: string;
}

export function AnimatedRouteTransition({
  children,
  routeKey,
}: AnimatedRouteTransitionProps): React.ReactElement {
  return <div key={routeKey}>{children}</div>;
}

interface CrossfadeImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export function CrossfadeImage({
  src,
  alt,
  className = "",
  onLoad,
}: CrossfadeImageProps): React.ReactElement {
  return (
    <div className={cn("relative", className)}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        onLoad={onLoad}
      />
    </div>
  );
}

interface SlideTransitionProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
}

export function SlideTransition({
  children,
  direction: _direction = "right",
  duration: _duration = 0.3,
}: SlideTransitionProps): React.ReactElement {
  return <div>{children}</div>;
}

interface FramePreloaderProps {
  frameIds: string[];
  onPreloadComplete?: (loadedIds: string[]) => void;
}

export function FramePreloader({
  frameIds,
  onPreloadComplete,
}: FramePreloaderProps): React.ReactElement | null {
  const [_loadedIds, setLoadedIds] = useState<string[]>([]);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = frameIds.map((id) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(id);
          img.onerror = () => reject(id);
          img.src = `/frames/${id}/frame-blank.webp`;
        });
      });

      try {
        const results = await Promise.allSettled(promises);
        const loaded = results
          .filter(
            (result): result is PromiseFulfilledResult<string> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);

        setLoadedIds(loaded);
        onPreloadComplete?.(loaded);
      } catch (error) {
        console.error("Error preloading frames:", error);
      }
    };

    if (frameIds.length > 0) {
      preloadImages();
    }
  }, [frameIds, onPreloadComplete]);

  return null; // This component doesn't render anything
}
