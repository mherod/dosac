#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("child_process");

const FRAMES_DIR = path.join(__dirname, "../public/frames");
const BACKUP_DIR = path.join(__dirname, "../backup-jpegs");

// WebP quality setting (0-100, higher = better quality but larger file)
const WEBP_QUALITY = 85;

function checkDependencies() {
  try {
    execSync("which cwebp", { stdio: "ignore" });
    console.log("✓ cwebp found");
  } catch (error) {
    console.error("❌ cwebp not found. Please install WebP tools:");
    console.error("  macOS: brew install webp");
    console.error("  Ubuntu: sudo apt install webp");
    process.exit(1);
  }
}

function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`📁 Created backup directory: ${BACKUP_DIR}`);
  }
}

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
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function convertJpegToWebP(jpegPath, webpPath, backupPath) {
  try {
    // Create backup
    fs.copyFileSync(jpegPath, backupPath);

    // Convert to WebP
    execSync(`cwebp -q ${WEBP_QUALITY} "${jpegPath}" -o "${webpPath}"`, {
      stdio: "ignore",
    });

    // Remove original JPEG
    fs.unlinkSync(jpegPath);

    return true;
  } catch (error) {
    console.error(`❌ Failed to convert ${jpegPath}:`, error.message);
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

      processDirectory(fullPath, stats);
    } else if (item.endsWith(".jpg") || item.endsWith(".jpeg")) {
      const originalSize = getFileSize(fullPath);
      const webpPath = fullPath.replace(/\.jpe?g$/i, ".webp");
      const backupPath = path.join(
        BACKUP_DIR,
        path.relative(FRAMES_DIR, fullPath),
      );

      // Ensure backup directory structure exists
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      console.log(`🔄 Converting: ${path.relative(FRAMES_DIR, fullPath)}`);

      if (convertJpegToWebP(fullPath, webpPath, backupPath)) {
        const newSize = getFileSize(webpPath);
        const savings = originalSize - newSize;
        const percentage = ((savings / originalSize) * 100).toFixed(1);

        stats.filesConverted++;
        stats.originalSize += originalSize;
        stats.newSize += newSize;
        stats.totalSavings += savings;

        console.log(
          `  ✓ ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${percentage}% smaller)`,
        );
      } else {
        stats.failedConversions++;
      }
    }
  }
}

function main() {
  console.log("🖼️  Converting JPEG frames to WebP...\n");

  checkDependencies();
  createBackupDir();

  const stats = {
    filesConverted: 0,
    failedConversions: 0,
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

  console.log("\n📊 Conversion Summary:");
  console.log(`  Files converted: ${stats.filesConverted}`);
  console.log(`  Failed conversions: ${stats.failedConversions}`);
  console.log(`  Original size: ${formatBytes(stats.originalSize)}`);
  console.log(`  New size: ${formatBytes(stats.newSize)}`);
  console.log(
    `  Total savings: ${formatBytes(stats.totalSavings)} (${((stats.totalSavings / stats.originalSize) * 100).toFixed(1)}%)`,
  );
  console.log(`  Time taken: ${duration}s`);
  console.log(`\n💾 Original JPEGs backed up to: ${BACKUP_DIR}`);

  if (stats.failedConversions > 0) {
    console.log(
      `\n⚠️  ${stats.failedConversions} files failed to convert. Check the error messages above.`,
    );
  }
}

// Handle command line arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
WebP Conversion Script for The Thick of It Quotes

Usage: node convert-to-webp.cjs [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be converted without actually converting
  --quality N    Set WebP quality (0-100, default: ${WEBP_QUALITY})

This script converts all JPEG frames to WebP format for better compression.
Original files are backed up to ../backup-jpegs/ before conversion.
`);
  process.exit(0);
}

if (process.argv.includes("--dry-run")) {
  console.log("🔍 DRY RUN MODE - No files will be converted\n");
  // TODO: Implement dry run functionality
  process.exit(0);
}

// Override quality if specified
const qualityIndex = process.argv.indexOf("--quality");
if (qualityIndex !== -1 && process.argv[qualityIndex + 1]) {
  const quality = Number.parseInt(process.argv[qualityIndex + 1]);
  if (quality >= 0 && quality <= 100) {
    WEBP_QUALITY = quality;
    console.log(`🎛️  Using WebP quality: ${quality}`);
  } else {
    console.error("❌ Quality must be between 0 and 100");
    process.exit(1);
  }
}

main();
