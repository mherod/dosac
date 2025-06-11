import fs from "fs";
import path from "path";
import { execSync } from "child_process";
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

function extractFrame(
  videoPath: string,
  timestamp: string,
  outputPath: string,
  offsetSeconds: number = 0,
) {
  const seconds = timestampToSeconds(timestamp) + offsetSeconds;
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

  console.log(`Parsing VTT file: ${filePath}`);

  // Skip WEBVTT header
  let i = 1;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Empty line indicates end of current frame
    if (line === "") {
      if (currentFrame && currentText.length > 0) {
        console.log(
          `Adding frame with timestamp ${currentFrame.startTime}:`,
          currentText,
        );
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
      console.log(
        `Found timestamp: ${currentFrame.startTime} --> ${currentFrame.endTime}`,
      );
      i++;
      continue;
    }

    // Text line
    if (currentFrame && line !== "") {
      console.log(`Adding text line for ${currentFrame.startTime}:`, line);
      currentText.push(line);
    }
    i++;
  }

  // Handle last frame if exists
  if (currentFrame && currentText.length > 0) {
    console.log(
      `Adding final frame with timestamp ${currentFrame.startTime}:`,
      currentText,
    );
    frames.push({
      startTime: currentFrame.startTime!,
      endTime: currentFrame.endTime!,
      text: [...currentText],
    });
  }

  // Merge frames with same timestamps
  console.log(
    "\nBefore merging, frames with 01:01.360:",
    frames.filter((f: any) => f.startTime === "01:01.360"),
  );

  const mergedFrames = mergeFrames(frames);

  console.log(
    "\nAfter merging, frame with 01:01.360:",
    mergedFrames.find((f) => f.startTime === "01:01.360"),
  );

  return { frames: mergedFrames };
}

function mergeFrames(frames: VTTFrame[]): VTTFrame[] {
  const mergedFrames = new Map<string, VTTFrame>();

  for (const frame of frames) {
    const existing = mergedFrames.get(frame.startTime);

    if (existing) {
      console.log(
        `Merging frame for ${frame.startTime}: \nExisting text:`,
        existing.text,
        "\nNew text:",
        frame.text,
      );

      // Merge the text arrays while avoiding duplicates
      const mergedText = [...existing.text];
      frame.text.forEach((line) => {
        if (!mergedText.includes(line)) {
          mergedText.push(line);
        }
      });

      mergedFrames.set(frame.startTime, {
        startTime: frame.startTime,
        endTime: frame.endTime,
        text: mergedText,
      });

      console.log(
        `After merging, frame with ${frame.startTime}:`,
        mergedFrames.get(frame.startTime),
      );
    } else {
      mergedFrames.set(frame.startTime, frame);
    }
  }

  return Array.from(mergedFrames.values());
}

async function findVTTFiles(): Promise<string[]> {
  // Find all VTT files in public directory
  const vttFiles = await glob("public/s[0-9][0-9]e[0-9][0-9].vtt");
  return vttFiles
    .map((vtt: string) => {
      const match = vtt.match(/public[/\\](s\d{2}e\d{2})\.vtt$/);
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

  // Parse VTT file
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
    const frameBlank2Path = path.join(frameDir, "frame-blank2.jpg");
    const speechPath = path.join(frameDir, "speech.txt");

    // Extract frames
    console.log(`Extracting first frame at ${timestamp}`);
    if (!extractFrame(videoPath, timestamp, frameBlankPath)) {
      console.error(
        `Failed to extract first frame at ${timestamp}, skipping...`,
      );
      continue;
    }

    console.log(`Extracting second frame at ${timestamp}+1s`);
    if (!extractFrame(videoPath, timestamp, frameBlank2Path, 1)) {
      console.error(
        `Failed to extract second frame at ${timestamp}+1s, skipping...`,
      );
      continue;
    }

    // Write speech text file
    console.log(`Writing speech file for ${timestamp}:`, frame.text);
    try {
      const speechContent = frame.text.join("\n") + "\n";
      fs.writeFileSync(speechPath, speechContent, "utf8");
    } catch (error) {
      console.error(`Error writing speech file at ${timestamp}:`, error);
      continue;
    }

    // Log progress every 10%
    if (index % Math.ceil(parsedVTT.frames.length / 10) === 0) {
      const progress = Math.round((index / parsedVTT.frames.length) * 100);
      console.log(`${episodeId}: ${progress}% complete`);
    }
  }

  console.log(
    `Completed ${episodeId}. Total frames: ${parsedVTT.frames.length}`,
  );
  return parsedVTT;
}

async function main() {
  // Get episode IDs from command line arguments
  const requestedEpisodes = process.argv
    .slice(2)
    .filter((arg: any) => !arg.startsWith("--"));

  // If no specific episodes requested, find all VTT files
  const episodeIds =
    requestedEpisodes.length > 0 ? requestedEpisodes : await findVTTFiles();

  console.log(`Found ${episodeIds.length} episodes to process`);

  for (const episodeId of episodeIds) {
    await processVideoFrames(episodeId);
  }
}

// Start processing
main().catch(console.error);
