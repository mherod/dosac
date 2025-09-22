import "server-only";

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import { generateFaceEmbedding } from "./face-embedding";
import { faceNet } from "./face-net";
import { faceProcessor } from "./face-processor";
import { faceRecognition } from "./face-recognition";

const TEST_IMAGE = join(process.cwd(), "scripts", "search.webp");

// Initialize TensorFlow.js with Node backend
tf.setBackend("tensorflow");

describe("face-recognition", () => {
  beforeAll(async () => {
    try {
      await faceRecognition.initialize();
    } catch (error) {
      console.error("Failed to initialize face recognition:", error);
      throw error;
    }
  });

  afterEach(() => {
    faceRecognition.clearCache();
    tf.dispose([]);
  });

  test("should initialize all required models", async () => {
    expect(faceRecognition).toBeDefined();
    await expect(faceRecognition.initialize()).resolves.not.toThrow();
  });

  test("should process image and detect faces", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer);

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("embedding");
    expect(results[0]).toHaveProperty("face");
    expect(results[0]).toHaveProperty("alignmentScore");
    expect(results[0].alignmentScore).toBeGreaterThan(0);
  });

  test("should handle images without faces", async () => {
    const buffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const results = await faceRecognition.processImage(buffer);
    expect(results).toHaveLength(0);
  });

  test("should respect minimum confidence threshold", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer, {
      minConfidence: 0.99, // Very high threshold
    });

    expect(results.length).toBeLessThanOrEqual(
      (await faceRecognition.processImage(buffer)).length,
    );
  });

  test("should respect maximum faces limit", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const maxFaces = 1;
    const results = await faceRecognition.processImage(buffer, {
      maxFaces,
    });

    expect(results.length).toBeLessThanOrEqual(maxFaces);
  });

  test("should generate consistent embeddings for same face", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results1 = await faceRecognition.processImage(buffer);
    const results2 = await faceRecognition.processImage(buffer);

    expect(results1[0].embedding.embedding).toEqual(
      results2[0].embedding.embedding,
    );
  });

  test("should compare faces successfully", async () => {
    const buffer1 = readFileSync(TEST_IMAGE);
    const buffer2 = readFileSync(TEST_IMAGE); // Same image

    const result = await faceRecognition.compareFaces(buffer1, buffer2);
    expect(result).not.toBeNull();
    if (result) {
      expect(result.similarity).toBeGreaterThan(0.9); // Should be very similar
      expect(result.alignmentScore1).toBeGreaterThan(0);
      expect(result.alignmentScore2).toBeGreaterThan(0);
    }
  });

  test("should handle face comparison with no faces", async () => {
    const emptyBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const buffer = readFileSync(TEST_IMAGE);
    const result = await faceRecognition.compareFaces(emptyBuffer, buffer);
    expect(result).toBeNull();
  });

  test("should find matches above threshold", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer);
    const queryEmbedding = results[0].embedding;

    // Create test candidates
    const candidates = [
      {
        path: "test1.jpg",
        embedding: queryEmbedding.embedding, // Same embedding
        faces: 1,
        cached: new Date().toISOString(),
        predictions: [],
      },
      {
        path: "test2.jpg",
        embedding: queryEmbedding.embedding.map((v: any) => v * 0.5), // Different embedding
        faces: 1,
        cached: new Date().toISOString(),
        predictions: [],
      },
    ];

    const matches = await faceRecognition.findMatches(
      queryEmbedding,
      candidates,
      0.8,
    );
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].similarity).toBeGreaterThan(0.8);
  });

  test("should handle invalid images", async () => {
    const invalidBuffer = Buffer.from("not an image");
    await expect(faceRecognition.processImage(invalidBuffer)).rejects.toThrow();
  });

  test("should properly align faces", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer);

    expect(results[0].alignmentScore).toBeDefined();
    expect(results[0].alignmentScore).toBeGreaterThan(0);
    expect(results[0].alignmentScore).toBeLessThanOrEqual(1);
  });

  test("should respect alignment threshold", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer, {
      alignmentThreshold: 0.99, // Very high threshold
    });

    expect(results.length).toBeLessThanOrEqual(
      (await faceRecognition.processImage(buffer)).length,
    );
  });

  test("should handle memory cleanup", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const initialMemory = process.memoryUsage().heapUsed;

    // Run multiple times to check for memory leaks
    for (let i = 0; i < 5; i++) {
      await faceRecognition.processImage(buffer);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiff = finalMemory - initialMemory;

    // Memory usage shouldn't increase significantly
    // Allow for some overhead (50MB)
    expect(memoryDiff).toBeLessThan(50 * 1024 * 1024);
  });

  test("should cache processed faces", async () => {
    const buffer = readFileSync(TEST_IMAGE);

    // First call should process the image
    const start1 = Date.now();
    const results1 = await faceRecognition.processImage(buffer);
    const time1 = Date.now() - start1;

    // Second call should use cache
    const start2 = Date.now();
    const results2 = await faceRecognition.processImage(buffer);
    const time2 = Date.now() - start2;

    expect(results1).toEqual(results2);
    expect(time2).toBeLessThan(time1); // Cached call should be faster
  });

  test("should clear cache successfully", async () => {
    const buffer = readFileSync(TEST_IMAGE);

    // Process image and cache results
    await faceRecognition.processImage(buffer);

    // Clear cache
    faceRecognition.clearCache();

    // Process again - should take longer as cache is cleared
    const start = Date.now();
    await faceRecognition.processImage(buffer);
    const processingTime = Date.now() - start;

    expect(processingTime).toBeGreaterThan(10); // Should take some time to process
  });
});

// Test FaceNet specific functionality
describe("face-net", () => {
  test("should load model successfully", async () => {
    await expect(faceNet.loadModel()).resolves.not.toThrow();
  });

  test("should generate valid embeddings", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer);
    const embedding = results[0].embedding;

    expect(embedding.embedding).toHaveLength(128); // FaceNet produces 128-dimensional embeddings
    expect(embedding.confidence).toBeGreaterThan(0);
  });

  test("should calculate similarity correctly", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const results = await faceRecognition.processImage(buffer);
    const embedding = results[0].embedding.embedding;

    // Same embedding should have similarity 1
    const similarity1 = faceNet.calculateSimilarity(embedding, embedding);
    expect(similarity1).toBeCloseTo(1, 5);

    // Different embedding should have lower similarity
    const differentEmbedding = embedding.map((v: any) => v * 0.5);
    const similarity2 = faceNet.calculateSimilarity(
      embedding,
      differentEmbedding,
    );
    expect(similarity2).toBeLessThan(similarity1);
  });
});

// Test FaceProcessor specific functionality
describe("face-processor", () => {
  test("should initialize successfully", async () => {
    await expect(faceProcessor.initialize()).resolves.not.toThrow();
  });

  test("should align faces correctly", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const result = await generateFaceEmbedding(TEST_IMAGE);
    if (!result || result.predictions.length === 0) {
      throw new Error("No faces detected in test image");
    }
    const aligned = await faceProcessor.alignFace(
      buffer,
      result.predictions[0],
    );

    expect(aligned.buffer).toBeDefined();
    expect(aligned.width).toBeGreaterThan(0);
    expect(aligned.height).toBeGreaterThan(0);
  });

  test("should preprocess faces correctly", async () => {
    const buffer = readFileSync(TEST_IMAGE);
    const result = await generateFaceEmbedding(TEST_IMAGE);
    if (!result || result.predictions.length === 0) {
      throw new Error("No faces detected in test image");
    }
    const processedBuffer = await faceProcessor.preprocessFace(
      buffer,
      result.predictions[0],
    );

    expect(Buffer.isBuffer(processedBuffer)).toBe(true);
    expect(processedBuffer.length).toBeGreaterThan(0);

    // Verify the processed image dimensions
    const metadata = await sharp(processedBuffer).metadata();
    expect(metadata.width).toBeGreaterThan(0);
    expect(metadata.height).toBeGreaterThan(0);
  });
});
