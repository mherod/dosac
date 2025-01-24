import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createCanvas, loadImage, registerFont } from "canvas";

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
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // Draw the original frame
  ctx.drawImage(image, 0, 0);

  // Configure text style
  ctx.textAlign = "center";
  ctx.font = "32px Arial";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";

  // Calculate text position (bottom center)
  const lineHeight = 40;
  const padding = 20;
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

  // Save the modified image
  const buffer = canvas.toBuffer("image/jpeg");
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

async function processVideoFrames(episodeId: string) {
  const vttPath = path.join(process.cwd(), "public", `${episodeId}.vtt`);
  const videoPath = path.join(process.cwd(), "public", `${episodeId}.mp4`);
  const framesBasePath = path.join(
    process.cwd(),
    "public",
    "frames",
    episodeId,
  );

  // Ensure base frames directory exists
  ensureDirectoryExists(framesBasePath);

  // Parse VTT file
  const parsedVTT = parseVTTFile(vttPath);
  console.log(
    `Processing ${parsedVTT.frames.length} frames for ${episodeId}...`,
  );

  // Process each frame
  for (const [index, frame] of parsedVTT.frames.entries()) {
    const timestamp = frame.startTime;
    const frameDir = path.join(framesBasePath, timestamp.replace(":", "-"));
    ensureDirectoryExists(frameDir);

    const framePath = path.join(frameDir, "frame.jpg");

    // Extract frame if it doesn't exist
    if (!fs.existsSync(framePath)) {
      console.log(
        `Extracting frame: ${timestamp} (${index + 1}/${parsedVTT.frames.length})`,
      );
      extractFrame(videoPath, timestamp, framePath);
    } else {
      console.log(
        `Frame exists: ${timestamp} (${index + 1}/${parsedVTT.frames.length})`,
      );
    }

    // Add subtitle text to frame
    console.log(`Adding subtitle to frame: ${timestamp}`);
    await addSubtitleToFrame(framePath, frame.text);
  }

  console.log("Frame extraction and subtitle addition complete!");
  return parsedVTT;
}

// Process frames for s02e01
processVideoFrames("s02e01").then((parsedVTT) => {
  console.log(`Total frames processed: ${parsedVTT.frames.length}`);
});
