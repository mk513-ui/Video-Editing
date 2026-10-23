import { loadVariableFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";

// Entri brand guidelines v2 (Coming Soon/brand-pack). Text on Lime is always Ink;
// never put Lime on a light background.
export const entri = {
  ink: "#0E0F0C",
  lime: "#C8F25A",
  paper: "#F4F3EE",
  moss: "#3D4A1F",
  alert: "#E5484D",
};

// Archivo is a variable font. The brand's headline face is its narrowest
// width (62%) at weight 900 — spread `display` into a style to use it.
const archivo = loadArchivo("normal", { subsets: ["latin", "latin-ext"] });
export const display = {
  fontFamily: archivo.fontFamily,
  fontWeight: 900,
  fontStretch: "62%",
  textTransform: "uppercase",
  lineHeight: 0.9,
  wordSpacing: "0.1em",
} as const;
export const waitForDisplayFont = archivo.waitUntilDone;

// DM Mono is for data: prices, dates, tags.
export const mono = {
  fontFamily: loadDMMono("normal", { weights: ["500"], subsets: ["latin"] })
    .fontFamily,
  fontWeight: 500,
} as const;

// TikTok / Reels cover the top ~200px and bottom ~420px with UI.
export const safe = {
  top: 210,
  bottom: 430,
  side: 70,
};
