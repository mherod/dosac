import * as tf from "./tensorflow-setup";
import { FaceDetector } from "./face-detector";
import { faceAttributeDetector } from "./face-attributes";
import { decodeImage } from "./tensorflow-setup";
import { readFileSync } from "fs";
import sharp from "sharp";
import { memoize } from "lodash-es";
import { LRUCache } from "lru-cache";
import { MAX_EMBEDDING_SIZE, SUPPORTED_IMAGE_TYPES } from "./constants";
import { convertToJpeg } from "./image-processing";
import { createCanvas, Image, Canvas } from "canvas";
import { createHash } from "crypto";

// Types
export interface FacePrediction {
  topLeft: [number, number];
  bottomRight: [number, number];
  landmarks?: Array<[number, number]>;
  probability: number;
}

export interface ImageProcessingResult {
  buffer: Buffer;
  contentType: string;
}

export interface GenerateEmbeddingOptions {
  logProgress?: (message: string) => void;
}

// Configure LRU cache for embeddings
const embeddingsCache = new LRUCache<string, number[]>({
  max: 100, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Cache for 1 hour
  updateAgeOnGet: true, // Update item's age when accessed
  allowStale: false,
});

const faceDetector = new FaceDetector();

let initialized = false;

async function initialize() {
  if (!initialized) {
    await Promise.all([
      faceDetector.initialize(),
      faceAttributeDetector.initialize(),
    ]);
    initialized = true;
  }
}

// Cache for decoded images
const imageCache = new LRUCache<string, tf.Tensor3D>({
  max: 100, // Maximum number of items to store
  dispose: (tensor: tf.Tensor3D) => tensor.dispose(), // Clean up tensors when removed from cache
});

// Memoized function to decode images
const decodeImageMemo = memoize(
  async (imagePath: string): Promise<tf.Tensor3D> => {
    const imageBuffer = readFileSync(imagePath);
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return decodeImage(data, info.width, info.height);
  },
  (imagePath: string) => imagePath,
);

// Validation utilities
export const validateFileType = memoize(
  (type: string): boolean => {
    return SUPPORTED_IMAGE_TYPES.includes(
      type as (typeof SUPPORTED_IMAGE_TYPES)[number],
    );
  },
  (type) => type,
);

export const validateFileSize = memoize(
  (size: number): boolean => {
    return size <= MAX_EMBEDDING_SIZE;
  },
  (size) => size,
);

// Image processing utilities
export const loadAndResizeImage = memoize(
  async (buffer: Buffer, size?: { width: number; height: number }) => {
    try {
      // Validate image buffer
      const metadata = await sharp(buffer).metadata();
      if (
        !metadata.width ||
        !metadata.height ||
        metadata.width === 0 ||
        metadata.height === 0
      ) {
        throw new Error("Invalid image dimensions");
      }

      if (size) {
        const resized = await sharp(buffer)
          .resize(size.width, size.height, { fit: "contain" })
          .toBuffer();
        return await convertToJpeg(resized);
      }
      return await convertToJpeg(buffer);
    } catch (error: unknown) {
      throw new Error(
        `Failed to load or resize image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  (...args) => {
    const [buffer, size] = args;
    return (
      buffer.toString("base64") + (size ? `_${size.width}x${size.height}` : "")
    );
  },
);

export const bufferToCanvas = memoize(
  async (
    buffer: Buffer,
  ): Promise<{ canvas: Canvas; width: number; height: number }> => {
    // Validate buffer
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("Invalid input: Expected a Buffer");
    }

    if (buffer.length === 0) {
      throw new Error("Invalid input: Empty buffer received");
    }

    try {
      // Get image dimensions
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error("Could not determine image dimensions");
      }

      if (metadata.width === 0 || metadata.height === 0) {
        throw new Error("Invalid image dimensions: width or height is 0");
      }

      // Create canvas
      const canvas = createCanvas(metadata.width, metadata.height);
      const ctx = canvas.getContext("2d");

      // Load image
      const image = new Image();
      image.onerror = (err) => {
        throw new Error(`Failed to load image: ${err}`);
      };
      image.src = buffer;

      // Draw image to canvas
      ctx.drawImage(image, 0, 0);

      return {
        canvas,
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      throw new Error(
        `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  (buffer) => buffer.toString("base64"),
);

// Face rotation and cropping utilities
export const calculateRotationAngle = memoize(
  (landmarks: Array<[number, number]> = []): number => {
    if (landmarks.length < 2) {
      return 0; // No rotation if we don't have enough landmarks
    }
    const [rightEye, leftEye] = landmarks;
    const deltaY = leftEye[1] - rightEye[1];
    const deltaX = leftEye[0] - rightEye[0];
    const angleRadians = Math.atan2(deltaY, deltaX);
    return -(angleRadians * (180 / Math.PI));
  },
  (landmarks) => JSON.stringify(landmarks),
);

export const calculateCenterPoint = memoize(
  (
    topLeft: [number, number],
    bottomRight: [number, number],
  ): { x: number; y: number } => {
    return {
      x: (topLeft[0] + bottomRight[0]) / 2,
      y: (topLeft[1] + bottomRight[1]) / 2,
    };
  },
  (topLeft, bottomRight) => `${topLeft.join(",")}-${bottomRight.join(",")}`,
);

export const getLargestFace = memoize(
  (predictions: FacePrediction[]): FacePrediction => {
    return predictions.reduce((prev, current) => {
      const prevArea =
        (prev.bottomRight[0] - prev.topLeft[0]) *
        (prev.bottomRight[1] - prev.topLeft[1]);
      const currentArea =
        (current.bottomRight[0] - current.topLeft[0]) *
        (current.bottomRight[1] - current.topLeft[1]);
      return prevArea > currentArea ? prev : current;
    });
  },
  (predictions) => JSON.stringify(predictions),
);

export async function rotateFace(
  buffer: Buffer,
  face: FacePrediction,
): Promise<Buffer> {
  const rotationAngle = calculateRotationAngle(face.landmarks || []);
  const rotated = await sharp(buffer)
    .rotate(rotationAngle, {
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();
  return await convertToJpeg(rotated);
}

export async function cropFace(
  buffer: Buffer,
  face: FacePrediction,
  width: number,
  height: number,
): Promise<Buffer> {
  const faceWidth = face.bottomRight[0] - face.topLeft[0];
  const faceHeight = face.bottomRight[1] - face.topLeft[1];

  // Calculate the center point of the face
  const center = calculateCenterPoint(face.topLeft, face.bottomRight);

  // Use the larger dimension to create a square box
  const size = Math.max(faceWidth, faceHeight);
  const padding = size * 0.3; // 30% padding
  const cropSize = size + padding * 2;

  // Calculate the crop coordinates ensuring they're within image bounds
  const cropLeft = Math.max(0, Math.floor(center.x - cropSize / 2));
  const cropTop = Math.max(0, Math.floor(center.y - cropSize / 2));
  const finalCropWidth = Math.min(cropSize, width - cropLeft);
  const finalCropHeight = Math.min(cropSize, height - cropTop);

  const cropped = await sharp(buffer)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: finalCropWidth,
      height: finalCropHeight,
    })
    .resize(224, 224) // Resize to standard size
    .toBuffer();
  return await convertToJpeg(cropped);
}

// Image preprocessing and embedding generation
export const preprocessImage = memoize(
  async (buffer: Buffer): Promise<tf.Tensor4D> => {
    try {
      // Validate image before processing
      const metadata = await sharp(buffer).metadata();
      if (
        !metadata.width ||
        !metadata.height ||
        metadata.width === 0 ||
        metadata.height === 0
      ) {
        throw new Error("Invalid image dimensions");
      }

      const resizedBuffer = await loadAndResizeImage(buffer, {
        width: 224,
        height: 224,
      });
      let decodedTensor: tf.Tensor3D | null = null;
      let processedTensor: tf.Tensor4D | null = null;
      try {
        decodedTensor = await decodeImage(resizedBuffer, 3);
        processedTensor = tf.tidy(() => {
          const expandedTensor = tf.expandDims(decodedTensor!, 0);
          const floatTensor = expandedTensor.toFloat();
          return floatTensor.div(127.5).sub(1) as tf.Tensor4D;
        });

        return processedTensor;
      } catch (error: unknown) {
        throw new Error(
          `Failed to create tensor: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        if (decodedTensor) tf.dispose(decodedTensor);
      }
    } catch (error: unknown) {
      throw new Error(
        `Failed to preprocess image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  (buffer: Buffer) => createHash("md5").update(buffer).digest("hex"),
);

export const generateEmbedding = memoize(
  async (inputTensor: tf.Tensor4D, model: tf.GraphModel): Promise<number[]> => {
    // Generate cache key from tensor data
    const tensorData = await inputTensor.data();
    const cacheKey = Buffer.from(new Uint8Array(tensorData)).toString("base64");

    // Check cache first
    const cachedEmbedding = embeddingsCache.get(cacheKey);
    if (cachedEmbedding) {
      return cachedEmbedding;
    }

    // Generate embedding if not in cache
    const embedding = tf.tidy(() => {
      try {
        const features = model.predict(inputTensor) as tf.Tensor2D;
        return Array.from(features.dataSync());
      } catch (error: unknown) {
        throw new Error(
          `Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });

    // Cache the result
    embeddingsCache.set(cacheKey, embedding);
    return embedding;
  },
  (tensor) => tensor.id,
);

// Helper function to recalculate face probability
export async function recalculateFaceProbability(
  buffer: Buffer,
  face: { topLeft: [number, number]; bottomRight: [number, number] },
): Promise<number> {
  try {
    if (!blazefaceModel) {
      blazefaceModel = await blazeface.load();
    }

    // Validate and extract metadata
    const metadata = await sharp(buffer).metadata();
    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width === 0 ||
      metadata.height === 0
    ) {
      throw new Error("Invalid image dimensions");
    }
    const { width, height } = metadata;

    const [x1, y1] = face.topLeft;
    const [x2, y2] = face.bottomRight;

    // Add padding to the face region
    const padding = 20; // pixels
    const extractWidth = Math.min(width, Math.round(x2 - x1 + padding * 2));
    const extractHeight = Math.min(height, Math.round(y2 - y1 + padding * 2));
    const extractX = Math.max(0, Math.round(x1 - padding));
    const extractY = Math.max(0, Math.round(y1 - padding));

    // Validate extraction dimensions
    if (extractWidth <= 0 || extractHeight <= 0) {
      throw new Error("Invalid face region dimensions");
    }

    const faceBuffer = await sharp(buffer)
      .extract({
        left: extractX,
        top: extractY,
        width: extractWidth,
        height: extractHeight,
      })
      .toBuffer();

    // Run face detection on the extracted region
    let tensor: tf.Tensor3D | null = null;
    let decodedTensor: tf.Tensor3D | null = null;
    try {
      decodedTensor = await decodeImage(faceBuffer, 3);
      tensor = tf.tidy(() => tf.cast(decodedTensor!, "float32")) as tf.Tensor3D;
      const predictions = await blazefaceModel.estimateFaces(tensor, false);

      // If a face is detected in the extracted region, use its probability
      if (predictions.length > 0) {
        const pred = predictions[0];
        if (typeof pred.probability === "number") {
          return pred.probability;
        } else if (Array.isArray(pred.probability)) {
          return pred.probability[0];
        } else if (
          pred.probability &&
          typeof pred.probability.dataSync === "function"
        ) {
          return pred.probability.dataSync()[0];
        }
      }
      return 0;
    } catch (error: unknown) {
      throw new Error(
        `Failed to process face region: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      if (decodedTensor) tf.dispose(decodedTensor);
      if (tensor) tf.dispose(tensor);
    }
  } catch (error: unknown) {
    console.error("Error recalculating face probability:", error);
    return 0;
  }
}

// Prediction conversion utility
export async function convertPredictions(
  predictions: blazeface.NormalizedFace[],
  imageBuffer?: Buffer,
): Promise<
  Array<{
    topLeft: [number, number];
    bottomRight: [number, number];
    probability: number;
  }>
> {
  const results = [];

  for (const pred of predictions) {
    // Handle tensor values safely
    let topLeft: [number, number] = [0, 0];
    let bottomRight: [number, number] = [0, 0];
    let probability = 0;

    try {
      if (Array.isArray(pred.topLeft)) {
        topLeft = [pred.topLeft[0], pred.topLeft[1]];
      } else if (pred.topLeft && typeof pred.topLeft.dataSync === "function") {
        const data = pred.topLeft.dataSync();
        topLeft = [data[0], data[1]];
      }

      if (Array.isArray(pred.bottomRight)) {
        bottomRight = [pred.bottomRight[0], pred.bottomRight[1]];
      } else if (
        pred.bottomRight &&
        typeof pred.bottomRight.dataSync === "function"
      ) {
        const data = pred.bottomRight.dataSync();
        bottomRight = [data[0], data[1]];
      }

      // Validate coordinates
      if (
        isNaN(topLeft[0]) ||
        isNaN(topLeft[1]) ||
        isNaN(bottomRight[0]) ||
        isNaN(bottomRight[1])
      ) {
        throw new Error("Invalid face coordinates");
      }

      // Handle probability value
      if (typeof pred.probability === "number") {
        probability = pred.probability;
      } else if (Array.isArray(pred.probability)) {
        probability = pred.probability[0];
      } else if (
        pred.probability &&
        typeof pred.probability.dataSync === "function"
      ) {
        const data = pred.probability.dataSync();
        probability = data[0];
      }

      // Ensure probability is between 0 and 1
      probability = Math.max(0, Math.min(1, probability));

      // If probability is 0 and we have the image buffer, try to recalculate
      if (probability === 0 && imageBuffer) {
        probability = await recalculateFaceProbability(imageBuffer, {
          topLeft,
          bottomRight,
        });
      }

      results.push({
        topLeft,
        bottomRight,
        probability,
      });
    } catch (error) {
      console.error("Error converting face prediction:", error);
      continue; // Skip invalid predictions
    }
  }

  return results;
}

// Main face embedding generation function
export async function generateFaceEmbedding(imagePath: string) {
  await initialize();

  try {
    // Get or decode image
    let image = imageCache.get(imagePath);
    if (!image) {
      image = await decodeImageMemo(imagePath);
      imageCache.set(imagePath, image);
    }

    const predictions = await faceDetector.detect(image);

    if (predictions.length === 0) {
      return {
        path: imagePath,
        embedding: null,
        faces: 0,
        cached: new Date().toISOString(),
        predictions: [],
      };
    }

    // Get embeddings and attributes for each face
    const processedPredictions = await Promise.all(
      predictions.map(async (pred) => {
        const { topLeft, bottomRight, probability } = pred;

        // Extract face region for attribute detection
        const width = bottomRight[0] - topLeft[0];
        const height = bottomRight[1] - topLeft[1];

        // Add padding for better attribute detection
        const padding = Math.min(width, height) * 0.2;
        const paddedLeft = Math.max(0, topLeft[0] - padding);
        const paddedTop = Math.max(0, topLeft[1] - padding);
        const paddedWidth = Math.min(
          image.shape[1] - paddedLeft,
          width + padding * 2,
        );
        const paddedHeight = Math.min(
          image.shape[0] - paddedTop,
          height + padding * 2,
        );

        const faceRegion = tf.tidy(() =>
          tf.slice(
            image,
            [Math.round(paddedTop), Math.round(paddedLeft), 0],
            [Math.round(paddedHeight), Math.round(paddedWidth), 3],
          ),
        );

        const { attributes, confidence } =
          await faceAttributeDetector.detectAttributes(faceRegion, pred);
        faceRegion.dispose();

        return {
          topLeft,
          bottomRight,
          probability,
          attributes,
          attributeConfidence: confidence,
        };
      }),
    );

    // Use the first face's embedding as the representative embedding
    const embedding = await faceDetector.generateEmbedding(
      image,
      predictions[0],
    );

    return {
      path: imagePath,
      embedding,
      faces: predictions.length,
      cached: new Date().toISOString(),
      predictions: processedPredictions,
    };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    throw error;
  }
}
