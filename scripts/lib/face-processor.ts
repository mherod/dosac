import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import sharp from "sharp";
import type { FacePrediction } from "./face-embedding";
import { convertToJpeg } from "./image-processing";
import tf from "./tensorflow-setup";
import { decodeImage } from "./tensorflow-setup";

// Define canonical face points for alignment
const CANONICAL_FACE_POINTS = {
  leftEye: [0.36, 0.5],
  rightEye: [0.64, 0.5],
  noseTip: [0.5, 0.6],
  mouthLeft: [0.4, 0.75],
  mouthRight: [0.6, 0.75],
} as const;

export interface AlignmentResult {
  buffer: Buffer;
  transformMatrix: number[][];
  landmarks: Array<{
    x: number;
    y: number;
    z?: number;
    score?: number;
    name?: string;
  }>;
  alignmentScore: number;
}

/**
 *
 */
export class FaceProcessor {
  private landmarksModel: faceLandmarksDetection.FaceLandmarksDetector | null =
    null;

  async initialize(): Promise<void> {
    try {
      // Load the MediaPipe FaceMesh model
      this.landmarksModel = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: "tfjs",
          refineLandmarks: true,
          maxFaces: 1,
        },
      );
    } catch (error) {
      throw new Error(
        `Failed to load face landmarks model: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async detectLandmarks(
    buffer: Buffer,
  ): Promise<
    Array<{ keypoints: Array<{ x: number; y: number; z?: number }> }>
  > {
    if (!this.landmarksModel) {
      throw new Error("Face landmarks model not initialized");
    }

    let tensor: tf.Tensor3D | null = null;
    try {
      tensor = (await decodeImage(buffer)) as tf.Tensor3D;
      const predictions = await this.landmarksModel.estimateFaces(tensor);
      return predictions;
    } finally {
      if (tensor) {
        tf.dispose(tensor);
      }
    }
  }

  private calculateAlignmentTransform(
    landmarks: Array<[number, number]>,
    targetLandmarks: Array<[number, number]>,
  ): number[][] {
    // Build the system of equations Ax = b
    const A: number[][] = [];
    const b: number[] = [];

    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i];
      const [u, v] = targetLandmarks[i];

      // Each point gives us two equations
      A.push([x, y, 1, 0, 0, 0]);
      A.push([0, 0, 0, x, y, 1]);
      b.push(u);
      b.push(v);
    }

    // Convert to tensors
    const AT = tf.tensor2d(A);
    const bT = tf.tensor1d(b);

    return tf.tidy(() => {
      // Compute A^T * A and A^T * b
      const ATA = tf.matMul(AT.transpose(), AT);
      const ATb = tf.matMul(AT.transpose(), bT.expandDims(1));

      // Use SVD for numerical stability
      // Using QR decomposition as a workaround for SVD
      const { q, r } = tf.linalg.qr(ATA);
      const svd = {
        s: tf.diag(r),
        u: q,
        v: tf.transpose(q),
      };
      const singularValues = svd.s.arraySync() as number[];
      const threshold = 1e-10;

      // Compute pseudo-inverse using SVD
      const Sinv = tf.tensor2d(
        singularValues.map((v: any) => (v < threshold ? 0 : 1 / v)),
        [singularValues.length, 1],
      );

      const UTb = tf.matMul(svd.u.transpose(), ATb);
      const x = tf.matMul(tf.matMul(svd.v, Sinv.mul(UTb)), svd.v.transpose());

      // Extract result
      const result = x.arraySync() as number[][];

      // Reshape into 2x3 transformation matrix
      return [
        [result[0][0], result[1][0], result[2][0]],
        [result[3][0], result[4][0], result[5][0]],
      ];
    });
  }

  private calculateAlignmentScore(
    current: typeof CANONICAL_FACE_POINTS,
    target: typeof CANONICAL_FACE_POINTS,
  ): number {
    let totalError = 0;
    let count = 0;

    for (const key of Object.keys(current) as Array<keyof typeof current>) {
      const currentPoint = current[key];
      const targetPoint = target[key];
      const dx = currentPoint[0] - targetPoint[0];
      const dy = currentPoint[1] - targetPoint[1];
      totalError += Math.sqrt(dx * dx + dy * dy);
      count++;
    }

    const averageError = totalError / count;
    return Math.max(0, 1 - averageError * 2); // Scale error to [0,1] score
  }

  async alignFace(
    buffer: Buffer,
    face: FacePrediction,
  ): Promise<{ buffer: Buffer; width: number; height: number }> {
    try {
      // Get image dimensions
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error("Invalid image dimensions");
      }

      // Calculate transformation matrix
      const matrix = await this.calculateAlignmentTransform(
        face.landmarks || [],
        CANONICAL_FACE_POINTS,
      );

      // Apply transformation using sharp
      const alignedBuffer = await sharp(buffer)
        .affine(
          [
            matrix[0][0],
            matrix[0][1],
            matrix[1][0],
            matrix[1][1],
            matrix[0][2],
            matrix[1][2],
          ],
          {
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          },
        )
        .toBuffer();

      return {
        buffer: await convertToJpeg(alignedBuffer),
        width: metadata.width,
        height: metadata.height,
      };
    } catch (error) {
      console.error("Error in alignFace:", error);
      return { buffer, width: 0, height: 0 };
    }
  }

  async preprocessFace(buffer: Buffer, face: FacePrediction): Promise<Buffer> {
    try {
      // Align face
      const { buffer: alignedBuffer } = await this.alignFace(buffer, face);

      // Get image dimensions
      const { width, height } = await sharp(alignedBuffer).metadata();
      if (!width || !height) {
        throw new Error("Invalid image dimensions");
      }

      // Calculate face dimensions
      const faceWidth = face.bottomRight[0] - face.topLeft[0];
      const faceHeight = face.bottomRight[1] - face.topLeft[1];

      // Calculate the center point of the face
      const centerX = face.topLeft[0] + faceWidth / 2;
      const centerY = face.topLeft[1] + faceHeight / 2;

      // Use the larger dimension to create a square box
      const size = Math.max(faceWidth, faceHeight);
      const padding = size * 0.3; // 30% padding
      const cropSize = size + padding * 2;

      // Calculate the crop coordinates ensuring they're within image bounds
      const cropLeft = Math.max(0, Math.floor(centerX - cropSize / 2));
      const cropTop = Math.max(0, Math.floor(centerY - cropSize / 2));
      const finalCropWidth = Math.min(cropSize, width - cropLeft);
      const finalCropHeight = Math.min(cropSize, height - cropTop);

      // Extract and process the face region
      const cropBuffer = await sharp(alignedBuffer)
        .extract({
          left: cropLeft,
          top: cropTop,
          width: finalCropWidth,
          height: finalCropHeight,
        })
        .resize(224, 224) // Resize to standard size
        .toBuffer();

      return await convertToJpeg(cropBuffer);
    } catch (error) {
      throw new Error(
        `Failed to preprocess face: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

// Export singleton instance
export const faceProcessor = new FaceProcessor();
