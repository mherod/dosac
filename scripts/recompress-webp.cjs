#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const FRAMES_DIR = path.join(__dirname, "../public/frames");

// Settings for Season 4 recompression to 450px width
const WEBP_QUALITY = 78;
const TARGET_WIDTH = 450; // Resize from 500px to 450px
const SEASON_FILTER = "s04"; // Only process Season 4

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function recompressWebP(webpPath) {
  try {
    const tempPath = `${webpPath}.tmp`;

    // Resize and recompress to 450px width with aspect ratio maintained
    execSync(
      `cwebp -q ${WEBP_QUALITY} -resize ${TARGET_WIDTH} 0 "${webpPath}" -o "${tempPath}"`,
      {
        stdio: "ignore",
      },
    );

    // Replace original with recompressed version
    fs.renameSync(tempPath, webpPath);

    return true;
  } catch (error) {
    console.error(`❌ Failed to recompress ${webpPath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath, stats) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip .DS_Store and other hidden directories
      if (item.startsWith(".")) continue;

      // Only process Season 4 directories
      if (!fullPath.includes(SEASON_FILTER)) continue;

      processDirectory(fullPath, stats);
    } else if (item.endsWith(".webp")) {
      const originalSize = getFileSize(fullPath);

      console.log(`🔄 Recompressing: ${path.relative(FRAMES_DIR, fullPath)}`);

      if (recompressWebP(fullPath)) {
        const newSize = getFileSize(fullPath);
        const savings = originalSize - newSize;
        const percentage = ((savings / originalSize) * 100).toFixed(1);

        stats.filesProcessed++;
        stats.originalSize += originalSize;
        stats.newSize += newSize;
        stats.totalSavings += savings;

        console.log(
          `  ✓ ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${percentage}% smaller)`,
        );
      } else {
        stats.failedCompressions++;
      }
    }
  }
}

function main() {
  console.log("🖼️  Recompressing Season 4 WebP frames to 450px width...");
  console.log(
    `📐 Settings: Quality ${WEBP_QUALITY}, Width ${TARGET_WIDTH}px, Season ${SEASON_FILTER}\n`,
  );

  const stats = {
    filesProcessed: 0,
    failedCompressions: 0,
    originalSize: 0,
    newSize: 0,
    totalSavings: 0,
  };

  const startTime = Date.now();

  if (!fs.existsSync(FRAMES_DIR)) {
    console.error(`❌ Frames directory not found: ${FRAMES_DIR}`);
    process.exit(1);
  }

  processDirectory(FRAMES_DIR, stats);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  console.log("\n📊 Recompression Summary:");
  console.log(`  Files processed: ${stats.filesProcessed}`);
  console.log(`  Failed compressions: ${stats.failedCompressions}`);
  console.log(`  Original size: ${formatBytes(stats.originalSize)}`);
  console.log(`  New size: ${formatBytes(stats.newSize)}`);
  console.log(
    `  Total savings: ${formatBytes(stats.totalSavings)} (${((stats.totalSavings / stats.originalSize) * 100).toFixed(1)}%)`,
  );
  console.log(`  Time taken: ${duration}s`);

  if (stats.failedCompressions > 0) {
    console.log(
      `\n⚠️  ${stats.failedCompressions} files failed to recompress. Check the error messages above.`,
    );
  }
}

main();
