import "server-only";

import * as sharp from "sharp";

export interface ImageProcessingResult {
  buffer: Buffer;
  contentType: string;
}

const OUTPUT_FORMAT = "jpeg" as const;
const OUTPUT_MIME_TYPE = "image/jpeg";

// Track failed image URLs to avoid retrying
const failedImageUrls = new Map<string, { error: string; timestamp: number }>();
const FAILURE_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Convert any image buffer to JPEG
export async function convertToJpeg(inputBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(inputBuffer)
      .jpeg({
        quality: 95,
        mozjpeg: true, // Use mozjpeg for better compression
      })
      .toBuffer();
  } catch (error) {
    console.error("Failed to convert image:", {
      error: error instanceof Error ? error.message : String(error),
      bufferSize: inputBuffer.length,
    });
    throw new Error(
      `Failed to convert image: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Image processing utilities
export const fetchImageBuffer = async (
  url: string,
): Promise<ImageProcessingResult> => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    throw new Error(
      "fetchImageBuffer must be called from a Node.js environment",
    );
  }

  // Check if URL has previously failed
  const failedAttempt = failedImageUrls.get(url);
  if (failedAttempt) {
    const hasExpired =
      Date.now() - failedAttempt.timestamp > FAILURE_CACHE_DURATION;
    if (!hasExpired) {
      throw new Error(
        `Previously failed to fetch image: ${failedAttempt.error} ${url}`,
      );
    }
    // Clear expired failure
    failedImageUrls.delete(url);
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "image/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      const error = `HTTP error! status: ${response.status}`;
      failedImageUrls.set(url, { error, timestamp: Date.now() });
      console.error("Failed to fetch image:", {
        url,
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(error);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      const error = `Not an image: ${contentType}`;
      failedImageUrls.set(url, { error, timestamp: Date.now() });
      console.error("Invalid content type:", {
        url,
        contentType,
      });
      throw new Error(error);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      const error = "Empty image received";
      failedImageUrls.set(url, { error, timestamp: Date.now() });
      console.error("Empty image received:", {
        url,
        byteLength: arrayBuffer?.byteLength ?? 0,
      });
      throw new Error(error);
    }

    const outputBuffer = await convertToJpeg(Buffer.from(arrayBuffer));

    return {
      buffer: outputBuffer,
      contentType: OUTPUT_MIME_TYPE,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    failedImageUrls.set(url, { error: errorMessage, timestamp: Date.now() });
    console.error("Failed to fetch image:", {
      url,
      error: errorMessage,
    });
    throw new Error(`Failed to fetch image: ${errorMessage}`);
  }
};

export async function processImageInput(
  formData: FormData,
): Promise<ImageProcessingResult> {
  const image = formData.get("image");
  const imageUrl = formData.get("url");

  if (imageUrl && typeof imageUrl === "string") {
    return await fetchImageBuffer(imageUrl);
  }

  if (image && image instanceof File) {
    if (!image.type.startsWith("image/")) {
      console.error("Invalid file type:", {
        type: image.type,
        name: image.name,
        size: image.size,
      });
      throw new Error("Not a valid image file");
    }
    const outputBuffer = await convertToJpeg(
      Buffer.from(await image.arrayBuffer()),
    );
    return {
      buffer: outputBuffer,
      contentType: OUTPUT_MIME_TYPE,
    };
  }

  console.error("No image provided in form data:", {
    hasImage: !!image,
    hasUrl: !!imageUrl,
    formDataKeys: Array.from(formData.keys()),
  });
  throw new Error("No image provided");
}

export function createProxyFormData(
  imageData: ImageProcessingResult,
): FormData {
  const proxyFormData = new FormData();
  const blob = new Blob([imageData.buffer], { type: OUTPUT_MIME_TYPE });
  proxyFormData.append("image", blob, `image.${OUTPUT_FORMAT}`);
  return proxyFormData;
}
