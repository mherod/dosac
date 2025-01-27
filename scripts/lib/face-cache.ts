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
  // Verify all embedding files exist before saving
  for (const entry of Object.values(index.entries)) {
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

    if (!embeddingExists) {
      console.error(
        `Cannot save index: Missing embedding file ${entry.embeddingFile} referenced for path ${entry.path}`,
      );
      process.exit(1);
    }
  }

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

export function loadEmbedding(embeddingFile: string): FaceEmbedding {
  // Handle both direct paths and filenames
  const fileName = embeddingFile.includes("/")
    ? embeddingFile.split("/").pop()!
    : embeddingFile;

  // Ensure the filename is a valid hash
  if (!isValidCacheFileName(fileName)) {
    throw new Error(`Invalid cache filename: ${fileName}`);
  }

  // Try all cache directories
  for (const dir of CACHE_DIRS) {
    const embeddingPath = join(dir, fileName);
    if (process.env.DEBUG_CACHE) {
      console.log("Checking " + embeddingPath);
    }
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
  const index = loadIndex();
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
      // Try all cache directories
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
