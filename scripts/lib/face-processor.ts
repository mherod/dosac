import tf from "./tensorflow-setup";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { loadModels } from "./face-embedding";
import { FacePrediction } from "./face-embedding";
import sharp from "sharp";
import { convertToJpeg } from "./image-processing";
import { decodeImage } from "./tensorflow-setup";

// Constants
const FACE_LANDMARKS_MODEL = "mediapipe-face-mesh";
const CANONICAL_FACE_POINTS = {
  leftEye: [0.3, 0.3] as [number, number],
  rightEye: [0.7, 0.3] as [number, number],
  nose: [0.5, 0.5] as [number, number],
  leftMouth: [0.3, 0.7] as [number, number],
  rightMouth: [0.7, 0.7] as [number, number],
};

export interface AlignmentResult {
  buffer: Buffer;
  transformMatrix: number[][];
  landmarks: faceLandmarksDetection.Keypoint[];
  alignmentScore: number;
}

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
  ): Promise<faceLandmarksDetection.Face[]> {
    if (!this.landmarksModel) {
      throw new Error("Face landmarks model not initialized");
    }

    let tensor: tf.Tensor3D | null = null;
    try {
      tensor = await decodeImage(buffer, 3);
      const predictions = await this.landmarksModel.estimateFaces(tensor);
      return predictions;
    } finally {
      if (tensor) {
        tf.dispose(tensor);
      }
    }
  }

  private calculateAlignmentTransform(
    landmarks: faceLandmarksDetection.Keypoint[],
    imageWidth: number,
    imageHeight: number,
  ): { matrix: number[][]; score: number } {
    // Extract key facial landmarks
    const LANDMARK_INDICES = {
      LEFT_EYE: 33,
      RIGHT_EYE: 263,
      NOSE_TIP: 1,
      LEFT_MOUTH: 61,
      RIGHT_MOUTH: 291,
    };

    const leftEye = landmarks[LANDMARK_INDICES.LEFT_EYE];
    const rightEye = landmarks[LANDMARK_INDICES.RIGHT_EYE];
    const nose = landmarks[LANDMARK_INDICES.NOSE_TIP];
    const leftMouth = landmarks[LANDMARK_INDICES.LEFT_MOUTH];
    const rightMouth = landmarks[LANDMARK_INDICES.RIGHT_MOUTH];

    // Calculate the current positions (normalized)
    const currentPoints = {
      leftEye: [leftEye.x / imageWidth, leftEye.y / imageHeight] as [
        number,
        number,
      ],
      rightEye: [rightEye.x / imageWidth, rightEye.y / imageHeight] as [
        number,
        number,
      ],
      nose: [nose.x / imageWidth, nose.y / imageHeight] as [number, number],
      leftMouth: [leftMouth.x / imageWidth, leftMouth.y / imageHeight] as [
        number,
        number,
      ],
      rightMouth: [rightMouth.x / imageWidth, rightMouth.y / imageHeight] as [
        number,
        number,
      ],
    };

    // Calculate affine transformation matrix
    const srcPoints = [
      currentPoints.leftEye,
      currentPoints.rightEye,
      currentPoints.nose,
      currentPoints.leftMouth,
      currentPoints.rightMouth,
    ];

    const dstPoints = [
      CANONICAL_FACE_POINTS.leftEye,
      CANONICAL_FACE_POINTS.rightEye,
      CANONICAL_FACE_POINTS.nose,
      CANONICAL_FACE_POINTS.leftMouth,
      CANONICAL_FACE_POINTS.rightMouth,
    ];

    // Calculate transformation matrix using least squares method
    const matrix = this.computeAffineTransform(srcPoints, dstPoints);

    // Calculate alignment score based on landmark positions
    const alignmentScore = this.calculateAlignmentScore(
      currentPoints,
      CANONICAL_FACE_POINTS,
    );

    return { matrix, score: alignmentScore };
  }

  private computeAffineTransform(
    src: [number, number][],
    dst: [number, number][],
  ): number[][] {
    const n = src.length;
    const A = [];
    const b = [];

    for (let i = 0; i < n; i++) {
      const [x, y] = src[i];
      const [u, v] = dst[i];
      A.push([x, y, 1, 0, 0, 0]);
      A.push([0, 0, 0, x, y, 1]);
      b.push(u);
      b.push(v);
    }

    // Solve using pseudo-inverse (least squares)
    const AT = tf.tensor2d(A);
    const bT = tf.tensor1d(b);
    const ATA = tf.matMul(AT.transpose(), AT);
    const ATb = tf.matMul(AT.transpose(), bT.expandDims(1));
    const x = tf.matMul(tf.tensor2d(this.pseudoInverse(ATA.arraySync())), ATb);
    const result = x.arraySync() as number[][];

    // Cleanup tensors
    tf.dispose([AT, bT, ATA, ATb, x]);

    // Reshape result into 2x3 transformation matrix
    return [
      [result[0][0], result[1][0], result[2][0]],
      [result[3][0], result[4][0], result[5][0]],
    ];
  }

  private pseudoInverse(matrix: number[][]): number[][] {
    const svd = this.computeSVD(matrix);
    const threshold = 1e-10;
    const singularValues = svd.s.map((v) =>
      Math.abs(v) < threshold ? 0 : 1 / v,
    );

    const result = new Array(matrix[0].length)
      .fill(0)
      .map(() => new Array(matrix.length).fill(0));

    for (let i = 0; i < matrix[0].length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        let sum = 0;
        for (let k = 0; k < singularValues.length; k++) {
          sum += svd.v[i][k] * singularValues[k] * svd.u[j][k];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  private computeSVD(matrix: number[][]): {
    u: number[][];
    s: number[];
    v: number[][];
  } {
    // Simple SVD implementation for small matrices
    const AT = tf.tensor2d(matrix).transpose();
    const A = tf.tensor2d(matrix);
    const ATA = tf.matMul(AT, A);
    const eigenvalues = tf.eig(ATA);

    const s = eigenvalues.values.arraySync() as number[];
    const v = eigenvalues.vectors.arraySync() as number[][];

    // Calculate U using A * V * S^(-1/2)
    const sqrtS = s.map((val) =>
      Math.abs(val) < 1e-10 ? 0 : 1 / Math.sqrt(val),
    );
    const u = tf
      .matMul(
        tf.matMul(A, tf.tensor2d(v)),
        tf.tensor2d([
          [sqrtS[0], 0],
          [0, sqrtS[1]],
        ]),
      )
      .arraySync() as number[][];

    tf.dispose([AT, A, ATA, eigenvalues.values, eigenvalues.vectors]);

    return { u, s, v };
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
  ): Promise<AlignmentResult> {
    try {
      // Get image dimensions
      const metadata = await sharp(buffer).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error("Invalid image dimensions");
      }

      // Detect facial landmarks
      const landmarks = await this.detectLandmarks(buffer);
      if (!landmarks.length) {
        throw new Error("No facial landmarks detected");
      }

      // Calculate transformation
      const { matrix, score } = this.calculateAlignmentTransform(
        landmarks[0].keypoints,
        metadata.width,
        metadata.height,
      );

      // Apply transformation using sharp
      const alignedBuffer = await sharp(buffer)
        .affine(matrix[0].concat(matrix[1]), {
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      // Convert to JPEG for consistency
      const processedBuffer = await convertToJpeg(alignedBuffer);

      return {
        buffer: processedBuffer,
        transformMatrix: matrix,
        landmarks: landmarks[0].keypoints,
        alignmentScore: score,
      };
    } catch (error) {
      throw new Error(
        `Failed to align face: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async preprocessFace(buffer: Buffer, face: FacePrediction): Promise<Buffer> {
    try {
      // Align face
      const { buffer: alignedBuffer } = await this.alignFace(buffer, face);

      // Crop to face region with padding
      const { width, height } = await sharp(alignedBuffer).metadata();
      if (!width || !height) {
        throw new Error("Invalid image dimensions");
      }

      const faceWidth = face.bottomRight[0] - face.topLeft[0];
      const faceHeight = face.bottomRight[1] - face.topLeft[1];
      const padding = Math.max(faceWidth, faceHeight) * 0.2;

      const cropBuffer = await sharp(alignedBuffer)
        .extract({
          left: Math.max(0, Math.floor(face.topLeft[0] - padding)),
          top: Math.max(0, Math.floor(face.topLeft[1] - padding)),
          width: Math.min(
            width - Math.floor(face.topLeft[0] - padding),
            Math.floor(faceWidth + padding * 2),
          ),
          height: Math.min(
            height - Math.floor(face.topLeft[1] - padding),
            Math.floor(faceHeight + padding * 2),
          ),
        })
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
