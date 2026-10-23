#!/usr/bin/env node
import { execFile } from "node:child_process";
import { constants as fsConstants, existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

const PUBLIC_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);

const FOLDER_BY_EXT = {
  ".mp4": "videos",
  ".mov": "videos",
  ".m4v": "videos",
  ".webm": "videos",
  ".png": "images",
  ".jpg": "images",
  ".jpeg": "images",
  ".webp": "images",
  ".gif": "images",
  ".svg": "images",
  ".avif": "images",
  ".mp3": "music",
  ".wav": "music",
  ".m4a": "music",
  ".aac": "music",
  ".ogg": "music",
  ".flac": "music",
  ".ttf": "fonts",
  ".otf": "fonts",
  ".woff": "fonts",
  ".woff2": "fonts",
};

// Chrome (Remotion's renderer) can't display HEIC, so iPhone photos become JPGs.
const CONVERT_TO_JPG = new Set([".heic", ".heif"]);

function cleanName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const base = path
    .basename(fileName, path.extname(fileName))
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return { base: base || "file", ext };
}

function freePath(dir, base, ext) {
  let candidate = path.join(dir, base + ext);
  for (let n = 1; existsSync(candidate); n++) {
    candidate = path.join(dir, `${base}-${n}${ext}`);
  }
  return candidate;
}

function isJunk(relPath) {
  return relPath
    .split(path.sep)
    .some((part) => part === "__MACOSX" || part.startsWith("."));
}

async function importZip(zipPath) {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "asset-import-"));
  try {
    await run("unzip", ["-q", zipPath, "-d", tmp]);

    const entries = await fs.readdir(tmp, {
      recursive: true,
      withFileTypes: true,
    });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(entry.parentPath, entry.name))
      .filter((src) => !isJunk(path.relative(tmp, src)))
      .sort();

    const imported = [];
    const skipped = [];

    for (const src of files) {
      const rel = path.relative(tmp, src);
      const { base, ext } = cleanName(path.basename(src));
      const convert = CONVERT_TO_JPG.has(ext);
      const folder = convert ? "images" : FOLDER_BY_EXT[ext];
      if (!folder) {
        skipped.push(rel);
        continue;
      }

      const destDir = path.join(PUBLIC_DIR, folder);
      await fs.mkdir(destDir, { recursive: true });
      const dest = freePath(destDir, base, convert ? ".jpg" : ext);

      if (convert) {
        await run("sips", ["-s", "format", "jpeg", src, "--out", dest]);
      } else {
        await fs.copyFile(src, dest, fsConstants.COPYFILE_EXCL);
      }

      imported.push({
        from: rel,
        to: path.relative(PUBLIC_DIR, dest),
        converted: convert,
      });
    }

    return { imported, skipped };
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

function report(zipName, { imported, skipped }) {
  console.log(`\n${zipName}: imported ${imported.length} file(s)`);

  const byFolder = Object.groupBy(imported, (f) => f.to.split(path.sep)[0]);
  for (const [folder, items] of Object.entries(byFolder)) {
    const converted = items.filter((f) => f.converted).length;
    const note = converted ? `  (${converted} converted from HEIC)` : "";
    console.log(`\n  public/${folder}/  ${items.length}${note}`);
    for (const f of items) {
      console.log(`    staticFile("${f.to}")  <-  ${f.from}`);
    }
  }

  if (skipped.length) {
    console.log(`\n  Skipped ${skipped.length} unsupported file(s):`);
    for (const rel of skipped) console.log(`    ${rel}`);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npm run import-assets -- <file.zip> [more.zip ...]");
  process.exit(1);
}

// npm runs scripts from the project root; INIT_CWD is where the user actually typed the command.
const userCwd = process.env.INIT_CWD ?? process.cwd();

for (const arg of args) {
  const zipPath = path.resolve(userCwd, arg);
  if (!existsSync(zipPath)) {
    console.error(`Not found: ${zipPath}`);
    process.exitCode = 1;
    continue;
  }
  try {
    report(path.basename(zipPath), await importZip(zipPath));
  } catch (err) {
    console.error(`Failed to import ${zipPath}: ${err.stderr || err.message}`);
    process.exitCode = 1;
  }
}
