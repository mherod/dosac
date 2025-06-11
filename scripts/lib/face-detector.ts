import { loadModels } from "./model-loader";
import * as tf from "./tensorflow-setup";

export interface FacePrediction {
  topLeft: [number, number];
  bottomRight: [number, number];
  probability: number;
}

/**
 *
 */
export class FaceDetector {
  private blazefaceModel: tf.GraphModel | null = null;
  private mobileNet: tf.GraphModel | null = null;

  async initialize() {
    if (!this.blazefaceModel || !this.mobileNet) {
      const models = await loadModels();
      this.blazefaceModel = models.blazefaceModel;
      this.mobileNet = models.mobileNet;
    }
  }

  async detect(image: tf.Tensor3D): Promise<FacePrediction[]> {
    if (!this.blazefaceModel) {
      throw new Error("Face detector not initialized");
    }

    const predictions = (await this.blazefaceModel.predict(
      tf.expandDims(image, 0),
    )) as tf.Tensor2D;

    const faces = await this.processPredictions(predictions);
    predictions.dispose();

    return faces;
  }

  async generateEmbedding(
    image: tf.Tensor3D,
    face: FacePrediction,
  ): Promise<number[]> {
    if (!this.mobileNet) {
      throw new Error("MobileNet not initialized");
    }

    // Extract and preprocess face region
    const faceRegion = this.extractFaceRegion(image, face);
    const preprocessed = this.preprocessForMobileNet(faceRegion);
    faceRegion.dispose();

    // Generate embedding
    const embedding = this.mobileNet.predict(preprocessed) as tf.Tensor2D;
    preprocessed.dispose();

    const embeddingData = await embedding.data();
    embedding.dispose();

    return Array.from(embeddingData);
  }

  private async processPredictions(
    predictions: tf.Tensor2D,
  ): Promise<FacePrediction[]> {
    const [boxes, scores] = tf.tidy(() => {
      const [boxes, scores] = tf.unstack(predictions, 2);
      const nms = tf.image.nonMaxSuppression(
        boxes as tf.Tensor2D,
        scores as tf.Tensor1D,
        100, // maxOutputSize
        0.3, // iouThreshold
        0.75, // scoreThreshold
      );
      return [
        tf.gather(boxes, nms).arraySync() as number[][],
        tf.gather(scores, nms).arraySync() as number[],
      ];
    });

    return boxes.map((box, i) => ({
      topLeft: [box[0], box[1]] as [number, number],
      bottomRight: [box[2], box[3]] as [number, number],
      probability: scores[i],
    }));
  }

  private extractFaceRegion(
    image: tf.Tensor3D,
    face: FacePrediction,
  ): tf.Tensor3D {
    return tf.tidy(() => {
      const [startY, startX] = face.topLeft;
      const [endY, endX] = face.bottomRight;
      const height = endY - startY;
      const width = endX - startX;

      // Add padding
      const padding = Math.min(width, height) * 0.2;
      const paddedStartX = Math.max(0, startX - padding);
      const paddedStartY = Math.max(0, startY - padding);
      const paddedWidth = Math.min(
        image.shape[1] - paddedStartX,
        width + padding * 2,
      );
      const paddedHeight = Math.min(
        image.shape[0] - paddedStartY,
        height + padding * 2,
      );

      return tf.slice(
        image,
        [Math.round(paddedStartY), Math.round(paddedStartX), 0],
        [Math.round(paddedHeight), Math.round(paddedWidth), 3],
      );
    });
  }

  private preprocessForMobileNet(image: tf.Tensor3D): tf.Tensor4D {
    return tf.tidy(() => {
      // Resize to MobileNet input size
      const resized = tf.image.resizeBilinear(image, [224, 224]);

      // Normalize to [-1, 1]
      const normalized = tf.sub(tf.div(resized, 127.5), 1);

      // Add batch dimension
      return tf.expandDims(normalized, 0);
    });
  }
}
