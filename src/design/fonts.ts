import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const headingFont = loadMontserrat("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const bodyFont = loadInter("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
