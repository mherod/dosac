import { toast } from "sonner";

/**
 * Encodes a URL or path for sharing by converting it to a base64 string
 * and making it URL-safe by replacing + with - and / with _
 * @param url - The URL or path to encode
 * @returns URL-safe base64 encoded string with padding removed
 */
export function encodeShareUrl(url: string): string {
  // Convert the URL to base64
  const base64 = Buffer.from(url).toString("base64");

  // Make it URL safe by replacing + with - and / with _
  // and removing padding =
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Creates a shareable URL for the current page with optional text parameter
 * @param currentPath - The current page path to create a share URL for
 * @param text - Optional text to include as a query parameter
 * @param baseUrl - Optional base URL to prepend (defaults to relative URL)
 * @returns Complete shareable URL with encoded parameters
 */
export function createShareUrl(
  currentPath: string,
  text?: string,
  baseUrl?: string,
): string {
  // Use the provided base URL or default to empty string (relative URL)
  const base = baseUrl || "";

  // If there's text, add it as a query parameter
  const url = text
    ? `${currentPath}?text=${encodeURIComponent(text)}`
    : currentPath;

  // Create the share URL
  const shareUrl = `${base}/share/${encodeShareUrl(url)}`;

  return shareUrl;
}

/**
 * Shares the URL using the Web Share API if available,
 * otherwise copies to clipboard
 * @param url - The URL to share or copy
 * @returns Promise that resolves when sharing/copying is complete
 * @throws Error if both sharing and clipboard copy fail
 */
export async function shareUrl(url: string): Promise<void> {
  try {
    if (navigator.share) {
      await navigator.share({
        url,
      });
      toast.success("Shared successfully");
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  } catch (error) {
    console.error("Error sharing:", error);
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (clipboardError) {
      console.error("Error copying to clipboard:", clipboardError);
      toast.error("Failed to share or copy link");
      throw new Error("Failed to share or copy URL");
    }
  }
}

/**
 * Main share function that combines URL creation and sharing
 * @param currentPath - The current page path to share
 * @param text - Optional text to include in the share URL
 * @param baseUrl - Optional base URL to prepend (defaults to relative URL)
 * @returns Promise that resolves when sharing is complete
 * @throws Error if sharing fails
 */
export async function handleShare(
  currentPath: string,
  text?: string,
  baseUrl?: string,
): Promise<void> {
  const url = createShareUrl(currentPath, text, baseUrl);
  await shareUrl(url);
}
