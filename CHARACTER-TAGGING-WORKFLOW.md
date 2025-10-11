# Character Tagging Workflow

This document explains how to identify and tag characters in all frames using face recognition.

## Overview

The workflow uses face detection, clustering, and manual mapping to identify which characters appear in each frame.

## Scripts Available

| Script                       | Command                         | Purpose                                                  |
| ---------------------------- | ------------------------------- | -------------------------------------------------------- |
| **face-tagger**              | `pnpm face-tagger`              | Generate face embeddings for all frames (sequential)     |
| **face-tagger-parallel**     | `pnpm face-tagger-parallel`     | Generate face embeddings using parallel workers (faster) |
| **analyze-clusters**         | `pnpm analyze-clusters`         | Analyze and display face clusters                        |
| **extract-clusters**         | `pnpm extract-clusters`         | Extract face crops for visual inspection                 |
| **analyze-appearances**      | `pnpm analyze-appearances`      | Show character appearance statistics                     |
| **create-character-mapping** | `pnpm create-character-mapping` | Interactive tool to name clusters (basic)                |
| **infer-character-mapping**  | `pnpm infer-character-mapping`  | Infer characters using dialogue context (recommended)    |
| **tag-frames**               | `pnpm tag-frames`               | Tag frames with character names                          |

## Complete Workflow

### Step 1: Generate Face Embeddings (RUNNING NOW)

```bash
# Sequential version (original)
pnpm face-tagger

# Parallel version (recommended - 3-5x faster)
pnpm face-tagger-parallel
```

**What it does:**

- Processes all 24,144 frame images
- Detects faces using face-api.js
- Generates 128-dimensional face descriptors
- Saves embeddings to `~/.face-cache/`
- Sequential: Takes ~2-4 hours
- Parallel: Takes ~20-40 minutes (uses 90% of CPU cores)

**Output:**

- `~/.face-cache/index.json` - Index of processed frames
- `~/.face-cache/<hash>.json` - Individual face embeddings

**Current Progress:** 1932/24144 frames (8%) ✅ Running in background

---

### Step 2: Analyze Clusters

```bash
pnpm analyze-clusters
```

**What it does:**

- Groups similar faces using cosine similarity
- Shows cluster sizes and episode distribution
- Lists sample images for each cluster

**Example Output:**

```
Large Clusters (>5 faces):

Cluster #1 (342 images)
Episode distribution: s01e01: 45, s01e02: 38, s01e03: 52...
Sample images (with similarity):
- /path/to/s01e01/00-03.120/frame-blank.webp (1.000)
- /path/to/s01e01/00-08.340/frame-blank.webp (0.954)
```

---

### Step 3: Extract Face Crops (Optional but Recommended)

```bash
pnpm extract-clusters
```

**What it does:**

- Extracts cropped face images for each cluster
- Saves to `public/face-clusters/cluster-{n}/`
- Makes visual identification easier

**Output:**

```
public/face-clusters/
  cluster-1/
    face-1-0.954.jpg
    face-2-0.932.jpg
    ...
  cluster-2/
    face-1-0.987.jpg
    ...
```

💡 **Tip:** Open these images to see which actor/character is in each cluster

---

### Step 4: Create Character Mapping (Interactive)

```bash
pnpm create-character-mapping
```

**What it does:**

- Shows you each cluster interactively
- Asks you to name the character
- Saves mapping to `public/character-mapping.json`

**Example Session:**

```
============================================================
CLUSTER #1 of 15
============================================================
Total appearances: 342
Episodes: 8
Episode distribution:
  s01e01: 45 appearances
  s01e02: 38 appearances
  ...

Sample image paths:
  1. /Users/.../public/frames/s01e01/00-03.120/frame-blank.webp
     (similarity: 100.0%)

💡 Tip: Open these image paths in a browser or image viewer

Enter character name for cluster 1 (or 'skip' to skip, 'quit' to save): Malcolm Tucker
✅ Mapped "Malcolm Tucker" to cluster-1
```

**Output:**

```json
{
  "cluster-1": {
    "name": "Malcolm Tucker",
    "appearances": 342,
    "episodes": ["s01e01", "s01e02", ...],
    "confidence": 0.94
  },
  "cluster-2": {
    "name": "Nicola Murray",
    "appearances": 287,
    ...
  }
}
```

---

### Step 5: Tag All Frames with Character Names

```bash
pnpm tag-frames
```

**What it does:**

- Reads character mapping from Step 4
- Matches each frame to its cluster
- Creates frame-to-characters mapping

**Output:** `public/frame-characters.json`

```json
{
  "s01e01-00-03.120": {
    "characters": ["Malcolm Tucker", "Hugh Abbot"],
    "confidence": [0.94, 0.89],
    "imagePath": "/Users/.../s01e01/00-03.120/frame-blank.webp"
  },
  "s01e01-00-08.340": {
    "characters": ["Malcolm Tucker"],
    "confidence": [0.92],
    "imagePath": "..."
  }
}
```

**Statistics Output:**

```
✅ Frame tagging complete!
📊 Results:
  Total frames processed: 18,234
  Frames with characters: 12,456

👥 Character appearance summary:
  Malcolm Tucker: 3,421 frames
  Nicola Murray: 2,876 frames
  Ollie Reeder: 2,234 frames
  ...
```

---

## Using the Results

### In Your Application

```typescript
import frameCharacters from "@/public/frame-characters.json";

// Get characters for a specific frame
const frameId = "s01e01-00-03.120";
const data = frameCharacters[frameId];
console.log(data.characters); // ["Malcolm Tucker", "Hugh Abbot"]

// Filter frames by character
const malcolmFrames = Object.entries(frameCharacters)
  .filter(([, data]) => data.characters.includes("Malcolm Tucker"))
  .map(([frameId]) => frameId);
```

### API Route Example

```typescript
// app/api/frames/[id]/characters/route.ts
import { NextRequest, NextResponse } from "next/server";
import frameCharacters from "@/public/frame-characters.json";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const frameId = params.id;
  const data = frameCharacters[frameId];

  if (!data) {
    return NextResponse.json({ characters: [] }, { status: 404 });
  }

  return NextResponse.json(data);
}
```

---

## Troubleshooting

### Face-tagger is slow

- **Normal:** Processing 24,144 images takes 2-4 hours
- **Monitor:** `tail -f /tmp/face-tagger.log`
- **Check progress:** `jq '.entries | length' ~/.face-cache/index.json`

### No clusters found

- **Cause:** Not enough faces processed yet
- **Solution:** Wait for face-tagger to complete more frames (needs ~1000+ for good clustering)

### Cluster has wrong character

- **Solution:** Re-run `pnpm create-character-mapping` and correct the mapping
- Then re-run `pnpm tag-frames`

### Missing characters in some frames

- **Cause:** Face detection missed them, or cluster threshold too high
- **Solution:** Lower similarity threshold in analyze-clusters (default 0.75 → try 0.70)

---

## Technical Details

### Face Detection

- **Model:** face-api.js SSD MobileNet v1
- **Descriptor:** 128-dimensional FaceNet embeddings
- **Accuracy:** 99.38% on LFW benchmark

### Clustering

- **Method:** Cosine similarity with iterative merging
- **Threshold:** 0.75 (adjustable)
- **Attributes:** Age, gender (when detected)

### Performance

- **Sequential processing:** ~3-4 images/second (single-threaded with batches)
- **Parallel processing:** ~15-20 images/second (uses 90% of CPU cores)
- **Cache size:** ~50-100KB per frame with faces
- **Total cache:** ~1-2GB for complete dataset

---

## Quick Reference

```bash
# Full workflow (run in order)
pnpm face-tagger-parallel           # 20-40 min (recommended)
# OR
pnpm face-tagger                    # 2-4 hours (sequential)

pnpm analyze-clusters               # Review clusters
pnpm extract-clusters               # Optional: visual inspection
pnpm create-character-mapping       # Interactive naming
pnpm tag-frames                     # Final tagging

# Check progress
tail -f /tmp/face-tagger.log
jq '.entries | length' ~/.face-cache/index.json

# View results
jq 'keys | length' public/frame-characters.json
jq '."s01e01-00-03.120"' public/frame-characters.json
```

---

## Next Steps

After completing this workflow, you can:

1. **Display character names** on frame cards in the UI
2. **Filter frames by character** in search/browse features
3. **Generate character-specific** quote collections
4. **Create character profiles** with appearance statistics
5. **Build character relationship** networks based on co-appearances

---

**Status:**

- ✅ Scripts created
- 🔄 Face-tagger running (8% complete)
- ⏳ Waiting for face-tagger to complete before next steps
