# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working with this repository.

## Development Commands

- Dev server: `pnpm dev`
- Production build: `pnpm build` then `pnpm start`
- Linting: `pnpm lint` or `pnpm lint:strict`
- Code formatting: `pnpm biome:check`, `pnpm biome:format`, `pnpm biome:lint`
- Testing: `pnpm test` (watch mode: `pnpm test:watch`)
- ML Scripts: `pnpm face-tagger`, `pnpm analyze-clusters`, `pnpm extract-clusters`, `pnpm analyze-appearances`

## Tech Stack

- **Package manager**: pnpm (not npm/yarn)
- **Node.js**: >= 18.0.0 required
- **Runtime**: Next.js 16.2.1-canary.19 + React 19.3.0-canary-1b45e243-20260402 with experimental features:
  - `cacheComponents` - Enables composable caching with "use cache"
  - `cacheLife` - Cache revalidation policies
  - `serverActions` - Server actions support (2mb body size limit)
  - `optimisticClientCache` - Client-side optimistic updates
  - PPR (`ppr: 'incremental'`) - Partial Prerendering for mixed static/dynamic
- **Styling**: TailwindCSS with tailwind-merge utility (cn function) from lib/utils
- **UI**: Radix UI primitives (shadcn/ui)
- **ML/AI**: TensorFlow.js (@tensorflow/tfjs-node) with MediaPipe face mesh, face-api.js with SSD MobileNet v1 and FaceNet
- **Build**: ESLint 9 + Biome + Prettier, strict mode (lint errors fail build)
  - Production builds use webpack (`pnpm build` runs `next build --webpack`)
  - Dev server uses Turbopack (`pnpm dev` runs `next dev --turbo`)
  - Static page generation timeout: 300 seconds
- **Custom ESLint**: `@mherod/eslint-plugin-custom` v1.4.0 — four plugin categories:
  - `@mherod/react` (49 rules) — Server/client separation, Next.js patterns, re-render optimization
  - `@mherod/typescript` (6 rules) — Type safety, Zod naming, empty function detection
  - `@mherod/general` (15 rules) — Import order, lodash-es, ufo, date-fns preferences
  - `@mherod/security` (12 rules) — Hardcoded secrets, unsafe eval/innerHTML, redirect validation
- **Code Style**: 2-space indentation, 80 char line width, double quotes, trailing commas, semicolons always

## Application Architecture

**Domain**: "The Thick of It" TV show quotes/memes generator with face recognition

**Core Data Type**: `Screenshot` in lib/types.ts

- `id`: unique frame identifier
- `imageUrl`, `image2Url`: primary and follow-up frame images
- `timestamp`, `subtitle`, `speech`: timing and dialogue data
- `episode`, `character`: show metadata

**Key Routes**:

- `/caption/[id]` and `/caption/[...ids]` - caption editing
- `/series/[id]/episode/[episodeId]` - episode browsing
- `/share/[base64]` - sharing generated captions
- `/api/frames/[id]` - frame data API
- `/t/[caption]` - Twitter/OG image generation

**Data Flow**: Static frame metadata → face recognition → character detection → meme generation

## Testing

- **Framework**: Jest 29 with ts-jest, ESM enabled
- **Test Location**: `__tests__/**/*.test.ts` (or `.test.tsx`)
- **Test Environment**: Node (jsdom for React components if needed)
- **Module Mapping**: `^@/(.*)$ -> <rootDir>/$1`
- **Key Utilities**: Test helpers in `lib/utils` - prefer pure functions over components

## Key Libraries and Utilities

- **lib/utils.tsx**: Core formatting helpers (`formatEpisodeId`, `formatTimestamp`, `generateTextShadow`, `cn` function)
- **lib/frames.server.ts**: Server-side frame data access (`getFrameById`)
- **scripts/lib/**: ML/face recognition modules (face-cache.ts, face-detector.ts, etc.)
- **TensorFlow Scripts**: `pnpm tsx scripts/<script>.ts` for ML processing

## Code Style Requirements

**Formatting (Biome enforced)**:

- **Indentation**: 2 spaces
- **Line width**: 80 characters
- **Quotes**: Double quotes (`"string"` not `'string'`)
- **Semicolons**: Required (`const x = 1;`)
- **Trailing commas**: Required (`{ a: 1, b: 2, }`)
- **Arrow functions**: Parentheses required (`(x) => x` not `x => x`)
- **Bracket spacing**: Enabled (`{ foo }` not `{foo}`)
- **Import organization**: Auto-sorted and grouped

**TypeScript Requirements (ESLint enforced)**:

- **Explicit types**: Required for parameters and return types in public APIs
- **No `any`**: Avoid `any` types (warnings enabled, use `unknown`)
- **Unused variables**: Error unless prefixed with `_` (`const _unused = value`)
- **JSDoc**: Required for classes, interfaces, type aliases, functions 15+ lines
- **Promise handling**: Return or catch promises (`promise/always-return`)

**React/Next.js Specific**:

- **Tailwind**: Use `cn()` utility from `lib/utils`, no dynamic classes
- **Server/Client**: Strict separation enforced (no client hooks in server components)
- **Imports**: Prefer destructured React imports, use Next.js navigation over router.push
- **Event handlers**: Don't pass to client component props — enforced by `@mherod/react/no-event-handlers-to-client-props` (error). Any component that passes `onClick`, `onChange`, `onValueChange`, or similar to JSX elements must have `"use client"`, even if it has no hooks or browser APIs. DON'T remove `"use client"` from a component without checking for event handler props first.
- **Components**: Use `React.ReactElement` return types
- **Route params**: Async in handlers - type as `Promise<{ paramName: string }>`, await before use
- **App Router**: Required (Pages Router not supported)

## Face Recognition & Character Tagging

**Overview**: Application uses face-api.js with SSD MobileNet v1 and FaceNet (128-dimensional embeddings) for character detection in video frames.

**Data Files**:

- `public/frame-characters.json` - Character tags (frameId → names + confidence)
- `public/character-mapping.json` - Maps cluster IDs to character names
- `.face-cache/` - Face embeddings (128-dimensional vectors) and detection results

**Key Scripts** (all use `pnpm tsx scripts/<script>.ts`):

1. **`pnpm face-tagger`** - Detects faces and generates embeddings
   - Processes ~24,000 frames in parallel (12 workers)
   - Caches results in `.face-cache/`
   - Creates `.face-cache/index.json` with face counts

2. **`pnpm analyze-clusters`** - Clusters face embeddings by similarity
   - Uses cosine similarity with 0.75 threshold
   - Iterative merging algorithm
   - Outputs cluster statistics and sample images

3. **`pnpm extract-clusters`** - Extracts cluster info to JSON
   - Generates `cluster-analysis.json`
   - Includes sample images and appearance counts

4. **`pnpm analyze-appearances`** - Analyzes character appearance patterns
   - Episode-by-episode breakdown
   - Identifies which cluster belongs to which character

5. **`pnpm tag-all-frames`** - Tags frames with character names
   - Loads mapping from `public/character-mapping.json`
   - Matches embeddings to known clusters
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

   Manually create `public/character-mapping.json` based on cluster analysis.

2. **Update Character Mapping**:
   - Edit `public/character-mapping.json`
   - Run `pnpm tag-all-frames` to regenerate tags
   - Server auto-loads new data (cached in memory)

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

**Performance**:

- Face detection: ~2-3 min for 24K frames (parallel)
- Clustering: ~30 sec for 17K faces
- Tagging: ~30 sec to match frames
- Frame index: Cached in memory (12K frames per server process)
- Character data: Cached in memory (per server process)

## Next.js 16 Caching & Performance

**Composable Caching with "use cache"**:

App uses Next.js 16's `unstable_cacheLife` API for caching control:

```typescript
export async function getFrameById(id: string): Promise<Frame> {
  "use cache";
  unstable_cacheLife("static"); // Cache forever (immutable data)
  // ... fetch frame data
}

export async function getFrameIndex(): Promise<Frame[]> {
  "use cache";
  unstable_cacheLife("stable"); // Cache with long expiration
  // ... load index
}
```

**Cache Policies**:

- `"static"` - Immutable (1 week default, 30 days stale-while-revalidate)
- `"stable"` - Rarely changing (2 hours default, 30 days stale-while-revalidate)
- `"dynamic"` - Frequently changing (no caching)

**Memory Optimization**: Frame index (~12K frames) uses a module-level singleton (`cachedFrameIndex` in `lib/frames.server.ts`) loaded once per worker process inside the `"use cache"` `getFrameIndex()` — prevents heap-limit errors during builds.

**SSR & Suspense Patterns**: strategic Suspense boundaries maximize SSR:

1. **Fully Static** (no Suspense): `/categories/[id]` (uses `generateStaticParams()`), `/profiles/[id]`, `/policies/[policy]`, `/series/[id]`.
2. **PPR** (static shell + dynamic in Suspense): `/` (homepage), `/search`, `/caption/[...ids]`.

**Suspense Best Practice**: DON'T wrap the whole page in one Suspense. DO render static shell (container/header/nav) immediately and wrap only the dynamic, `searchParams`/`params`-dependent subtree in `<Suspense>` with a skeleton fallback.

**Key Rules**:

- Pages accessing `searchParams` or `params` must be wrapped in Suspense (Next.js 16 with `cacheComponents`)
- Move Suspense boundaries close to dynamic data
- Render static shells (containers, headers, navigation) outside Suspense
- "use cache" is incompatible with `searchParams`/`params` access
- API routes must use `await headers()` to force dynamic rendering

**Client Boundary Rules**:

- A file without `"use client"` that is imported directly by a client component gets **bundled into the client** — it does NOT get server-rendered as a separate RSC payload
- To achieve true server rendering for a component, it must be imported/rendered by a server parent (page, layout, or another server component) — or passed as `children` from a server parent
- Removing `"use client"` from a leaf component only imported by client parents is a code organization cleanup, not an SSR improvement
- Pure rendering components (no hooks, no browser APIs, no event handlers) can have `"use client"` removed safely — they will be bundled into whichever context imports them

## Data Files Structure

**Subtitle Files** (two VTT formats):

- **Base format** (`s##e##.vtt`):
  - ~1800 lines per episode
  - Splits overlapping dialogue into separate blocks
  - Additional line breaks for readability

- **Named format** (`s##e##-names.vtt`):
  - ~1700 lines per episode
  - Includes speaker labels ("MALCOLM:", "HUGH:")
  - Groups related dialogue under single timestamps
  - Combines overlapping dialogue under speakers

Both formats use WebVTT standard formatting, maintain identical timestamps, preserve all dialogue, start with "WEBVTT" header.

**Frame Extraction** (`/public/frames/{episodeId}/`):

Each timestamp has directory named by timestamp ("05-31-360" for "05:31.360") containing:

- `frame-blank.webp` - Original frame at exact timestamp
- `frame-blank2.webp` - Frame captured 1 second after timestamp
- `speech.txt` - Subtitle text

Frames extracted using ffmpeg at exact timestamps, 500px width, cached permanently.

## Adding Character Profile Highlights

**Process for adding memorable captions:**

1. **Find frame ID** by searching for quote text:

   ```bash
   grep -i "quote text" public/frame-index.json
   ```

2. **Verify frame exists** and get complete frame ID (format: `s##e##-##-##.###`):

   ```bash
   grep "s##e##-##-##.###" public/frame-index.json
   ```

3. **Add to profile** in `lib/profiles.ts`:
   - Locate character profile
   - Add or update `frameHighlights` array
   - Include frame ID with comment

   ```typescript
   frameHighlights: [
     "s03e04-07-20.600", // "I like the plasmic nature of your data modelling! Nice!"
   ],
   ```

4. **Position in structure**:
   - Place `frameHighlights` before `relatedProfiles` if both exist
   - Add as new property if no existing highlights

**Result**: Caption appears in character's "Highlights" section with:

- Visual frame display with caption overlay
- Episode and timestamp metadata chips
- Click-to-edit functionality
- Responsive grid layout

**Note**: Frame IDs must exist in frame index with corresponding images in `/public/frames/`.

## Development Process & Workflows

### Upgrading Next.js and React Canary Versions

DO upgrade Next.js and React together; never separately.

1. Check: `pnpm view next@canary version` / `pnpm view react@canary version`.
2. Upgrade: `pnpm up next@canary react@canary react-dom@canary`.
3. Update `pnpm.overrides` in `package.json` (`next`, `react`, `react-dom`) to the exact new versions — required because canaries have peer-dependency mismatches; overrides pin one React version and silence "unmet peer dependency" warnings.
4. Update the Runtime version line in `CLAUDE.md`, `AGENTS.md`, `.junie/guidelines.md`.
5. Run QA checks below, then commit `chore: upgrade Next.js to <v> and React to <v>`.

### Quality Assurance Checks

Before pushing/merging to main, run in order:

1. `pnpm lint` — exit 0 = pass (warnings non-blocking). Errors must be fixed. DON'T run `pnpm lint --fix` after adding new plugins/rules — autofixes from unfamiliar rules can corrupt code; run without `--fix` first, then apply `--fix` only to known-safe rules/files.
2. `pnpm build` — runs `next build --webpack`; TypeScript typecheck runs as part of build (no separate `tsc`). Must exit 0.
3. `pnpm test` — Jest suite (`__tests__/**/*.test.ts[x]`); all must pass.

DON'T skip failing checks, disable lint rules, or comment out broken tests. If a fix is too large, document an actionable TODO.

## Important Notes

- **Face Recognition Caching**: Pipeline uses caching in `scripts/lib/face-cache.ts` - clear cache if results look stale
- **Image Processing**: Uses sharp and canvas for OG images
- **Base64 Routes**: `/t/[caption]` and `/share/[base64]` handle base64 payloads with size limits via `bodySizeLimit` in serverActions
- **Path Aliasing**: Use `@/*` alias configured in tsconfig.json (maps to project root)
- **UI Components**: Relaxed rules for `components/ui/**/*` (shadcn/ui components allow `any` types)
- **Webpack vs Turbopack**: Production uses webpack (avoids warnings); dev uses Turbopack (speed)
- **Frame Index**: Singleton pattern, loaded once per process; ~12K frames in memory
- **Git Workflow**: Conventional commits, pre-commit hooks required, max message 100 chars
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy in next.config.js
