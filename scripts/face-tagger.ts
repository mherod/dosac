import fastGlob from "fast-glob";
import {
  readFileSync,
  statSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { cpus, homedir } from "os";
import { basename, join } from "path";
import {
  loadIndex,
  saveIndex,
  saveEmbedding,
  updateIndex,
  getCacheStats,
  validateCache,
  FaceEmbedding,
} from "./lib/face-cache";
import { generateFaceEmbedding } from "./lib/face-embedding";
import { BATCH_SIZE, PRIMARY_CACHE_DIR } from "./lib/config";

const localDir = homedir() + "/Development/thickofitquotes/public/frames";

const { sync } = fastGlob;

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

// Process images in parallel batches
async function processBatch(batch: string[]) {
  return Promise.all(batch.map(processImage));
}

async function processImage(filePath: string): Promise<FaceEmbedding | null> {
  const fileName = basename(filePath);
  let stats;
  try {
    stats = statSync(filePath);
  } catch (error) {
    console.error(`Failed to read file stats for ${fileName}:`, error);
    return null;
  }

  const currentIndex = loadIndex();
  const existingEntry = currentIndex.entries[filePath];

  if (existingEntry && existingEntry.mtime === stats.mtimeMs) {
    return null; // File hasn't changed, skip processing
  }

  let buffer;
  try {
    buffer = readFileSync(filePath);
  } catch (error) {
    console.error(`Failed to read file ${fileName}:`, error);
    return null;
  }

  let embeddingData;
  try {
    embeddingData = await generateFaceEmbedding(buffer, filePath, {
      logProgress: (message) => console.log(`[${fileName}] ${message}`),
    });
  } catch (error) {
    console.error(`Failed to generate face embedding for ${fileName}:`, error);
    return null;
  }

  if (!embeddingData) {
    return null;
  }

  try {
    // Set the file path and save
    embeddingData.path = filePath;
    saveEmbedding(filePath, embeddingData);
    updateIndex(currentIndex, filePath, embeddingData.faces, stats.mtimeMs);
    saveIndex(currentIndex);
  } catch (error) {
    console.error(`Failed to save embedding data for ${fileName}:`, error);
    return null;
  }

  return embeddingData;
}

async function main() {
  // Validate existing cache
  console.log("\nValidating cache...");
  const validation = validateCache();
  if (!validation.valid) {
    console.error("Cache validation failed:");
    validation.errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  let files;
  try {
    files = sync(localDir + "/**/frame-blank.jpg").slice(0, 100);
  } catch (error) {
    console.error("Failed to scan directory for images:", error);
    process.exit(1);
  }
  console.log(`\nFound ${files.length} image files`);

  const currentIndex = loadIndex();
  const filesToProcess = files.filter((file) => {
    try {
      const stats = statSync(file);
      const existingEntry = currentIndex.entries[file];
      return !existingEntry || existingEntry.mtime !== stats.mtimeMs;
    } catch (error) {
      console.error(
        `Failed to check file status for ${basename(file)}:`,
        error,
      );
      process.exit(1);
    }
  });

  // Sort files by size (smallest first)
  const sortedFiles = filesToProcess.sort((a, b) => {
    try {
      const statsA = statSync(a);
      const statsB = statSync(b);
      return statsA.size - statsB.size;
    } catch (error) {
      console.error("Failed to sort files by size:", error);
      process.exit(1);
    }
  });

  console.log(`${sortedFiles.length} files need processing`);
  const numCpus = cpus().length;
  console.log(`Using batch size of ${BATCH_SIZE} (${numCpus} CPU cores)`);

  const results = [];

  for (let i = 0; i < sortedFiles.length; i += BATCH_SIZE) {
    const batch = sortedFiles.slice(i, i + BATCH_SIZE);
    let batchResults;
    try {
      batchResults = await processBatch(batch);
    } catch (error) {
      console.error("Failed to process batch:", error);
      process.exit(1);
    }

    const validResults = batchResults.filter((result) => result !== null);
    results.push(...validResults);

    if (i % (BATCH_SIZE * 10) === 0) {
      try {
        saveIndex(currentIndex);
      } catch (error) {
        console.error("Failed to save index:", error);
        process.exit(1);
      }
    }

    let totalSize = 0;
    try {
      totalSize = batch.reduce((sum, file) => sum + statSync(file).size, 0);
    } catch (error) {
      console.error("Failed to calculate batch size:", error);
      process.exit(1);
    }

    console.log(
      `Processed ${i + batch.length}/${sortedFiles.length} files. Batch size: ${(totalSize / 1024 / 1024).toFixed(2)}MB. Found ${validResults.length} faces in this batch.`,
    );
  }

  try {
    saveIndex(currentIndex);
  } catch (error) {
    console.error("Failed to save final index:", error);
    process.exit(1);
  }

  // Print final stats
  try {
    const stats = getCacheStats();
    console.log("\nProcessing complete! Cache statistics:");
    console.log(`Total images with faces: ${stats.totalImages}`);
    console.log(`Total faces detected: ${stats.totalFaces}`);
    console.log("Face count distribution:");
    Object.entries(stats.byFaceCount).forEach(([faces, count]) => {
      console.log(`  ${faces} face(s): ${count} images`);
    });
    console.log(`Cache size: ${(stats.cacheSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Last update: ${stats.lastUpdate}`);
  } catch (error) {
    console.error("Failed to get cache statistics:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
