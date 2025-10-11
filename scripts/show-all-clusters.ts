import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { analyzeFaceClusters } from "./lib/face-cache";

/**
 * Shows all face clusters with sample images and dialogue context
 * Non-interactive version for quick review
 */

function getSpeechForFrame(framePath: string): string {
  const match = framePath.match(/(s\d+e\d+)\/([^\/]+)\/frame-blank/);
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
  return "";
}

async function main() {
  console.log("🔍 Analyzing face clusters...\n");
  const { clusters } = await analyzeFaceClusters(0.75);

  console.log(`✅ Found ${clusters.length} clusters\n`);
  console.log("=".repeat(60));

  for (let idx = 0; idx < clusters.length; idx++) {
    const cluster = clusters[idx];

    console.log(`\nCLUSTER #${idx + 1}`);
    console.log("=".repeat(60));
    console.log(`Total appearances: ${cluster.size}`);
    console.log(
      `Episodes: ${Object.keys(cluster.episodes).length} different episodes`,
    );

    // Show top episodes
    const topEpisodes = Object.entries(cluster.episodes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    console.log("\nTop episodes:");
    for (const [episode, count] of topEpisodes) {
      console.log(`  ${episode}: ${count} appearances`);
    }

    // Show sample frames with dialogue
    console.log("\n📸 Sample frames:");
    const samples = cluster.sampleImages.slice(0, 3);

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const speech = getSpeechForFrame(sample.path);

      console.log(`\n  ${i + 1}. Path: ${sample.path}`);
      console.log(`     Similarity: ${(sample.similarity * 100).toFixed(1)}%`);
      if (speech) {
        const truncated =
          speech.length > 100 ? speech.substring(0, 100) + "..." : speech;
        console.log(`     Dialogue: "${truncated}"`);
      }
    }

    console.log("\n");
  }

  console.log("\n" + "=".repeat(60));
  console.log("Known main characters from the show:");
  const knownCharacters = [
    "Malcolm Tucker",
    "Nicola Murray",
    "Hugh Abbot",
    "Ollie Reeder",
    "Glenn Cullen",
    "Terri Coverley",
    "Peter Mannion",
    "Emma Messinger",
    "Phil Smith",
  ];

  for (const char of knownCharacters) {
    console.log(`  - ${char}`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
