"use client";

import Image from "next/image";
import { getResponsiveSizes } from "@/lib/image-utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  blurDataURL?: string;
  onLoad?: () => void;
}

/**
 * Optimized image component with automatic responsive sizing and blur placeholders
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  blurDataURL,
  onLoad,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={getResponsiveSizes(width)}
      quality={75}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      onLoad={onLoad}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
