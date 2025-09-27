# Project-specific development guidelines

This document captures practical, project-specific knowledge to accelerate setup, development, testing, and debugging for thickofitquotes. It intentionally omits generic Next.js or React explanations.

## Development Commands

- Dev server: `pnpm dev`
- Production build: `pnpm build` then `pnpm start`
- Linting: `pnpm lint` or `pnpm lint:strict`
- Code formatting: `pnpm biome:check`, `pnpm biome:format`, `pnpm biome:lint`
- Testing: `pnpm test` (watch mode: `pnpm test:watch`)
- ML Scripts: `pnpm face-tagger`, `pnpm analyze-clusters`, `pnpm extract-clusters`, `pnpm analyze-appearances`

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

## Tech Stack

- **Package manager**: pnpm (use pnpm, not npm/yarn)
- **Runtime**: Next.js 15 canary + React 19 RC with experimental features (serverActions, optimisticClientCache, PPR incremental)
- **Styling**: TailwindCSS with tailwind-merge utility (cn function) from lib/utils
- **UI Components**: Radix UI primitives
- **ML/AI**: TensorFlow.js (@tensorflow/tfjs-node) with MediaPipe face mesh
- **Build**: ESLint 9 + Biome + Prettier, strict mode (lint errors fail build)

## Environment, toolchain, and expectations

- Runtime: Node.js 20 LTS recommended. Newer Node 22 works, but native deps (sharp, canvas, tfjs-node) often have prebuilt binaries matched for Node 20 and are more predictable in CI.
- Package manager: pnpm (pnpm-lock.yaml present). Use pnpm over npm/yarn for consistency.
- OS prerequisites (native deps):
  - macOS: brew install pkg-config cairo pango libpng jpeg giflib librsvg
  - Debian/Ubuntu: apt-get install -y build-essential pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
  - Windows: Prefer WSL2 Ubuntu; otherwise install windows-build-tools, GTK/Cairo stack, and ensure node-gyp prerequisites. For automation/CI, Linux containers are simpler.
- Optional environment knobs:
  - NEXT_TELEMETRY_DISABLED=1 to silence Next telemetry in CI.
  - For heavy scripts (TensorFlow): set TF_CPP_MIN_LOG_LEVEL=2 to reduce log noise.

## Build and configuration

- Dev server: pnpm dev (Next.js 15 canary + React 19 RC). Uses experimental features: serverActions, optimisticClientCache, PPR incremental. React strict mode is on.
- Production build: pnpm build then pnpm start. Build is strict with eslint.ignoreDuringBuilds=false; lint errors fail the build.
- Image handling: next/image is open to any https host via images.remotePatterns. Device/image sizes configured; AVIF/WebP enabled.
- Static generation:
  - staticPageGenerationTimeout=300 (5 min) to accommodate data-heavy pages.
  - generateBuildId provides a unique timestamp-based build ID.
- Path aliasing: Jest maps ^@/(.\*)$ -> <rootDir>/$1. Application TypeScript relies on relative imports; no tsconfig paths declared beyond defaults.

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

## Quality gates and code style

- ESLint 9 with Next.js plugin and a custom plugin @mherod/eslint-plugin-custom. Run pnpm lint or pnpm lint:strict.
- Biome is configured alongside ESLint and Prettier:
  - pnpm biome:check for CI-friendly checks.
  - pnpm biome:format and pnpm biome:lint to auto-fix.
- Pre-commit: husky + lint-staged enforce ESLint/Prettier on staged files.
- Styling: TailwindCSS with tailwind-merge utility (cn function) and tailwindcss-animate. Maintain Tailwind class determinism; prefer cn() from lib/utils for conditional classes.

## Testing

- **Framework**: Jest 29 with ts-jest, ESM enabled
- **Test Location**: `__tests__/**/*.test.ts` (or `.test.tsx`)
- **Test Environment**: Node (switch to jsdom for React components if needed)
- **Module Mapping**: `^@/(.*)$ -> <rootDir>/$1`
- **Key Utilities**: Test helpers in `lib/utils` - prefer testing pure functions over components
- Commands:
  - Run all tests: pnpm test
  - Watch mode: pnpm test:watch
- Config specifics (jest.config.js):
  - preset: ts-jest
  - testEnvironment: node (switch to jsdom if rendering components in tests)
  - transform: ts-jest with tsconfig.test.json and useESM: true
  - moduleNameMapper: ^@/(.\*)$ -> <rootDir>/$1
  - extensionsToTreatAsEsm: [".ts", ".tsx"]
- TypeScript for tests (tsconfig.test.json):
  - jsx: react-jsx
  - moduleResolution: bundler and module: ESNext compatible with ts-jest ESM mode
  - types: ["jest", "node"]

## Key Libraries and Utilities

- **lib/utils.tsx**: Core formatting helpers (`formatEpisodeId`, `formatTimestamp`, `generateTextShadow`, `cn` function)
- **lib/frames.server.ts**: Server-side frame data access (`getFrameById`)
- **scripts/lib/**: ML/face recognition modules (face-cache.ts, face-detector.ts, etc.)
- **TensorFlow Scripts**: Use `pnpm tsx scripts/<script>.ts` to run ML processing

How to add a new test (and example)

- Place tests under **tests**/ and name them _.test.ts or _.test.tsx.
- Prefer testing small, deterministic utilities to keep the suite fast. For React components, switch testEnvironment to jsdom per-suite if needed.

Example (validated locally before documentation)

- Example targets pure helpers in lib/utils to avoid Next/React runtime:

  File: **tests**/utils.test.ts
  import { formatEpisodeId, formatTimestamp, generateTextShadow } from "../lib/utils";

  describe("lib/utils helpers", () => {
  test("formatEpisodeId formats s01e02 to S1 E2 and leaves bad input unchanged", () => {
  expect(formatEpisodeId("s01e02")).toBe("S1 E2");
  expect(formatEpisodeId("S10E03")).toBe("S10 E3");
  expect(formatEpisodeId("bad")).toBe("bad");
  expect(formatEpisodeId(null as unknown as string)).toBe("");
  expect(formatEpisodeId(undefined)).toBe("");
  });

  test("formatTimestamp formats 00-03.120 to 0:03 and leaves bad input unchanged", () => {
  expect(formatTimestamp("00-03.120")).toBe("0:03");
  expect(formatTimestamp("12-34.999")).toBe("12:34");
  expect(formatTimestamp("oops")).toBe("oops");
  });

  test("generateTextShadow produces outline points and optional drop shadow", () => {
  const outlineOnly = generateTextShadow(1, 0);
  expect(outlineOnly.split(", ").length).toBe(8);
  expect(outlineOnly).toContain("-1px -1px 0 #000");
  expect(outlineOnly).toContain("1px 1px 0 #000");

      const withShadow = generateTextShadow(1, 2);
      expect(withShadow.split(", ").length).toBe(9);
      expect(withShadow).toContain("0 2px 4px rgba(0,0,0,0.7)");

  });
  });

- Run: pnpm test
- Expected output (summary):
  Tests: 1 passed, 1 total
  Suites: 1 passed, 1 total
  Assertions: ~10

Guidelines for writing new tests

- Utilities (Node): keep them in **tests**/ and target lib/\* modules; avoid importing next/link or server actions to keep environment Node-friendly.
- React components: either
  - set testEnvironment: "jsdom" via a per-file comment or separate Jest project; or
  - create a new jest.config.ui.js extending current config with jsdom and testMatch for \*.test.tsx.
- Server code (app/api or actions): mock external services; prefer integration tests via Next route handlers only when the Node environment and required native deps (sharp, canvas) are available.
- Determinism: avoid network calls; leverage local fixtures under a tests/fixtures/ directory. Keep large binary fixtures out of the repo.

## Notes for data/ML scripts

- scripts/\* rely on TensorFlow.js (tfjs-node) and may download or load native bindings.
- For reproducibility, pin Node 20 and run with: pnpm tsx scripts/<script>.ts
- Consider setting TF_CPP_MIN_LOG_LEVEL=2 and increasing ulimit -n if processing many files.

## Important Notes

- **Face Recognition Caching**: Pipeline uses caching in `scripts/lib/face-cache.ts` - clear cache if results look stale
- **Image Processing**: Uses sharp and canvas for OG/processing
- **Base64 Routes**: `/t/[caption]` and `/share/[base64]` handle base64 payloads with size limits via `bodySizeLimit` in serverActions
- **Path Aliasing**: Use relative imports (no tsconfig paths configured beyond defaults)
- **UI Components**: Relaxed rules for `components/ui/**/*` (shadcn/ui components allow `any` types)
- Next routing: app/t/[caption]/route.ts and share/[base64] rely on base64 payloads—when hitting limits, confirm bodySizeLimit in experimental.serverActions and verify URL length limits in browsers.
- Utilities in lib/utils.tsx provide safe formatting helpers used across caption rendering; prefer these over ad hoc formatting.

## CI recommendations

- Add a workflow that runs: pnpm i --frozen-lockfile && pnpm biome:check && pnpm lint && pnpm test && pnpm build.
- Cache pnpm store and node_modules; use Node 20.x.

## Cleanup after test demonstration

- This document included a working example test. To keep the repository minimal, delete any demonstration files created during verification. Keep only this .junie/guidelines.md as the added artifact.
