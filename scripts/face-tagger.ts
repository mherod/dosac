import fastGlob from "fast-glob";
import { statSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { cpus } from "os";
import { basename, join, resolve } from "path";
import {
  loadIndex,
  saveIndex,
  saveEmbedding,
  updateIndex,
  getCacheStats,
  rebuildCacheIndex,
  FaceEmbedding,
  CacheIndex,
} from "./lib/face-cache";
import { generateFaceEmbedding } from "./lib/face-embedding";
import { BATCH_SIZE, PRIMARY_CACHE_DIR } from "./lib/config";
import { promises as fs } from "fs";

const localDir = resolve("public/frames");

const { sync: fastGlobSync } = fastGlob;

// Initialize cache and index
if (!existsSync(PRIMARY_CACHE_DIR)) {
  mkdirSync(PRIMARY_CACHE_DIR, { recursive: true });
}

const indexPath = join(PRIMARY_CACHE_DIR, "index.json");
if (!existsSync(indexPath)) {
  writeFileSync(
    indexPath,
    JSON.stringify(
      { entries: {}, lastUpdate: new Date().toISOString() },
      null,
      2,
    ),
  );
}

const NUM_WORKERS = Math.max(1, Math.floor(cpus().length * 0.75)); // Use 75% of available cores

// Process images in parallel batches
async function processBatch(batch: string[], currentIndex: CacheIndex) {
  const results = await Promise.all(
    batch.map((filePath) => processImage(filePath, currentIndex)),
  );
  await saveIndex(currentIndex);
  return results;
}

async function processImage(
  filePath: string,
  currentIndex: CacheIndex,
): Promise<FaceEmbedding | null> {
  const fileName = basename(filePath);
  let stats;
  try {
    stats = statSync(filePath);
  } catch (error) {
    console.error(`Failed to read file stats for ${fileName}:`, error);
    return null;
  }

  const existingEntry = currentIndex.entries[filePath];

  if (existingEntry && existingEntry.mtime === stats.mtimeMs) {
    return null; // File hasn't changed, skip processing
  }

  let embeddingData;
  try {
    embeddingData = await generateFaceEmbedding(filePath);
  } catch (error) {
    console.error(`Failed to generate face embedding for ${fileName}:`, error);
    return null;
  }

  try {
    if (embeddingData) {
      // Set the file path and save
      embeddingData.path = filePath;
      saveEmbedding(filePath, embeddingData);
      updateIndex(currentIndex, filePath, embeddingData.faces, stats.mtimeMs);
    } else {
      // Mark file as having no faces
      updateIndex(currentIndex, filePath, 0, stats.mtimeMs, true);
    }
  } catch (error) {
    console.error(`Failed to save embedding data for ${fileName}:`, error);
    return null;
  }

  return embeddingData;
}

async function getAllImageFiles(): Promise<string[]> {
  const files = fastGlobSync(localDir + "/**/frame-blank*.jpg");
  console.log(`\nFound ${files.length} image files`);
  return files;
}

async function main() {
  // Check for --rebuild-index flag
  if (process.argv.includes("--rebuild-index")) {
    console.log("\nRebuilding cache index...");
    await rebuildCacheIndex();
    console.log("Cache index rebuilt successfully!");
    return;
  }

  // Always rebuild the cache index first
  console.log("\nRebuilding cache index...");
  await rebuildCacheIndex();

  const files = await getAllImageFiles();
  const batches = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    batches.push(files.slice(i, i + BATCH_SIZE));
  }

  const currentIndex = await loadIndex();

  console.log(
    `Processing ${files.length} files with batch size ${BATCH_SIZE} across ${NUM_WORKERS} CPU cores...`,
  );

  for (const batch of batches) {
    const batchSize =
      Buffer.concat(await Promise.all(batch.map((f: string) => fs.readFile(f))))
        .length /
      1024 /
      1024;

    console.log(
      `Processed ${files.indexOf(
        batch[0],
      )}/${files.length} files. Batch size: ${batchSize.toFixed(2)}MB.`,
    );

    await processBatch(batch, currentIndex);
  }

  const stats = await getCacheStats();
  console.log("\nCache Statistics:");
  console.log(`Total images with faces: ${stats.totalImages}`);
  console.log(`Total faces detected: ${stats.totalFaces}`);
  console.log("\nFace count distribution:");
  Object.entries(stats.byFaceCount).forEach(([count, images]) => {
    console.log(`${count} face(s): ${images} images`);
  });
  console.log(`\nCache size: ${(stats.cacheSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Last update: ${stats.lastUpdate}`);
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
