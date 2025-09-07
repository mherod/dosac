import * as tf from "@tensorflow/tfjs-node";

// Configure TensorFlow.js for Node.js
tf.enableProdMode();
tf.setBackend("tensorflow");

// Helper function to decode raw image data into a tensor
export function decodeImage(
  data: Buffer,
  width: number,
  height: number,
): tf.Tensor3D {
  return tf.tidy(() => {
    // Convert raw RGBA buffer to tensor
    const tensor = tf.tensor4d(
      new Float32Array(data.buffer),
      [1, height, width, 4],
      "float32",
    );

    // Remove alpha channel and normalize to [0, 1]
    return tf.squeeze(
      tf.slice(tensor, [0, 0, 0, 0], [-1, -1, -1, 3]),
    ) as tf.Tensor3D;
  });
}

// Re-export TensorFlow.js
export * from "@tensorflow/tfjs-node";

// Export useful utilities
export const { dispose, tidy, zeros, tensor, tensor2d, tensor3d, tensor4d } =
  tf;

// Helper function to clean up tensors
export function disposeTensors(tensors: tf.Tensor[]): void {
  for (const tensor of tensors) {
    if (tensor && !tensor.isDisposed) {
      tensor.dispose();
    }
  }
}

// Export the configured TensorFlow.js instance
export default tf;
