#!/usr/bin/env node
// Makes editable 1080p SDR copies of the phone footage in public/videos/.
//
// Why: Samsung/iPhone clips are often 4K HDR10 (HEVC, BT.2020, PQ). Chrome —
// which Remotion renders with — shows HDR as flat and grey, and 4K HEVC at
// ~96 Mbps is far too heavy to scrub in Studio. This tone-maps HDR to normal
// BT.709 on the Mac's GPU (VideoToolbox), fixes the phone's rotation flag, and
// writes H.264 copies to public/videos/sdr/. Originals are never touched.
//
// Usage: npm run make-sdr            (converts anything not converted yet)
//        npm run make-sdr -- --force (redo everything)
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const VIDEOS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "videos",
);
const OUT_DIR = path.join(VIDEOS_DIR, "sdr");

const VIDEO_EXTS = new Set([".mp4", ".mov", ".m4v"]);
const HDR_TRANSFERS = new Set(["smpte2084", "arib-std-b67"]); // PQ, HLG

// The phone stores a landscape frame plus a "rotate on playback" flag.
const TRANSPOSE_BY_ROTATION = {
  "-90": "transpose=clock",
  90: "transpose=cclock",
  180: "hflip,vflip",
  "-180": "hflip,vflip",
};

async function probe(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,color_transfer:stream_side_data=rotation",
    "-of", "json",
    file,
  ]);
  const stream = JSON.parse(stdout).streams[0];
  const rotation = stream.side_data_list?.find((d) => "rotation" in d)?.rotation ?? 0;
  return {
    width: stream.width,
    height: stream.height,
    hdr: HDR_TRANSFERS.has(stream.color_transfer),
    rotation: String(rotation),
  };
}

function buildArgs(src, dest, info) {
  const turn = TRANSPOSE_BY_ROTATION[info.rotation];
  // Scale the stored (pre-rotation) frame so the long side ends up 1920.
  const landscape = info.width >= info.height;
  const [w, h] = landscape ? [1920, 1080] : [1080, 1920];

  const color = [
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  ];
  const encode = ["-c:v", "h264_videotoolbox", "-b:v", "14M", "-tag:v", "avc1"];
  const audio = ["-c:a", "aac", "-b:a", "192k"];

  if (info.hdr) {
    // scale_vt does the HDR -> SDR tone-map on the GPU while resizing.
    const vf = [
      `scale_vt=w=${w}:h=${h}:color_matrix=bt709:color_primaries=bt709:color_transfer=bt709`,
      "hwdownload",
      "format=p010le",
      turn,
      "format=nv12",
    ].filter(Boolean).join(",");
    return [
      "-v", "error", "-y",
      "-hwaccel", "videotoolbox", "-hwaccel_output_format", "videotoolbox_vld",
      "-noautorotate", "-i", src,
      "-vf", vf, ...encode, ...color, ...audio,
      "-movflags", "+faststart", dest,
    ];
  }

  const vf = [turn, "scale=-2:1920:force_original_aspect_ratio=decrease", "format=nv12"]
    .filter(Boolean)
    .join(",");
  return [
    "-v", "error", "-y", "-noautorotate", "-i", src,
    "-vf", vf, ...encode, ...color, ...audio,
    "-movflags", "+faststart", dest,
  ];
}

const force = process.argv.includes("--force");
await fs.mkdir(OUT_DIR, { recursive: true });

const files = (await fs.readdir(VIDEOS_DIR, { withFileTypes: true }))
  .filter((e) => e.isFile() && VIDEO_EXTS.has(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort();

for (const name of files) {
  const src = path.join(VIDEOS_DIR, name);
  const dest = path.join(OUT_DIR, path.basename(name, path.extname(name)) + ".mp4");
  if (existsSync(dest) && !force) {
    console.log(`skip   ${name} (already converted)`);
    continue;
  }
  const info = await probe(src);
  const started = Date.now();
  const tmp = dest + ".part.mp4";
  try {
    await run("ffmpeg", buildArgs(src, tmp, info), { maxBuffer: 1 << 24 });
    await fs.rename(tmp, dest);
  } catch (err) {
    await fs.rm(tmp, { force: true });
    console.error(`FAILED ${name}: ${err.stderr || err.message}`);
    process.exitCode = 1;
    continue;
  }
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `done   ${name} -> staticFile("videos/sdr/${path.basename(dest)}")` +
      `  [${info.hdr ? "HDR tone-mapped" : "SDR"}, rotation ${info.rotation}, ${secs}s]`,
  );
}
