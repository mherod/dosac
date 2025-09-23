"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  sizes?: string;
}

/**
 * Lazy loading image component with intersection observer
 * Provides progressive loading with placeholder support
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  sizes,
}: LazyImageProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        // Start loading when image is 100px away from viewport
        rootMargin: "100px",
        threshold: 0.01,
      },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setHasLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        !hasLoaded && "animate-pulse bg-gray-200",
        className,
      )}
      style={
        width && height
          ? {
              width,
              height,
              aspectRatio: `${width} / ${height}`,
            }
          : undefined
      }
    >
      {isIntersecting ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-opacity duration-300",
            hasLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" aria-label="Loading..." />
      )}
    </div>
  );
}

/**
 * Hook for lazy loading multiple images
 */
export function useLazyImageLoader(_imageUrls: string[]) {
  const [loadedImages, setLoadedImages] = useState(new Set<string>());
  const [failedImages, setFailedImages] = useState(new Set<string>());

  const preloadImage = (url: string) => {
    if (loadedImages.has(url) || failedImages.has(url)) {
      return;
    }

    const img = new window.Image();
    img.src = url;

    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(url));
    };

    img.onerror = () => {
      setFailedImages((prev) => new Set(prev).add(url));
    };
  };

  const preloadImages = (urls: string[]) => {
    urls.forEach(preloadImage);
  };

  return {
    loadedImages,
    failedImages,
    preloadImage,
    preloadImages,
    isLoaded: (url: string) => loadedImages.has(url),
    hasFailed: (url: string) => failedImages.has(url),
  };
}
