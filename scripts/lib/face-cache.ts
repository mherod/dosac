import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  statSync,
} from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { generateFaceEmbedding } from "./face-embedding";
import { CACHE_DIRS, PRIMARY_CACHE_DIR, CACHE_FILE_PATTERN } from "./config";
import { FaceAttributes, AttributeConfidence } from "./face-attributes";

export const INDEX_FILE = join(PRIMARY_CACHE_DIR, "index.json");

// Ensure cache directories exist
for (const dir of CACHE_DIRS) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export interface FaceEmbedding {
  path: string;
  embedding: number[];
  faces: number;
  cached: string;
  predictions: Array<{
    topLeft: [number, number];
    bottomRight: [number, number];
    probability: number;
    attributes?: FaceAttributes;
    attributeConfidence?: AttributeConfidence;
  }>;
}

export interface IndexEntry {
  path: string;
  mtime: number;
  faces: number;
  embeddingFile: string;
  noFaces?: boolean;
}

export interface CacheIndex {
  entries: { [path: string]: IndexEntry };
  lastUpdate: string;
}

export function loadIndex(): CacheIndex {
  if (existsSync(INDEX_FILE)) {
    const index = JSON.parse(readFileSync(INDEX_FILE, "utf-8")) as CacheIndex;
    const validEntries: { [path: string]: IndexEntry } = {};
    let hasInvalidEntries = false;

    // Only keep entries where embedding files exist
    for (const [path, entry] of Object.entries(index.entries)) {
      if (typeof entry !== "object" || !entry || !entry.embeddingFile) {
        console.log(`Filtering out invalid entry for path: ${path}`);
        hasInvalidEntries = true;
        continue;
      }

      let embeddingExists = false;

      // Check primary cache directory first
      const primaryEmbeddingPath = join(PRIMARY_CACHE_DIR, entry.embeddingFile);
      if (existsSync(primaryEmbeddingPath)) {
        embeddingExists = true;
      } else {
        // Check worker cache directories
        for (const dir of CACHE_DIRS) {
          const embeddingPath = join(dir, entry.embeddingFile);
          if (process.env.DEBUG_CACHE) {
            console.log("Checking " + embeddingPath);
          }
          if (existsSync(embeddingPath)) {
            embeddingExists = true;
            break;
          }
        }
      }

      if (embeddingExists) {
        validEntries[path] = entry;
      } else {
        console.log(
          `Filtering out entry with missing embedding file: ${path} (${entry.embeddingFile})`,
        );
        hasInvalidEntries = true;
      }
    }

    // If we filtered any entries, save the cleaned index
    if (hasInvalidEntries) {
      const cleanedIndex = {
        entries: validEntries,
        lastUpdate: new Date().toISOString(),
      };
      writeFileSync(INDEX_FILE, JSON.stringify(cleanedIndex, null, 2));
      return cleanedIndex;
    }

    return {
      entries: validEntries,
      lastUpdate: index.lastUpdate,
    };
  }
  return { entries: {}, lastUpdate: new Date().toISOString() };
}

export function saveIndex(index: CacheIndex): void {
  // Remove entries with missing embedding files
  const validEntries: { [path: string]: IndexEntry } = {};

  for (const [path, entry] of Object.entries(index.entries)) {
    let embeddingExists = false;

    // Check primary cache directory first
    const primaryEmbeddingPath = join(PRIMARY_CACHE_DIR, entry.embeddingFile);
    if (existsSync(primaryEmbeddingPath)) {
      embeddingExists = true;
    } else {
      // Check worker cache directories
      for (const dir of CACHE_DIRS) {
        const embeddingPath = join(dir, entry.embeddingFile);
        if (existsSync(embeddingPath)) {
          embeddingExists = true;
          break;
        }
      }
    }

    if (embeddingExists) {
      validEntries[path] = entry;
    } else {
      console.log(
        `Removing entry with missing embedding file: ${path} (${entry.embeddingFile})`,
      );
    }
  }

  index.entries = validEntries;
  index.lastUpdate = new Date().toISOString();
  writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

export function isValidCacheFileName(fileName: string): boolean {
  return CACHE_FILE_PATTERN.test(fileName);
}

export function getShortFileName(filePath: string): string {
  const hash = createHash("md5").update(filePath).digest("hex").slice(0, 8);
  return `${hash}.json`;
}

export function saveEmbedding(filePath: string, data: FaceEmbedding): void {
  const embeddingFile = getShortFileName(filePath);
  const embeddingPath = join(PRIMARY_CACHE_DIR, embeddingFile);

  // Ensure we're only saving valid cache files
  if (!isValidCacheFileName(embeddingFile)) {
    throw new Error(`Invalid cache filename generated: ${embeddingFile}`);
  }

  // Ensure cache directory exists
  if (!existsSync(PRIMARY_CACHE_DIR)) {
    mkdirSync(PRIMARY_CACHE_DIR, { recursive: true });
  }

  writeFileSync(embeddingPath, JSON.stringify(data, null, 2));
}

export function loadEmbedding(fileName: string): FaceEmbedding {
  // Check primary cache directory first
  const primaryEmbeddingPath = join(PRIMARY_CACHE_DIR, fileName);
  if (existsSync(primaryEmbeddingPath)) {
    return JSON.parse(readFileSync(primaryEmbeddingPath, "utf-8"));
  }

  // Check worker cache directories
  for (const dir of CACHE_DIRS) {
    const embeddingPath = join(dir, fileName);
    if (existsSync(embeddingPath)) {
      return JSON.parse(readFileSync(embeddingPath, "utf-8"));
    }
  }

  throw new Error(`Embedding file not found: ${fileName}`);
}

export function updateIndex(
  index: CacheIndex,
  filePath: string,
  faces: number,
  mtime: number,
  noFaces?: boolean,
): void {
  const embeddingFile = getShortFileName(filePath);
  index.entries[filePath] = {
    path: filePath,
    mtime,
    faces,
    embeddingFile,
    noFaces,
  };
}

export interface SearchOptions {
  threshold?: number;
  limit?: number;
  minFaces?: number;
  maxFaces?: number;
}

export interface SearchResult extends FaceEmbedding {
  similarity: number;
}

export function searchCache(
  searchEmbedding: number[],
  options: SearchOptions = {},
): SearchResult[] {
  const { threshold = 0.6, limit = 10, minFaces, maxFaces } = options;

  const index = loadIndex();
  const results: SearchResult[] = [];

  for (const entry of Object.values(index.entries)) {
    // Apply face count filters
    if (typeof minFaces === "number" && entry.faces < minFaces) continue;
    if (typeof maxFaces === "number" && entry.faces > maxFaces) continue;

    const embeddingData = loadEmbedding(entry.embeddingFile);
    const similarity = cosineSimilarity(
      searchEmbedding,
      embeddingData.embedding,
    );

    if (similarity >= threshold) {
      results.push({
        ...embeddingData,
        similarity,
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

// Stats and diagnostics
export function getCacheStats() {
  const index = existsSync(INDEX_FILE)
    ? (JSON.parse(readFileSync(INDEX_FILE, "utf-8")) as CacheIndex)
    : { entries: {}, lastUpdate: new Date().toISOString() };
  const entries = Object.values(index.entries);

  return {
    totalImages: entries.length,
    totalFaces: entries.reduce((sum, entry) => sum + entry.faces, 0),
    byFaceCount: entries.reduce(
      (acc, entry) => {
        acc[entry.faces] = (acc[entry.faces] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    ),
    lastUpdate: index.lastUpdate,
    cacheSize: entries.reduce((sum, entry) => {
      // Check primary cache directory first
      const primaryEmbeddingPath = join(PRIMARY_CACHE_DIR, entry.embeddingFile);
      if (existsSync(primaryEmbeddingPath)) {
        return sum + readFileSync(primaryEmbeddingPath).length;
      }

      // Then check worker cache directories
      for (const dir of CACHE_DIRS) {
        const embeddingPath = join(dir, entry.embeddingFile);
        if (existsSync(embeddingPath)) {
          return sum + readFileSync(embeddingPath).length;
        }
      }
      return sum;
    }, 0),
  };
}

// Cache maintenance
export function validateCache(): { valid: boolean; errors: string[] } {
  const index = loadIndex();
  const errors: string[] = [];

  // Check index entries
  for (const [path, entry] of Object.entries(index.entries)) {
    // Validate embedding filename format
    if (!isValidCacheFileName(entry.embeddingFile)) {
      errors.push(`Invalid embedding filename format: ${entry.embeddingFile}`);
      continue;
    }

    // Check if original file still exists
    if (!existsSync(path)) {
      errors.push(`Original file missing: ${path}`);
      continue;
    }

    // Check if embedding file exists in any cache directory
    let embeddingExists = false;
    for (const dir of CACHE_DIRS) {
      const embeddingPath = join(dir, entry.embeddingFile);
      if (existsSync(embeddingPath)) {
        embeddingExists = true;
        break;
      }
    }

    if (!embeddingExists) {
      errors.push(`Embedding file missing: ${entry.embeddingFile}`);
      continue;
    }

    // Validate embedding file content
    try {
      const embedding = loadEmbedding(entry.embeddingFile);
      if (!embedding.embedding || !Array.isArray(embedding.embedding)) {
        errors.push(`Invalid embedding data for: ${path}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push(`Failed to read embedding for: ${path} - ${message}`);
    }
  }

  // Check for invalid files in all cache directories
  for (const dir of CACHE_DIRS) {
    const files = readdirSync(dir);
    for (const file of files) {
      // Skip index.json and worker.log
      if (file === "index.json" || file === "worker.log") continue;

      if (!isValidCacheFileName(file)) {
        errors.push(`Invalid cache file found in ${dir}: ${file}`);
      }
    }
  }

  // Also check primary cache directory
  const primaryFiles = readdirSync(PRIMARY_CACHE_DIR);
  for (const file of primaryFiles) {
    // Skip index.json and worker.log
    if (file === "index.json" || file === "worker.log") continue;

    if (!isValidCacheFileName(file)) {
      errors.push(`Invalid cache file found in ${PRIMARY_CACHE_DIR}: ${file}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Add cleanup function
export interface CleanupResult {
  removed: string[];
  errors: string[];
  indexCleaned: number;
  rebuilt: string[];
}

export async function cleanupInvalidCacheFiles(): Promise<CleanupResult> {
  const index = loadIndex();
  const removed: string[] = [];
  const errors: string[] = [];
  const rebuilt: string[] = [];
  let indexCleaned = 0;

  // Clean up invalid files in primary and worker cache directories
  const allCacheDirs = [PRIMARY_CACHE_DIR, ...CACHE_DIRS];
  for (const dir of allCacheDirs) {
    const files = readdirSync(dir);
    for (const file of files) {
      // Skip index.json and worker.log
      if (file === "index.json" || file === "worker.log") continue;

      // Remove any file that doesn't match the cache pattern
      if (!isValidCacheFileName(file)) {
        try {
          const fullPath = join(dir, file);
          unlinkSync(fullPath);
          removed.push(fullPath);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Unknown error";
          errors.push(`Failed to remove invalid file ${file}: ${message}`);
        }
      }
    }
  }

  // Clean up and rebuild index entries
  const newEntries: { [path: string]: IndexEntry } = {};

  for (const [path, entry] of Object.entries(index.entries)) {
    // Skip if original file doesn't exist
    if (!existsSync(path)) {
      indexCleaned++;
      continue;
    }

    // Get proper hashed filename
    const properEmbeddingFile = getShortFileName(path);

    // If the entry has an invalid filename, try to rebuild it
    if (
      !isValidCacheFileName(entry.embeddingFile) ||
      entry.embeddingFile !== properEmbeddingFile
    ) {
      try {
        // Generate new embedding
        const buffer = readFileSync(path);
        const embedding = await generateFaceEmbedding(buffer, path, {
          logProgress: (msg) => console.log(`[Rebuild ${path}] ${msg}`),
        });

        if (embedding) {
          // Save new embedding
          embedding.path = path;
          saveEmbedding(path, embedding);

          // Update index entry
          const mtime = statSync(path).mtimeMs;
          newEntries[path] = {
            path,
            mtime,
            faces: embedding.faces,
            embeddingFile: properEmbeddingFile,
          };

          rebuilt.push(path);
        } else {
          // If no faces detected, mark as having no faces
          const mtime = statSync(path).mtimeMs;
          newEntries[path] = {
            path,
            mtime,
            faces: 0,
            embeddingFile: properEmbeddingFile,
            noFaces: true,
          };
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to rebuild embedding for ${path}: ${message}`);

        // If we can't rebuild, mark as having no faces
        const mtime = statSync(path).mtimeMs;
        newEntries[path] = {
          path,
          mtime,
          faces: 0,
          embeddingFile: properEmbeddingFile,
          noFaces: true,
        };
      }
      indexCleaned++;
    } else {
      // Entry is valid, keep it
      newEntries[path] = entry;
    }
  }

  // Save cleaned index
  index.entries = newEntries;
  saveIndex(index);

  return {
    removed,
    errors,
    indexCleaned,
    rebuilt,
  };
}

export async function rebuildCacheIndex(): Promise<void> {
  const index: CacheIndex = {
    entries: {},
    lastUpdate: new Date().toISOString(),
  };
  const files = readdirSync(PRIMARY_CACHE_DIR);

  for (const file of files) {
    // Skip index.json and worker.log
    if (file === "index.json" || file === "worker.log") continue;

    // Only process valid cache files
    if (!isValidCacheFileName(file)) continue;

    try {
      const embeddingPath = join(PRIMARY_CACHE_DIR, file);
      const embeddingData = JSON.parse(
        readFileSync(embeddingPath, "utf-8"),
      ) as FaceEmbedding;
      const filePath = embeddingData.path;

      if (!filePath || !existsSync(filePath)) continue;

      const mtime = statSync(filePath).mtimeMs;
      index.entries[filePath] = {
        path: filePath,
        mtime,
        faces: embeddingData.faces,
        embeddingFile: file,
        noFaces: embeddingData.faces === 0,
      };
    } catch (error) {
      console.error(`Failed to process embedding file ${file}:`, error);
    }
  }

  saveIndex(index);
}

export interface ClusterStats {
  clusters: Array<{
    size: number;
    episodes: { [episode: string]: number };
    sampleImages: Array<{ path: string; similarity: number }>;
  }>;
  totalClusters: number;
  averageClusterSize: number;
}

// Default values for missing attributes
const DEFAULT_ATTRIBUTES: FaceAttributes = {
  gender: "male",
  hairColor: "brown",
  ageGroup: "young",
  skinTone: "medium",
};

const DEFAULT_CONFIDENCE: AttributeConfidence = {
  gender: 0.5,
  hairColor: 0.5,
  ageGroup: 0.5,
  skinTone: 0.5,
};

export async function analyzeFaceClusters(
  similarityThreshold = 0.75,
): Promise<ClusterStats> {
  const index = loadIndex();
  const entries = Object.values(index.entries).filter(
    (entry) => entry.faces > 0,
  );

  console.log(`Processing ${entries.length} images with faces...`);

  // Initialize clusters with the first face from each image
  const clusters: Array<{
    faces: number[][];
    paths: string[];
    episodes: { [episode: string]: number };
    attributes: FaceAttributes;
    attributeConfidence: AttributeConfidence;
  }> = [];

  // First pass: Create initial clusters
  let processedCount = 0;
  const logInterval = Math.max(1, Math.floor(entries.length / 20)); // Log every 5%

  for (const entry of entries) {
    try {
      const embedding = loadEmbedding(entry.embeddingFile);
      if (!embedding.embedding) continue;

      // Extract episode from path (e.g., s01e02)
      const episode = entry.path.match(/s\d+e\d+/)?.[0] || "unknown";

      // Find best matching cluster
      let bestMatch = -1;
      let bestSimilarity = 0;

      // Compare with representative faces of existing clusters
      for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];

        // Calculate embedding similarity
        const similarity = cosineSimilarity(
          embedding.embedding,
          cluster.faces[0],
        );

        // If we have attributes, factor them into the similarity score
        const faceAttrs =
          embedding.predictions[0].attributes || DEFAULT_ATTRIBUTES;
        const faceConf =
          embedding.predictions[0].attributeConfidence || DEFAULT_CONFIDENCE;

        const attributeMatch = calculateAttributeMatch(
          faceAttrs,
          cluster.attributes,
          faceConf,
          cluster.attributeConfidence,
        );

        // Combine embedding similarity with attribute matching
        const combinedSimilarity = similarity * 0.7 + attributeMatch * 0.3;

        if (
          combinedSimilarity > similarityThreshold &&
          combinedSimilarity > bestSimilarity
        ) {
          bestMatch = i;
          bestSimilarity = combinedSimilarity;
        }
      }

      if (bestMatch >= 0) {
        // Add to existing cluster
        clusters[bestMatch].faces.push(embedding.embedding);
        clusters[bestMatch].paths.push(entry.path);
        clusters[bestMatch].episodes[episode] =
          (clusters[bestMatch].episodes[episode] || 0) + 1;
      } else {
        // Create new cluster
        clusters.push({
          faces: [embedding.embedding],
          paths: [entry.path],
          episodes: { [episode]: 1 },
          attributes: embedding.predictions[0].attributes || DEFAULT_ATTRIBUTES,
          attributeConfidence:
            embedding.predictions[0].attributeConfidence || DEFAULT_CONFIDENCE,
        });
      }

      processedCount++;
      if (processedCount % logInterval === 0) {
        const percent = ((processedCount / entries.length) * 100).toFixed(1);
        console.log(
          `Processed ${processedCount}/${entries.length} images (${percent}%) - Current clusters: ${clusters.length}`,
        );
      }
    } catch (error) {
      console.error(`Error processing ${entry.path}:`, error);
      continue;
    }
  }

  console.log(
    `\nFirst pass complete. Found ${clusters.length} initial clusters.`,
  );
  console.log("Starting second pass: merging smaller clusters...");

  // Second pass: Merge smaller clusters with stricter attribute matching
  const MERGE_THRESHOLD = 0.65; // More aggressive threshold for merging
  const MIN_CLUSTER_SIZE = 2;

  let mergeCount = 0;
  let merged: boolean;
  do {
    merged = false;
    for (let i = 0; i < clusters.length; i++) {
      if (clusters[i].faces.length < MIN_CLUSTER_SIZE) {
        for (let j = 0; j < clusters.length; j++) {
          if (i !== j) {
            // Calculate average similarity between clusters
            const similarities = clusters[i].faces
              .map((face1) =>
                clusters[j].faces.map((face2) =>
                  cosineSimilarity(face1, face2),
                ),
              )
              .flat();
            const avgSimilarity =
              similarities.reduce((a, b) => a + b, 0) / similarities.length;

            // Check attribute compatibility
            const attributeMatch = calculateAttributeMatch(
              clusters[i].attributes,
              clusters[j].attributes,
              clusters[i].attributeConfidence,
              clusters[j].attributeConfidence,
            );

            // Combined similarity score
            const combinedSimilarity =
              avgSimilarity * 0.7 + attributeMatch * 0.3;

            if (combinedSimilarity > MERGE_THRESHOLD) {
              // Merge clusters
              clusters[j].faces.push(...clusters[i].faces);
              clusters[j].paths.push(...clusters[i].paths);
              for (const [episode, count] of Object.entries(
                clusters[i].episodes,
              )) {
                clusters[j].episodes[episode] =
                  (clusters[j].episodes[episode] || 0) + count;
              }
              clusters.splice(i, 1);
              merged = true;
              mergeCount++;
              console.log(
                `Merged small cluster (${mergeCount} merges so far) - ${clusters.length} clusters remaining`,
              );
              break;
            }
          }
        }
        if (merged) break;
      }
    }
  } while (merged);

  console.log(
    `\nSecond pass complete. Performed ${mergeCount} cluster merges.`,
  );

  // Format results
  const formattedClusters = clusters
    .filter((cluster) => cluster.faces.length >= MIN_CLUSTER_SIZE)
    .map((cluster) => ({
      size: cluster.paths.length,
      episodes: cluster.episodes,
      sampleImages: cluster.paths
        .map((path, idx) => ({
          path,
          similarity:
            idx === 0
              ? 1.0
              : cosineSimilarity(cluster.faces[0], cluster.faces[idx]),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5),
    }))
    .sort((a, b) => b.size - a.size);

  return {
    clusters: formattedClusters,
    totalClusters: formattedClusters.length,
    averageClusterSize:
      formattedClusters.reduce((sum, c) => sum + c.size, 0) /
      formattedClusters.length,
  };
}

// Helper function to calculate attribute matching score
export function calculateAttributeMatch(
  attrs1: FaceAttributes,
  attrs2: FaceAttributes,
  conf1: AttributeConfidence,
  conf2: AttributeConfidence,
): number {
  let score = 0;
  let totalWeight = 0;

  // Gender matching (high weight)
  const genderWeight = 0.4;
  if (attrs1.gender === attrs2.gender) {
    score += genderWeight * Math.min(conf1.gender || 0.5, conf2.gender || 0.5);
  }
  totalWeight += genderWeight;

  // Hair color matching (medium weight)
  const hairWeight = 0.3;
  if (attrs1.hairColor === attrs2.hairColor) {
    score +=
      hairWeight * Math.min(conf1.hairColor || 0.5, conf2.hairColor || 0.5);
  }
  totalWeight += hairWeight;

  // Age group matching (medium weight)
  const ageWeight = 0.2;
  if (attrs1.ageGroup === attrs2.ageGroup) {
    score += ageWeight * Math.min(conf1.ageGroup || 0.5, conf2.ageGroup || 0.5);
  }
  totalWeight += ageWeight;

  // Skin tone matching (low weight)
  const skinWeight = 0.1;
  if (attrs1.skinTone === attrs2.skinTone) {
    score +=
      skinWeight * Math.min(conf1.skinTone || 0.5, conf2.skinTone || 0.5);
  }
  totalWeight += skinWeight;

  return score / totalWeight;
}

export function getEmbeddingFileFromPath(path: string): string {
  const entry = loadIndex().entries[path];
  return entry ? entry.embeddingFile : "";
}
