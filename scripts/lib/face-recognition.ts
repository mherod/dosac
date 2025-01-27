import { faceNet, FaceNetEmbedding } from "./face-net";
import { faceProcessor } from "./face-processor";
import { loadModels, detectFaces, FacePrediction } from "./face-embedding";
import { FaceEmbedding } from "./face-cache";
import { LRUCache } from "lru-cache";
import { createHash } from "crypto";

// Types
export interface RecognitionOptions {
  minConfidence?: number;
  maxFaces?: number;
  alignmentThreshold?: number;
}

export interface RecognitionResult {
  embedding: FaceNetEmbedding;
  face: FacePrediction;
  alignmentScore: number;
}

export interface MatchResult {
  embedding: FaceEmbedding;
  similarity: number;
  alignmentScore: number;
}

// Configure LRU cache for processed faces
const processedFacesCache = new LRUCache<string, RecognitionResult>({
  max: 1000, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Cache for 1 hour
  updateAgeOnGet: true,
});

export class FaceRecognitionService {
  private initialized = false;
  private readonly options: Required<RecognitionOptions>;

  constructor(options: RecognitionOptions = {}) {
    this.options = {
      minConfidence: options.minConfidence ?? 0.8,
      maxFaces: options.maxFaces ?? 5,
      alignmentThreshold: options.alignmentThreshold ?? 0.7,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize all required models
      await Promise.all([
        loadModels(),
        faceNet.loadModel(),
        faceProcessor.initialize(),
      ]);
      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Failed to initialize face recognition service: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  }

  private generateCacheKey(buffer: Buffer, face: FacePrediction): string {
    const hash = createHash("md5");
    hash.update(buffer);
    hash.update(JSON.stringify(face));
    return hash.digest("hex");
  }

  async processImage(
    buffer: Buffer,
    options: RecognitionOptions = {},
  ): Promise<RecognitionResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const mergedOptions = { ...this.options, ...options };

    try {
      // Detect faces
      const { predictions } = await detectFaces(buffer);
      if (!predictions.length) {
        return [];
      }

      // Sort by confidence and limit number of faces
      const sortedFaces = predictions
        .filter((face) => face.probability >= mergedOptions.minConfidence)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, mergedOptions.maxFaces);

      // Process each face
      const results = await Promise.all(
        sortedFaces.map(async (face) => {
          const cacheKey = this.generateCacheKey(buffer, face);
          const cached = processedFacesCache.get(cacheKey);
          if (cached) {
            return cached;
          }

          // Align and preprocess face
          const processedBuffer = await faceProcessor.preprocessFace(
            buffer,
            face,
          );
          const { alignmentScore } = await faceProcessor.alignFace(
            buffer,
            face,
          );

          // Skip faces with poor alignment if threshold is set
          if (alignmentScore < mergedOptions.alignmentThreshold) {
            return null;
          }

          // Generate embedding
          const embedding = await faceNet.generateEmbedding(
            processedBuffer,
            face,
          );
          if (!embedding) {
            return null;
          }

          const result = {
            embedding,
            face,
            alignmentScore,
          };

          // Cache the result
          processedFacesCache.set(cacheKey, result);
          return result;
        }),
      );

      return results.filter(
        (result): result is RecognitionResult => result !== null,
      );
    } catch (error) {
      throw new Error(
        `Failed to process image: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async findMatches(
    queryEmbedding: FaceNetEmbedding,
    candidates: FaceEmbedding[],
    threshold = 0.6,
  ): Promise<MatchResult[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const matches: MatchResult[] = [];

    for (const candidate of candidates) {
      const similarity = faceNet.calculateSimilarity(
        queryEmbedding.embedding,
        candidate.embedding,
      );

      if (similarity >= threshold) {
        matches.push({
          embedding: candidate,
          similarity,
          alignmentScore: queryEmbedding.alignmentScore ?? 1.0,
        });
      }
    }

    // Sort by similarity score
    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  async compareFaces(
    buffer1: Buffer,
    buffer2: Buffer,
    options: RecognitionOptions = {},
  ): Promise<{
    similarity: number;
    alignmentScore1: number;
    alignmentScore2: number;
  } | null> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Process both images
      const [faces1, faces2] = await Promise.all([
        this.processImage(buffer1, options),
        this.processImage(buffer2, options),
      ]);

      if (!faces1.length || !faces2.length) {
        return null;
      }

      // Use the highest confidence face from each image
      const face1 = faces1[0];
      const face2 = faces2[0];

      // Calculate similarity
      const similarity = faceNet.calculateSimilarity(
        face1.embedding.embedding,
        face2.embedding.embedding,
      );

      return {
        similarity,
        alignmentScore1: face1.alignmentScore,
        alignmentScore2: face2.alignmentScore,
      };
    } catch (error) {
      throw new Error(
        `Failed to compare faces: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Utility method to clear caches
  clearCache(): void {
    processedFacesCache.clear();
  }
}

// Export singleton instance
export const faceRecognition = new FaceRecognitionService();
