/**
 * Component to inject resource hints for critical assets
 * Improves performance by preloading essential resources
 */
export function ResourceHints() {
  return (
    <>
      {/* Preload critical fonts */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preconnect to image CDN if using one */}
      <link rel="preconnect" href="https://cdn.example.com" />
      <link rel="dns-prefetch" href="https://cdn.example.com" />

      {/* Preload critical API endpoints */}
      <link
        rel="preload"
        href="/api/frames/index"
        as="fetch"
        crossOrigin="anonymous"
      />

      {/* Preload frame index JSON */}
      <link
        rel="preload"
        href="/frame-index.json"
        as="fetch"
        crossOrigin="anonymous"
      />

      {/* Prefetch search index for faster search */}
      <link
        rel="prefetch"
        href="/search-index.json"
        as="fetch"
        crossOrigin="anonymous"
      />
    </>
  );
}

/**
 * Hook to preload images for the current viewport
 */
export function useImagePreload(imageUrls: string[]) {
  if (typeof window !== "undefined") {
    // Preload first 6 images
    imageUrls.slice(0, 6).forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
    });
  }
}
