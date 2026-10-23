import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, headingFont } from "../../design/fonts";
import { safeArea } from "../../design/theme";

type LowerThirdProps = {
  readonly style: React.CSSProperties;
};

const LowerThirdInner = ({ style }: LowerThirdProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const safe = safeArea(width);
  const name = "Speaker Name";
  const title = "Title or Role";

  const enterEnd = fps * 0.5;
  const exitStart = durationInFrames - fps * 0.5;

  return (
    <div
      style={{
        position: "absolute",
        bottom: safe.vertical,
        left: safe.horizontal,
        translate: interpolate(
          frame,
          [0, enterEnd, exitStart, durationInFrames],
          ["-120% 0px", "0% 0px", "0% 0px", "-120% 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "16px 32px",
          borderLeft: "4px solid #0b84f3",
        }}
      >
        <div
          style={{
            fontFamily: headingFont.fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: "white",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: bodyFont.fontFamily,
            fontSize: 24,
            color: "#a0aec0",
            marginTop: 4,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export const LowerThird = Interactive.create({
  Component: LowerThirdInner,
  layout: "none",
  schema: {
    ...Interactive.backgroundSchema,
  },
});
