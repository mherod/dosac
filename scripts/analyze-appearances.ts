import { analyzeFaceClusters } from "./lib/face-cache";

interface EpisodeStats {
  totalAppearances: number;
  characters: number;
  mainCharacters: number; // Characters appearing in multiple scenes
}

interface CharacterStats {
  totalAppearances: number;
  episodes: { [episode: string]: number };
  scenes: number;
  isMainCharacter: boolean;
}

async function analyzeAppearances() {
  console.log("Analyzing character appearances across episodes...");
  const { clusters } = await analyzeFaceClusters(0.75);

  // Episode statistics
  const episodeStats: { [episode: string]: EpisodeStats } = {};

  // Character statistics (each cluster represents a character)
  const characterStats: CharacterStats[] = [];

  // Process each cluster (character)
  for (const cluster of clusters) {
    const stats: CharacterStats = {
      totalAppearances: cluster.size,
      episodes: cluster.episodes,
      scenes: Object.keys(cluster.episodes).length,
      isMainCharacter: cluster.size >= 5, // Consider characters with 5+ appearances as main characters
    };

    characterStats.push(stats);

    // Update episode statistics
    for (const [episode, appearances] of Object.entries(cluster.episodes)) {
      if (!episodeStats[episode]) {
        episodeStats[episode] = {
          totalAppearances: 0,
          characters: 0,
          mainCharacters: 0,
        };
      }

      episodeStats[episode].totalAppearances += appearances;
      episodeStats[episode].characters++;
      if (stats.isMainCharacter) {
        episodeStats[episode].mainCharacters++;
      }
    }
  }

  // Sort episodes by code (s01e01, s01e02, etc.)
  const sortedEpisodes = Object.keys(episodeStats).sort();

  // Print episode statistics
  console.log("\nEpisode Statistics:");
  console.log("==================");
  for (const episode of sortedEpisodes) {
    const stats = episodeStats[episode];
    console.log(`\n${episode.toUpperCase()}:`);
    console.log(`- Total character appearances: ${stats.totalAppearances}`);
    console.log(`- Unique characters: ${stats.characters}`);
    console.log(`- Main characters: ${stats.mainCharacters}`);
  }

  // Sort characters by total appearances
  characterStats.sort(
    (a: { totalAppearances: number }, b: { totalAppearances: number }) =>
      b.totalAppearances - a.totalAppearances,
  );

  // Print character statistics
  console.log("\nCharacter Statistics:");
  console.log("===================");
  console.log(`\nTotal characters detected: ${characterStats.length}`);
  console.log(
    `Main characters: ${characterStats.filter((c: { isMainCharacter: boolean }) => c.isMainCharacter).length}`,
  );

  // Print main character details
  console.log("\nMain Character Appearances:");
  characterStats
    .filter((char: { isMainCharacter: boolean }) => char.isMainCharacter)
    .forEach((char, index) => {
      console.log(`\nCharacter #${index + 1}:`);
      console.log(`- Total appearances: ${char.totalAppearances}`);
      console.log(`- Episodes: ${Object.keys(char.episodes).length}`);
      console.log("- Episode distribution:");
      Object.entries(char.episodes)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([episode, count]) => {
          console.log(`  ${episode}: ${count} appearances`);
        });
    });
}

// Run the analysis
analyzeAppearances().catch(console.error);
