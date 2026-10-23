# Video-Editing

Remotion-based video creation toolkit. Build social media clips, YouTube intros, explainers, and more — edit interactively in Studio or render from the CLI.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Open Studio (browser-based editor)
npm run dev
```

Studio opens at `http://localhost:3000`. Pick a composition from the sidebar to preview and edit.

## Bringing in your own footage

```bash
# Import clips/photos from a zip (sorts into public/videos, public/images, etc.)
npm run import-assets -- ~/Downloads/my-pack.zip

# Tone-map HDR phone footage to SDR (Studio needs these)
npm run make-sdr

# Transcribe clips locally with Whisper (captions → src/data/captions/)
npm run transcribe

# Apply any hand-corrections to mis-heard words
npm run fix-captions

# Quick contact sheet without opening Studio
npm run preview -- <CompositionId>
```

**Important:** Phone footage is often HDR (HEVC, BT.2020). Chrome renders it flat and grey. Always run `npm run make-sdr` after importing — it creates 1080p SDR copies that Studio uses. Edit from those, never the originals.

## Rendering

```bash
# Render a specific composition
npx remotion render <CompositionId> out/<name>.mp4

# Example
npx remotion render FiverEater out/entri/FiverEater.mp4
```

Rendered videos are in `out/entri/`. The repo includes the 6 Entri teaser clips already rendered — check `out/previews/` for contact-sheet thumbnails.

## Project structure

```
src/
  components/      Reusable building blocks (text, overlays, backgrounds, audio, transitions)
  compositions/    Complete video compositions by type (entri/, social/, youtube/, explainer/)
  design/          Theme, fonts, format presets, brand tokens
  data/            Clip registry, caption files, sample data
scripts/           Asset pipeline (import, SDR convert, transcribe, caption fixes, previews)
public/
  images/          Photos and stills
  sfx/             Sound effects
  videos/          YOUR footage goes here (gitignored — each person brings their own)
out/
  entri/           Rendered videos (included in repo)
  previews/        Contact-sheet thumbnails
```

## Prerequisites

- **Node.js** 20.19+, 22.13+, or 24+
- **ffmpeg** with `scale_vt` support (for HDR→SDR tone mapping)
- **Whisper** model downloads automatically on first `npm run transcribe`

## Remotion docs

- [Fundamentals](https://www.remotion.dev/docs/the-fundamentals)
- [Studio](https://www.remotion.dev/docs/studio)
- [Rendering](https://www.remotion.dev/docs/render)
