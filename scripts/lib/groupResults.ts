import { orderBy, uniqBy, partition, maxBy } from "lodash-es";

// Define strong types for face results
export interface ResultWithEmbedding {
  id: string;
  embedding?: number[];
  similarity?: number;
  quality?: number;
  thumbnailUrl?: string;
  // Add other required properties based on usage
  [key: string]: unknown;
}

// Define cosine similarity function with strong types
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    const v1 = vec1[i];
    const v2 = vec2[i];
    if (v1 !== undefined && v2 !== undefined) {
      dotProduct += v1 * v2;
      mag1 += v1 * v1;
      mag2 += v2 * v2;
    }
  }

  const magnitude = Math.sqrt(mag1) * Math.sqrt(mag2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Memoize helper with strong types
function memoize<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  keyGenerator: (...args: TArgs) => string,
): (...args: TArgs) => TResult {
  const cache = new Map<string, TResult>();
  return (...args: TArgs): TResult => {
    const key = keyGenerator(...args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key) as TResult;
  };
}

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
  const [withEmbeddings, withoutEmbeddings] = partition(
    results,
    (result: ResultWithEmbedding): boolean => Boolean(result.embedding),
  ) as [ResultWithEmbedding[], ResultWithEmbedding[]];

  // Memoize similarity calculation
  const calculateSimilarity = memoize<
    [ResultWithEmbedding, ResultWithEmbedding],
    number
  >(
    (face1: ResultWithEmbedding, face2: ResultWithEmbedding): number => {
      if (!face1.embedding || !face2.embedding) return 0;
      return cosineSimilarity(face1.embedding, face2.embedding);
    },
    (face1: ResultWithEmbedding, face2: ResultWithEmbedding): string =>
      `${face1.id}-${face2.id}`,
  );

  // Group similar faces
  const groups = withEmbeddings.reduce<ResultWithEmbedding[][]>(
    (
      acc: ResultWithEmbedding[][],
      face: ResultWithEmbedding,
    ): ResultWithEmbedding[][] => {
      const existingGroup = acc.find((group: ResultWithEmbedding[]) =>
        group.some(
          (groupFace: ResultWithEmbedding): boolean =>
            calculateSimilarity(face, groupFace) >= similarityThreshold,
        ),
      );

      if (existingGroup) {
        existingGroup.push(face);
      } else {
        acc.push([face]);
      }
      return acc;
    },
    [],
  );

  // Sort groups by max quality and size
  const sortedGroups = orderBy(
    groups,
    [
      (group: ResultWithEmbedding[]) =>
        maxBy(group, (item: ResultWithEmbedding) => item.quality)?.quality || 0,
      (group: ResultWithEmbedding[]) => group.length,
    ],
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
