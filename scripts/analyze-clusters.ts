import { analyzeFaceClusters } from "./lib/face-cache";

async function main(): Promise<void> {
  console.log("\nAnalyzing face clusters...");
  const stats = await analyzeFaceClusters(0.75);

  console.log(`\nFound ${stats.totalClusters} distinct faces`);
  console.log(
    `Average cluster size: ${stats.averageClusterSize.toFixed(2)} images\n`,
  );

  // Sort clusters by size and categorize them
  const largeClusters = stats.clusters.filter(
    (c: { size: number }) => c.size > 5,
  );
  const mediumClusters = stats.clusters.filter(
    (c) => c.size >= 3 && c.size <= 5,
  );
  const smallClusters = stats.clusters.filter(
    (c: { size: number }) => c.size < 3,
  );

  // Print large clusters (more than 5 faces)
  if (largeClusters.length > 0) {
    console.log("Large Clusters (>5 faces):");
    largeClusters.forEach((cluster, i) => {
      console.log(`\nCluster #${i + 1} (${cluster.size} images)`);
      console.log(
        "Episode distribution:",
        Object.entries(cluster.episodes)
          .map(([ep, count]) => `${ep}: ${count}`)
          .join(", "),
      );
      console.log("Sample images (with similarity):");
      for (const img of cluster.sampleImages) {
        console.log(`- ${img.path} (${img.similarity.toFixed(3)})`);
      }
    });
  }

  // Print medium clusters (3-5 faces)
  if (mediumClusters.length > 0) {
    console.log("\nMedium Clusters (3-5 faces):");
    mediumClusters.forEach((cluster, i) => {
      console.log(
        `\nCluster #${i + largeClusters.length + 1} (${cluster.size} images)`,
      );
      console.log(
        "Episode distribution:",
        Object.entries(cluster.episodes)
          .map(([ep, count]) => `${ep}: ${count}`)
          .join(", "),
      );
      console.log("Sample images (with similarity):");
      for (const img of cluster.sampleImages) {
        console.log(`- ${img.path} (${img.similarity.toFixed(3)})`);
      }
    });
  }

  // Print summary of small clusters
  if (smallClusters.length > 0) {
    console.log(
      `\nSmall Clusters (<3 faces): ${smallClusters.length} clusters`,
    );
    console.log(
      "These may need further analysis or merging with larger clusters.",
    );
  }
}

main().catch((error: Error) => {
  console.error("Error:", error);
  process.exit(1);
});
