import * as tf from "./tensorflow-setup";
import { loadModels } from "./model-loader";

// Define attribute types
export interface FaceAttributes {
  gender: "male" | "female";
  hairColor: "black" | "brown" | "blonde" | "red" | "gray";
  ageGroup: "child" | "young" | "middle" | "senior";
  skinTone: "light" | "medium" | "dark";
}

export interface AttributeConfidence {
  gender: number;
  hairColor: number;
  ageGroup: number;
  skinTone: number;
}

/**
 *
 */
export class FaceAttributeDetector {
  private genderModel: tf.GraphModel | null = null;
  private ageModel: tf.GraphModel | null = null;
  private hairModel: tf.GraphModel | null = null;
  private skinModel: tf.GraphModel | null = null;

  async initialize() {
    if (
      !this.genderModel ||
      !this.ageModel ||
      !this.hairModel ||
      !this.skinModel
    ) {
      const models = await loadModels();
      this.genderModel = models.genderModel;
      this.ageModel = models.ageModel;
      this.hairModel = models.hairModel;
      this.skinModel = models.skinModel;
    }
  }

  async detectAttributes(
    image: tf.Tensor3D,
  ): Promise<{ attributes: FaceAttributes; confidence: AttributeConfidence }> {
    if (
      !this.genderModel ||
      !this.ageModel ||
      !this.hairModel ||
      !this.skinModel
    ) {
      throw new Error("Models not initialized");
    }

    // Preprocess image for each model
    const preprocessed = tf.tidy(() => {
      // Resize to 224x224 (standard input size for most models)
      const resized = tf.image.resizeBilinear(image, [224, 224]);
      // Normalize to [-1, 1]
      return tf.sub(tf.div(resized, 127.5), 1);
    });

    try {
      // Run all models in parallel
      const [genderPrediction, agePrediction, hairPrediction, skinPrediction] =
        await Promise.all([
          this.genderModel.predict(tf.expandDims(preprocessed, 0)) as tf.Tensor,
          this.ageModel.predict(tf.expandDims(preprocessed, 0)) as tf.Tensor,
          this.hairModel.predict(tf.expandDims(preprocessed, 0)) as tf.Tensor,
          this.skinModel.predict(tf.expandDims(preprocessed, 0)) as tf.Tensor,
        ]);

      // Get predictions and confidences
      const [genderProbs, ageProbs, hairProbs, skinProbs] = await Promise.all([
        genderPrediction.data(),
        agePrediction.data(),
        hairPrediction.data(),
        skinPrediction.data(),
      ]);

      // Clean up tensors
      tf.dispose([
        genderPrediction,
        agePrediction,
        hairPrediction,
        skinPrediction,
      ]);

      // Process gender prediction
      const genderIndex = genderProbs[0] > 0.5 ? 1 : 0;
      const genderConfidence = Math.abs(genderProbs[0] - 0.5) * 2;
      const gender = genderIndex === 1 ? "male" : "female";

      // Process age prediction
      const ageGroups: ("child" | "young" | "middle" | "senior")[] = [
        "child",
        "young",
        "middle",
        "senior",
      ];
      const ageIndex = tf.argMax(ageProbs).dataSync()[0];
      const ageConfidence = ageProbs[ageIndex];
      const ageGroup = ageGroups[ageIndex];

      // Process hair color prediction
      const hairColors: ("black" | "brown" | "blonde" | "red" | "gray")[] = [
        "black",
        "brown",
        "blonde",
        "red",
        "gray",
      ];
      const hairIndex = tf.argMax(hairProbs).dataSync()[0];
      const hairConfidence = hairProbs[hairIndex];
      const hairColor = hairColors[hairIndex];

      // Process skin tone prediction
      const skinTones: ("light" | "medium" | "dark")[] = [
        "light",
        "medium",
        "dark",
      ];
      const skinIndex = tf.argMax(skinProbs).dataSync()[0];
      const skinConfidence = skinProbs[skinIndex];
      const skinTone = skinTones[skinIndex];

      return {
        attributes: {
          gender,
          hairColor,
          ageGroup,
          skinTone,
        },
        confidence: {
          gender: genderConfidence,
          hairColor: hairConfidence,
          ageGroup: ageConfidence,
          skinTone: skinConfidence,
        },
      };
    } finally {
      // Clean up preprocessed tensor
      preprocessed.dispose();
    }
  }
}

// Export singleton instance
export const faceAttributeDetector = new FaceAttributeDetector();
