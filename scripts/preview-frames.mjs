#!/usr/bin/env node
// Renders a contact sheet of stills from one or more compositions, for a quick
// visual check without scrubbing through Studio.
//
// Usage: npm run preview -- WorstConfession [ThisOrThat ...] [--frames 12]
//        npm run preview -- TPTicket --at 0,60,300
// Output: out/previews/<id>.jpg (frames left-to-right, top-to-bottom)
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out", "previews");

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const count = Number(flag("--frames") ?? 12);
const at = flag("--at")?.split(",").map(Number);
const ids = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (ids.length === 0) {
  console.error("Usage: npm run preview -- <CompositionId> [...] [--frames N | --at f1,f2]");
  process.exit(1);
}

await fs.mkdir(OUT_DIR, { recursive: true });
console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src", "index.ts") });
const browser = await openBrowser("chrome");

try {
  for (const id of ids) {
    const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser });
    const last = composition.durationInFrames - 1;
    const frames =
      at ?? Array.from({ length: count }, (_, i) => Math.round((i * last) / Math.max(1, count - 1)));

    const tmp = await fs.mkdtemp(path.join(OUT_DIR, `.${id}-`));
    for (const [i, frame] of frames.entries()) {
      await renderStill({
        composition,
        serveUrl,
        frame,
        output: path.join(tmp, `${String(i).padStart(3, "0")}.jpeg`),
        imageFormat: "jpeg",
        scale: 0.3,
        puppeteerInstance: browser,
      });
    }

    const cols = Math.min(6, frames.length);
    const rows = Math.ceil(frames.length / cols);
    const sheet = path.join(OUT_DIR, `${id}.jpg`);
    await run("ffmpeg", [
      "-v", "error", "-y", "-pattern_type", "glob", "-i", path.join(tmp, "*.jpeg"),
      "-vf", `tile=${cols}x${rows}:padding=6:color=white`, "-frames:v", "1", sheet,
    ]);
    await fs.rm(tmp, { recursive: true, force: true });
    const secs = (f) => (f / composition.fps).toFixed(1);
    console.log(
      `${id}: ${composition.durationInFrames} frames (${secs(composition.durationInFrames)}s) -> ${path.relative(ROOT, sheet)}` +
        `\n  frames: ${frames.map((f) => `${f} (${secs(f)}s)`).join(", ")}`,
    );
  }
} finally {
  await browser.close({ silent: true });
}
