import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import * as tf from "./tensorflow-setup";

const MODEL_CACHE_DIR = join(homedir(), ".face-models");
const BLAZEFACE_URL =
  "https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1";
const MOBILENET_URL =
  "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";
const GENDER_MODEL_URL =
  "https://tfhub.dev/tensorflow/tfjs-model/gender_classifier/1/default/1";
const AGE_MODEL_URL =
  "https://tfhub.dev/tensorflow/tfjs-model/age_classifier/1/default/1";
const HAIR_MODEL_URL =
  "https://tfhub.dev/tensorflow/tfjs-model/hair_color_classifier/1/default/1";
const SKIN_MODEL_URL =
  "https://tfhub.dev/tensorflow/tfjs-model/skin_tone_classifier/1/default/1";

interface LoadedModels {
  blazefaceModel: tf.GraphModel;
  mobileNet: tf.GraphModel;
  genderModel: tf.GraphModel;
  ageModel: tf.GraphModel;
  hairModel: tf.GraphModel;
  skinModel: tf.GraphModel;
}

let cachedModels: LoadedModels | null = null;

export async function loadModels(): Promise<LoadedModels> {
  if (cachedModels) {
    return cachedModels;
  }

  // Ensure cache directory exists
  if (!existsSync(MODEL_CACHE_DIR)) {
    mkdirSync(MODEL_CACHE_DIR, { recursive: true });
  }

  console.log("Loading models...");

  const [
    blazefaceModel,
    mobileNet,
    genderModel,
    ageModel,
    hairModel,
    skinModel,
  ] = await Promise.all([
    loadModel("blazeface", BLAZEFACE_URL),
    loadModel("mobilenet", MOBILENET_URL),
    loadModel("gender", GENDER_MODEL_URL),
    loadModel("age", AGE_MODEL_URL),
    loadModel("hair", HAIR_MODEL_URL),
    loadModel("skin", SKIN_MODEL_URL),
  ]);

  cachedModels = {
    blazefaceModel,
    mobileNet,
    genderModel,
    ageModel,
    hairModel,
    skinModel,
  };

  return cachedModels;
}

async function loadModel(name: string, url: string): Promise<tf.GraphModel> {
  const modelPath = join(MODEL_CACHE_DIR, name);

  try {
    // Try loading from cache first
    if (existsSync(modelPath)) {
      console.log(`Loading ${name} model from cache...`);
      return await tf.loadGraphModel(`file://${modelPath}/model.json`);
    }
  } catch (error) {
    console.warn(`Failed to load ${name} model from cache:`, error);
  }

  // Download and cache model
  console.log(`Downloading ${name} model...`);
  const model = await tf.loadGraphModel(url);

  try {
    await model.save(`file://${modelPath}`);
    console.log(`Cached ${name} model to ${modelPath}`);
  } catch (error) {
    console.warn(`Failed to cache ${name} model:`, error);
  }

  return model;
}

export function clearModelCache() {
  cachedModels = null;
}
