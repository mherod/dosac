import { FaceDetector } from "./face-detector";

// Types
/**
 *
 */
export interface FaceEmbeddingResult {
  path: string;
  embedding: number[] | null;
  faces: number;
  cached: string;
  /**
   *
   */
  predictions: Array<{
    topLeft: [number, number];
    bottomRight: [number, number];
    probability: number;
    attributes?: {
      gender?: string;
      ageGroup?: string;
      hairColor?: string;
      skinTone?: string;
    };
    attributeConfidence?: {
      gender?: number;
      hairColor?: number;
      ageGroup?: number;
      skinTone?: number;
    };
  }>;
}

const faceDetector = new FaceDetector();

let initialized = false;

async function initialize() {
  if (!initialized) {
    await faceDetector.initialize();
    initialized = true;
  }
}

/**
 * Main face embedding generation function using face-api.js
 * @param imagePath Absolute path to image file
 * @returns Face embedding data
 */
export async function generateFaceEmbedding(
  imagePath: string,
): Promise<FaceEmbeddingResult> {
  await initialize();

  try {
    // Detect all faces with descriptors and attributes
    const predictions = await faceDetector.detect(imagePath);

    if (predictions.length === 0) {
      return {
        path: imagePath,
        embedding: null,
        faces: 0,
        cached: new Date().toISOString(),
        predictions: [],
      };
    }

    // Use the first face's descriptor as the representative embedding
    const embedding = predictions[0].descriptor || null;

    // Convert predictions to the expected format
    const processedPredictions = predictions.map((pred) => {
      // Determine age group
      let ageGroup: "child" | "young" | "middle" | "senior" = "young";
      if (pred.age !== undefined) {
        if (pred.age < 18) ageGroup = "child";
        else if (pred.age < 35) ageGroup = "young";
        else if (pred.age < 60) ageGroup = "middle";
        else ageGroup = "senior";
      }

      return {
        topLeft: pred.topLeft,
        bottomRight: pred.bottomRight,
        probability: pred.probability,
        ...(pred.gender || pred.age !== undefined
          ? {
              attributes: {
                ...(pred.gender ? { gender: pred.gender } : {}),
                ...(pred.age !== undefined ? { ageGroup } : {}),
              },
              attributeConfidence: {
                ...(pred.genderProbability !== undefined
                  ? { gender: pred.genderProbability }
                  : {}),
                ...(pred.age !== undefined ? { ageGroup: 0.8 } : {}),
              },
            }
          : {}),
      };
    });

    return {
      path: imagePath,
      embedding,
      faces: predictions.length,
      cached: new Date().toISOString(),
      predictions: processedPredictions,
    };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
    throw error;
  }
}
