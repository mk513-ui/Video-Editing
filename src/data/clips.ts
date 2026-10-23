import type { Caption } from "@remotion/captions";
import { staticFile } from "remotion";
import c142322 from "./captions/20261021-142322.json";
import c142532 from "./captions/20261021-142532.json";
import c152555 from "./captions/20261021-152555.json";
import c153753 from "./captions/20261021-153753.json";

// One entry per filmed clip (shoot of 21 Oct 2026). To add footage:
// npm run import-assets -> npm run make-sdr -> npm run transcribe -> add it here.
export const CLIP_IDS = [
  "20261021-142322", // rugby shirt: worst drunken confession
  "20261021-142532", // rugby shirt + friend: most spent on a night out
  "20261021-152555", // black jacket: TP ticket, £5 note, this or that
  "20261021-153753", // shark costume: worst drunken confession
] as const;

export type ClipId = (typeof CLIP_IDS)[number];

export const clipCaptions: Record<ClipId, Caption[]> = {
  "20261021-142322": c142322,
  "20261021-142532": c142532,
  "20261021-152555": c152555,
  "20261021-153753": c153753,
};

// The tone-mapped 1080p copies made by `npm run make-sdr`.
export const clipSrc = (id: ClipId) => staticFile(`videos/sdr/${id}.mp4`);
