# CLAUDE.md — Video-Editing Project

## Purpose
Remotion-based video creation toolkit — both data-driven generation and interactive Studio editing. Covers social media, YouTube, data/explainer, and general-purpose videos.

## Action Policy
Permitted: create/modify video project files, run Studio, render video, install Remotion packages.

## Conventions
- Always use `npx remotion add` for Remotion packages (ensures version alignment)
- Use `Interactive.*` elements for anything the user should select/edit in Studio
- Keep `interpolate()` calls inline on `style` props (required for Studio keyframe editing)
- Keep `defaultProps` as inline object literals on `<Composition>` (Studio can't write back extracted defaults)
- Use `useVideoConfig().fps` for all timing math — never hardcode 30
- Use format presets from `src/design/formats.ts` for composition dimensions
- Load the appropriate Remotion skill before writing markup

## Key Skills
| Skill | When to load |
|-------|-------------|
| `remotion:remotion-create` | Scaffolding new project or composition |
| `remotion:remotion-markup` | Writing any Remotion React markup |
| `remotion:remotion-interactivity` | Making components editable in Studio |
| `remotion:remotion-captions` | Working with captions/subtitles |
| `remotion:remotion-render` | Exporting/rendering video |
| `remotion:remotion-studio` | Launching or configuring Studio |
| `remotion:remotion-transitions` | Scene transitions |
| `remotion:remotion-multimedia` | Browser-based media operations |
| `remotion:remotion-docs` | Looking up Remotion APIs |

## Footage workflow (phone clips → editable)
Run in order after dropping new footage in. Every step is idempotent (skips work already done).
1. `npm run import-assets -- ~/Downloads/pack.zip` — sorts into `public/videos`, `public/images`, …
2. `npm run make-sdr` — 1080p H.264 copies in `public/videos/sdr/` (gitignored, regenerable). **Always edit from these, never the originals.**
3. `npm run transcribe` — local Whisper (large-v3-turbo, Mac GPU; audio never leaves the machine) → `src/data/captions/<clip>.json`
4. `npm run fix-captions` — re-applies hand corrections to mis-heard words (table in `scripts/fix-captions.mjs`)
5. Register the clip in `src/data/clips.ts`
6. `npm run preview -- <CompositionId>` — contact sheet in `out/previews/` for a quick visual check without Studio

## Gotchas (learned the hard way)
- **Phone footage is often HDR10** (HEVC, BT.2020, PQ). Chrome renders it flat and grey. `make-sdr` tone-maps it on the GPU with `scale_vt`.
- This machine's ffmpeg has **no `zscale`, `libplacebo` or `drawtext`** — use `scale_vt` for HDR→SDR, and don't rely on ffmpeg text overlays.
- Phone photos can carry an EXIF rotation flag (orientation 6). Bake the rotation in with ffmpeg `transpose` before using them.
- The brand's condensed Archivo has a very thin space; with a text outline, words merge unless you add `wordSpacing`.
- Inside `<Sequence trimBefore={X}>`, `useCurrentFrame()` counts from the *source* file's start, so caption and overlay times can stay in source seconds.

## Entri teasers (`src/compositions/entri/`, Studio folder "Entri-Teasers")
- `InterviewClip` — street-interview clips built from data: `cuts` (source seconds to keep) plus `stickers`, `money`, `choices` and `punches`, all timed in source seconds. Each video is just a `<Composition>` with different `defaultProps` in `Root.tsx`.
- `GuessTheCourse` — photo + clue zooms + options + countdown. An empty `answer` means "comment your guess" (part 2 does the reveal).
- Brand tokens and fonts: `src/design/entri.ts` (from `~/Projects/Coming Soon/brand-pack`). Captions: `src/components/captions/EntriCaptions.tsx`.
- Render: `npx remotion render <Id> out/entri/<Id>.mp4`

## Project Structure
- `src/design/` — Design system (theme, fonts, format presets)
- `src/components/` — Reusable building blocks (text, overlays, backgrounds, scenes, transitions)
- `src/compositions/` — Complete video compositions organized by type (social, youtube, explainer, general)
- `src/data/` — Sample JSON payloads for data-driven rendering
- `public/` — Static assets (music, sfx, images, videos, fonts)
