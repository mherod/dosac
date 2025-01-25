import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createCanvas, loadImage, registerFont } from "canvas";
import glob from "fast-glob";

interface VTTFrame {
  startTime: string;
  endTime: string;
  text: string[];
}

interface VTTFile {
  frames: VTTFrame[];
}

function parseTimestamp(timestamp: string): string {
  // Normalize timestamp format
  return timestamp.trim();
}

function timestampToSeconds(timestamp: string): number {
  const [minutes, seconds] = timestamp.split(":");
  return parseFloat(minutes) * 60 + parseFloat(seconds);
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function addSubtitleToFrame(imagePath: string, text: string[]) {
  const image = await loadImage(imagePath);

  // Calculate scale to get width of 400px while maintaining aspect ratio
  const TARGET_WIDTH = 500;
  const MAX_HEIGHT = 390; // Add maximum height constraint

  // Only scale down, never up
  const scale = image.width > TARGET_WIDTH ? TARGET_WIDTH / image.width : 1;

  // Calculate dimensions
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  // Apply max height if needed
  const finalScale = height > MAX_HEIGHT ? MAX_HEIGHT / height : 1;
  const finalWidth = Math.round(width * finalScale);
  const finalHeight = Math.round(height * finalScale);

  const canvas = createCanvas(finalWidth, finalHeight);
  const ctx = canvas.getContext("2d");

  // Draw the original frame scaled to new dimensions
  ctx.drawImage(image, 0, 0, finalWidth, finalHeight);

  // Configure text style - scale font size according to image scale
  const effectiveScale = scale * finalScale;
  ctx.textAlign = "center";
  ctx.font = `${Math.max(14, Math.round(28 * effectiveScale))}px Arial`; // Reduced base font size
  ctx.lineWidth = Math.max(1.5, 2.5 * effectiveScale); // Reduced stroke width
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";

  // Calculate text position (bottom center)
  const lineHeight = Math.max(18, Math.round(35 * effectiveScale)); // Reduced line height
  const padding = Math.max(8, Math.round(16 * effectiveScale)); // Reduced padding
  const startY = canvas.height - (text.length * lineHeight + padding);

  // Draw each line of text
  text.forEach((line, index) => {
    const y = startY + index * lineHeight;
    const x = canvas.width / 2;

    // Draw text stroke (outline)
    ctx.strokeText(line, x, y);
    // Draw text fill
    ctx.fillText(line, x, y);
  });

  // Save the modified image with higher compression
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.6 }); // Increased compression
  fs.writeFileSync(imagePath, buffer);
}

function extractFrame(
  videoPath: string,
  timestamp: string,
  outputPath: string,
) {
  const seconds = timestampToSeconds(timestamp);
  try {
    // Add -vf scale=400:-1 to resize to 400px width while maintaining aspect ratio
    const command = `ffmpeg -ss ${seconds} -i ${videoPath} -vf scale=500:-1 -vframes 1 -update 1 -y ${outputPath}`;
    execSync(command);
    return true;
  } catch (error) {
    console.error(`Error extracting frame at ${timestamp}:`, error);
    return false;
  }
}

function parseVTTFile(filePath: string): VTTFile {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const frames: VTTFrame[] = [];
  let currentFrame: Partial<VTTFrame> | null = null;
  let currentText: string[] = [];

  // Skip WEBVTT header
  let i = 1;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Empty line indicates end of current frame
    if (line === "") {
      if (currentFrame && currentText.length > 0) {
        frames.push({
          startTime: currentFrame.startTime!,
          endTime: currentFrame.endTime!,
          text: [...currentText],
        });
        currentFrame = null;
        currentText = [];
      }
      i++;
      continue;
    }

    // Timestamp line
    if (line.includes("-->")) {
      const [start, end] = line.split("-->");
      currentFrame = {
        startTime: parseTimestamp(start),
        endTime: parseTimestamp(end),
      };
      i++;
      continue;
    }

    // Text line
    if (currentFrame) {
      currentText.push(line);
    }
    i++;
  }

  // Handle last frame if exists
  if (currentFrame && currentText.length > 0) {
    frames.push({
      startTime: currentFrame.startTime!,
      endTime: currentFrame.endTime!,
      text: currentText,
    });
  }

  return { frames };
}

async function findVideoFiles(): Promise<string[]> {
  const videos = await glob("public/s[0-9][0-9]e[0-9][0-9].mp4");
  return videos
    .map((video: string) => {
      const match = video.match(/public[/\\](s\d{2}e\d{2})\.mp4$/);
      return match ? match[1] : "";
    })
    .filter(Boolean);
}

async function processVideoFrames(episodeId: string) {
  // Validate episode ID format
  if (!episodeId.match(/^s\d{2}e\d{2}$/)) {
    console.error(
      `Invalid episode ID format: ${episodeId}. Expected format: s##e## (e.g., s01e01)`,
    );
    return null;
  }

  const vttPath = path.join(process.cwd(), "public", `${episodeId}.vtt`);
  const videoPath = path.join(process.cwd(), "public", `${episodeId}.mp4`);
  const framesBasePath = path.join(
    process.cwd(),
    "public",
    "frames",
    episodeId,
  );

  // Check if VTT file exists
  if (!fs.existsSync(vttPath)) {
    console.error(`VTT file not found for ${episodeId}, skipping...`);
    return null;
  }

  // Check if video file exists
  if (!fs.existsSync(videoPath)) {
    console.error(`Video file not found for ${episodeId}, skipping...`);
    return null;
  }

  // Parse VTT file first to check if all frames exist
  const parsedVTT = parseVTTFile(vttPath);
  console.log(`Processing ${episodeId}: ${parsedVTT.frames.length} frames`);

  // Ensure base frames directory exists
  ensureDirectoryExists(framesBasePath);

  // Process each frame
  for (const [index, frame] of parsedVTT.frames.entries()) {
    const timestamp = frame.startTime;
    const frameDir = path.join(framesBasePath, timestamp.replace(":", "-"));
    ensureDirectoryExists(frameDir);

    const frameBlankPath = path.join(frameDir, "frame-blank.jpg");
    const framePath = path.join(frameDir, "frame.jpg");
    const speechPath = path.join(frameDir, "speech.txt");

    // Skip if all files exist for this frame
    if (
      fs.existsSync(frameBlankPath) &&
      fs.existsSync(framePath) &&
      fs.existsSync(speechPath)
    ) {
      continue;
    }

    // Extract frame if blank version doesn't exist
    if (!fs.existsSync(frameBlankPath)) {
      if (!extractFrame(videoPath, timestamp, frameBlankPath)) {
        console.error(`Failed to extract frame at ${timestamp}, skipping...`);
        continue;
      }
    }

    try {
      // Copy blank frame to create base for subtitled version
      fs.copyFileSync(frameBlankPath, framePath);
      // Write speech text to file
      fs.writeFileSync(speechPath, frame.text.join("\n"), "utf8");
      // Add subtitle text to the copy
      await addSubtitleToFrame(framePath, frame.text);

      // Log progress every 10%
      if (index % Math.ceil(parsedVTT.frames.length / 10) === 0) {
        const progress = Math.round((index / parsedVTT.frames.length) * 100);
        console.log(`${episodeId}: ${progress}% complete`);
      }
    } catch (error) {
      console.error(`Error processing frame at ${timestamp}:`, error);
      // Clean up any partially created files
      if (fs.existsSync(framePath)) fs.unlinkSync(framePath);
      if (fs.existsSync(speechPath)) fs.unlinkSync(speechPath);
      continue;
    }
  }

  console.log(
    `Completed ${episodeId}. Total frames: ${parsedVTT.frames.length}`,
  );
  return parsedVTT;
}

async function main() {
  // Get episode IDs from command line arguments
  const requestedEpisodes = process.argv.slice(2);

  // If no specific episodes requested, find all video files
  const episodeIds =
    requestedEpisodes.length > 0 ? requestedEpisodes : await findVideoFiles();

  console.log(`Found ${episodeIds.length} episodes to process`);

  for (const episodeId of episodeIds) {
    const vttPath = path.join(process.cwd(), "public", `${episodeId}.vtt`);
    const framesPath = path.join(process.cwd(), "public", "frames", episodeId);

    // Parse VTT file to get expected frame count
    if (!fs.existsSync(vttPath)) {
      console.error(`VTT file not found for ${episodeId}, skipping...`);
      continue;
    }

    const parsedVTT = parseVTTFile(vttPath);
    const expectedFrameCount = parsedVTT.frames.length;

    // Check if episode is already fully processed
    if (fs.existsSync(framesPath)) {
      const existingFrames = fs.readdirSync(framesPath).length;
      if (existingFrames === expectedFrameCount) {
        console.log(
          `${episodeId}: Already processed ${existingFrames} frames, skipping...`,
        );
        continue;
      }
      console.log(
        `${episodeId}: Found ${existingFrames}/${expectedFrameCount} frames, continuing processing...`,
      );
    }

    await processVideoFrames(episodeId);
  }
}

// Start processing
main().catch(console.error);
