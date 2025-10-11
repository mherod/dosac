import { existsSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { promises as fs } from "node:fs";
import { cpus } from "node:os";
import { basename, join, resolve } from "node:path";
import fastGlob from "fast-glob";
import { BATCH_SIZE, PRIMARY_CACHE_DIR } from "./lib/config";
import {
  type CacheIndex,
  type FaceEmbedding,
  getCacheStats,
  loadIndex,
  rebuildCacheIndex,
  saveEmbedding,
  saveIndex,
  updateIndex,
} from "./lib/face-cache";
import { generateFaceEmbedding } from "./lib/face-embedding";

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
  try {
    const results = await Promise.all(
      batch.map(async (filePath: string) => {
        try {
          return await processImage(filePath, currentIndex);
        } catch (error) {
          console.error(
            `❌ Failed to process ${basename(filePath)}:`,
            error instanceof Error ? error.message : "Unknown error",
          );
          throw error; // Re-throw to fail the entire batch
        }
      }),
    );
    await saveIndex(currentIndex);
    return results;
  } catch (error) {
    throw new Error(
      `Batch processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function processImage(
  filePath: string,
  currentIndex: CacheIndex,
): Promise<FaceEmbedding | null> {
  const fileName = basename(filePath);

  // Validate file exists and is readable
  let stats;
  try {
    stats = statSync(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${filePath}`);
    }
  } catch (error) {
    throw new Error(
      `Failed to read file stats for ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  const existingEntry = currentIndex.entries[filePath];

  if (existingEntry && existingEntry.mtime === stats.mtimeMs) {
    return null; // File hasn't changed, skip processing
  }

  let embeddingData;
  try {
    embeddingData = await generateFaceEmbedding(filePath);
  } catch (error) {
    throw new Error(
      `Failed to generate face embedding for ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
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
    throw new Error(
      `Failed to save embedding data for ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  return embeddingData;
}

async function getAllImageFiles(): Promise<string[]> {
  const files = fastGlobSync(`${localDir}/**/frame-blank*.webp`);
  console.log(`\nFound ${files.length} image files`);
  return files;
}

async function validateEnvironment(): Promise<void> {
  console.log("🔍 Validating environment...");

  // Check if frames directory exists
  if (!existsSync(localDir)) {
    throw new Error(`❌ Frames directory not found: ${localDir}`);
  }
  console.log(`✅ Frames directory found: ${localDir}`);

  // Check if we have any image files
  const files = await getAllImageFiles();
  if (files.length === 0) {
    throw new Error(`❌ No image files found in ${localDir}`);
  }
  console.log(`✅ Found ${files.length} image files to process`);

  // Test TensorFlow.js initialization
  try {
    console.log("🧠 Testing TensorFlow.js initialization...");
    const { generateFaceEmbedding } = await import("./lib/face-embedding");
    // Test with a small sample
    const testFile = files[0];
    console.log(`🧪 Testing face detection with sample file: ${testFile}`);
    const testResult = await generateFaceEmbedding(testFile);
    console.log(
      `✅ Face detection test successful - found ${testResult.faces} faces`,
    );
  } catch (error) {
    throw new Error(
      `❌ TensorFlow.js initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  // Test cache directory creation
  try {
    if (!existsSync(PRIMARY_CACHE_DIR)) {
      console.log(`📁 Creating cache directory: ${PRIMARY_CACHE_DIR}`);
      mkdirSync(PRIMARY_CACHE_DIR, { recursive: true });
    }
    console.log(`✅ Cache directory ready: ${PRIMARY_CACHE_DIR}`);
  } catch (error) {
    throw new Error(
      `❌ Failed to create cache directory: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }

  console.log("✅ Environment validation complete!\n");
}

async function main() {
  try {
    // Fail fast - validate environment first
    await validateEnvironment();

    // Check for --rebuild-index flag
    if (process.argv.includes("--rebuild-index")) {
      console.log("🔄 Rebuilding cache index...");
      await rebuildCacheIndex();
      console.log("✅ Cache index rebuilt successfully!");
      return;
    }

    // Always rebuild the cache index first
    console.log("🔄 Rebuilding cache index...");
    await rebuildCacheIndex();

    const files = await getAllImageFiles();
    const batches = [];

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push(files.slice(i, i + BATCH_SIZE));
    }

    const currentIndex = await loadIndex();

    console.log(
      `🚀 Processing ${files.length} files with batch size ${BATCH_SIZE} across ${NUM_WORKERS} CPU cores...`,
    );

    let processedCount = 0;
    for (const batch of batches) {
      try {
        const batchSize =
          Buffer.concat(
            await Promise.all(batch.map((f: string) => fs.readFile(f))),
          ).length /
          1024 /
          1024;

        console.log(
          `📊 Processing batch ${Math.floor(processedCount / BATCH_SIZE) + 1}/${Math.ceil(files.length / BATCH_SIZE)} - ${processedCount}/${files.length} files. Batch size: ${batchSize.toFixed(2)}MB.`,
        );

        await processBatch(batch, currentIndex);
        processedCount += batch.length;
      } catch (error) {
        console.error(
          `❌ Failed to process batch starting at file ${batch[0]}:`,
          error,
        );
        throw error; // Fail fast on batch errors
      }
    }

    const stats = await getCacheStats();
    console.log("\n📈 Cache Statistics:");
    console.log(`Total images with faces: ${stats.totalImages}`);
    console.log(`Total faces detected: ${stats.totalFaces}`);
    console.log("\nFace count distribution:");
    Object.entries(stats.byFaceCount).forEach(([count, images]) => {
      console.log(`${count} face(s): ${images} images`);
    });
    console.log(
      `\nCache size: ${(stats.cacheSize / 1024 / 1024).toFixed(2)}MB`,
    );
    console.log(`Last update: ${stats.lastUpdate}`);
    console.log("\n✅ Face tagging completed successfully!");
  } catch (error) {
    console.error(
      "\n❌ Face tagging failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available",
    );
    process.exit(1);
  }
}

// eslint-disable-next-line promise/prefer-await-to-callbacks
main().catch((error: Error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
