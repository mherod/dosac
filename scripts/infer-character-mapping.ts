import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import readline from "node:readline";
import { analyzeFaceClusters } from "./lib/face-cache";

/**
 * Infers character names from face clusters using context clues
 *
 * This script:
 * 1. Analyzes face clusters
 * 2. Shows sample frames with dialogue context
 * 3. Allows manual character identification
 * 4. Saves mapping to public/character-mapping.json
 */

interface CharacterMapping {
  [clusterId: string]: {
    name: string;
    appearances: number;
    episodes: string[];
    confidence: number;
  };
}

/**
 * Extract episode ID from frame path
 */
function extractEpisode(path: string): string {
  const match = path.match(/(s\d+e\d+)/);
  return match ? match[1] : "unknown";
}

/**
 * Get speech text for a frame
 */
function getSpeechForFrame(framePath: string): string {
  try {
    // Extract timestamp directory from path
    const match = framePath.match(/(s\d+e\d+)\/([^/]+)\/frame-blank/);
    if (!match) return "";

    const [, episode, timestamp] = match;
    const speechPath = join(
      process.cwd(),
      "public",
      "frames",
      episode,
      timestamp,
      "speech.txt",
    );

    if (existsSync(speechPath)) {
      return readFileSync(speechPath, "utf-8").trim();
    }
  } catch {
    // Ignore errors
  }
  return "";
}

/**
 * Display cluster information with context
 */
function displayCluster(
  clusterNum: number,
  totalClusters: number,
  cluster: {
    sampleImages: Array<{ path: string; similarity: number }>;
    size: number;
    episodes: Record<string, number>;
  },
): void {
  console.log("\n" + "=".repeat(60));
  console.log(`CLUSTER #${clusterNum} of ${totalClusters}`);
  console.log("=".repeat(60));
  console.log(`Total appearances: ${cluster.size}`);
  console.log(`Episodes: ${Object.keys(cluster.episodes).length}`);

  console.log("\nEpisode distribution:");
  Object.entries(cluster.episodes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([ep, count]) => {
      console.log(`  ${ep}: ${count} appearances`);
    });

  console.log("\n📸 Sample frames with dialogue context:\n");

  // Show first 3 samples with dialogue
  cluster.sampleImages.slice(0, 3).forEach((img, idx) => {
    const speech = getSpeechForFrame(img.path);
    const episode = extractEpisode(img.path);
    const timestamp = img.path.match(/\/([^/]+)\/frame-blank/)?.[1] || "";

    console.log(`${idx + 1}. ${episode} @ ${timestamp}`);
    console.log(`   Path: ${img.path}`);
    console.log(`   Similarity: ${(img.similarity * 100).toFixed(1)}%`);
    if (speech) {
      const truncated =
        speech.length > 80 ? speech.substring(0, 77) + "..." : speech;
      console.log(`   Dialogue: "${truncated}"`);
    }
    console.log();
  });

  console.log("💡 Tip: Open the image paths above to see the character's face");
}

/**
 * Known characters from "The Thick of It"
 */
const KNOWN_CHARACTERS = [
  "Malcolm Tucker",
  "Nicola Murray",
  "Hugh Abbot",
  "Ollie Reeder",
  "Glenn Cullen",
  "Terri Coverley",
  "Peter Mannion",
  "Emma Messinger",
  "Phil Smith",
  "Adam Kenyon",
  "Ben Swain",
  "Julius Nicholson",
  "Stewart Pearson",
  "Steve Fleming",
];

async function main() {
  console.log("🔍 Analyzing face clusters...\n");

  const { clusters } = await analyzeFaceClusters(0.75);

  // Sort by size (most appearances first)
  const sortedClusters = clusters
    .map((cluster, idx) => ({ cluster, idx }))
    .sort((a, b) => b.cluster.size - a.cluster.size);

  console.log(`\n✅ Found ${sortedClusters.length} clusters\n`);
  console.log("Known characters from the show:");
  KNOWN_CHARACTERS.forEach((char, idx) => {
    console.log(`  ${idx + 1}. ${char}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  const mapping: CharacterMapping = {};

  for (let i = 0; i < sortedClusters.length; i++) {
    const { cluster, idx } = sortedClusters[i];

    displayCluster(i + 1, sortedClusters.length, cluster);

    const clusterId = `cluster-${idx + 1}`;

    const answer = await question(
      `\nEnter character name for cluster ${idx + 1} (or 'skip' to skip, 'quit' to save and exit): `,
    );

    if (answer.toLowerCase() === "quit") {
      console.log("\n💾 Saving partial mapping...");
      break;
    }

    if (answer.toLowerCase() === "skip" || !answer.trim()) {
      console.log(`⏭️  Skipping cluster ${idx + 1}`);
      continue;
    }

    const characterName = answer.trim();

    // Calculate average similarity as confidence
    const avgSimilarity =
      cluster.sampleImages.reduce((sum, img) => sum + img.similarity, 0) /
      cluster.sampleImages.length;

    mapping[clusterId] = {
      name: characterName,
      appearances: cluster.size,
      episodes: Object.keys(cluster.episodes).sort(),
      confidence: avgSimilarity,
    };

    console.log(`✅ Mapped "${characterName}" to ${clusterId}`);
  }

  rl.close();

  // Save mapping
  const outputPath = join(process.cwd(), "public", "character-mapping.json");
  writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

  console.log(`\n✅ Character mapping saved to ${outputPath}`);
  console.log(`\n📊 Mapped ${Object.keys(mapping).length} characters:\n`);

  Object.entries(mapping).forEach(([clusterId, data]) => {
    console.log(
      `  ${data.name} (${clusterId}): ${data.appearances} appearances`,
    );
  });

  console.log(
    "\n🎯 Next step: Run 'pnpm tag-frames' to tag all frames with character names",
  );
}

try {
  await main();
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
