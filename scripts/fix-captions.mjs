#!/usr/bin/env node
// Corrects words Whisper mis-heard, without touching their timings.
//
// Each fix finds the word(s) starting at `at` (ms) whose text matches `was`,
// and replaces them with one caption reading `now`. Fixes that no longer match
// (already applied, or the clip was re-transcribed differently) are skipped, so
// this is safe to re-run:  npm run transcribe && npm run fix-captions
//
// Entries marked CHECK are best guesses at local names — confirm by ear.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CAPTIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "captions",
);

const FIXES = {
  "20261021-142322": [
    { at: 21560, was: "angry", now: " angry?" },
  ],
  "20261021-152555": [
    { at: 8120, was: "overheard", now: " Overheard" },
    { at: 8980, was: "mine it out?", now: " MyNightOut?" },
    { at: 36740, was: "fairs.", now: " fair's." },
    { at: 61100, was: "go -to", now: " go-to" },
    { at: 69940, was: "timepiece", now: " Timepiece" },
    { at: 70240, was: "of", now: " or" },
    { at: 70380, was: "Volts.", now: " Vaults?" }, // CHECK: Vaults / Volts?
    { at: 71920, was: "Volts.", now: " Vaults." }, // CHECK
    { at: 73620, was: "chefs.", now: " Chefs?" }, // CHECK: which venue?
    { at: 76900, was: "Jagerbom?", now: " Jägerbomb?" },
    { at: 77800, was: "Jagerbom", now: " Jägerbomb" },
    { at: 79580, was: "My night out", now: " MyNightOut" },
    { at: 84360, was: "uni tunes.", now: " unanimous." },
    { at: 85820, was: "FAs", now: " FAs" }, // CHECK: FAs / Efes?
    { at: 86280, was: "Mackies?", now: " Maccies?" },
    { at: 89000, was: "Rumors", now: " Rumours" },
  ],
};

const norm = (s) => s.trim().toLowerCase();

for (const clip of Object.keys(FIXES)) {
  const file = path.join(CAPTIONS_DIR, `${clip}.json`);
  const captions = JSON.parse(await fs.readFile(file, "utf8"));
  let applied = 0;

  for (const fix of FIXES[clip]) {
    const span = fix.was.split(" ").length;
    const start = captions.findIndex((c) => c.startMs === fix.at);
    if (start === -1) continue;
    const words = captions.slice(start, start + span);
    const current = words.map((w) => w.text).join("");
    if (current === fix.now || norm(current) !== norm(fix.was)) continue;

    const last = words[words.length - 1];
    captions.splice(start, span, {
      ...words[0],
      text: fix.now,
      endMs: last.endMs,
      timestampMs: Math.round((words[0].startMs + last.endMs) / 2),
    });
    applied++;
  }

  await fs.writeFile(file, JSON.stringify(captions, null, 2) + "\n");
  console.log(`${clip}: ${applied} fix(es) applied`);
}
