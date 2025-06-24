"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import type React from "react";

interface AnimatedRouteTransitionProps {
  children: React.ReactNode;
  routeKey: string;
}

export function AnimatedRouteTransition({
  children,
  routeKey,
}: AnimatedRouteTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
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
}: CrossfadeImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  useEffect(() => {
    if (src !== prevSrc) {
      setIsLoaded(false);
      setPrevSrc(src);
    }
  }, [src, prevSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          onLoad={handleLoad}
        />
      </AnimatePresence>
    </div>
  );
}

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: "left" | "right" | "up" | "down";
  duration?: number;
}

export function SlideTransition({
  children,
  direction = "right",
  duration = 0.3,
}: SlideTransitionProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "left":
        return { x: -100, y: 0 };
      case "right":
        return { x: 100, y: 0 };
      case "up":
        return { x: 0, y: -100 };
      case "down":
        return { x: 0, y: 100 };
    }
  };

  const getExitPosition = () => {
    switch (direction) {
      case "left":
        return { x: 100, y: 0 };
      case "right":
        return { x: -100, y: 0 };
      case "up":
        return { x: 0, y: 100 };
      case "down":
        return { x: 0, y: -100 };
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={getInitialPosition()}
        animate={{ x: 0, y: 0 }}
        exit={getExitPosition()}
        transition={{
          duration,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface FramePreloaderProps {
  frameIds: string[];
  onPreloadComplete?: (loadedIds: string[]) => void;
}

export function FramePreloader({
  frameIds,
  onPreloadComplete,
}: FramePreloaderProps) {
  const [_loadedIds, setLoadedIds] = useState<string[]>([]);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = frameIds.map((id) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(id);
          img.onerror = () => reject(id);
          img.src = `/frames/${id}/frame-blank.jpg`;
        });
      });

      try {
        const results = await Promise.allSettled(promises);
        const loaded = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => (result as PromiseFulfilledResult<string>).value);

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
