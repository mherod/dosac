import "server-only";

import { readFileSync } from "node:fs";
import { Canvas, ImageData } from "@napi-rs/canvas";
import sharp from "sharp";
import { faceapi, loadModels } from "./model-loader";

export interface FacePrediction {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: number;
  descriptor?: number[];
  age?: number;
  gender?: string;
  genderProbability?: number;
}

/**
 * Face detector using face-api.js
 */
export class FaceDetector {
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      await loadModels();
      this.initialized = true;
    }
  }

  async detect(imagePath: string): Promise<FacePrediction[]> {
    if (!this.initialized) {
      throw new Error("Face detector not initialized");
    }

    try {
      // Load and decode image using sharp
      const imageBuffer = readFileSync(imagePath);
      const { data, info } = await sharp(imageBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Create canvas and put image data
      const canvas = new Canvas(info.width, info.height);
      const ctx = canvas.getContext("2d");
      const imageData = new ImageData(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
      );
      ctx.putImageData(imageData, 0, 0);

      // Detect faces with landmarks, descriptors, and age/gender
      const detections = await faceapi
        .detectAllFaces(canvas as any)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender();

      return detections.map((detection) => {
        const box = detection.detection.box;
        return {
          topLeft: [box.x, box.y] as [number, number],
          bottomRight: [box.x + box.width, box.y + box.height] as [
            number,
            number,
          ],
          probability: detection.detection.score,
          descriptor: Array.from(detection.descriptor),
          age: detection.age,
          gender: detection.gender,
          genderProbability: detection.genderProbability,
        };
      });
    } catch (error) {
      console.error(`Error detecting faces in ${imagePath}:`, error);
      return [];
    }
  }

  async generateEmbedding(
    imagePath: string,
    faceIndex: number = 0,
  ): Promise<number[]> {
    if (!this.initialized) {
      throw new Error("Face detector not initialized");
    }

    try {
      const detections = await this.detect(imagePath);
      if (detections.length === 0 || !detections[faceIndex]) {
        throw new Error("No face detected");
      }

      const descriptor = detections[faceIndex].descriptor;
      if (!descriptor) {
        throw new Error("No descriptor generated");
      }

      return descriptor;
    } catch (error) {
      throw new Error(
        `Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
