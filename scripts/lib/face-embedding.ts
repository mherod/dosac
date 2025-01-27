import tf, { decodeImage } from "./tensorflow-setup";
import * as blazeface from "@tensorflow-models/blazeface";
import sharp from "sharp";
import { memoize } from "lodash-es";
import { createHash } from "crypto";
import { FaceEmbedding } from "./face-cache";
import { basename } from "path";
import { createCanvas, Image, Canvas } from "canvas";
import { LRUCache } from "lru-cache";
import { MAX_EMBEDDING_SIZE, SUPPORTED_IMAGE_TYPES } from "./constants";
import { convertToJpeg } from "./image-processing";

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

// Load models
let blazefaceModel: blazeface.BlazeFaceModel | null = null;
let mobileNet: tf.GraphModel | null = null;

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

// Face detection and processing
export const loadModels = memoize(async () => {
  try {
    if (!blazefaceModel) {
      blazefaceModel = await blazeface.load();
    }
    if (!mobileNet) {
      mobileNet = await tf.loadGraphModel(
        "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1",
        { fromTFHub: true },
      );
    }
    return { blazefaceModel, mobileNet };
  } catch (error) {
    throw error;
  }
});

export const detectFaces = memoize(
  async (buffer: Buffer) => {
    if (!blazefaceModel) {
      blazefaceModel = await blazeface.load();
    }

    try {
      // Validate and convert to PNG
      const metadata = await sharp(buffer).metadata();
      if (
        !metadata.width ||
        !metadata.height ||
        metadata.width === 0 ||
        metadata.height === 0
      ) {
        throw new Error("Invalid image dimensions");
      }

      // Convert to PNG for consistent format and alignment
      const pngBuffer = await sharp(buffer)
        .ensureAlpha() // Ensure consistent channels (RGBA)
        .png()
        .toBuffer();

      // Decode image outside of tf.tidy
      const decoded = await decodeImage(pngBuffer, 4); // Force 4 channels (RGBA)

      // Process tensor with explicit shape and dtype
      const tensor = tf.tidy(() => {
        try {
          const float32Tensor = tf.cast(decoded, "float32");
          const rgbTensor = float32Tensor.slice([0, 0, 0], [-1, -1, 3]); // Take first 3 channels
          return rgbTensor as tf.Tensor3D;
        } catch (error: unknown) {
          throw new Error(
            `Failed to create tensor: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      });

      // Clean up decoded tensor
      tf.dispose(decoded);

      const predictions = await blazefaceModel.estimateFaces(tensor, false);
      tf.dispose(tensor);

      return { predictions, width: metadata.width, height: metadata.height };
    } catch (error) {
      console.error("Error in face detection:", error);
      return { predictions: [], width: 0, height: 0 };
    }
  },
  (buffer: Buffer) => createHash("md5").update(buffer).digest("hex"),
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
  const padding = {
    width: faceWidth * 0.2,
    height: faceHeight * 0.2,
  };

  const center = calculateCenterPoint(face.topLeft, face.bottomRight);
  const cropSize = Math.max(
    Math.floor(faceWidth + padding.width * 2),
    Math.floor(faceHeight + padding.height * 2),
  );

  const cropped = await sharp(buffer)
    .extract({
      left: Math.max(0, Math.floor(center.x - cropSize / 2)),
      top: Math.max(0, Math.floor(center.y - cropSize / 2)),
      width: Math.min(cropSize, width - Math.floor(center.x - cropSize / 2)),
      height: Math.min(cropSize, height - Math.floor(center.y - cropSize / 2)),
    })
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
export async function generateFaceEmbedding(
  buffer: Buffer,
  filePath: string,
  options: GenerateEmbeddingOptions = {},
): Promise<FaceEmbedding | null> {
  const { logProgress = () => {} } = options;
  let inputTensor: tf.Tensor4D | null = null;
  const fileName = basename(filePath);

  try {
    // Validate input buffer
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new Error("Invalid input buffer");
    }

    // Validate image format and dimensions
    const metadata = await sharp(buffer).metadata();
    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width === 0 ||
      metadata.height === 0
    ) {
      throw new Error("Invalid image dimensions");
    }

    // Load models
    const { mobileNet } = await loadModels();

    // Convert to PNG for compatibility
    const pngBuffer = await sharp(buffer).png().toBuffer();

    // Detect faces
    logProgress("Detecting faces...");
    const faceDetection = await detectFaces(pngBuffer);

    if (!faceDetection.predictions || faceDetection.predictions.length === 0) {
      logProgress(`No faces detected in ${fileName}`);
      return null;
    }

    logProgress(
      `Found ${faceDetection.predictions.length} faces in ${fileName}`,
    );

    // Generate embedding
    logProgress(`Generating face embedding for ${fileName}...`);
    inputTensor = await preprocessImage(pngBuffer);
    const embedding = await generateEmbedding(inputTensor, mobileNet!);

    // Convert predictions with the image buffer for potential recalculation
    const predictions = await convertPredictions(
      faceDetection.predictions,
      pngBuffer,
    );

    const embeddingData: FaceEmbedding = {
      path: "", // Path will be set by the caller
      embedding,
      faces: faceDetection.predictions.length,
      cached: new Date().toISOString(),
      predictions,
    };

    logProgress(`Face embedding generated successfully for ${fileName}`);
    return embeddingData;
  } catch (error) {
    if (error instanceof Error) {
      logProgress(
        `Error generating face embedding for ${fileName}: ${error.message}`,
      );
    } else {
      logProgress(
        `Error generating face embedding for ${fileName}: Unknown error`,
      );
    }
    throw error;
  } finally {
    if (inputTensor) {
      tf.dispose(inputTensor);
    }
    tf.dispose([]);
  }
}
