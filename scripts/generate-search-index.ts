import fs from "node:fs/promises";
import path from "node:path";

interface SearchResult {
  episodeId: string;
  timestamp: string;
  text: string;
  startTime: number;
}

async function parseVTTFile(
  filePath: string,
  episodeId: string,
): Promise<SearchResult[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const results: SearchResult[] = [];

  let currentTimestamp = "";
  let currentStartTime = 0;
  let currentText: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip WEBVTT header and empty lines
    if (line === "WEBVTT" || line === "") continue;

    // Check if line is a timestamp
    if (line.includes("-->")) {
      // If we have previous text, save it
      if (currentText.length > 0) {
        results.push({
          episodeId,
          timestamp: currentTimestamp,
          text: currentText.join(" "),
          startTime: currentStartTime,
        });
        currentText = [];
      }

      currentTimestamp = line;
      // Extract start time in seconds for sorting
      const startTimeStr = line.split("-->")[0].trim();
      const timeParts = startTimeStr.split(":");
      const secondsPart = timeParts.pop()!;
      const ms = secondsPart.split(".")[1] || "0";
      currentStartTime =
        timeParts.reduce((acc, val) => acc * 60 + Number.parseInt(val), 0) +
        Number.parseInt(secondsPart) +
        Number.parseInt(ms) / 1000;
    } else if (line !== "") {
      // Add non-empty lines as text
      currentText.push(line);
    } else if (currentText.length > 0) {
      // Merge consecutive text lines
      currentText[currentText.length - 1] += ` ${line}`;
    }
  }

  // Add the last segment if exists
  if (currentText.length > 0) {
    results.push({
      episodeId,
      timestamp: currentTimestamp,
      text: currentText.join(" "),
      startTime: currentStartTime,
    });
  }

  return results;
}

async function generateSearchIndex() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const files = await fs.readdir(publicDir);
    const vttFiles = files.filter(
      (file) => file.endsWith(".vtt") && !file.includes("-names"),
    );

    const allResults: SearchResult[] = [];

    for (const file of vttFiles) {
      const episodeId = path.basename(file, ".vtt");
      const filePath = path.join(publicDir, file);
      const fileResults = await parseVTTFile(filePath, episodeId);
      allResults.push(...fileResults);
    }

    // Sort results by episode and timestamp
    const sortedResults = allResults.sort((a: any, b: any) => {
      if (a.episodeId !== b.episodeId) {
        return a.episodeId.localeCompare(b.episodeId);
      }
      return a.startTime - b.startTime;
    });

    // Write the search index to a JSON file
    const outputPath = path.join(publicDir, "search-index.json");
    await fs.writeFile(outputPath, JSON.stringify(sortedResults, null, 2));
    console.log("Search index generated successfully!");
  } catch (error) {
    console.error("Error generating search index:", error);
    process.exit(1);
  }
}

generateSearchIndex();
