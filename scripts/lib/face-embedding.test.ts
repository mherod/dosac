import "server-only";

import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NormalizedFace } from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import {
  convertPredictions,
  detectFaces,
  generateFaceEmbedding,
} from "./face-embedding";

const TEST_IMAGE = join(process.cwd(), "scripts", "search.webp");

type FacePrediction = {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: number;
};

// Mock predictions for testing
const mockPrediction: NormalizedFace = {
  topLeft: [100, 100],
  bottomRight: [200, 200],
  landmarks: [
    [150, 150],
    [160, 150],
  ],
  probability: 0.95,
};

// Create a mock tensor prediction that matches the NormalizedFace type
const mockTensorPrediction: NormalizedFace = {
  topLeft: tf.tensor1d([100, 100]) as unknown as [number, number],
  bottomRight: tf.tensor1d([200, 200]) as unknown as [number, number],
  landmarks: [
    [150, 150],
    [160, 150],
  ],
  probability: tf.scalar(0.95) as unknown as number,
};

describe("face-embedding", () => {
  test("should detect faces in test image", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const result = await detectFaces(buffer);

    expect(result.predictions).toBeDefined();
    expect(result.predictions.length).toBeGreaterThan(0);

    const converted = await convertPredictions(result.predictions);
    expect(converted[0].probability).toBeGreaterThan(0.5);
  });

  test("should convert predictions to correct format", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const { predictions } = await detectFaces(buffer);
    const converted = await convertPredictions(predictions);

    expect(converted.length).toBeGreaterThan(0);
    expect(converted[0]).toHaveProperty("topLeft");
    expect(converted[0]).toHaveProperty("bottomRight");
    expect(converted[0]).toHaveProperty("probability");
    expect(Array.isArray(converted[0].topLeft)).toBe(true);
    expect(Array.isArray(converted[0].bottomRight)).toBe(true);
    expect(converted[0].topLeft.length).toBe(2);
    expect(converted[0].bottomRight.length).toBe(2);
  });

  test("should generate face embedding", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const messages: string[] = [];
    const embeddingData = await generateFaceEmbedding(buffer, TEST_IMAGE, {
      logProgress: (msg: string) => {
        messages.push(msg);
        return messages.length;
      },
    });

    expect(embeddingData).not.toBeNull();
    expect(embeddingData?.embedding).toBeDefined();
    expect(embeddingData?.embedding.length).toBeGreaterThan(0);
    expect(embeddingData?.faces).toBeGreaterThan(0);
    expect(embeddingData?.predictions.length).toBeGreaterThan(0);
    expect(embeddingData?.cached).toBeDefined();
    expect(messages).toContain("Loading models...");
    expect(messages).toContain("Models loaded successfully");
    expect(messages).toContain("Detecting faces...");
    expect(messages).toContain(
      "Face embedding generated successfully for search.webp",
    );
  });

  test("should return null for image without faces", async () => {
    const buffer = await sharp({
      create: {
        width: 1,
        height: 1,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const messages: string[] = [];
    const embeddingData = await generateFaceEmbedding(buffer, TEST_IMAGE, {
      logProgress: (msg: string) => {
        messages.push(msg);
        return messages.length;
      },
    });

    expect(embeddingData).toBeNull();
    expect(messages).toContain("No faces detected in search.webp");
  });

  test("should handle invalid image data", async () => {
    const buffer = Buffer.from("not an image");

    await expect(generateFaceEmbedding(buffer, "test.jpg")).rejects.toThrow();
  });

  test("should generate consistent embeddings for same face", async () => {
    const buffer = readFileSync(TEST_IMAGE);

    const embedding1 = await generateFaceEmbedding(buffer, "test1.jpg");
    const embedding2 = await generateFaceEmbedding(buffer, "test2.jpg");

    expect(embedding1).not.toBeNull();
    expect(embedding2).not.toBeNull();
    if (embedding1 && embedding2) {
      expect(embedding1.embedding).toEqual(embedding2.embedding);
    }
  });

  test("should handle memory cleanup", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const initialMemory = process.memoryUsage().heapUsed;

    // Run multiple times to check for memory leaks
    for (let i = 0; i < 5; i++) {
      await generateFaceEmbedding(buffer, `test${i}.jpg`);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiff = finalMemory - initialMemory;

    // Memory usage shouldn't increase significantly
    // Allow for some overhead (50MB)
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024);
  });

  test("should convert predictions correctly", async () => {
    const predictions = [mockPrediction];
    const result: FacePrediction[] = await convertPredictions(predictions);

    expect(result[0].probability).toBeGreaterThan(0.5);
  });

  test("should handle tensor values", async () => {
    const predictions = [mockTensorPrediction];
    const result: FacePrediction[] = await convertPredictions(predictions);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("topLeft");
    expect(result[0]).toHaveProperty("bottomRight");
    expect(result[0]).toHaveProperty("probability");
    expect(Array.isArray(result[0].topLeft)).toBe(true);
    expect(Array.isArray(result[0].bottomRight)).toBe(true);
    expect(result[0].topLeft.length).toBe(2);
    expect(result[0].bottomRight.length).toBe(2);
  });

  // Cleanup tensors after tests
  afterEach(() => {
    tf.dispose([]);
  });
});
