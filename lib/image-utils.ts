// Note: plaiceholder package would be used here for blur generation
// For now, using a simple base64 placeholder

/**
 * Cache for blur data URLs to avoid regenerating
 */
const blurCache = new Map<string, string>();

/**
 * Generates a blur placeholder for an image
 * @param imagePath - Relative path to the image in public folder
 * @returns Base64 encoded blur data URL
 */
export async function getBlurDataURL(imagePath: string): Promise<string> {
  // Check cache first
  if (blurCache.has(imagePath)) {
    return blurCache.get(imagePath)!;
  }

  // For now, return a generic blur placeholder
  // In production, you would use a library like plaiceholder or sharp to generate actual blur data
  const genericBlur =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

  blurCache.set(imagePath, genericBlur);
  return genericBlur;
}

/**
 * Optimizes image loading with responsive sizes
 */
export function getResponsiveSizes(
  width: number,
  breakpoints = [640, 768, 1024, 1280, 1536],
): string {
  return (
    breakpoints
      .filter((bp) => bp <= width * 2) // Only include sizes up to 2x the display size
      .map((bp) => `(max-width: ${bp}px) ${Math.floor(width * (bp / 1280))}px`)
      .join(", ") + `, ${width}px`
  );
}

/**
 * Gets optimized image loader configuration
 */
export function getImageLoader(
  src: string,
  width: number,
  quality = 75,
): string {
  // Add any CDN transformations here
  return `${src}?w=${width}&q=${quality}`;
}
