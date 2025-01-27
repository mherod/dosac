// Cache directory configuration
import path from "path";
import * as os from "node:os";

export const NUM_CACHE_DIRS = 1;
export const PRIMARY_CACHE_DIR = path.join(os.homedir(), ".face-cache");
export const CACHE_DIRS = Array.from(
  { length: NUM_CACHE_DIRS },
  (_, i) => `${PRIMARY_CACHE_DIR}-${i}`,
);

// Cache file configuration
export const CACHE_FILE_PATTERN = /^[a-f0-9]{8}\.json$/;

// Performance tuning
export const BATCH_SIZE = 12; // NUM_PROCESSES * 2 for parallel processing
