# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Dev server: `pnpm dev`
- Production build: `pnpm build` then `pnpm start`
- Linting: `pnpm lint` or `pnpm lint:strict`
- Code formatting: `pnpm biome:check`, `pnpm biome:format`, `pnpm biome:lint`
- Testing: `pnpm test` (watch mode: `pnpm test:watch`)
- ML Scripts: `pnpm face-tagger`, `pnpm analyze-clusters`, `pnpm extract-clusters`, `pnpm analyze-appearances`

## Tech Stack

- **Package manager**: pnpm (use pnpm, not npm/yarn)
- **Runtime**: Next.js 15 canary + React 19 RC with experimental features (serverActions, optimisticClientCache, PPR incremental)
- **Styling**: TailwindCSS with tailwind-merge utility (cn function) from lib/utils
- **UI Components**: Radix UI primitives
- **ML/AI**: TensorFlow.js (@tensorflow/tfjs-node) with MediaPipe face mesh
- **Build**: ESLint 9 + Biome + Prettier, strict mode (lint errors fail build)
- **Code Style**: 2-space indentation, 80 char line width, double quotes, trailing commas, semicolons always

## Application Architecture

**Domain**: "The Thick of It" TV show quotes/memes generator with face recognition

**Core Data Type**: `Screenshot` in lib/types.ts

- `id`: unique frame identifier
- `imageUrl`, `image2Url`: primary and follow-up frame images
- `timestamp`, `subtitle`, `speech`: timing and dialogue data
- `episode`, `character`: show metadata

**Key Routes**:

- `/caption/[id]` and `/caption/[...ids]` - caption editing (single/dual)
- `/series/[id]/episode/[episodeId]` - episode browsing
- `/share/[base64]` - sharing generated captions
- `/api/frames/[id]` - frame data API
- `/t/[caption]` - Twitter/OG image generation

**Data Flow**: Static frame/screenshot metadata → face recognition processing → character detection → meme generation

## Testing

- **Framework**: Jest 29 with ts-jest, ESM enabled
- **Test Location**: `__tests__/**/*.test.ts` (or `.test.tsx`)
- **Test Environment**: Node (switch to jsdom for React components if needed)
- **Module Mapping**: `^@/(.*)$ -> <rootDir>/$1`
- **Key Utilities**: Test helpers in `lib/utils` - prefer testing pure functions over components

## Key Libraries and Utilities

- **lib/utils.tsx**: Core formatting helpers (`formatEpisodeId`, `formatTimestamp`, `generateTextShadow`, `cn` function)
- **lib/frames.server.ts**: Server-side frame data access (`getFrameById`)
- **scripts/lib/**: ML/face recognition modules (face-cache.ts, face-detector.ts, etc.)
- **TensorFlow Scripts**: Use `pnpm tsx scripts/<script>.ts` to run ML processing

## Code Style Requirements

**Formatting (Biome enforced)**:

- **Indentation**: 2 spaces (never tabs)
- **Line width**: 80 characters max
- **Quotes**: Double quotes always (`"string"` not `'string'`)
- **Semicolons**: Always required (`const x = 1;`)
- **Trailing commas**: Always (`{ a: 1, b: 2, }`)
- **Arrow functions**: Parentheses always (`(x) => x` not `x => x`)
- **Bracket spacing**: Enabled (`{ foo }` not `{foo}`)
- **Import organization**: Auto-sorted and grouped

**TypeScript Requirements (ESLint enforced)**:

- **Explicit types**: Required for function parameters and return types in public APIs
- **No `any`**: Avoid `any` types (warnings enabled, use `unknown` instead)
- **Unused variables**: Error unless prefixed with `_` (`const _unused = value`)
- **JSDoc**: Required for classes, interfaces, type aliases, and functions 15+ lines
- **Promise handling**: Always return or catch promises (`promise/always-return`)

**React/Next.js Specific**:

- **Tailwind**: Use `cn()` utility from `lib/utils`, no dynamic classes
- **Server/Client**: Strict separation enforced (no client hooks in server components)
- **Imports**: Prefer destructured React imports, use Next.js navigation over router.push
- **Event handlers**: Don't pass to client component props
- **Components**: Use `React.ReactElement` return types for components

## Face Recognition & Character Tagging

**Overview**: The application uses face-api.js with SSD MobileNet v1 and FaceNet (128-dimensional embeddings) to detect and identify characters in video frames.

**Data Files**:

- `public/frame-characters.json` - Character tags for all frames (frameId → character names + confidence)
- `public/character-mapping.json` - Maps cluster IDs to character names
- `.face-cache/` - Cached face embeddings (128-dimensional vectors) and detection results

**Key Scripts** (all use `pnpm tsx scripts/<script>.ts`):

1. **`pnpm face-tagger`** - Detects faces in all frames and generates embeddings
   - Processes ~24,000 frames in parallel (12 workers)
   - Caches results in `.face-cache/`
   - Creates `.face-cache/index.json` with face counts per frame

2. **`pnpm analyze-clusters`** - Clusters face embeddings by similarity
   - Uses cosine similarity with 0.75 threshold
   - Iterative merging algorithm
   - Outputs cluster statistics and sample images

3. **`pnpm extract-clusters`** - Extracts cluster info to JSON
   - Generates `cluster-analysis.json`
   - Includes sample images and appearance counts per episode

4. **`pnpm analyze-appearances`** - Analyzes character appearance patterns
   - Shows episode-by-episode breakdown
   - Helps identify which cluster belongs to which character

5. **`pnpm tag-all-frames`** - Tags all frames with character names
   - Loads character mapping from `public/character-mapping.json`
   - Matches face embeddings to known clusters
   - Generates `public/frame-characters.json`

**Character Mapping Format** (`public/character-mapping.json`):

```json
{
  "cluster-1": {
    "name": "Malcolm Tucker",
    "appearances": 4600,
    "episodes": ["s01e01", "s01e02", ...],
    "confidence": 0.97
  }
}
```

**Frame Characters Format** (`public/frame-characters.json`):

```json
{
  "s03e01-08-24.000": {
    "characters": ["Malcolm Tucker"],
    "confidence": [1.0],
    "imagePath": "/frames/s03e01/08-24.000/frame-blank.webp"
  }
}
```

**Common Workflows**:

1. **Initial Setup** (run once):

   ```bash
   pnpm face-tagger          # Generate all face embeddings
   pnpm analyze-clusters     # Identify face clusters
   pnpm extract-clusters     # Export cluster data
   pnpm analyze-appearances  # Analyze patterns
   ```

   Then manually create `public/character-mapping.json` based on cluster analysis.

2. **Update Character Mapping**:
   - Edit `public/character-mapping.json`
   - Run `pnpm tag-all-frames` to regenerate tags
   - Server will auto-load new data (cached in memory)

3. **Fix Cluster Assignments**:
   - Use `analyze-appearances` to identify mis-labeled clusters
   - Update cluster IDs in `character-mapping.json`
   - Re-run `tag-all-frames`

4. **Server-Side Usage**:
   ```typescript
   import { getCharactersForFrame } from "@/lib/frame-characters.server";
   const characters = getCharactersForFrame("s03e01-08-24.000");
   // Returns: [{ name: "Malcolm Tucker", confidence: 1.0 }]
   ```

**Performance Notes**:

- Face detection: ~2-3 minutes for 24K frames (parallel processing)
- Clustering: ~30 seconds for 17K faces
- Tagging: ~30 seconds to match all frames
- Frame index: Cached in memory (one-time 12K frame load per server process)
- Character data: Cached in memory (loaded once per server process)

## Important Notes

- **Face Recognition Caching**: Pipeline uses caching in `scripts/lib/face-cache.ts` - clear cache if results look stale
- **Image Processing**: Uses sharp and canvas for OG/processing
- **Base64 Routes**: `/t/[caption]` and `/share/[base64]` handle base64 payloads with size limits via `bodySizeLimit` in serverActions
- **Path Aliasing**: Use relative imports (no tsconfig paths configured beyond defaults)
- **UI Components**: Relaxed rules for `components/ui/**/*` (shadcn/ui components allow `any` types)
