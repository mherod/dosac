import { writeFileSync } from "node:fs";
import * as readline from "node:readline/promises";
import { analyzeFaceClusters } from "./lib/face-cache";

/**
 * Interactive script to map face clusters to character names
 *
 * Usage: pnpm tsx scripts/create-character-mapping.ts
 *
 * This script:
 * 1. Analyzes face clusters from cached embeddings
 * 2. Shows you sample images for each cluster
 * 3. Lets you assign character names to each cluster
 * 4. Saves the mapping to public/character-mapping.json
 */

interface CharacterMapping {
  [clusterId: string]: {
    name: string;
    appearances: number;
    episodes: string[];
    confidence: number;
  };
}

async function main() {
  console.log("🔍 Analyzing face clusters...\n");

  // Analyze clusters with default similarity threshold
  const { clusters, totalClusters, averageClusterSize } =
    await analyzeFaceClusters(0.75);

  console.log(`\n📊 Found ${totalClusters} character clusters`);
  console.log(
    `📈 Average cluster size: ${averageClusterSize.toFixed(1)} images\n`,
  );

  // Filter to only show significant clusters (5+ appearances)
  const significantClusters = clusters.filter((c) => c.size >= 5);

  console.log(
    `\n🎯 Showing ${significantClusters.length} significant characters (5+ appearances)\n`,
  );

  const mapping: CharacterMapping = {};
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    for (let i = 0; i < significantClusters.length; i++) {
      const cluster = significantClusters[i];
      const clusterId = `cluster-${i + 1}`;

      console.log(`\n${"=".repeat(60)}`);
      console.log(`CLUSTER #${i + 1} of ${significantClusters.length}`);
      console.log(`${"=".repeat(60)}`);
      console.log(`Total appearances: ${cluster.size}`);
      console.log(`Episodes: ${Object.keys(cluster.episodes).length}`);
      console.log(`Episode distribution:`);

      // Show top 5 episodes for this cluster
      const topEpisodes = Object.entries(cluster.episodes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      for (const [episode, count] of topEpisodes) {
        console.log(`  ${episode}: ${count} appearances`);
      }

      console.log(`\nSample image paths:`);
      cluster.sampleImages.slice(0, 3).forEach((img, idx) => {
        console.log(`  ${idx + 1}. ${img.path}`);
        console.log(`     (similarity: ${(img.similarity * 100).toFixed(1)}%)`);
      });

      console.log(
        `\n💡 Tip: Open these image paths in a browser or image viewer to see the faces`,
      );

      // Ask for character name
      const name = await rl.question(
        `\nEnter character name for cluster ${i + 1} (or 'skip' to skip, 'quit' to save and exit): `,
      );

      if (name.toLowerCase() === "quit") {
        console.log("\n⏹️  Stopping and saving progress...");
        break;
      }

      if (name.toLowerCase() === "skip" || name.trim() === "") {
        console.log(`⏭️  Skipped cluster ${i + 1}`);
        continue;
      }

      // Calculate confidence based on cluster consistency
      const avgSimilarity =
        cluster.sampleImages.reduce((sum, img) => sum + img.similarity, 0) /
        cluster.sampleImages.length;

      mapping[clusterId] = {
        name: name.trim(),
        appearances: cluster.size,
        episodes: Object.keys(cluster.episodes).sort(),
        confidence: avgSimilarity,
      };

      console.log(`✅ Mapped "${name}" to ${clusterId}`);
    }

    // Save mapping
    const outputPath = "public/character-mapping.json";
    writeFileSync(outputPath, JSON.stringify(mapping, null, 2));

    console.log(`\n✅ Character mapping saved to ${outputPath}`);
    console.log(`\n📊 Mapping summary:`);
    console.log(`  Total characters mapped: ${Object.keys(mapping).length}`);
    console.log(`  Characters:`);

    for (const [_clusterId, data] of Object.entries(mapping)) {
      console.log(
        `    - ${data.name}: ${data.appearances} appearances across ${data.episodes.length} episodes`,
      );
    }

    console.log(
      `\n💡 Next step: Run 'pnpm tsx scripts/tag-frames-with-characters.ts' to tag all frames`,
    );
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
