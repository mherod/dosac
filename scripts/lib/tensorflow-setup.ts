import * as tf from "@tensorflow/tfjs-node";

// Configure TensorFlow.js to use the Node backend
tf.setBackend("tensorflow");

// Export the configured TensorFlow.js instance
export default tf;

// Export useful utilities
export const { dispose, tidy, zeros, tensor, tensor2d, tensor3d, tensor4d } =
  tf;

// Helper function to decode images
export async function decodeImage(
  buffer: Buffer,
  channels: number,
): Promise<tf.Tensor3D> {
  try {
    return tf.node.decodeImage(buffer, channels) as tf.Tensor3D;
  } catch (error) {
    console.error("Error in decodeImage:", error);
    throw error;
  }
}

// Helper function to clean up tensors
export function disposeTensors(tensors: tf.Tensor[]): void {
  tensors.forEach((tensor) => {
    if (tensor && !tensor.isDisposed) {
      tensor.dispose();
    }
  });
}
