# The Thick of It Quotes - Codebase Overview

## Project Description

A Next.js application called "DOSAC.UK" that serves as a sophisticated screenshot-based quote generator for the British TV show "The Thick of It". The app extracts video frames synchronized with dialogue to create shareable memes and quotes, featuring advanced face detection and character clustering capabilities.

## Tech Stack

- **Framework**: Next.js 15 with React 19 (canary)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: TensorFlow.js, MediaPipe, BlazeFace, MobileNet for face detection/clustering
- **UI Components**: Radix UI primitives (shadcn/ui)
- **Animation**: Framer Motion
- **Image Processing**: Sharp for server-side processing
- **Code Quality**: Biome, ESLint, Prettier, Husky with pre-commit hooks

## Key Features

- **Frame/Quote System**: Extracts frames from TV episodes with synchronized dialogue
- **Advanced Face Recognition**: Multi-stage ML pipeline for character detection and clustering
- **Search & Filtering**: Pre-indexed search by episode, season, character, or dialogue content
- **Caption Editor**: Interactive tools with font controls and positioning
- **Share Functionality**: Generate and share quote images with base64 encoded URLs
- **Performance Optimized**: LRU caching, batch processing, incremental static generation

## Detailed Architecture

### Core Components (`/components/`)

- **`captioned-image.tsx`** & **`client-captioned-image.tsx`**: Core frame display with captions
- **`frame-*.tsx`**: Frame display variants (`frame-card`, `frame-grid`, `frame-stack`, `frame-strip`)
- **`*-page.tsx`**: Main page components (home, episode, series)
- **`main-nav/`**: Navigation system including search, series selection, category navigation
- **`caption-controls/`**: Caption editing controls (font, positioning, action buttons)
- **`ui/`**: Complete shadcn/ui component library

### Core Utilities (`/lib/`)

- **`types.ts`**: Main type definitions including `Screenshot` interface
- **`frames.ts`** & **`frames.server.ts`**: Frame handling (client/server split)
- **`series-info.ts`**: Comprehensive series metadata with character cross-references
- **`profiles.ts`**: Character profile definitions with images and metadata (written from in-universe perspective, no Series/Episode references)
- **`categories.ts`**: Content categorization system
- **`constants.ts`**: Site configuration and constants
- **`utils.tsx`**: General utility functions and helpers

### API Routes (`/app/api/`)

- **`frames/[id]/route.ts`**: Individual frame data endpoints
- **`frames/index/route.ts`**: Frame index/listing endpoint
- **`moments/route.ts`**: Highlights and ranked moments
- **`og/route.tsx`**: Dynamic Open Graph image generation
- **`search/`**: Search functionality endpoints

### Page Structure (`/app/`)

- **`caption/[id]/`**: Caption editing interface with comparison tools
- **`series/[id]/episode/`**: Nested episode viewing structure
- **`profiles/[id]/`**: Character profile pages
- **`categories/[id]/`**: Category browsing interface
- **`share/[base64]/`**: Shareable link generation and handling

### Face Detection/ML Pipeline (`/scripts/lib/`)

- **`face-detector.ts`**: Main detection class using BlazeFace + MobileNet
- **`face-recognition.ts`**: Recognition service with similarity matching
- **`face-embedding.ts`**: Face embedding generation using FaceNet
- **`face-net.ts`**: FaceNet model implementation for embeddings
- **`face-processor.ts`**: Face preprocessing and alignment utilities
- **`face-cache.ts`**: Sophisticated caching system for processed face data
- **`model-loader.ts`**: TensorFlow model loading and initialization
- **`tensorflow-setup.ts`**: TensorFlow.js environment configuration

### Data Processing Scripts (`/scripts/`)

- **`face-tagger.ts`**: Batch face detection and tagging pipeline
- **`extract-face-clusters.ts`**: Groups similar faces into character clusters
- **`analyze-clusters.ts`**: Analyzes and validates clustering results
- **`analyze-appearances.ts`**: Character appearance frequency analysis
- **`generate-search-index.ts`**: Creates searchable text index from VTT subtitle files
- **`vtt-frames.ts`**: Processes subtitle files for frame extraction timing

### Data Organization (`/public/`)

- **`frames/s[XX]e[XX]/[timestamp]/`**: Frame data structure:
  - `frame-blank.jpg` & `frame-blank2.jpg`: Primary + 1-second-later frames
  - `speech.txt`: Processed dialogue text
- **`characters/`**: Character portrait images (multiple formats)
- **`search-index.json`**: Pre-built searchable dialogue index
- **`frame-rank.json`**: Frame popularity and ranking data
- **`*.vtt`**: WebVTT subtitle files for each episode
- **`*.mp4`**: Source video files

## Development Commands

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run lint`** - Run ESLint
- **`npm run biome:check`** - Run Biome checker
- **`npm run test`** - Run Jest tests
- **`npm run face-tagger`** - Run face detection pipeline
- **`npm run analyze-clusters`** - Analyze face clustering results
- **`npm run extract-clusters`** - Extract face clusters
- **`npm run analyze-appearances`** - Character appearance analysis

## Key Technical Features

- **Multi-Stage Face Detection**: BlazeFace detection → MobileNet embeddings → Custom clustering
- **Performance Optimization**: LRU caching, batch processing, force-dynamic rendering
- **Rich Metadata System**: Character profiles, series information, episode guides
- **Advanced Search**: Pre-indexed full-text search across all dialogue
- **Image Optimization**: Multiple formats (AVIF, WebP), responsive sizing
- **Modern Architecture**: App Router, Server Components, incremental static generation

## Important Development Notes

### Character Profiles

- Character profiles in `lib/profiles.ts` are written from an in-universe perspective
- Do NOT include Series/Episode references (e.g., "Series 3, Episode 1") in profile data
- Character information should be factual and based on what's shown in the series
- Relationships between characters should be clearly established in the show
- **ALWAYS use British English spelling** (e.g., "manoeuvre" not "maneuver", "organising" not "organizing", "defence" not "defense", "rumours" not "rumors")
