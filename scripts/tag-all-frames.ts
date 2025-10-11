import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import {
  analyzeFaceClusters,
  loadEmbedding,
  loadIndex,
  cosineSimilarity,
  getEmbeddingFileFromPath,
} from "./lib/face-cache";

/**
 * Tags ALL frames with character names using face similarity matching
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

  // Build cluster representatives (use first face from each cluster)
  const clusterRepresentatives: Array<{
    clusterId: string;
    characterName: string | null;
    embedding: number[];
  }> = [];

  for (let idx = 0; idx < clusters.length; idx++) {
    const cluster = clusters[idx];
    const clusterId = `cluster-${idx + 1}`;
    const characterData = characterMapping[clusterId];

    if (cluster.sampleImages.length > 0) {
      // Load the embedding from the cache using the path
      const firstImage = cluster.sampleImages[0];

      try {
        const embeddingFile = getEmbeddingFileFromPath(firstImage.path);
        if (embeddingFile) {
          const embeddingData = loadEmbedding(embeddingFile);
          if (embeddingData && embeddingData.embedding) {
            clusterRepresentatives.push({
              clusterId,
              characterName: characterData?.name || null,
              embedding: embeddingData.embedding,
            });
          }
        }
      } catch (error) {
        console.error(`Error loading embedding for ${firstImage.path}:`, error);
      }
    }
  }

  console.log(
    `📊 Built ${clusterRepresentatives.length} cluster representatives`,
  );

  // Load all processed frames
  const index = loadIndex();
  const entries = Object.values(index.entries).filter(
    (entry) => entry.faces > 0,
  );

  console.log(`\n📊 Processing ${entries.length} frames with faces...\n`);

  const frameCharacters: FrameCharacters = {};
  let processedCount = 0;
  let matchedCount = 0;

  for (const entry of entries) {
    try {
      // Load embedding from cache using the embedding file from the index
      let embeddingData;
      try {
        embeddingData = loadEmbedding(entry.embeddingFile);
      } catch {
        // Skip if embedding not found
        continue;
      }

      if (!embeddingData || !embeddingData.embedding) continue;

      // Find best matching cluster
      let bestMatch: {
        clusterId: string;
        characterName: string | null;
        similarity: number;
      } | null = null;

      for (const rep of clusterRepresentatives) {
        const similarity = cosineSimilarity(
          embeddingData.embedding,
          rep.embedding,
        );

        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = {
            clusterId: rep.clusterId,
            characterName: rep.characterName,
            similarity,
          };
        }
      }

      // Only include if similarity is above threshold and we have a character name
      if (
        bestMatch &&
        bestMatch.similarity >= 0.75 &&
        bestMatch.characterName
      ) {
        const frameId = extractFrameId(entry.path);

        if (!frameCharacters[frameId]) {
          // Convert absolute path to relative web path
          const relativePath = entry.path
            .replace(/^.*\/public\//, "/")
            .replace(/\\/g, "/");

          frameCharacters[frameId] = {
            characters: [],
            confidence: [],
            imagePath: relativePath,
          };
        }

        if (
          !frameCharacters[frameId].characters.includes(bestMatch.characterName)
        ) {
          frameCharacters[frameId].characters.push(bestMatch.characterName);
          frameCharacters[frameId].confidence.push(bestMatch.similarity);
          matchedCount++;
        }
      }

      processedCount++;

      if (processedCount % 500 === 0) {
        const percent = ((processedCount / entries.length) * 100).toFixed(1);
        console.log(
          `Processed ${processedCount}/${entries.length} frames (${percent}%) - Matched: ${matchedCount}`,
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
  console.log(`  Total character matches: ${matchedCount}`);
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
  const sortedChars = Object.entries(characterCounts).sort(
    ([, a], [, b]) => b - a,
  );

  for (const [char, count] of sortedChars) {
    console.log(`  ${char}: ${count} frames`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
