import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Canvas, Image } from "@napi-rs/canvas";
import * as faceapi from "@vladmandic/face-api";

const MODEL_CACHE_DIR = join(homedir(), ".face-models");

// Ensure cache directory exists
if (!existsSync(MODEL_CACHE_DIR)) {
  mkdirSync(MODEL_CACHE_DIR, { recursive: true });
}

// Configure face-api.js environment for Node.js
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  createCanvasElement: () => new Canvas(1, 1) as any,
  createImageElement: () => new Image() as any,
});

let modelsLoaded = false;

/**
 * Load face-api.js models
 * Uses SSD MobileNet for face detection and FaceNet for recognition
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) {
    return;
  }

  console.log("Loading face-api.js models...");

  try {
    // Load models from node_modules
    const modelPath = join(
      process.cwd(),
      "node_modules",
      "@vladmandic",
      "face-api",
      "model",
    );

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
      faceapi.nets.ageGenderNet.loadFromDisk(modelPath),
    ]);

    modelsLoaded = true;
    console.log("✅ All face-api.js models loaded successfully");
  } catch (error) {
    console.error("Failed to load face-api.js models:", error);
    throw error;
  }
}

export function clearModelCache() {
  modelsLoaded = false;
}

export { faceapi };
