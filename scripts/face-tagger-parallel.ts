import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { basename, join, resolve } from "node:path";
import fastGlob from "fast-glob";
import pLimit from "p-limit";
import { PRIMARY_CACHE_DIR } from "./lib/config";
import {
  getCacheStats,
  loadIndex,
  rebuildCacheIndex,
  saveEmbedding,
  saveIndex,
  updateIndex,
  type CacheIndex,
  type FaceEmbedding,
} from "./lib/face-cache";
import { generateFaceEmbedding } from "./lib/face-embedding";
import { statSync } from "node:fs";

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

// Use 90% of CPU cores for parallel processing
const PARALLEL_LIMIT = Math.max(1, Math.floor(cpus().length * 0.9));

console.log(
  `🚀 Using ${PARALLEL_LIMIT} parallel workers (${cpus().length} cores available)`,
);

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
      return null;
    }
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return null;
  }

  const existingEntry = currentIndex.entries[filePath];

  // Skip if already processed and file hasn't changed
  if (existingEntry && existingEntry.mtime === stats.mtimeMs) {
    return null;
  }

  try {
    const embeddingData = await generateFaceEmbedding(filePath);

    if (embeddingData) {
      embeddingData.path = filePath;
      saveEmbedding(filePath, embeddingData);
      updateIndex(currentIndex, filePath, embeddingData.faces, stats.mtimeMs);
      return embeddingData;
    } else {
      updateIndex(currentIndex, filePath, 0, stats.mtimeMs, true);
      return null;
    }
  } catch (error) {
    console.error(
      `❌ Failed to process ${fileName}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

async function getAllImageFiles(): Promise<string[]> {
  const files = fastGlobSync(`${localDir}/**/frame-blank*.webp`);
  console.log(`\nFound ${files.length} image files`);
  return files;
}

async function validateEnvironment(): Promise<void> {
  console.log("🔍 Validating environment...");

  if (!existsSync(localDir)) {
    throw new Error(`❌ Frames directory not found: ${localDir}`);
  }
  console.log(`✅ Frames directory found: ${localDir}`);

  const files = await getAllImageFiles();
  if (files.length === 0) {
    throw new Error(`❌ No image files found in ${localDir}`);
  }
  console.log(`✅ Found ${files.length} image files to process`);

  console.log("🧠 Testing face detection...");
  const { generateFaceEmbedding: testEmbedding } = await import(
    "./lib/face-embedding"
  );
  const testFile = files[0];
  console.log(`🧪 Testing with: ${testFile}`);
  const testResult = await testEmbedding(testFile);
  console.log(
    `✅ Face detection test successful - found ${testResult.faces} faces`,
  );

  if (!existsSync(PRIMARY_CACHE_DIR)) {
    console.log(`📁 Creating cache directory: ${PRIMARY_CACHE_DIR}`);
    mkdirSync(PRIMARY_CACHE_DIR, { recursive: true });
  }
  console.log(`✅ Cache directory ready: ${PRIMARY_CACHE_DIR}`);
  console.log("✅ Environment validation complete!\n");
}

async function main() {
  try {
    await validateEnvironment();

    if (process.argv.includes("--rebuild-index")) {
      console.log("🔄 Rebuilding cache index...");
      await rebuildCacheIndex();
      console.log("✅ Cache index rebuilt successfully!");
      return;
    }

    console.log("🔄 Rebuilding cache index...");
    await rebuildCacheIndex();

    const files = await getAllImageFiles();
    const currentIndex = loadIndex();

    console.log(
      `🚀 Processing ${files.length} files with ${PARALLEL_LIMIT} parallel workers...\n`,
    );

    // Create a rate limiter for parallel processing
    const limit = pLimit(PARALLEL_LIMIT);

    let processedCount = 0;
    let successCount = 0;
    const errorCount = 0;
    const startTime = Date.now();

    // Process all files in parallel with rate limiting
    const tasks = files.map((filePath) =>
      limit(async () => {
        const result = await processImage(filePath, currentIndex);

        processedCount++;

        if (result !== null) {
          successCount++;
        }

        // Log progress every 50 files
        if (processedCount % 50 === 0) {
          const elapsed = (Date.now() - startTime) / 1000;
          const rate = processedCount / elapsed;
          const remaining = files.length - processedCount;
          const eta = remaining / rate;

          console.log(
            `📊 Progress: ${processedCount}/${files.length} (${((processedCount / files.length) * 100).toFixed(1)}%) | ` +
              `Rate: ${rate.toFixed(1)} files/sec | ` +
              `ETA: ${Math.floor(eta / 60)}m ${Math.floor(eta % 60)}s | ` +
              `Success: ${successCount}, Errors: ${errorCount}`,
          );

          // Save index periodically
          if (processedCount % 200 === 0) {
            await saveIndex(currentIndex);
          }
        }

        return result;
      }),
    );

    // Wait for all tasks to complete
    await Promise.all(tasks);

    // Final save
    await saveIndex(currentIndex);

    const stats = await getCacheStats();
    const totalTime = (Date.now() - startTime) / 1000;

    console.log("\n" + "=".repeat(60));
    console.log("📈 FINAL STATISTICS");
    console.log("=".repeat(60));
    console.log(`Total files processed: ${processedCount}`);
    console.log(`Files with faces: ${stats.totalImages}`);
    console.log(`Total faces detected: ${stats.totalFaces}`);
    console.log(
      `Processing time: ${Math.floor(totalTime / 60)}m ${Math.floor(totalTime % 60)}s`,
    );
    console.log(
      `Average rate: ${(processedCount / totalTime).toFixed(1)} files/sec`,
    );
    console.log(
      `\nCache size: ${(stats.cacheSize / 1024 / 1024).toFixed(2)}MB`,
    );
    console.log(`Last update: ${stats.lastUpdate}`);

    console.log("\nFace count distribution:");
    Object.entries(stats.byFaceCount).forEach(([count, images]) => {
      console.log(`  ${count} face(s): ${images} images`);
    });

    console.log("\n✅ Face tagging completed successfully!");
  } catch (error) {
    console.error(
      "\n❌ Face tagging failed:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available",
    );
    process.exit(1);
  }
}

main().catch((error: Error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
