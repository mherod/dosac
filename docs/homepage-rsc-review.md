# Homepage RSC review

## Boundary changes

- `app/page.tsx` remains a Server Component. It resolves the frame index and
  request parameters together, then filters and paginates on the server.
- `HomePageShell` keeps the heading outside the results Suspense boundary.
  The route loading file reuses this shell; the results fallback matches the
  normal grid spacing and reserves pagination space.
- Previously, the client `ScreenshotGrid` imported `FrameCard`, which imported
  `FrameCardContent`. That made the visual card implementation client code.
- Now, the server `ScreenshotGrid` constructs each `FrameCardContent` slot.
  `ScreenshotGridClient` receives `{ id, speech, label, content }` for each card.
  `FrameCard` renders the supplied content without importing its implementation.
  This is a server organism, client selection controller, server card composition.
- The grid keeps selection, drag ranges, Escape handling, speculation rules and
  pathname-aware pagination together. Its headings and navigation markup remain
  with that controller to preserve the shared grid API across routes.
- `ClientCaptionedImage` remains client-owned for image toggling and responsive
  caption measurement. `FrameStrip` retains its independent selection, resizing,
  scroll and animation state. Moving those into server slots would not remove
  their browser dependencies.
- The existing cached frame loader and error boundaries are retained. One
  parent-owned frame read supplies the count, grid and strip consistently; the
  refactor introduces no per-card data reads or new cache policy.

## Verification

- Baseline and final `pnpm build` succeed, including TypeScript and 210 generated
  routes. The homepage remains partially prerendered.
- All 27 Jest tests pass. Changed-file ESLint passes with one existing redirect
  warning; commit hooks run lint-staged and TypeScript.
- The compiled homepage client-reference manifest includes the grid controller
  and caption-image client entry, but not the server grid or card-content module.
  Both server modules also have `server-only` guards.
- The prerendered homepage HTML contains the persistent heading.
- In-app browser checks exercised keyboard selection, Escape, page-two
  navigation, browser history and search (131 results for `minister`).
- Production HTTP checks cover filtered homepage, series, profile and category
  consumers of the shared grid.
- No byte-saving, latency or zero-CLS claim is made. The fallback represents a
  full page; short result sets can have different heights.

## Existing runtime limitation

The baseline production build already emits intermittent React hydration error 418. The final response also contains duplicate `S:4` and `S:5` completion IDs,
and the browser reports `HierarchyRequestError` in React's `$RV` stream reveal.
These observations match the reported PPR segment-ID collision in
[Next.js issue 95982](https://github.com/vercel/next.js/issues/95982) and
[React issue 37078](https://github.com/react/react/issues/37078).

The installed runtime is Next.js 16.2.1-canary.19 with Cache Components and
React 19.3.0-canary-1b45e243-20260402. Framework upgrade validation remains a
separate follow-up; this change does not suppress warnings, patch React's inline
runtime, or claim hydration is clean.
