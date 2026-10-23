import { linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

export const quickFade = {
  presentation: fade(),
  timing: linearTiming({ durationInFrames: 15 }),
};

export const smoothSlideLeft = {
  presentation: slide({ direction: "from-left" }),
  timing: springTiming({ config: { damping: 200 }, durationInFrames: 25 }),
};

export const smoothSlideRight = {
  presentation: slide({ direction: "from-right" }),
  timing: springTiming({ config: { damping: 200 }, durationInFrames: 25 }),
};

export const wipeRight = {
  presentation: wipe({ direction: "from-left" }),
  timing: linearTiming({ durationInFrames: 20 }),
};
