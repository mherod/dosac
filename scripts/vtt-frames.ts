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
  const TARGET_WIDTH = 400;
  const scale = TARGET_WIDTH / image.width;
  const width = TARGET_WIDTH;
  const height = Math.round(image.height * scale);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw the original frame scaled to new dimensions
  ctx.drawImage(image, 0, 0, width, height);

  // Configure text style - scale font size according to image scale
  ctx.textAlign = "center";
  ctx.font = `${Math.max(16, Math.round(32 * scale))}px Arial`; // Min font size of 16px
  ctx.lineWidth = Math.max(2, 3 * scale);
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";

  // Calculate text position (bottom center)
  const lineHeight = Math.max(20, Math.round(40 * scale));
  const padding = Math.max(10, Math.round(20 * scale));
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

  // Save the modified image with compression
  // Increase compression to reduce file size further
  const buffer = canvas.toBuffer("image/jpeg", { quality: 0.8 });
  fs.writeFileSync(imagePath, buffer);
}

function extractFrame(
  videoPath: string,
  timestamp: string,
  outputPath: string,
) {
  const seconds = timestampToSeconds(timestamp);
  try {
    const command = `ffmpeg -ss ${seconds} -i ${videoPath} -vframes 1 -update 1 -y ${outputPath}`;
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

async function processAllVideos() {
  const episodeIds = await findVideoFiles();
  console.log(
    `Found ${episodeIds.length} videos to process: ${episodeIds.join(", ")}`,
  );

  for (const episodeId of episodeIds) {
    try {
      const parsedVTT = await processVideoFrames(episodeId);
      if (!parsedVTT) {
        console.log(`Failed to process ${episodeId}`);
      }
    } catch (error) {
      console.error(`Error processing ${episodeId}:`, error);
    }
  }
}

// Start processing all videos
processAllVideos().catch(console.error);
