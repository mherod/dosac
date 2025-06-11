import type { ResultWithEmbedding } from "@/app/utils/similarity";
import { cosineSimilarity } from "@/app/utils/similarity";
import { orderBy, uniqBy } from "lodash-es";

export interface GroupedResults {
  groupedResults: ResultWithEmbedding[][];
  ungroupedResults: ResultWithEmbedding[];
  totalResults: number;
}

export function groupResults(
  resultsWithEmbeddings: ResultWithEmbedding[],
  failedImageIds: Set<string>,
  similarityThreshold = 0.8,
): GroupedResults {
  if (!resultsWithEmbeddings.length) {
    return { groupedResults: [], ungroupedResults: [], totalResults: 0 };
  }

  const filteredResults = orderBy(
    resultsWithEmbeddings.filter(
      (result) => result?.id && !failedImageIds.has(result.id),
    ),
    ["similarity"],
    ["desc"],
  );

  const { groupedResults, ungroupedResults } = groupSimilarFaces(
    filteredResults,
    similarityThreshold,
  );

  return {
    groupedResults,
    ungroupedResults,
    totalResults: filteredResults.length,
  };
}

function groupSimilarFaces(
  results: ResultWithEmbedding[],
  similarityThreshold: number,
): {
  groupedResults: ResultWithEmbedding[][];
  ungroupedResults: ResultWithEmbedding[];
} {
  const [withEmbeddings, withoutEmbeddings] = partition(results, "embedding");

  // Memoize similarity calculation
  const calculateSimilarity = memoize(
    (face1: ResultWithEmbedding, face2: ResultWithEmbedding) => {
      if (!face1.embedding || !face2.embedding) return 0;
      return cosineSimilarity(face1.embedding, face2.embedding);
    },
    (face1, face2) => `${face1.id}-${face2.id}`,
  );

  // Group similar faces
  const groups = withEmbeddings.reduce<ResultWithEmbedding[][]>((acc, face) => {
    const existingGroup = acc.find((group) =>
      group.some(
        (groupFace) =>
          calculateSimilarity(face, groupFace) >= similarityThreshold,
      ),
    );

    if (existingGroup) {
      existingGroup.push(face);
    } else {
      acc.push([face]);
    }
    return acc;
  }, []);

  // Sort groups by max quality and size
  const sortedGroups = orderBy(
    groups,
    [(group) => maxBy(group, "quality")?.quality || 0, (group) => group.length],
    ["desc", "desc"],
  );

  return {
    groupedResults: sortedGroups,
    ungroupedResults: orderBy(
      uniqBy(uniqBy(withoutEmbeddings, "id"), "thumbnailUrl"),
      "quality",
      "desc",
    ),
  };
}
