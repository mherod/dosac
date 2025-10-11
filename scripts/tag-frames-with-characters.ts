import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { analyzeFaceClusters, loadIndex } from "./lib/face-cache";

/**
 * Tags frames with character names based on cluster mapping
 *
 * Usage: pnpm tsx scripts/tag-frames-with-characters.ts
 *
 * This script:
 * 1. Loads the character mapping (public/character-mapping.json)
 * 2. Analyzes face clusters
 * 3. Matches each frame to clusters
 * 4. Outputs frame-to-characters mapping to public/frame-characters.json
 */

interface CharacterMapping {
  [clusterId: string]: {
    name: string;
    appearances: number;
    episodes: string[];
    confidence: number;
  };
}

interface FrameCharacters {
  [frameId: string]: {
    characters: string[];
    confidence: number[];
    imagePath: string;
  };
}

function extractFrameId(path: string): string {
  // Extract frame ID from path like:
  // /path/to/public/frames/s01e01/00-03.120/frame-blank.webp
  // Returns: s01e01-00-03.120
  const match = path.match(/(s\d+e\d+)\/([\d-]+\.[\d]+)/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return basename(path);
}

async function main() {
  // Load character mapping
  const mappingPath = "public/character-mapping.json";
  if (!existsSync(mappingPath)) {
    console.error(`❌ Character mapping not found at ${mappingPath}`);
    console.error(
      "💡 Run 'pnpm tsx scripts/create-character-mapping.ts' first",
    );
    process.exit(1);
  }

  const characterMapping: CharacterMapping = JSON.parse(
    readFileSync(mappingPath, "utf-8"),
  );

  console.log(
    `✅ Loaded character mapping for ${Object.keys(characterMapping).length} characters`,
  );

  // Analyze clusters
  console.log("\n🔍 Analyzing face clusters...");
  const { clusters } = await analyzeFaceClusters(0.75);

  console.log(`✅ Found ${clusters.length} clusters\n`);

  // Build cluster lookup by sample paths
  const pathToCluster = new Map<string, number>();
  clusters.forEach((cluster, idx) => {
    cluster.sampleImages.forEach((img) => {
      pathToCluster.set(img.path, idx);
    });
  });

  // Load cache index to get all processed frames
  const index = loadIndex();
  const entries = Object.values(index.entries);

  console.log(`📊 Processing ${entries.length} frames...\n`);

  const frameCharacters: FrameCharacters = {};
  let processedCount = 0;

  for (const entry of entries) {
    if (entry.faces === 0) continue;

    try {
      // Get cluster for this frame
      const clusterIdx = pathToCluster.get(entry.path);
      if (clusterIdx === undefined) continue;

      const clusterId = `cluster-${clusterIdx + 1}`;
      const characterData = characterMapping[clusterId];

      if (!characterData) continue;

      // Extract frame ID
      const frameId = extractFrameId(entry.path);

      // Initialize or update frame entry
      if (!frameCharacters[frameId]) {
        frameCharacters[frameId] = {
          characters: [],
          confidence: [],
          imagePath: entry.path,
        };
      }

      // Add character if not already present
      if (!frameCharacters[frameId].characters.includes(characterData.name)) {
        frameCharacters[frameId].characters.push(characterData.name);
        frameCharacters[frameId].confidence.push(characterData.confidence);
      }

      processedCount++;

      if (processedCount % 100 === 0) {
        const percent = ((processedCount / entries.length) * 100).toFixed(1);
        console.log(
          `Processed ${processedCount}/${entries.length} frames (${percent}%)`,
        );
      }
    } catch (error) {
      console.error(`Error processing ${entry.path}:`, error);
    }
  }

  // Save results
  const outputPath = "public/frame-characters.json";
  writeFileSync(outputPath, JSON.stringify(frameCharacters, null, 2));

  console.log(`\n✅ Frame tagging complete!`);
  console.log(`📊 Results:`);
  console.log(`  Total frames processed: ${processedCount}`);
  console.log(
    `  Frames with characters: ${Object.keys(frameCharacters).length}`,
  );
  console.log(`  Output saved to: ${outputPath}`);

  // Show sample
  console.log(`\n📝 Sample entries:`);
  const sampleFrames = Object.entries(frameCharacters).slice(0, 5);
  for (const [frameId, data] of sampleFrames) {
    console.log(`  ${frameId}: ${data.characters.join(", ")}`);
  }

  // Character statistics
  const characterCounts: Record<string, number> = {};
  for (const data of Object.values(frameCharacters)) {
    for (const char of data.characters) {
      characterCounts[char] = (characterCounts[char] || 0) + 1;
    }
  }

  console.log(`\n👥 Character appearance summary:`);
  const sortedChars = Object.entries(characterCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  for (const [char, count] of sortedChars) {
    console.log(`  ${char}: ${count} frames`);
  }
}

try {
  await main();
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
