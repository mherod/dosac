import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import {
  analyzeFaceClusters,
  loadEmbedding,
  getEmbeddingFileFromPath,
} from "./lib/face-cache";

async function extractFaceCrops(similarityThreshold = 0.75) {
  const outputDir = "public/face-clusters";
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log("Analyzing face clusters...");
  const { clusters } = await analyzeFaceClusters(similarityThreshold);
  console.log(`Found ${clusters.length} clusters to process`);

  for (const [idx, cluster] of clusters.entries()) {
    // Skip single-face clusters
    if (cluster.size < 2) continue;

    // Create directory for this cluster
    const clusterDir = join(outputDir, `cluster-${idx + 1}`);
    if (!existsSync(clusterDir)) {
      mkdirSync(clusterDir, { recursive: true });
    }

    console.log(`Processing cluster ${idx + 1} (${cluster.size} faces)`);

    // Extract faces for each image in the cluster
    for (const [imageIdx, sample] of cluster.sampleImages.entries()) {
      try {
        const embedding = loadEmbedding(getEmbeddingFileFromPath(sample.path));
        const prediction = embedding.predictions[0]; // Use first face prediction

        // Calculate box dimensions and round to integers
        const left = Math.round(prediction.topLeft[0]);
        const top = Math.round(prediction.topLeft[1]);
        const width = Math.round(
          prediction.bottomRight[0] - prediction.topLeft[0],
        );
        const height = Math.round(
          prediction.bottomRight[1] - prediction.topLeft[1],
        );

        // Extract face region
        await sharp(sample.path)
          .extract({ left, top, width, height })
          .resize(224, 224)
          .jpeg({ quality: 90 })
          .toFile(
            join(
              clusterDir,
              `face-${imageIdx + 1}-${sample.similarity.toFixed(3)}.jpg`,
            ),
          );
      } catch (error) {
        console.error(`Error extracting face from ${sample.path}:`, error);
      }
    }
  }
}

// Run the extraction
extractFaceCrops().catch(console.error);
