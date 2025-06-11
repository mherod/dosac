import * as tf from "@tensorflow/tfjs";
import { loadModels } from "./face-embedding";
import { FacePrediction } from "./face-embedding";

// Constants for FaceNet
const FACENET_INPUT_SIZE = 224; // MobileNet V2 input size
const TRIPLET_MARGIN = 0.2;

// Types
export interface FaceNetOptions {
  minConfidence?: number;
  rotationCompensation?: boolean;
  alignFaces?: boolean;
}

export interface TrainingOptions {
  batchSize?: number;
  epochs?: number;
  learningRate?: number;
  hardNegativeMining?: boolean;
}

export interface FaceNetEmbedding {
  embedding: number[];
  confidence: number;
  alignmentScore?: number;
}

// FaceNet model class
/**
 *
 */
export class FaceNet {
  private model: tf.LayersModel | null = null;
  private readonly options: Required<FaceNetOptions>;

  constructor(options: FaceNetOptions = {}) {
    this.options = {
      minConfidence: options.minConfidence ?? 0.8,
      rotationCompensation: options.rotationCompensation ?? true,
      alignFaces: options.alignFaces ?? true,
    };
  }

  async loadModel(): Promise<void> {
    try {
      // Create MobileNet V2 model
      const input = tf.input({
        shape: [FACENET_INPUT_SIZE, FACENET_INPUT_SIZE, 3],
      });
      const mobilenet = await tf.loadLayersModel(
        "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v2_1.0_224/model.json",
      );

      // Get the feature extraction layer
      const features = mobilenet.getLayer("global_average_pooling2d_1").output;

      // Create a new model with just the feature extraction
      this.model = tf.model({
        inputs: input,
        outputs: features,
        name: "facenet_mobilenet",
      });

      // Warm up the model
      const dummyInput = tf.zeros([
        1,
        FACENET_INPUT_SIZE,
        FACENET_INPUT_SIZE,
        3,
      ]);
      await this.model.predict(dummyInput);
      tf.dispose(dummyInput);
    } catch (error) {
      throw new Error(
        `Failed to load FaceNet model: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async preprocessFace(
    buffer: Buffer,
    face: FacePrediction,
  ): Promise<{ tensor: tf.Tensor4D; alignmentScore?: number }> {
    return tf.tidy(() => {
      try {
        const processedBuffer = buffer;
        let alignmentScore;

        // Apply face alignment if enabled
        if (this.options.alignFaces && face.landmarks) {
          const angle = calculateRotationAngle(face.landmarks);
          alignmentScore =
            Math.abs(angle) < 10 ? 1.0 : Math.max(0, 1 - Math.abs(angle) / 45);
        }

        // Crop and resize face region
        const tensor = tf.node
          .decodeImage(processedBuffer, 3)
          .resizeBilinear([FACENET_INPUT_SIZE, FACENET_INPUT_SIZE])
          .toFloat()
          .div(255.0)
          .expandDims(0) as tf.Tensor4D;

        return { tensor, alignmentScore };
      } catch (error) {
        throw new Error(
          `Failed to preprocess face: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    });
  }

  async generateEmbedding(
    buffer: Buffer,
    face: FacePrediction,
  ): Promise<FaceNetEmbedding | null> {
    if (!this.model) {
      throw new Error("FaceNet model not loaded");
    }

    if (face.probability < this.options.minConfidence) {
      return null;
    }

    let processedTensor: tf.Tensor4D | null = null;
    try {
      const { tensor, alignmentScore } = await this.preprocessFace(
        buffer,
        face,
      );
      processedTensor = tensor;

      const embedding = await tf.tidy(() => {
        const prediction = this.model!.predict(processedTensor!) as tf.Tensor2D;
        // L2 normalize the embeddings
        const normalized = tf.div(prediction, tf.norm(prediction, 2, 1, true));
        return Array.from(normalized.dataSync());
      });

      return {
        embedding,
        confidence: face.probability,
        alignmentScore,
      };
    } finally {
      if (processedTensor) {
        tf.dispose(processedTensor);
      }
    }
  }

  // Triplet loss function for training
  private tripletLoss(
    anchor: tf.Tensor2D,
    positive: tf.Tensor2D,
    negative: tf.Tensor2D,
  ): tf.Tensor<tf.Rank> {
    return tf.tidy(() => {
      const positiveDist = tf.sum(tf.square(tf.sub(anchor, positive)), 1);
      const negativeDist = tf.sum(tf.square(tf.sub(anchor, negative)), 1);
      return tf.maximum(
        tf.add(tf.sub(positiveDist, negativeDist), TRIPLET_MARGIN),
        0,
      );
    });
  }

  // Hard triplet mining
  private async mineHardTriplets(
    embeddings: tf.Tensor2D,
    labels: number[],
  ): Promise<{
    anchors: tf.Tensor2D;
    positives: tf.Tensor2D;
    negatives: tf.Tensor2D;
  }> {
    return tf.tidy(() => {
      const uniqueLabels = Array.from(new Set(labels));
      const _numClasses = uniqueLabels.length;

      // Create label mapping
      const labelMap = new Map(uniqueLabels.map((label, i) => [label, i]));
      const labelIndices = labels.map((label: any) => labelMap.get(label)!);

      // Calculate pairwise distances
      const distances = tf.matMul(embeddings, embeddings.transpose());
      const squaredNorms = tf.sum(tf.square(embeddings), 1, true);
      const pairwiseDistances = tf.add(
        tf.add(squaredNorms, tf.transpose(squaredNorms)),
        tf.mul(distances, -2),
      );

      // Find hardest positive and negative pairs
      const positiveMask = tf.tensor(
        labelIndices.map((i: any) =>
          labelIndices.map((j: any) => i === j && i !== j),
        ),
      );
      const negativeMask = tf.tensor(
        labelIndices.map((i: any) => labelIndices.map((j: any) => i !== j)),
      );

      const hardestPositives = tf.argMax(
        tf.mul(pairwiseDistances, positiveMask),
        1,
      );
      const hardestNegatives = tf.argMin(
        tf.add(
          tf.mul(pairwiseDistances, negativeMask),
          tf
            .mul(tf.onesLike(pairwiseDistances), 1e10)
            .mul(tf.logicalNot(negativeMask)),
        ),
        1,
      );

      // Gather triplets
      const anchors = embeddings;
      const positives = tf.gather(embeddings, hardestPositives);
      const negatives = tf.gather(embeddings, hardestNegatives);

      return { anchors, positives, negatives };
    });
  }

  // Fine-tune the model on a dataset
  async fineTune(
    dataset: Array<{ buffer: Buffer; label: number }>,
    options: TrainingOptions = {},
  ): Promise<void> {
    if (!this.model) {
      throw new Error("FaceNet model not loaded");
    }

    const {
      batchSize = 32,
      epochs = 10,
      learningRate = 0.0001,
      hardNegativeMining = true,
    } = options;

    // Prepare optimizer
    const optimizer = tf.train.adam(learningRate);

    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      let batchCount = 0;

      // Process in batches
      for (let i = 0; i < dataset.length; i += batchSize) {
        const batchData = dataset.slice(i, i + batchSize);
        const labels = batchData.map((d: any) => d.label);

        // Generate embeddings for the batch
        const embeddings = await tf.tidy(async () => {
          const tensors = await Promise.all(
            batchData.map(async ({ buffer }) => {
              const { predictions } = await loadModels();
              const face = predictions[0];
              if (!face) return null;
              const { tensor } = await this.preprocessFace(buffer, face);
              return tensor;
            }),
          );

          const validTensors = tensors.filter(
            (t): t is tf.Tensor4D => t !== null,
          );
          return this.model!.predict(tf.concat(validTensors, 0)) as tf.Tensor2D;
        });

        // Perform triplet mining if enabled
        const { anchors, positives, negatives } = hardNegativeMining
          ? await this.mineHardTriplets(embeddings, labels)
          : {
              anchors: embeddings,
              positives: embeddings,
              negatives: embeddings,
            };

        // Compute and apply gradients
        const loss = await tf.tidy(() => {
          const tripletLoss = this.tripletLoss(anchors, positives, negatives);
          return tripletLoss.mean();
        });

        const gradients = await tf.variableGrads(() => loss);
        optimizer.applyGradients(gradients.grads);

        totalLoss += await loss.array();
        batchCount++;

        tf.dispose([embeddings, loss, gradients]);
      }

      console.log(
        `Epoch ${epoch + 1}/${epochs}, Average Loss: ${totalLoss / batchCount}`,
      );
    }
  }

  // Calculate similarity between two face embeddings
  calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    return tf.tidy(() => {
      const t1 = tf.tensor2d([embedding1]);
      const t2 = tf.tensor2d([embedding2]);
      const similarity = tf.metrics.cosineProximity(t1, t2).arraySync();
      return 1 - similarity; // Convert distance to similarity
    });
  }
}

// Export singleton instance
export const faceNet = new FaceNet();
