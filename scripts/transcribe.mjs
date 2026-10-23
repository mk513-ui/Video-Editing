#!/usr/bin/env node
// Transcribes clips locally (Whisper on the Mac's GPU — no audio leaves the
// machine) and saves word-level captions for Remotion.
//
// Usage: npm run transcribe                        (every clip in public/videos/sdr/)
//        npm run transcribe -- public/videos/sdr/x.mp4 [--force] [--model small.en]
//
// Output: src/data/captions/<clip>.json, an array of @remotion/captions `Caption`
// objects. Timestamps are relative to the start of that clip.
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WHISPER_WEBGPU_SAMPLE_RATE,
  canUseWhisperWebGpu,
  downloadWhisperModel,
  toCaptions,
  transcribe,
} from "@remotion/whisper-webgpu";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DIR = path.join(ROOT, "public", "videos", "sdr");
const OUT_DIR = path.join(ROOT, "src", "data", "captions");

const args = process.argv.slice(2);
const force = args.includes("--force");
const modelFlag = args.indexOf("--model");
const model = modelFlag === -1 ? "large-v3-turbo" : args[modelFlag + 1];
const fileArgs = args.filter(
  (a, i) => !a.startsWith("--") && (modelFlag === -1 || i !== modelFlag + 1),
);

// ffmpeg hands us the mono 16 kHz float waveform Whisper expects.
function decodeAudio(file) {
  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      ["-v", "error", "-i", file, "-vn", "-ac", "1", "-ar", String(WHISPER_WEBGPU_SAMPLE_RATE), "-f", "f32le", "pipe:1"],
      { encoding: "buffer", maxBuffer: 1 << 30 },
      (err, stdout) => {
        if (err) return reject(err);
        const copy = new Uint8Array(stdout).slice().buffer;
        resolve(new Float32Array(copy));
      },
    );
  });
}

const support = await canUseWhisperWebGpu();
if (!support.supported) {
  console.error(`Whisper can't use the GPU here: ${support.detailedReason}`);
  process.exit(1);
}

const files = fileArgs.length
  ? fileArgs.map((f) => path.resolve(process.env.INIT_CWD ?? process.cwd(), f))
  : (await fs.readdir(DEFAULT_DIR))
      .filter((f) => f.endsWith(".mp4") && !f.includes(".part."))
      .sort()
      .map((f) => path.join(DEFAULT_DIR, f));

await fs.mkdir(OUT_DIR, { recursive: true });
console.log(`Model: ${model} (first run downloads it, ~0.1–1.7 GB)`);
await downloadWhisperModel({ model });

for (const file of files) {
  const name = path.basename(file, path.extname(file));
  const dest = path.join(OUT_DIR, `${name}.json`);
  if (existsSync(dest) && !force) {
    console.log(`skip   ${name} (already transcribed)`);
    continue;
  }
  const started = Date.now();
  const channelWaveform = await decodeAudio(file);
  const transcription = await transcribe({
    channelWaveform,
    model,
    // Multilingual models need to be told the language; ".en" models don't.
    language: model.endsWith(".en") ? undefined : "en",
  });
  const { captions } = toCaptions({ whisperWebGpuOutput: transcription });
  await fs.writeFile(dest, JSON.stringify(captions, null, 2) + "\n");
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`done   ${name} -> src/data/captions/${name}.json  [${captions.length} words, ${secs}s]`);
}
